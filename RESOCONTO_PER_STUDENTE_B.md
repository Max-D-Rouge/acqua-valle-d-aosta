# Resoconto per lo Studente B (e la sua chat Claude) — 30/09/2026

Scritto dalla chat dello Studente A (Max). Da incollare nella chat dello Studente B.

## Situazione in una riga
Siamo in **Fase 2 (Tecnologie)**, solo analisi. **Non esiste codice** e **nessuna tecnologia è stata scelta**. Lo Studente B **non deve ancora scrivere codice**: prima deve fare i passi della sezione "Cosa deve fare B".

## ATTENZIONE: GitHub non è aggiornato
- Repository: `Max-D-Rouge/acqua-valle-d-aosta` (privato).
- Su GitHub c'è solo `main` al commit `635f8c4` (documenti della Fase 0).
- Tutto il lavoro successivo (Fase 0 rivista, Fase 1, inizio Fase 2) è sul Mac di A, ramo `dev-studente-A`, **non ancora in un commit**.
- I rami `dev-studente-A` e `dev-studente-B` esistono solo in locale sul Mac di A.
- Prima che B lavori, A deve: fare commit, pushare i due rami, invitare B come collaboratore.

## Fasi
- Fase 0 (Analisi): fatta.
- Fase 1 (Requisiti): `docs/01_PROGETTO.md` pronto (RF-001…RF-073, RNF, SEC-001…016, criteri CA-01…CA-17, MVP). **Serve la conferma di B e del docente.**
- Fase 2 (Tecnologie): in corso, analisi in `docs/15_TECNOLOGIE.md`.

## Decisioni (dettagli in `DECISIONI_TECNICHE.md`)
- APPROVATE: D01 piattaforme Windows/Linux/macOS/iOS/Android; D07 niente tile pubblici openstreetmap.org come fonte principale; D14 rami `main`, `dev-studente-A`, `dev-studente-B`; D16 14 documenti in `docs/`; D17 fasi 0-19 originali; D18 segreti mai nel repository (`.env` ignorato).
- BLOCCATA: D03 React Native + Expo. Motivo: non copre il desktop e il Mac Intel di A (max macOS Sonoma 14) non può installare l'Xcode richiesto da Expo attuale.
- DA DECIDERE (proposta principale, non approvata): PWA (web app installabile) con Vite, React o nessun framework, TypeScript o JavaScript, MapLibre GL JS / Leaflet / OpenLayers, tile OpenFreeMap / VersaTiles / MapTiler, backend Supabase / Firebase / proprio, coordinate `latitude` + `longitude` (PostGIS dopo), hosting Cloudflare Pages / Netlify.
- Domande aperte sui requisiti: RQ-01…RQ-13 (`docs/01_PROGETTO.md`).
- 8 domande per il docente (D19, `docs/01_PROGETTO.md` §19): PWA, Supabase, pubblicazione online, repository pubblico, regole della scuola su account/email/foto/privacy, scadenza, moderazione, età minima per gli account sui servizi esterni.

## Computer dello Studente A (verificato)
MacBook Air 2019 Intel, 8 GB RAM, macOS 14.8.5, Git 2.39.5, Node.js v26 (non LTS), npm 11, Docker presente. Problema: solo ~4 GB liberi su disco, da liberare prima di installare altro. Nessun test Android o Linux disponibile finora.

## Cosa deve fare lo Studente B (in ordine)
1. Creare un account GitHub e comunicare il nome utente ad A.
2. Installare Git su Windows.
3. Comunicare i dati del computer: versione di Windows, RAM, spazio libero; se installati, versioni di Node.js e Git.
4. Comunicare il telefono: marca, modello, Android o iOS e versione (utile per i test Android).
5. Dopo l'invito e il push di A: clonare il repository e passare al ramo `dev-studente-B`.
6. Leggere `docs/01_PROGETTO.md` e `DECISIONI_TECNICHE.md` e dire cosa conferma e cosa no.
7. Insieme ad A: mandare le domande al docente.

## Regole per la chat di B
- Le decisioni ufficiali sono nei file del repository, non nelle chat.
- Non riaprire le decisioni APPROVATE senza segnalarlo; se qualcosa contraddice il repository, segnalarlo prima di procedere.
- Non installare dipendenze né creare il progetto finché lo stack non è approvato.
