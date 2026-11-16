-- Blocco degli utenti (ban) e valutazione delle segnalazioni da parte degli amministratori (decisione D37).
-- Da incollare nel "SQL Editor" di Supabase ed eseguire UNA volta sola, DOPO 13_segnalazioni_foto.sql.
--
-- REGOLE (decise da Max il 2026-11-16):
--  * L'amministratore (Max o Mayo) valuta ogni segnalazione di un utente nel pannello di Supabase,
--    cambiando la colonna "stato" di segnalazioni_utenti: nuova -> confermata oppure respinta.
--  * Un utente SEGNALATO viene bloccato per 1 mese quando ha 3 segnalazioni CONFERMATE fatte da 3 persone DIVERSE.
--  * Un SEGNALANTE viene bloccato per 1 mese quando 3 sue segnalazioni contro lo STESSO account sono state RESPINTE.
--  * Un utente bloccato può accedere e guardare la mappa, ma non può aggiungere punti, foto, segnalazioni, voti, avvisi.
--  * Dopo un blocco il conteggio riparte da zero per quel motivo (contano solo le valutazioni successive).
--  * Per togliere un blocco: elimina la riga in "blocchi" dal pannello di Supabase.

-- 1) Tabella dei blocchi. L'app può solo LEGGERE i propri blocchi: non esiste nessuna regola di scrittura.
--    (Non sta in "profili" perché ognuno può modificare il proprio profilo e si toglierebbe il blocco da solo.)
create table public.blocchi (
  id uuid primary key default gen_random_uuid(),
  utente uuid not null references auth.users (id) on delete cascade,
  fino_a timestamptz not null,
  motivo text not null check (motivo in ('segnalazioni_confermate', 'segnalazioni_respinte')),
  creato_il timestamptz not null default now()
);
create index blocchi_utente_idx on public.blocchi (utente, fino_a);
alter table public.blocchi enable row level security;

create policy "ognuno vede i propri blocchi"
  on public.blocchi for select
  to authenticated
  using (utente = (select auth.uid()));

-- 2) Funzione usata dalle regole: vera se l'utente collegato NON è bloccato in questo momento.
create or replace function public.utente_non_bloccato()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select not exists (
    select 1 from public.blocchi where utente = (select auth.uid()) and fino_a > now()
  );
$$;
revoke all on function public.utente_non_bloccato() from public, anon;
grant execute on function public.utente_non_bloccato() to authenticated;

-- 3) Segnalazioni di utenti: stato di valutazione.
alter table public.segnalazioni_utenti
  add column stato text not null default 'nuova' check (stato in ('nuova', 'confermata', 'respinta')),
  add column valutata_il timestamptz;

-- Prima: una sola segnalazione in assoluto per coppia. Ora: una sola IN ATTESA alla volta
-- (dopo che l'amministratore l'ha valutata si può segnalare di nuovo: serve per contare le 3 respinte).
alter table public.segnalazioni_utenti drop constraint segnalazioni_utenti_una;
create unique index segnalazioni_utenti_una_in_attesa
  on public.segnalazioni_utenti (segnalante, segnalato) where stato = 'nuova';

-- Chi segnala può solo creare segnalazioni "nuove" (non può confermarsi da solo) e non deve essere bloccato.
drop policy "utenti collegati possono segnalare altri utenti" on public.segnalazioni_utenti;
create policy "utenti collegati possono segnalare altri utenti"
  on public.segnalazioni_utenti for insert
  to authenticated
  with check (
    segnalante = auth.uid() and segnalato is not null and segnalato <> auth.uid()
    and stato = 'nuova' and valutata_il is null
    and (select public.utente_non_bloccato())
  );

-- 4) Quando l'amministratore cambia lo stato: si registra la data e si controllano i blocchi.
create or replace function public.segna_data_valutazione()
returns trigger
language plpgsql
as $$
begin
  if new.stato <> 'nuova' then
    new.valutata_il := now();
  else
    new.valutata_il := null;
  end if;
  return new;
end;
$$;
create trigger segnalazioni_utenti_data_valutazione
  before update of stato on public.segnalazioni_utenti
  for each row when (old.stato is distinct from new.stato)
  execute function public.segna_data_valutazione();

create or replace function public.controlla_blocchi_da_valutazione()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  dopo timestamptz;
  quanti int;
begin
  -- (a) utente segnalato: 3 conferme da 3 persone diverse
  if new.stato = 'confermata' and new.segnalato is not null then
    select coalesce(max(creato_il), '-infinity') into dopo
      from public.blocchi where utente = new.segnalato and motivo = 'segnalazioni_confermate';
    select count(distinct segnalante) into quanti
      from public.segnalazioni_utenti
      where segnalato = new.segnalato and stato = 'confermata' and valutata_il > dopo and segnalante is not null;
    if quanti >= 3 then
      insert into public.blocchi (utente, fino_a, motivo)
      values (new.segnalato, now() + interval '1 month', 'segnalazioni_confermate');
    end if;
  end if;

  -- (b) segnalante: 3 segnalazioni respinte contro lo stesso account
  if new.stato = 'respinta' and new.segnalante is not null and new.segnalato is not null then
    select coalesce(max(creato_il), '-infinity') into dopo
      from public.blocchi where utente = new.segnalante and motivo = 'segnalazioni_respinte';
    select count(*) into quanti
      from public.segnalazioni_utenti
      where segnalante = new.segnalante and segnalato = new.segnalato and stato = 'respinta' and valutata_il > dopo;
    if quanti >= 3 then
      insert into public.blocchi (utente, fino_a, motivo)
      values (new.segnalante, now() + interval '1 month', 'segnalazioni_respinte');
    end if;
  end if;
  return null;
end;
$$;
create trigger segnalazioni_utenti_controllo_blocchi
  after update of stato on public.segnalazioni_utenti
  for each row when (old.stato is distinct from new.stato)
  execute function public.controlla_blocchi_da_valutazione();

-- 5) Un utente bloccato non può scrivere. Si rifanno le regole di inserimento aggiungendo il controllo
--    (le condizioni di prima restano uguali, in più c'è utente_non_bloccato()).
drop policy "utenti collegati possono aggiungere punti" on public.punti;
create policy "utenti collegati possono aggiungere punti"
  on public.punti for insert
  to authenticated
  with check (autore = auth.uid() and esempio = false and (select public.utente_non_bloccato()));

drop policy "utenti collegati possono segnalare" on public.segnalazioni;
create policy "utenti collegati possono segnalare"
  on public.segnalazioni for insert
  to authenticated
  with check (autore = auth.uid() and (select public.utente_non_bloccato()));

drop policy "ognuno può cambiare il proprio voto" on public.segnalazioni;
create policy "ognuno può cambiare il proprio voto"
  on public.segnalazioni for update
  to authenticated
  using (autore = auth.uid())
  with check (autore = auth.uid() and (select public.utente_non_bloccato()));

drop policy "utenti collegati possono creare avvisi" on public.avvisi;
create policy "utenti collegati possono creare avvisi"
  on public.avvisi for insert
  to authenticated
  with check (autore = auth.uid() and scade_il <= now() + interval '3 days' and (select public.utente_non_bloccato()));

drop policy "foto: carica nella propria cartella" on storage.objects;
create policy "foto: carica nella propria cartella"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'foto-punti' and (storage.foldername(name))[1] = (select auth.uid()::text)
    and (select public.utente_non_bloccato())
  );

drop policy "utenti collegati aggiungono foto" on public.foto_punti;
create policy "utenti collegati aggiungono foto"
  on public.foto_punti for insert
  to authenticated
  with check (
    autore = (select auth.uid())
    and percorso like (select auth.uid()::text) || '/%'
    and (select count(*) from public.foto_punti f where f.punto_id = foto_punti.punto_id) < 5
    and (select count(*) from public.foto_punti f
         where f.autore = (select auth.uid()) and f.creato_il > now() - interval '1 day') < 10
    and (select public.utente_non_bloccato())
  );

drop policy "utenti collegati possono segnalare una foto" on public.segnalazioni_foto;
create policy "utenti collegati possono segnalare una foto"
  on public.segnalazioni_foto for insert
  to authenticated
  with check (
    segnalante = auth.uid()
    and not exists (select 1 from public.foto_punti f where f.id = foto_id and f.autore = auth.uid())
    and (select public.utente_non_bloccato())
  );

-- 6) Avvisi via email (stesso servizio Google Apps Script e stesso segreto del Vault della 08).
--    Un problema con l'email non deve MAI impedire di salvare la segnalazione o il blocco.
create or replace function public.invia_avviso_email(corpo jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  indirizzo text;
begin
  select decrypted_secret into indirizzo from vault.decrypted_secrets where name = 'avviso_segnalazioni_url' limit 1;
  if indirizzo is null then
    return;
  end if;
  perform net.http_post(url := indirizzo, body := corpo);
exception when others then
  return;
end;
$$;
revoke all on function public.invia_avviso_email(jsonb) from public, anon, authenticated;

create or replace function public.avvisa_segnalazione_foto()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.invia_avviso_email(jsonb_build_object(
    'tipo', 'foto',
    'motivo', new.motivo,
    'punto', (select p.nome from public.foto_punti f join public.punti p on p.id = f.punto_id where f.id = new.foto_id),
    'foto_id', new.foto_id,
    'segnalante_nome', (select nome_utente from public.profili where id = new.segnalante),
    'quando', new.creato_il
  ));
  return null;
end;
$$;
create trigger segnalazioni_foto_avviso
  after insert on public.segnalazioni_foto
  for each row execute function public.avvisa_segnalazione_foto();

create or replace function public.avvisa_blocco()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.invia_avviso_email(jsonb_build_object(
    'tipo', 'blocco',
    'motivo', new.motivo,
    'utente_nome', (select nome_utente from public.profili where id = new.utente),
    'utente_id', new.utente,
    'fino_a', new.fino_a,
    'quando', new.creato_il
  ));
  return null;
end;
$$;
create trigger blocchi_avviso
  after insert on public.blocchi
  for each row execute function public.avvisa_blocco();
