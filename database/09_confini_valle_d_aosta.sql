-- Un punto deve stare dentro la Valle d'Aosta (docs/01_PROGETTO.md, §5.4). Creato il 2026-11-09.
-- Da incollare nel "SQL Editor" di Supabase ed eseguire UNA volta sola (dopo 01-08).

-- Per ora si usa un RETTANGOLO (latitudine e longitudine minime e massime) che contiene la regione.
-- Non segue il confine esatto: vicino ai bordi (per esempio verso Ivrea o la Svizzera) qualche punto
-- fuori regione può passare. Più avanti si può usare il confine vero con PostGIS (decisione D11).
-- Il controllo vale anche se qualcuno prova a scrivere nel database senza passare dall'app.
alter table public.punti
  add constraint punti_dentro_valle_daosta
  check (lat between 45.46 and 45.99 and lon between 6.80 and 7.95);
