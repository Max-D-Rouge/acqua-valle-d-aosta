-- Segnalazione di una singola foto di un punto.
-- Da incollare nel "SQL Editor" di Supabase ed eseguire UNA volta sola, DOPO 11_foto_punti.sql.
-- Le segnalazioni le leggono solo gli amministratori dal pannello di Supabase (Table Editor):
-- non esiste nessuna regola di lettura per l'app. Per ora NON parte nessuna email.

create table public.segnalazioni_foto (
  id uuid primary key default gen_random_uuid(),
  foto_id uuid not null references public.foto_punti (id) on delete cascade,
  segnalante uuid not null default auth.uid() references auth.users (id) on delete cascade,
  motivo text not null check (motivo in ('non_e_il_punto', 'persone_riconoscibili', 'inappropriata')),
  creato_il timestamptz not null default now(),
  -- una sola segnalazione per utente e per foto (contro lo spam)
  constraint segnalazioni_foto_una unique (foto_id, segnalante)
);
alter table public.segnalazioni_foto enable row level security;

-- Chi è collegato può segnalare, ma non una foto scattata da lui stesso.
create policy "utenti collegati possono segnalare una foto"
  on public.segnalazioni_foto for insert
  to authenticated
  with check (
    segnalante = auth.uid()
    and not exists (
      select 1 from public.foto_punti f where f.id = foto_id and f.autore = auth.uid()
    )
  );
