# Acqua Valle d'Aosta (nome provvisorio)

App per trovare, vedere, aggiungere e verificare i punti in cui bere acqua in Valle d'Aosta (fontane, sorgenti e altri punti d'acqua potabile).

Progetto scolastico di due studenti. Il repository GitHub è la fonte di verità: le decisioni ufficiali sono nei file di questo repository, non nelle chat.

## Stato attuale

- FASE 0 (Analisi): completata.
- FASE 1 (Requisiti): documento pronto, in attesa di conferma degli studenti e del docente (`docs/01_PROGETTO.md`).
- FASE 2 (Tecnologie): analisi in corso (`docs/15_TECNOLOGIE.md`). Direzione aggiornata il 2026-10-23 su indicazione dello Studente A: **React Native + Expo** (D28, approvata dallo Studente A il 2026-10-26; conferma dello Studente B non registrata). Flutter (D24, proposta del 2026-10-05) è superata ma resta nei documenti come storico. D03 (Expo) è riaperta: restano i vincoli su iPhone, vedi `DECISIONI_TECNICHE.md`.
- Pitch dell'idea (2026-10-05): presentazione su Google Slides "AcquaVDA_Pitch" (copia iniziale in `presentazioni/`, non aggiornata).
- Ambiente di sviluppo (D23, APPROVATA): Node.js 24 LTS (24.21.0, npm 11.19.0) su entrambi i computer; sul Mac di A gestito con nvm. Approvata da A; una conferma esplicita di B non è registrata (B ha riferito le stesse versioni il 30/09).
- Codice dell'app: esiste una prima versione in `app-mobile/` (Expo SDK 58, TypeScript, Expo Router): mappa (MapLibre GL JS in una WebView), pulsante GPS e punti letti da Supabase. Provata solo su iPhone con Expo Go dallo Studente A (23-26/10/2026); non provata su Android né su Windows. È sul ramo `dev-studente-A`. Il **prototipo web** (`prototipo-web/`) resta come riferimento funzionale e non è ancora salvato con un commit.
- Expo è la scelta approvata dallo Studente A (D28, 2026-10-26); la conferma dello Studente B non è registrata e A non la richiede. Flutter (D24) e PWA (D02) sono superate.
- Rami su GitHub: `origin/dev-studente-A` è a `4c44a91` (push di Max del 26/10/2026); `origin/dev-studente-B` e `origin/main` risultavano a `bb9b849` e `635f8c4` all'ultimo controllo (12/10/2026), non riverificati.
- Visibilità del repository: **contraddittoria, da confermare**. Il diario del 28/09 dice che Max lo ha reso privato; Max (incarico del 12/10) e il resoconto di revisione lo indicano pubblico (Mayo lo avrebbe clonato senza credenziali). Claude non ha potuto verificarlo su GitHub.
- Stato di ogni decisione: `DECISIONI_TECNICHE.md`.

## Documenti principali

- `docs/01_PROGETTO.md`: obiettivi, utenti, requisiti (RF, RNF, sicurezza), MVP, criteri di accettazione, vincoli, rischi
- `DECISIONI_TECNICHE.md`: scelte tecnologiche e loro stato (APPROVATA / DA DECIDERE / BLOCCATA)
- `DIARIO_SVILUPPO.md`: cronologia reale del lavoro
- `docs/15_TECNOLOGIE.md`: analisi delle tecnologie (Fase 2)
- `CHANGELOG.md`: versioni del software

Gli altri documenti in `docs/` (da `02_ARCHITETTURA.md` a `14_PREPARAZIONE_ESAME.md`) vengono creati quando inizia la fase corrispondente.

## Come si avvia il progetto

App mobile (`app-mobile/`):

1. Servono Node.js 24 (D23), un account Expo gratuito (expo.dev) e l'app Expo Go sull'iPhone, con lo stesso account.
2. `cd app-mobile`, poi `npm install`.
3. Copia `.env.example` in `.env` e inserisci i due valori di Supabase (vanno chiesti a Max in privato; il `.env` non va mai su GitHub).
4. Una volta sola: `npx expo login`. Poi `npx expo start --clear` e inquadra il QR con la Fotocamera dell'iPhone.

Per il prototipo web vedi `prototipo-web/README.md` (quando sarà pubblicato).
