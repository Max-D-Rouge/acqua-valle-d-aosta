-- PROVA del controllo "dentro il confine" (database/15). Si esegue nel SQL Editor di Supabase dopo il file 15.
-- Non scrive nulla: confronta il risultato di PostGIS con quello atteso, calcolato a parte con un altro metodo (Python).
-- Il risultato compare come messaggio di errore "RISULTATO DELLA PROVA" (è voluto: così il messaggio si legge per intero).
do $$
declare
  r record;
  esito text := '';
  sbagliati int := 0;
begin
  for r in select * from (values
  ('Aosta centro', 45.737, 7.32, true),
  ('Courmayeur', 45.7969, 6.9689, true),
  ('Cogne', 45.6086, 7.356, true),
  ('Gressoney-Saint-Jean', 45.775, 7.824, true),
  ('Morgex', 45.7573, 7.0383, true),
  ('Pont-Saint-Martin', 45.597, 7.796, true),
  ('Ivrea (Piemonte)', 45.4667, 7.8667, false),
  ('Biella (Piemonte)', 45.5628, 8.0583, false),
  ('Chamonix (Francia)', 45.9237, 6.8694, false),
  ('Martigny (Svizzera)', 46.103, 7.072, false),
  ('Zermatt (Svizzera)', 46.0207, 7.7491, false),
  ('Torino', 45.0703, 7.6869, false),
  ('Ceresole Reale (Piemonte)', 45.4547, 7.2347, false),
  ('Cervinia', 45.937, 7.631, true)
  ) as t(nome, lat, lon, atteso)
  loop
    if public.dentro_valle_daosta(r.lat::double precision, r.lon::double precision) = r.atteso then
      esito := esito || 'OK     ' || r.nome || ' -> ' || r.atteso || E'\n';
    else
      esito := esito || 'ERRORE ' || r.nome || ' -> atteso ' || r.atteso || E'\n';
      sbagliati := sbagliati + 1;
    end if;
  end loop;
  raise exception E'RISULTATO DELLA PROVA (punti sbagliati: %)\n%', sbagliati, esito;
end;
$$;
