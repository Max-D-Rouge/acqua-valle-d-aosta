-- Segnalazioni sui punti d'acqua ("funziona?", "è potabile?"). Creato il 2026-11-09.
-- Da incollare nel "SQL Editor" di Supabase ed eseguire UNA volta sola (dopo 01, 02 e 03).

-- Ogni utente collegato può dare UN voto per ogni domanda (campo) su ogni punto, e cambiarlo.
create table public.segnalazioni (
  id uuid primary key default gen_random_uuid(),
  punto_id uuid not null references public.punti (id) on delete cascade,
  autore uuid not null default auth.uid() references auth.users (id) on delete cascade,
  campo text not null check (campo in ('stato', 'potabile')),
  valore text not null,
  creato_il timestamptz not null default now(),
  -- il valore deve essere coerente con la domanda
  constraint segnalazioni_valore_ok check (
    (campo = 'stato' and valore in ('funzionante', 'non_funzionante'))
    or (campo = 'potabile' and valore in ('potabile', 'non_potabile'))
  ),
  -- un solo voto per utente, punto e domanda
  constraint segnalazioni_un_voto unique (punto_id, autore, campo)
);

alter table public.segnalazioni enable row level security;

-- Chiunque può leggere; solo chi è collegato può votare e solo a proprio nome.
create policy "tutti possono leggere le segnalazioni"
  on public.segnalazioni for select
  to anon, authenticated
  using (true);

create policy "utenti collegati possono segnalare"
  on public.segnalazioni for insert
  to authenticated
  with check (autore = auth.uid());

-- Si può cambiare solo il proprio voto.
create policy "ognuno può cambiare il proprio voto"
  on public.segnalazioni for update
  to authenticated
  using (autore = auth.uid())
  with check (autore = auth.uid());

-- Quando almeno 3 voti sono uguali, lo stato (o la potabilità) del punto cambia.
-- "security definer": la funzione gira con i permessi del proprietario, perché gli utenti
-- non possono modificare la tabella punti direttamente.
create or replace function public.aggiorna_punto_da_segnalazioni()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  vincente text;
begin
  select valore into vincente
  from public.segnalazioni
  where punto_id = new.punto_id and campo = new.campo
  group by valore
  having count(*) >= 3
  order by count(*) desc
  limit 1;

  if vincente is not null then
    if new.campo = 'stato' then
      update public.punti set stato = vincente where id = new.punto_id;
    else
      update public.punti set potabile = vincente where id = new.punto_id;
    end if;
  end if;
  return null;
end;
$$;

create trigger segnalazioni_aggiornano_punto
  after insert or update on public.segnalazioni
  for each row execute function public.aggiorna_punto_da_segnalazioni();
