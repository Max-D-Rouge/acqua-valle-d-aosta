-- Profili: nome utente PUBBLICO separato dall'email (decisione D29). Creato il 2026-11-09.
-- Da incollare nel "SQL Editor" di Supabase ed eseguire UNA volta sola (dopo 01-06).

-- L'email resta in auth.users (non leggibile dall'app). Qui c'è solo ciò che può essere pubblico.
create table public.profili (
  id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  nome_utente text not null,
  creato_il timestamptz not null default now(),
  -- da 3 a 20 caratteri: lettere, numeri e trattino basso
  constraint profili_nome_formato check (nome_utente ~ '^[A-Za-z0-9_]{3,20}$')
);

-- Il nome deve essere unico, senza distinguere maiuscole e minuscole ("Max" e "max" sono lo stesso nome).
create unique index profili_nome_unico on public.profili (lower(nome_utente));

alter table public.profili enable row level security;

-- Chiunque può leggere i nomi utente (sono pubblici).
create policy "tutti possono leggere i profili"
  on public.profili for select
  to anon, authenticated
  using (true);

-- Ognuno può creare e cambiare solo il proprio profilo.
create policy "ognuno crea il proprio profilo"
  on public.profili for insert
  to authenticated
  with check (id = auth.uid());

create policy "ognuno modifica il proprio profilo"
  on public.profili for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());
