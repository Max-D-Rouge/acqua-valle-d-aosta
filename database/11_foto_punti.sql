-- Fotografie dei punti d'acqua (Fase 13). Da incollare nel "SQL Editor" di Supabase. Creato il 2026-11-11.
--
-- Come funziona:
--  - i file delle foto stanno in Supabase Storage, nel "bucket" foto-punti (pubblico in lettura);
--  - la tabella foto_punti dice quale foto appartiene a quale punto e chi l'ha caricata;
--  - per ogni foto ci sono 2 file: l'immagine (max 1280 px) e una miniatura "_mini" (max 400 px).
--
-- Limiti (Supabase gratuito, verificati su supabase.com/pricing il 2026-11-11):
--  1 GB di file, 5 GB di traffico, 50 MB per file. Qui mettiamo 2 MB per file e solo JPEG.

-- 1) Il contenitore dei file (bucket). Se questa istruzione desse errore, crealo dal pannello:
--    Storage -> New bucket -> nome foto-punti, "Public bucket" acceso, limite 2 MB, tipo image/jpeg.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('foto-punti', 'foto-punti', true, 2097152, array['image/jpeg'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Regole sui file: ognuno può caricare e cancellare SOLO nella cartella col proprio identificativo.
-- (La lettura non serve: il bucket è pubblico.)
create policy "foto: carica nella propria cartella"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'foto-punti' and (storage.foldername(name))[1] = (select auth.uid()::text));

create policy "foto: cancella dalla propria cartella"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'foto-punti' and (storage.foldername(name))[1] = (select auth.uid()::text));

-- 2) La tabella che collega le foto ai punti.
create table public.foto_punti (
  id uuid primary key default gen_random_uuid(),
  punto_id uuid not null references public.punti (id) on delete cascade,
  -- Se l'utente elimina l'account la foto resta (come i punti), senza autore.
  autore uuid default auth.uid() references auth.users (id) on delete set null,
  -- Percorso del file nel bucket: "<id utente>/<nome>.jpg". La miniatura è "<nome>_mini.jpg".
  percorso text not null unique,
  creato_il timestamptz not null default now(),
  constraint foto_percorso_formato check (percorso ~ '^[0-9a-f-]{36}/[A-Za-z0-9_-]{4,40}\.jpg$')
);

create index foto_punti_punto_idx on public.foto_punti (punto_id);

alter table public.foto_punti enable row level security;

-- Tutti vedono le foto.
create policy "tutti leggono le foto"
  on public.foto_punti for select
  to anon, authenticated
  using (true);

-- Chi è collegato può aggiungere una foto a nome proprio, nella propria cartella,
-- con questi limiti contro gli abusi: massimo 5 foto per punto e 10 foto al giorno per utente.
create policy "utenti collegati aggiungono foto"
  on public.foto_punti for insert
  to authenticated
  with check (
    autore = (select auth.uid())
    and percorso like (select auth.uid()::text) || '/%'
    and (select count(*) from public.foto_punti f where f.punto_id = foto_punti.punto_id) < 5
    and (select count(*) from public.foto_punti f
         where f.autore = (select auth.uid()) and f.creato_il > now() - interval '1 day') < 10
  );

-- Ognuno può eliminare solo le proprie foto.
create policy "utenti eliminano le proprie foto"
  on public.foto_punti for delete
  to authenticated
  using (autore = (select auth.uid()));
