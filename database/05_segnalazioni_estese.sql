-- Segnalazioni estese a tutti i dati del punto. Creato il 2026-11-09.
-- Da incollare nel "SQL Editor" di Supabase ed eseguire UNA volta sola, DOPO 04_segnalazioni.sql.

-- Ora si può votare su 6 domande: stato, potabilità, bottiglia, accesso, carrozzina, stagionalità.
alter table public.segnalazioni drop constraint if exists segnalazioni_campo_check;
alter table public.segnalazioni drop constraint if exists segnalazioni_valore_ok;

alter table public.segnalazioni add constraint segnalazioni_campo_check
  check (campo in ('stato', 'potabile', 'bottiglia', 'accesso', 'carrozzina', 'stagionalita'));

alter table public.segnalazioni add constraint segnalazioni_valore_ok check (
  (campo = 'stato' and valore in ('funzionante', 'non_funzionante'))
  or (campo = 'potabile' and valore in ('potabile', 'non_potabile'))
  or (campo = 'bottiglia' and valore in ('si', 'no'))
  or (campo = 'accesso' and valore in ('strada', 'sentiero'))
  or (campo = 'carrozzina' and valore in ('si', 'no'))
  or (campo = 'stagionalita' and valore in ('tutto_anno', 'stagionale'))
);

-- Stessa regola di prima (3 voti uguali cambiano il dato), ora per tutti i campi.
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
    update public.punti set
      stato        = case when new.campo = 'stato'        then vincente else stato end,
      potabile     = case when new.campo = 'potabile'     then vincente else potabile end,
      bottiglia    = case when new.campo = 'bottiglia'    then vincente else bottiglia end,
      accesso      = case when new.campo = 'accesso'      then vincente else accesso end,
      carrozzina   = case when new.campo = 'carrozzina'   then vincente else carrozzina end,
      stagionalita = case when new.campo = 'stagionalita' then vincente else stagionalita end
    where id = new.punto_id;
  end if;
  return null;
end;
$$;
