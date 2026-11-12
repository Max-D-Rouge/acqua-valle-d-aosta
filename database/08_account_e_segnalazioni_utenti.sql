-- Eliminazione dell'account e segnalazione degli utenti con avviso via email. Creato il 2026-11-09.
-- Da incollare nel "SQL Editor" di Supabase ed eseguire UNA volta sola (dopo 01-07).
-- Per ricevere le email segui i passi in servizi/avviso-email.gs (senza quelli la segnalazione si salva lo stesso).

-- 1) Se un utente elimina l'account, i suoi punti RESTANO sulla mappa e l'autore diventa vuoto
--    (nell'app compare l'avviso arancione "da controllare"). Prima il collegamento bloccava l'eliminazione.
alter table public.punti drop constraint if exists punti_autore_fkey;
alter table public.punti
  add constraint punti_autore_fkey foreign key (autore) references auth.users (id) on delete set null;
-- Il profilo (nome utente) e i voti dell'utente vengono cancellati insieme all'account (on delete cascade).

-- 2) Funzione che l'app chiama per eliminare il PROPRIO account (e solo quello).
-- "security definer": gira con i permessi del proprietario, perché un utente non può cancellarsi da solo.
create or replace function public.elimina_mio_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Non sei collegato';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;
revoke all on function public.elimina_mio_account() from public, anon;
grant execute on function public.elimina_mio_account() to authenticated;

-- 3) Segnalazioni di utenti. Le leggono solo gli amministratori dal pannello di Supabase:
--    non esiste nessuna regola di lettura per l'app.
create table public.segnalazioni_utenti (
  id uuid primary key default gen_random_uuid(),
  segnalato uuid references auth.users (id) on delete set null,
  segnalante uuid default auth.uid() references auth.users (id) on delete set null,
  punto_id uuid references public.punti (id) on delete set null,
  motivo text not null check (motivo in ('informazioni_false', 'contenuto_offensivo', 'spam', 'altro')),
  messaggio text check (char_length(messaggio) <= 500),
  creato_il timestamptz not null default now(),
  -- una sola segnalazione per coppia segnalante/segnalato (contro lo spam)
  constraint segnalazioni_utenti_una unique (segnalante, segnalato)
);
alter table public.segnalazioni_utenti enable row level security;

create policy "utenti collegati possono segnalare altri utenti"
  on public.segnalazioni_utenti for insert
  to authenticated
  with check (segnalante = auth.uid() and segnalato is not null and segnalato <> auth.uid());

-- 4) Avviso via email: a ogni segnalazione il database chiama un piccolo servizio (Google Apps Script)
--    che manda la mail agli amministratori. L'indirizzo del servizio è un segreto: sta nel "Vault" di Supabase,
--    NON in questo file (vedi servizi/avviso-email.gs).
create extension if not exists pg_net with schema extensions;

create or replace function public.avvisa_segnalazione_utente()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  indirizzo text;
  corpo jsonb;
begin
  select decrypted_secret into indirizzo
  from vault.decrypted_secrets
  where name = 'avviso_segnalazioni_url'
  limit 1;
  if indirizzo is null then
    return null; -- servizio non ancora configurato
  end if;

  corpo := jsonb_build_object(
    'motivo', new.motivo,
    'messaggio', new.messaggio,
    'segnalato_id', new.segnalato,
    'segnalato_nome', (select nome_utente from public.profili where id = new.segnalato),
    'segnalante_nome', (select nome_utente from public.profili where id = new.segnalante),
    'punto', (select nome from public.punti where id = new.punto_id),
    'quando', new.creato_il
  );
  perform net.http_post(url := indirizzo, body := corpo);
  return null;
exception when others then
  return null; -- un problema con l'email non deve mai impedire di salvare la segnalazione
end;
$$;

create trigger segnalazioni_utenti_avviso
  after insert on public.segnalazioni_utenti
  for each row execute function public.avvisa_segnalazione_utente();
