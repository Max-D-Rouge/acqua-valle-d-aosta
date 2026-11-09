-- Frazione dei punti, registro delle modifiche e viste ordinate per luogo. Creato il 2026-11-09.
-- Da incollare nel "SQL Editor" di Supabase ed eseguire UNA volta sola, DOPO 04 e 05.

-- 1) Nuova colonna: frazione (il comune esiste già).
alter table public.punti
  add column frazione text check (char_length(frazione) <= 80);

-- 2) Registro delle modifiche automatiche: ogni volta che 3 voti uguali cambiano un dato del punto.
create table public.modifiche_punto (
  id uuid primary key default gen_random_uuid(),
  punto_id uuid not null references public.punti (id) on delete cascade,
  campo text not null,
  vecchio text,
  nuovo text not null,
  creato_il timestamptz not null default now()
);
alter table public.modifiche_punto enable row level security;
-- Tutti possono leggere; nessuno può scrivere dall'app (le righe le scrive solo la funzione qui sotto).
create policy "tutti possono leggere le modifiche"
  on public.modifiche_punto for select
  to anon, authenticated
  using (true);

-- 3) La funzione dei 3 voti ora scrive anche nel registro (solo se il dato cambia davvero).
create or replace function public.aggiorna_punto_da_segnalazioni()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  vincente text;
  vecchio text;
begin
  select valore into vincente
  from public.segnalazioni
  where punto_id = new.punto_id and campo = new.campo
  group by valore
  having count(*) >= 3
  order by count(*) desc
  limit 1;

  if vincente is not null then
    select case new.campo
             when 'stato' then stato
             when 'potabile' then potabile
             when 'bottiglia' then bottiglia
             when 'accesso' then accesso
             when 'carrozzina' then carrozzina
             when 'stagionalita' then stagionalita
           end
      into vecchio
    from public.punti where id = new.punto_id;

    if vecchio is distinct from vincente then
      update public.punti set
        stato        = case when new.campo = 'stato'        then vincente else stato end,
        potabile     = case when new.campo = 'potabile'     then vincente else potabile end,
        bottiglia    = case when new.campo = 'bottiglia'    then vincente else bottiglia end,
        accesso      = case when new.campo = 'accesso'      then vincente else accesso end,
        carrozzina   = case when new.campo = 'carrozzina'   then vincente else carrozzina end,
        stagionalita = case when new.campo = 'stagionalita' then vincente else stagionalita end
      where id = new.punto_id;

      insert into public.modifiche_punto (punto_id, campo, vecchio, nuovo)
      values (new.punto_id, new.campo, vecchio, vincente);
    end if;
  end if;
  return null;
end;
$$;

-- 4) Viste ordinate per comune, poi frazione, poi nome (si aprono dal Table Editor di Supabase).
-- "security_invoker" = la vista rispetta le stesse regole di sicurezza delle tabelle.
create view public.segnalazioni_per_luogo with (security_invoker = true) as
select
  coalesce(p.comune, '(senza comune)') as comune,
  coalesce(p.frazione, '(senza frazione)') as frazione,
  p.nome,
  s.campo,
  s.valore,
  count(*) as voti,
  max(s.creato_il) as ultimo_voto,
  p.id as punto_id
from public.segnalazioni s
join public.punti p on p.id = s.punto_id
group by p.id, p.comune, p.frazione, p.nome, s.campo, s.valore
order by 1, 2, 3, 4, 5;

create view public.modifiche_per_luogo with (security_invoker = true) as
select
  coalesce(p.comune, '(senza comune)') as comune,
  coalesce(p.frazione, '(senza frazione)') as frazione,
  p.nome,
  m.campo,
  m.vecchio,
  m.nuovo,
  m.creato_il,
  p.id as punto_id
from public.modifiche_punto m
join public.punti p on p.id = m.punto_id
order by 1, 2, 3, m.creato_il desc;
