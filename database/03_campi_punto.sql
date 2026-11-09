-- Altri campi del punto d'acqua (docs/01_PROGETTO.md, §5.1). Creato il 2026-11-06.
-- Da incollare nel "SQL Editor" di Supabase ed eseguire UNA volta sola (dopo 01 e 02).

-- Il tipo "altro" è previsto dai requisiti: sostituiamo il vincolo.
alter table public.punti drop constraint punti_tipo_check;
alter table public.punti add constraint punti_tipo_check
  check (tipo in ('fontana', 'fontanella', 'sorgente', 'punto_struttura', 'altro'));

-- Limiti di lunghezza dei testi (nome 80, descrizione 500).
alter table public.punti add constraint punti_nome_lungo check (char_length(nome) <= 80);
alter table public.punti add constraint punti_descrizione_lunga check (char_length(descrizione) <= 500);

-- Nuovi campi: tutti con un valore predefinito, così l'inserimento resta rapido.
alter table public.punti
  add column stato text not null default 'non_verificato'
    check (stato in ('funzionante', 'non_funzionante', 'non_verificato')),
  add column bottiglia text not null default 'non_so'
    check (bottiglia in ('si', 'no', 'non_so')),
  add column accesso text not null default 'non_so'
    check (accesso in ('strada', 'sentiero', 'non_so')),
  add column carrozzina text not null default 'non_so'
    check (carrozzina in ('si', 'no', 'non_so')),
  add column stagionalita text not null default 'non_so'
    check (stagionalita in ('tutto_anno', 'stagionale', 'non_so')),
  add column stagionalita_nota text check (char_length(stagionalita_nota) <= 200);
