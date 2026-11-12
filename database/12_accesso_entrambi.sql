-- "Come si raggiunge": oltre a strada e sentiero si può scegliere "entrambi". Creato il 2026-11-12.
-- Da incollare nel "SQL Editor" di Supabase ed eseguire UNA volta sola (dopo 03 e 05).

-- 1) Il campo del punto.
alter table public.punti drop constraint if exists punti_accesso_check;
alter table public.punti add constraint punti_accesso_check
  check (accesso in ('strada', 'sentiero', 'entrambi', 'non_so'));

-- 2) Le segnalazioni (voti) sullo stesso campo.
alter table public.segnalazioni drop constraint if exists segnalazioni_valore_ok;
alter table public.segnalazioni add constraint segnalazioni_valore_ok check (
  (campo = 'stato' and valore in ('funzionante', 'non_funzionante'))
  or (campo = 'potabile' and valore in ('potabile', 'non_potabile'))
  or (campo = 'bottiglia' and valore in ('si', 'no'))
  or (campo = 'accesso' and valore in ('strada', 'sentiero', 'entrambi'))
  or (campo = 'carrozzina' and valore in ('si', 'no'))
  or (campo = 'stagionalita' and valore in ('tutto_anno', 'stagionale'))
);
