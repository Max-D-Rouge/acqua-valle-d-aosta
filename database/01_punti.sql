-- Tabella dei punti d'acqua di AcquaVDA (Supabase / PostgreSQL).
-- Da incollare nel "SQL Editor" di Supabase. Creato il 2026-10-23.

create table public.punti (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  comune text,
  tipo text not null check (tipo in ('fontana', 'fontanella', 'sorgente', 'punto_struttura')),
  lat double precision not null check (lat between -90 and 90),
  lon double precision not null check (lon between -180 and 180),
  potabile text not null default 'non_verificato'
    check (potabile in ('potabile', 'non_potabile', 'non_verificato')),
  descrizione text,
  esempio boolean not null default false,  -- true = punto di prova, da eliminare più avanti
  creato_il timestamptz not null default now()
);

-- Sicurezza a livello di riga (RLS): senza regole esplicite nessuno può leggere né scrivere.
alter table public.punti enable row level security;

-- Regola: chiunque (anche senza account) può LEGGERE i punti.
-- Non esiste nessuna regola di scrittura: dall'app, per ora, nessuno può aggiungere o modificare punti.
create policy "tutti possono leggere i punti"
  on public.punti for select
  to anon, authenticated
  using (true);

-- Punti di esempio (coordinate approssimate, da verificare sul posto).
insert into public.punti (nome, comune, tipo, lat, lon, potabile, descrizione, esempio) values
  ('Fontana Piazza Chanoux', 'Aosta', 'fontana', 45.7370, 7.3200, 'potabile', 'Nella piazza centrale, vicino al municipio.', true),
  ('Fontana Arco d''Augusto', 'Aosta', 'fontana', 45.7355, 7.3225, 'potabile', null, true),
  ('Fontana del centro', 'Courmayeur', 'fontana', 45.7969, 6.9689, 'potabile', null, true),
  ('Fontana del paese', 'Cogne', 'fontana', 45.6086, 7.3560, 'potabile', null, true),
  ('Fontanella Cervinia', 'Valtournenche', 'fontanella', 45.9370, 7.6310, 'potabile', 'Vicino agli impianti di risalita.', true),
  ('Sorgente sul sentiero', 'Gressoney-Saint-Jean', 'sorgente', 45.7750, 7.8240, 'non_verificato', 'Acqua di sorgente: non indicata come potabile.', true),
  ('Fontana del centro', 'Saint-Vincent', 'fontana', 45.7500, 7.6500, 'potabile', null, true),
  ('Fontana lungo la strada', 'Pont-Saint-Martin', 'fontana', 45.5970, 7.7960, 'non_potabile', 'Cartello "acqua non potabile".', true),
  ('Fontanella del rifugio', 'Valsavarenche', 'punto_struttura', 45.5977, 7.2330, 'potabile', null, true),
  ('Fontana vicino al castello', 'Bard', 'fontana', 45.6035, 7.7458, 'potabile', null, true),
  ('Fontana in piazza', 'Morgex', 'fontana', 45.7573, 7.0383, 'potabile', null, true),
  ('Sorgente (esempio)', 'La Thuile', 'sorgente', 45.7131, 6.9505, 'non_verificato', null, true),
  ('Fontana del paese', 'Etroubles', 'fontana', 45.8197, 7.2158, 'potabile', null, true),
  ('Fontana Châtillon', 'Châtillon', 'fontana', 45.7468, 7.6150, 'non_verificato', null, true);
