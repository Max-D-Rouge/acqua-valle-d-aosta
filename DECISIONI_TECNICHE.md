# Decisioni tecniche

Stati possibili: APPROVATA, DA DECIDERE, DA CONFERMARE.
Le decisioni segnate "delegata" sono state prese dall'assistente su delega di Max (28/09/2026: "per il resto fai te") e vanno confermate dal secondo studente.

---

## DT-001 - React Native + Expo + TypeScript
- Data: 2026-09-28
- Decisione: app mobile con React Native, Expo e TypeScript.
- Motivazione: un solo codice per iOS e Android, ambiente semplice da installare, molta documentazione ufficiale.
- Alternative: app native separate (troppo lavoro), Flutter (linguaggio diverso, non nell'elenco).
- Vantaggi: ecosistema ampio, adatto a principianti.
- Svantaggi: TypeScript è un ulteriore concetto da imparare.
- Conseguenze: serve Node.js su entrambi i computer.
- Stato: SOSTITUITA da DT-008 (2026-09-28): requisito nuovo, app per Windows, Linux, macOS, iOS e Android.

## DT-002 - MapLibre con development build
- Data: 2026-09-28
- Decisione: usare MapLibre React Native per la mappa.
- Motivazione: open source, compatibile con i dati OSM, nessuna chiave obbligatoria.
- Alternative: react-native-maps (su Android usa Google Maps), Leaflet in WebView (meno nativo).
- Vantaggi: mappa vettoriale fluida, coerente con OSM.
- Svantaggi: NON funziona in Expo Go (documentazione MapLibre): serve un development build. Per iOS serve un Mac con Xcode.
- Conseguenze: setup iniziale più lungo. Max usa un Mac. Il sistema operativo del secondo studente NON è ancora noto: se non ha un Mac può testare solo su Android.
- Stato: SOSTITUITA da DT-008 (2026-09-28). MapLibre React Native supporta solo Android e iOS (README ufficiale), quindi non copre Windows e Linux.

## DT-003 - Provider dei tile: OpenFreeMap
- Data: 2026-09-28
- Decisione: usare l'istanza pubblica di OpenFreeMap per i tile e lo stile (vale anche con MapLibre GL JS, DT-008).
- Motivazione: gratuita, senza API key, uso commerciale consentito, stili pronti per MapLibre.
- Alternative: tile pubblici OSM (policy "best-effort", bloccabili senza preavviso, richiedono User-Agent e cache), MapTiler Free (API key, piano gratuito per uso non commerciale), self-hosting (troppo complesso).
- Svantaggi: nessuna garanzia di servizio dichiarata.
- Conseguenze: attribuzione "OpenFreeMap © OpenMapTiles Data from OpenStreetMap" visibile sulla mappa.
- Stato: APPROVATA PROVVISORIA. Da verificare in pratica nella Fase 7.

## DT-004 - Supabase (Auth, database, poi Storage)
- Data: 2026-09-28
- Decisione: usare Supabase come backend.
- Motivazione: autenticazione, database PostgreSQL e storage in un solo servizio, piano gratuito.
- Alternative: backend proprio (Node + database): molto più lavoro e infrastruttura.
- Svantaggi: piano Free con 1 settimana di inattività = progetto in pausa; nessun backup automatico; limite 500 MB database.
- Conseguenze: un solo progetto Supabase condiviso dai due studenti. Lo schema si modifica solo con file SQL salvati nel repository. Prima dell'esame verificare che il progetto non sia in pausa.
- Stato: APPROVATA (delegata).

## DT-005 - PostGIS per le coordinate
- Data: 2026-09-28
- Decisione: usare PostGIS (tipo geography Point) per la posizione dei punti.
- Motivazione: permette query "punti vicini a me" e migliora la parte spiegabile all'esame.
- Alternative: due colonne latitude/longitude (più semplice, meno potente).
- Svantaggi: curva di apprendimento più ripida.
- Conseguenze: estensione da attivare in uno schema dedicato (`extensions`).
- Stato: APPROVATA (delegata). Se risulta troppo complessa in Fase 5, si può rivedere con una nuova decisione documentata.

## DT-006 - Numerazione dei documenti
- Data: 2026-09-28
- Decisione: usare i 12 file `docs/01`..`docs/12` indicati nel messaggio iniziale (09_GIT, 10_TEST, 11_PROBLEMI_E_SOLUZIONI, 12_PREPARAZIONE_ESAME).
- Motivazione: le istruzioni permanenti prevedevano 14 file con numerazione diversa; si adotta la versione più recente e più semplice.
- Conseguenze: documenti su gestione punti e immagini si creano solo quando servono.
- Stato: APPROVATA (delegata).

## DT-007 - Versioni esatte di Expo SDK e React Native
- Stato: SOSTITUITA da DT-008 e DT-010 (Expo non è più previsto).

## DT-008 - Web app installabile (PWA) per tutte le piattaforme
- Data: 2026-09-28
- Requisito nuovo: l'app deve funzionare su Windows, Linux, macOS, iOS e Android.
- Decisione: web app in TypeScript con React, mappa con MapLibre GL JS, backend Supabase, resa installabile come PWA. Sostituisce DT-001 e DT-002.
- Motivazione: un solo codice gira nel browser di tutti e cinque i sistemi. Una PWA è installabile su desktop e mobile con icona (MDN). Nessun Mac, Xcode o development build necessari, e il problema del computer del secondo studente sparisce.
- Alternative: (a) React Native + Expo con MapLibre nativo: solo iOS e Android; (b) Expo con target web + mappa web separata: due implementazioni della mappa, più complesso; (c) Electron/Tauri per il desktop + app mobile separata: più progetti da mantenere.
- Vantaggi: massima compatibilità, setup semplice, nessuno store, facile da spiegare all'esame.
- Svantaggi: meno integrazione con il sistema rispetto a un'app nativa; su iOS le PWA hanno più limiti (da verificare); il GPS del browser richiede HTTPS e permesso utente (MDN); serve un hosting per pubblicare l'app.
- Conseguenze: la struttura di cartelle proposta (app, components, lib, services, types) andrà adattata a un progetto web; le fasi restano uguali ma la Fase 2 diventa "Vite/React + TypeScript". Supabase (DT-004) e PostGIS (DT-005) restano invariati. L'attribuzione OpenFreeMap (DT-003) resta.
- Stato: APPROVATA (delegata da Max), da confermare dal secondo studente.

## DT-009 - Hosting della web app
- Stato: DA DECIDERE (da valutare in Fase 2, con costi e limiti verificati).

## DT-010 - Libreria e strumenti web (React, Vite, versioni)
- Stato: DA DECIDERE. Sostituisce la parte "versioni" di DT-007. Versioni e compatibilità da verificare sulla documentazione ufficiale in Fase 2.

## DT-011 - Affidabilità dello stato "potabile"
- Data: 2026-09-28
- Problema: i punti possono essere inseriti da utenti sconosciuti; un punto segnato "potabile" per errore può essere pericoloso.
- Proposta (riferita dalla chat dello studente Windows): stati potabile / non potabile / sconosciuto, valore predefinito "non verificato", avviso visibile nell'app.
- Stato: DA DECIDERE (da definire in Fase 5, progettazione del database).

## DT-012 - Chiarimenti con il docente
- Data: 2026-09-28
- Da chiarire prima di scrivere codice: (1) una PWA conta come "app" per la consegna? (2) Supabase è accettabile come backend?
- Scadenza del progetto: aprile 2027 (riferita dallo studente Windows).
- Stato: DA DECIDERE, in attesa della risposta del docente.

## Note per la Fase 5
- Il client JavaScript di Supabase gestisce male le colonne geografiche: serviranno una vista o una funzione SQL di appoggio (riferito dalla chat Windows, da verificare sulla documentazione).

## DT-013 - Assegnazione degli sviluppatori
- Data: 2026-09-28
- Decisione: Studente A = Max (Mac), branch `dev-studente-A`. Studente B = lo studente Windows, branch `dev-studente-B`.
- Stato: APPROVATA (deciso da Max). Da comunicare a B.
