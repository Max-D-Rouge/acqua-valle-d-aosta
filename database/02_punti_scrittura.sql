-- Permette agli utenti COLLEGATI di aggiungere punti d'acqua. Creato il 2026-11-06.
-- Da incollare nel "SQL Editor" di Supabase ed eseguire UNA volta sola (dopo 01_punti.sql).

-- Chi ha aggiunto il punto. Si compila da solo con l'utente collegato (auth.uid()).
alter table public.punti
  add column autore uuid references auth.users (id) default auth.uid();

-- Regola: può INSERIRE solo chi è collegato, e solo punti a proprio nome e che non siano "di esempio".
-- Non esiste nessuna regola per modificare o cancellare: per ora nessuno può farlo dall'app.
create policy "utenti collegati possono aggiungere punti"
  on public.punti for insert
  to authenticated
  with check (autore = auth.uid() and esempio = false);
