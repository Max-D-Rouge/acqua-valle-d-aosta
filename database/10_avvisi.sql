-- Avvisi sulla mappa "alla Waze": segnalazioni temporanee (sentiero chiuso, fontana in manutenzione...). Creato il 2026-11-09.
-- Da incollare nel "SQL Editor" di Supabase ed eseguire UNA volta sola (dopo 01-09).

create table public.avvisi (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('sentiero_chiuso', 'fontana_manutenzione', 'acqua_torbida', 'pericolo', 'altro')),
  nota text check (char_length(nota) <= 200),
  lat double precision not null,
  lon double precision not null,
  autore uuid default auth.uid() references auth.users (id) on delete set null,
  creato_il timestamptz not null default now(),
  -- Un avviso dura 48 ore, poi non si vede più. (Per cambiare la durata basta cambiare questo numero.)
  scade_il timestamptz not null default now() + interval '48 hours',
  -- Come per i punti: solo dentro la Valle d'Aosta (stesso rettangolo di 09).
  constraint avvisi_dentro_valle check (lat between 45.46 and 45.99 and lon between 6.80 and 7.95)
);

alter table public.avvisi enable row level security;

-- Tutti vedono solo gli avvisi non ancora scaduti.
create policy "tutti vedono gli avvisi in corso"
  on public.avvisi for select
  to anon, authenticated
  using (scade_il > now());

-- Può creare avvisi solo chi è collegato, a proprio nome e con una scadenza di al massimo 3 giorni.
create policy "utenti collegati possono creare avvisi"
  on public.avvisi for insert
  to authenticated
  with check (autore = auth.uid() and scade_il <= now() + interval '3 days');

-- Ognuno può rimuovere i propri avvisi (per esempio quando il problema è risolto).
create policy "ognuno rimuove i propri avvisi"
  on public.avvisi for delete
  to authenticated
  using (autore = auth.uid());
