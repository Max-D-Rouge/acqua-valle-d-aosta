-- PROVA delle regole di blocco (database/14). Si esegue nel SQL Editor di Supabase quando si vuole.
-- Crea utenti FINTI, simula segnalazioni e valutazioni, controlla i risultati e alla fine ANNULLA TUTTO
-- (termina volutamente con un errore): non resta nulla nel database e non parte nessuna email.
-- Il risultato si legge nel messaggio di errore "RISULTATO DELLA PROVA".
do $$
declare
  t1 uuid := gen_random_uuid();  -- segnalato da 3 persone diverse
  a  uuid := gen_random_uuid();  -- segnalanti
  b  uuid := gen_random_uuid();
  c  uuid := gen_random_uuid();
  t2 uuid := gen_random_uuid();  -- segnalato 3 volte dalla stessa persona
  r  uuid := gen_random_uuid();  -- segnalante respinto 3 volte
  t3 uuid := gen_random_uuid();
  esito text := '';
  n int;
  rid uuid;
  mot text;
begin
  insert into auth.users (id, email)
  select x, x::text || '@prova.invalid' from unnest(array[t1, a, b, c, t2, r, t3]) as x;

  -- PROVA 1: 3 conferme da 3 persone diverse -> blocca il segnalato (non prima della terza)
  insert into public.segnalazioni_utenti (segnalato, segnalante, motivo) values (t1, a, 'spam') returning id into rid;
  update public.segnalazioni_utenti set stato = 'confermata' where id = rid;
  insert into public.segnalazioni_utenti (segnalato, segnalante, motivo) values (t1, b, 'spam') returning id into rid;
  update public.segnalazioni_utenti set stato = 'confermata' where id = rid;
  select count(*) into n from public.blocchi where utente = t1;
  esito := esito || case when n = 0 then 'OK     ' else 'ERRORE ' end || '1a) dopo 2 conferme blocchi = ' || n || ' (atteso 0)' || E'\n';
  insert into public.segnalazioni_utenti (segnalato, segnalante, motivo) values (t1, c, 'spam') returning id into rid;
  update public.segnalazioni_utenti set stato = 'confermata' where id = rid;
  select count(*), max(motivo) into n, mot from public.blocchi where utente = t1 and fino_a > now() + interval '27 days';
  esito := esito || case when n = 1 and mot = 'segnalazioni_confermate' then 'OK     ' else 'ERRORE ' end || '1b) dopo 3 conferme da 3 persone: blocchi di circa 1 mese = ' || n || ' (atteso 1)' || E'\n';

  -- PROVA 2: 3 conferme dalla STESSA persona NON bloccano
  for i in 1..3 loop
    insert into public.segnalazioni_utenti (segnalato, segnalante, motivo) values (t2, a, 'spam') returning id into rid;
    update public.segnalazioni_utenti set stato = 'confermata' where id = rid;
  end loop;
  select count(*) into n from public.blocchi where utente = t2;
  esito := esito || case when n = 0 then 'OK     ' else 'ERRORE ' end || '2) 3 conferme della stessa persona: blocchi = ' || n || ' (atteso 0)' || E'\n';

  -- PROVA 3: 3 segnalazioni RESPINTE dello stesso segnalante contro lo stesso account -> blocca il segnalante
  for i in 1..3 loop
    insert into public.segnalazioni_utenti (segnalato, segnalante, motivo) values (t3, r, 'spam') returning id into rid;
    update public.segnalazioni_utenti set stato = 'respinta' where id = rid;
    if i = 2 then
      select count(*) into n from public.blocchi where utente = r;
      esito := esito || case when n = 0 then 'OK     ' else 'ERRORE ' end || '3a) dopo 2 respinte blocchi del segnalante = ' || n || ' (atteso 0)' || E'\n';
    end if;
  end loop;
  select count(*), max(motivo) into n, mot from public.blocchi where utente = r;
  esito := esito || case when n = 1 and mot = 'segnalazioni_respinte' then 'OK     ' else 'ERRORE ' end || '3b) dopo 3 respinte blocchi del segnalante = ' || n || ' (atteso 1)' || E'\n';
  select count(*) into n from public.blocchi where utente = t3;
  esito := esito || case when n = 0 then 'OK     ' else 'ERRORE ' end || '3c) il segnalato non viene bloccato: blocchi = ' || n || ' (atteso 0)' || E'\n';

  -- PROVA 4: due segnalazioni IN ATTESA della stessa persona contro lo stesso account non sono ammesse
  begin
    insert into public.segnalazioni_utenti (segnalato, segnalante, motivo) values (t3, a, 'spam');
    insert into public.segnalazioni_utenti (segnalato, segnalante, motivo) values (t3, a, 'spam');
    esito := esito || 'ERRORE 4) la seconda segnalazione in attesa e'' stata accettata' || E'\n';
  exception when unique_violation then
    esito := esito || 'OK     4) la seconda segnalazione in attesa e'' rifiutata' || E'\n';
  end;

  -- PROVA 5: un utente bloccato non puo' creare avvisi; uno non bloccato si'
  execute 'set local role authenticated';
  perform set_config('request.jwt.claim.sub', t1::text, true);
  perform set_config('request.jwt.claims', json_build_object('sub', t1::text, 'role', 'authenticated')::text, true);
  begin
    insert into public.avvisi (tipo, lat, lon, autore) values ('pericolo', 45.7, 7.3, t1);
    esito := esito || 'ERRORE 5a) l''utente bloccato ha creato un avviso' || E'\n';
  exception when insufficient_privilege then
    esito := esito || 'OK     5a) l''utente bloccato non puo'' creare avvisi' || E'\n';
  when others then
    esito := esito || 'NON VERIFICATO 5a) errore diverso: ' || sqlerrm || E'\n';
  end;
  perform set_config('request.jwt.claim.sub', b::text, true);
  perform set_config('request.jwt.claims', json_build_object('sub', b::text, 'role', 'authenticated')::text, true);
  begin
    insert into public.avvisi (tipo, lat, lon, autore) values ('pericolo', 45.7, 7.3, b);
    esito := esito || 'OK     5b) un utente non bloccato puo'' creare avvisi' || E'\n';
  exception when others then
    esito := esito || 'NON VERIFICATO 5b) ' || sqlerrm || E'\n';
  end;
  execute 'reset role';

  -- Fine: l'errore sotto ANNULLA tutto (utenti finti, segnalazioni, blocchi, avvisi).
  raise exception E'RISULTATO DELLA PROVA (tutto annullato, nulla e'' stato salvato):\n%', esito;
end;
$$;
