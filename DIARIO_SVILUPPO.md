# Diario di sviluppo

Solo attività realmente svolte. I dati mancanti sono da compilare.

---

## 2026-09-28 - FASE 0: Analisi

- Sviluppatore: Max (Mac). Secondo studente: da compilare.
- Obiettivo: analizzare l'architettura proposta e produrre una proposta tecnica.
- Attività svolte: verifica sulla documentazione ufficiale di MapLibre (Expo), policy tile OSM, limiti Supabase Free, PostGIS su Supabase, expo-location, requisiti dei development build, OpenFreeMap, MapTiler.
- File creati: README.md, DECISIONI_TECNICHE.md, DIARIO_SVILUPPO.md, CHANGELOG.md, docs/01_PROGETTO.md
- File modificati: nessuno
- Problemi: MapLibre non funziona in Expo Go, quindi serve un development build. Le istruzioni permanenti e il messaggio iniziale avevano numerazioni dei documenti diverse.
- Soluzione: DT-002 con condizione aperta; DT-006 per la numerazione.
- Alternative: vedi DECISIONI_TECNICHE.md
- Cosa abbiamo imparato: differenza tra dati OSM, tile, stile e libreria MapLibre; limiti del piano gratuito Supabase.
- Test effettuati: nessuno (nessun codice esiste)
- Risultato: proposta tecnica e documenti iniziali. Le decisioni delegate vanno confermate dal secondo studente.
- Commit Git: nessuno (il repository non è ancora stato creato)
- Attività successive: confermare le decisioni con il secondo studente, verificare il suo computer, poi FASE 1 (Git/GitHub).

---

## 2026-09-28 - FASE 0: nuovo requisito multipiattaforma

- Sviluppatore: Max.
- Obiettivo: adattare l'architettura al requisito "Windows, Linux, macOS, iOS, Android".
- Attività svolte: verifica che MapLibre React Native supporti solo Android e iOS; verifica di MapLibre GL JS, Geolocation API (solo HTTPS, permesso utente) e PWA (MDN).
- File modificati: DECISIONI_TECNICHE.md (DT-001 e DT-002 sostituite, aggiunte DT-008, DT-009, DT-010), docs/01_PROGETTO.md.
- Problemi: React Native + MapLibre nativo non copre desktop.
- Soluzione: DT-008, web app PWA con React, TypeScript, MapLibre GL JS e Supabase.
- Test effettuati: nessuno (nessun codice).
- Commit Git: nessuno.
- Attività successive: conferma del secondo studente; poi FASE 1 (Git/GitHub).

---

## 2026-09-28 - FASE 0: allineamento con la chat dello studente Windows

- Fonte: resoconto incollato da Max, NON verificato direttamente. La seconda chat non ha creato file né codice.
- Informazioni riferite: secondo studente su Windows, senza account GitHub e senza Git installato; scadenza aprile 2027; struttura a 12 documenti confermata da lui; accetta DT-008 e le scelte su Supabase, PostGIS, OpenFreeMap.
- Rischi aperti: docente da consultare (PWA come "app", Supabase come backend); limiti PWA su iOS; hosting e versioni; conferma delle decisioni delegate da parte dello studente Windows; assegnazione Studente A/B ancora da fare.
- File modificati: DECISIONI_TECNICHE.md (DT-011, DT-012, note Fase 5).
- Test effettuati: nessuno. Commit Git: nessuno.

---

## 2026-09-28 - FASE 1 (avvio): ruoli e .gitignore

- Sviluppatore: Studente A (Max).
- Attività svolte: assegnati i ruoli A/B (DT-013); creato il file .gitignore.
- File creati: .gitignore
- File modificati: DECISIONI_TECNICHE.md
- Test effettuati: nessuno. Commit Git: nessuno (repository non ancora creato).
- Da fare: installare/configurare Git su A, creare il repository GitHub, primo commit.

---

## 2026-09-28 - FASE 1: primo commit e push

- Sviluppatore: Studente A (Max).
- Obiettivo: creare il repository Git locale e inviarlo a GitHub.
- Attività svolte: `git init -b main`, `git add` dei sei file di Fase 0, primo commit, collegamento a `origin` (repository privato `Max-D-Rouge/acqua-valle-d-aosta`), push di `main`.
- Problemi: `git init` ha lasciato un file di blocco (`index.lock`) e un file vuoto nella cartella `.git`, non eliminabili senza permesso. Soluzione: permesso di eliminazione concesso da Max, rimossi i due file. Il repository era pubblico ed è stato reso privato da Max; l'accesso di Claude a GitHub è stato revocato da Max, quindi il push è stato fatto da Max sul proprio Mac.
- Test effettuati: `git log` e `git branch -vv` in locale mostrano `main` allineato a `origin/main` al commit `635f8c4`. Il contenuto sul sito GitHub non è stato verificato da Claude.
- Risultato: `main` su GitHub al commit `635f8c4`. I rami `dev-studente-A` e `dev-studente-B` esistono ancora solo in locale (non ancora inviati a GitHub).
- Commit Git: `635f8c4` (Fase 0: documentazione iniziale del progetto).
- Attività successive: inviare i due rami a GitHub; invitare Studente B in Settings -> Collaborators; Studente B clona il repository; risposta del docente su PWA e Supabase (DT-012).
