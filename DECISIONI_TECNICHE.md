# Decisioni tecniche

Ultima revisione: 2026-09-28 (FASE 2 - Tecnologie, avvio: nessuna nuova approvazione; D04 riaperta; D05, D06, D09, D10 resi neutrali rispetto ai candidati; nuove D22, D23). Analisi completa delle alternative: `docs/15_TECNOLOGIE.md`. I requisiti (COSA fa il sistema) sono in `docs/01_PROGETTO.md`; questo file contiene solo le decisioni su COME realizzarlo.

## Regole di questo file

- Stati ammessi: **APPROVATA**, **DA DECIDERE**, **BLOCCATA**.
  - APPROVATA: decisione presa, non dipende da informazioni che ancora mancano.
  - DA DECIDERE: c'è una proposta, ma manca un'informazione, un test pratico o una conferma.
  - BLOCCATA: con le informazioni attuali non si può adottare (motivo scritto nella scheda).
- In ogni scheda si distingue tra:
  - **Fatto**: verificato su documentazione ufficiale (fonte in fondo al file) o dichiarato da uno studente;
  - **Proposto**: suggerimento non ancora approvato;
  - **Da verificare**: informazione che non conosciamo o che va provata in pratica.
- Fonti consultate il 2026-09-28. Prezzi, limiti e versioni cambiano: vanno ricontrollati prima dell'uso.
- Le versioni con le vecchie schede DT-001...DT-013 sono nella storia Git (commit `635f8c4`, `b4a9dc3`). La prima revisione D01-D19 non era stata salvata in un commit: questa la sostituisce (le differenze sono riassunte in `DIARIO_SVILUPPO.md`).

---

## Tabella riassuntiva

| ID | Decisione | Scelta proposta | Motivazione | Alternative | Stato |
| -- | --------- | --------------- | ----------- | ----------- | ----- |
| D01 | Piattaforme | Windows, Linux, macOS, iOS, Android | Requisito confermato dallo Studente A | Solo iOS + Android | APPROVATA |
| D02 | Tipo di app | PWA (web app installabile) | Analisi delle 22 funzionalità: nessuna "non adatta"; alcune con limitazioni da provare | React Native + Expo; PWA + Capacitor | DA DECIDERE |
| D03 | React Native + Expo + MapLibre React Native | Non usarli | Non copre desktop; SDK Expo attuale non compilabile per iOS sul Mac Intel dello Studente A | Vedi D02 | BLOCCATA |
| D04 | Linguaggio | Candidati: TypeScript, JavaScript | Riaperta in Fase 2 su indicazione dello Studente A | — | DA DECIDERE |
| D05 | Frontend: framework e strumento di sviluppo | Candidati: React, nessun framework (HTML/CSS/JS); strumento Vite (usabile con entrambi) | Confronto in `15_TECNOLOGIE.md` §3 | Vue, Svelte (non analizzati) | DA DECIDERE |
| D06 | Libreria della mappa | Candidati: MapLibre GL JS, Leaflet, OpenLayers | Confronto in `15_TECNOLOGIE.md` §5.2; test pratico | — | DA DECIDERE |
| D07 | Tile pubblici openstreetmap.org come fonte principale | Non usarli | Best-effort, bloccabili senza preavviso | — | APPROVATA |
| D08 | Provider dei tile | Candidati: OpenFreeMap, VersaTiles, MapTiler | Scelta dopo un test pratico | Protomaps (self-hosting) | DA DECIDERE |
| D09 | Backend e autenticazione | Candidati: Supabase, Firebase, backend scritto da noi | Confronto in `15_TECNOLOGIE.md` §4.1 | PocketBase, Appwrite (non analizzati) | DA DECIDERE |
| D10 | Database | Candidati: relazionale (PostgreSQL), a documenti (Firestore) | Segue D09; `15_TECNOLOGIE.md` §4.2 | SQLite | DA DECIDERE |
| D11 | Coordinate | Proposto: `latitude` + `longitude` numerici nell'MVP; PostGIS aggiungibile dopo | Per la scala del progetto basta; meno concetti; nessuna funzione `rpc()` obbligatoria | PostGIS `geography(Point)` subito | DA DECIDERE |
| D12 | Hosting HTTPS | Candidati: Cloudflare Pages, Netlify | Serve HTTPS; GitHub Pages non disponibile per repository privati con account gratuito | Vercel Hobby, GitHub Pages | DA DECIDERE |
| D13 | Stato "acqua potabile" | 3 valori con predefinito "non verificato" + avviso; campo "fonte" in P2 | Prudenza; analisi in `01_PROGETTO.md` §5.3 | Sì/no; valori basati sul cartello | DA DECIDERE |
| D14 | Git e rami | `main`, `dev-studente-A`, `dev-studente-B` | `main` stabile | — | APPROVATA |
| D15 | Ruoli e dispositivi | A = Max (MacBook Air Intel, iPhone); B = Mayo (Windows 11, iPhone 15 Pro Max) | Dati riferiti da entrambi | — | DA DECIDERE |
| D16 | Numerazione documenti | 14 documenti originali | Richiesta dello Studente A | 12 documenti | APPROVATA |
| D17 | Numerazione fasi | Fasi 0-19 originali (Fase 1 = Requisiti) | Lo Studente A ha avviato ufficialmente la Fase 1 = Requisiti | Vecchio elenco | APPROVATA |
| D18 | Segreti | Mai nel repository; `.env` ignorato da Git | Sicurezza | — | APPROVATA |
| D19 | Domande al docente | Vedi scheda | Da esse dipendono D02, D09, D12 | — | DA DECIDERE |
| D20 | Architettura complessiva | Vedi scheda | Sintesi delle proposte D02-D12 | — | DA DECIDERE |
| D22 | Storage delle immagini (dopo l'MVP) | Candidati: Supabase Storage, Firebase Storage (richiede piano Blaze con carta), storage proprio | `15_TECNOLOGIE.md` §4.4 | — | DA DECIDERE |
| D23 | Ambiente di sviluppo locale | Node.js su entrambi i computer; Docker solo se si esegue il backend in locale | Dipende dai computer (dati mancanti) | — | DA DECIDERE |
| D21 | Offline | MVP senza offline (A); cache minima dell'interfaccia in P1 (B); offline completo non previsto (C) | Policy dei tile e semplicità; analisi in `01_PROGETTO.md` §11 | Mappe offline | DA DECIDERE |

---

## Tre cose da non confondere

| | Sito web responsive | PWA installabile | App nativa |
| - | ------------------- | ---------------- | ---------- |
| Cos'è | Un sito che si adatta a schermi grandi e piccoli | Un sito responsive con in più un manifest (e di solito un service worker) che il sistema può "installare" con un'icona | Un programma compilato per iOS o Android |
| Come si apre | Dal browser, digitando l'indirizzo | Dall'icona, in una finestra senza barra del browser | Dall'icona |
| Come si ottiene | Visitando l'indirizzo | Dal browser: "Installa" (Chrome/Edge) o Condividi → "Aggiungi alla schermata Home" (iPhone) | Store o installazione di sviluppo |
| Strumenti per crearla | Editor + browser | Editor + browser + HTTPS | Xcode (iOS), Android Studio (Android) |
| Nel nostro progetto | È la base | È l'obiettivo proposto (D02) | Bloccata (D03) |

**Manifest**: file JSON con nome, icone, colore e modalità di apertura dell'app. **Service worker**: script che il browser esegue "dietro" la pagina; può salvare file in una cache e servirli anche senza rete.

---

## Analisi: la PWA è adatta alle funzionalità del progetto?

Legenda: **S** = supportato; **SL** = supportato con limitazioni; **DV** = da verificare praticamente; **NA** = non adatto.

| # | Funzionalità | Esito | Spiegazione | Fonte / nota |
| - | ------------ | ----- | ----------- | ------------ |
| 1 | Mappa interattiva MapLibre GL JS | S + DV | Libreria TypeScript che disegna mappe nel browser con WebGL; uso con Vite documentato. Prestazioni sull'iPhone di A e sul telefono di B da provare | MapLibre GL JS docs |
| 2 | GPS / geolocalizzazione | SL | Solo in HTTPS e dopo il permesso dell'utente. Pensata per l'uso con l'app aperta; il funzionamento in background non è verificato e non è richiesto | MDN Geolocation API |
| 3 | Posizione dell'utente sulla mappa | S | `GeolocateControl` di MapLibre: pulsante "trova la mia posizione", opzionalmente segue lo spostamento; disabilitato se il permesso è negato | MapLibre GeolocateControl |
| 4 | Visualizzazione dei punti d'acqua | S | Dati letti da Supabase e mostrati come livello sulla mappa | MapLibre, Supabase |
| 5 | Ricerca dei punti vicini | S | Non dipende dalla PWA: calcolo nel database o nel browser (vedi D11) | PostGIS / D11 |
| 6 | Registrazione | S + DV | Supabase Auth (email e password, password salvate con bcrypt). Limiti di invio delle email di conferma: da verificare | Supabase Auth |
| 7 | Login / logout | SL | Funziona nel browser. Su iPhone la PWA installata è separata da Safari: probabilmente bisogna rifare il login dentro l'app installata (DV) | WebKit blog 16.4 |
| 8 | Profilo utente | S | Tabella profilo collegata all'utente, protetta da RLS | Supabase RLS |
| 9 | Aggiunta di nuovi punti | S | Modulo + scrittura nel database, consentita solo agli utenti registrati tramite RLS | Supabase RLS |
| 10 | Modifica dei propri punti (se prevista) | S | Regola RLS "solo l'autore può modificare". Se prevederla: da decidere nella fase Requisiti | Supabase RLS |
| 11 | Caricamento fotografie | S + DV | Supabase Storage; limite 50 MB per file e 1 GB totali nel piano Free: le foto dovranno essere ridotte prima dell'invio | Supabase Storage |
| 12 | Fotocamera dello smartphone | SL + DV | `<input type="file" accept="image/*" capture="environment">` apre la fotocamera sui telefoni; attributo non "Baseline" (non uguale in tutti i browser); sul computer apre la scelta file. Da provare su iPhone e Android | MDN `capture` |
| 13 | Segnalazione di problemi | S | Tabella segnalazioni + RLS | — |
| 14 | Verifica dello stato di una fontana | S | Tabella verifiche con data e autore | — |
| 15 | Filtri | S | Filtri sulla query o sul livello della mappa | — |
| 16 | Ricerca | S | Ricerca per nome nel database. La ricerca di indirizzi richiederebbe un servizio di geocodifica esterno: non prevista, non analizzata | — |
| 17 | Responsive design | S | CSS; è la base di qualsiasi sito moderno | — |
| 18 | Installazione come PWA su iPhone | SL + DV | Solo manuale: Condividi → "Aggiungi alla schermata Home" (da iOS 16.4 anche da browser diversi da Safari). Nessun pulsante "Installa" automatico: WebKit ha rifiutato l'evento `beforeinstallprompt`. Icona dal manifest o da `apple-touch-icon` | WebKit blog; WebKit bug 255716 |
| 19 | Installazione come PWA su Android | S + DV | Chrome propone l'installazione se: HTTPS, manifest con `name`/`short_name`, icone 192 e 512 px, `start_url`, `display` adatto, e dopo un minimo di interazione dell'utente. Firefox Android crea solo un collegamento | web.dev install criteria; MDN |
| 20 | HTTPS | S (obbligatorio) | Richiesto per GPS e installazione. Fornito dai servizi di hosting (D12). In sviluppo `localhost` è considerato sicuro, ma aprire l'app dal telefono con l'indirizzo di rete del computer (`http://192.168...`) NON è HTTPS: il GPS non funzionerà. Serve una soluzione per i test su telefono (DV) | MDN |
| 21 | Offline / cache | SL | Il service worker può salvare i file dell'app. Tile e dati offline non previsti: la policy OSM vieta il download in blocco e i ToS di OpenFreeMap vietano la raccolta automatica di dati senza permesso. Safari può cancellare i dati dei siti dopo 7 giorni senza uso; le PWA installate hanno un proprio contatore | OSMF; OpenFreeMap ToS; WebKit |
| 22 | Privacy e permessi GPS | S | Il browser chiede il permesso; se negato, l'app funziona lo stesso (mappa senza posizione). Proposta: la posizione non viene salvata; se il calcolo dei punti vicini avviene nel browser non lascia nemmeno il telefono | MDN; D11 |

**Esito dell'analisi**: nessuna funzionalità risulta "non adatta". Le limitazioni riguardano soprattutto iPhone (installazione manuale, login separato, fotocamera da provare) e i test su telefono durante lo sviluppo (HTTPS). Queste vanno provate in pratica prima di approvare D02.

### Differenze principali tra browser

| Aspetto | Safari / iPhone | Chrome / Android | Browser desktop |
| ------- | --------------- | ---------------- | --------------- |
| Installazione | Manuale da Condividi → "Aggiungi alla schermata Home"; nessun prompt automatico | Prompt automatico se i criteri sono soddisfatti; anche dal menu | Chrome/Edge: icona "Installa"; Safari 17+ su macOS: "Aggiungi al Dock"; Firefox: non installa |
| Dati e login | PWA installata separata da Safari | Condivisi col browser (DV) | Condivisi col browser |
| Cancellazione dati | Possibile dopo 7 giorni senza uso in Safari; PWA installata ha un contatore proprio | Nessuna regola simile trovata (DV) | — |
| Fotocamera con `capture` | DV | DV | Apre la scelta file |
| GPS | HTTPS + permesso | HTTPS + permesso | HTTPS + permesso; su computer senza GPS la posizione è approssimativa (DV) |

---

## Confronto delle alternative

A = React Native + Expo. B = React + Vite + PWA. C = B + Capacitor (la stessa web app "impacchettata" come app nativa). Nessun voto: per ogni criterio si dice cosa succede.

| Criterio | A. React Native + Expo | B. React + Vite + PWA | C. PWA + Capacitor |
| -------- | ---------------------- | --------------------- | ------------------ |
| Computer Studente A (Mac Intel) | SDK 56-57 richiedono Xcode 26.4+, non installabile su nessun MacBook Air Intel | Serve solo Node.js (Vite: 20.19+ o 22.12+) e un browser | Capacitor 8 richiede Xcode 26.0+ (macOS Sequoia 15.6): possibile solo se il Mac è il modello 2020 |
| Computer Studente B | Android: Android Studio; iOS impossibile senza Mac | Qualsiasi sistema con Node.js | Android: Android Studio; iOS impossibile senza Mac |
| iPhone | Build cloud + 99 USD/anno, oppure build locale bloccata | Browser Safari; installazione manuale | Come A per la parte iOS |
| Android | Sì, con development build | Sì, installazione PWA da Chrome | Sì, app nativa |
| Windows / Linux / macOS | No (MapLibre RN solo Android e iOS) | Sì, dal browser | Sì, come B |
| Difficoltà | Alta: toolchain native, development build | Media: web, React, TypeScript | B + toolchain native |
| Manutenzione | Aggiornamenti SDK e native | Un solo progetto web | Progetto web + progetti nativi |
| Costo | 0 per Android; 99 USD/anno per iPhone via cloud | 0 (piani gratuiti) | Come A |
| Mappe | MapLibre Native | MapLibre GL JS | MapLibre GL JS dentro l'app |
| GPS | Completo, anche in background | Solo app aperta, HTTPS | Completo con plugin |
| Fotocamera | Completa | Tramite `input` (DV) | Completa con plugin |
| Immagini | Supabase Storage | Supabase Storage | Supabase Storage |
| Autenticazione | Supabase Auth | Supabase Auth | Supabase Auth |
| Database | Supabase/PostgreSQL | Supabase/PostgreSQL | Supabase/PostgreSQL |
| Installazione | Store o build di sviluppo | Dal browser | Store o build di sviluppo |
| Pubblicazione | Store (account a pagamento su Apple) | Hosting HTTPS gratuito | Come A |
| Spiegazione all'esame | Media | Alta: un solo codice, concetti web standard | Media |
| Rischi principali | Blocco hardware; costo Apple | Limiti iOS; test HTTPS su telefono; docente | Complessità doppia |

**Conclusione proposta**: rispetto al criterio "realizzabile con i nostri dispositivi senza costi", B è l'unica opzione che funziona oggi per entrambi gli studenti. C non è necessaria ora: resta un'evoluzione possibile se in futuro servisse un'app da store (per Android è fattibile su qualsiasi sistema; per iOS dipende dal modello del Mac).

---

## Architettura proposta (NON implementata)

Proposta, subordinata all'approvazione di D02 e D09 (vedi D20).

```
Browser (iPhone, Android, Windows, macOS, Linux)
│
├── Frontend: React + Vite + TypeScript
│   ├── PWA: Web App Manifest + Service Worker (plugin compatibile con Vite, es. vite-plugin-pwa)
│   ├── Mappa: MapLibre GL JS  ──►  Provider tile (da decidere, D08)
│   └── GPS: Geolocation API del browser (via GeolocateControl)
│
└── HTTPS ──► Supabase
              ├── Auth (registrazione, login, sessione)
              ├── Database PostgreSQL (+ eventualmente PostGIS, D11)
              ├── Storage (fotografie)
              └── Row Level Security (regole di accesso sulle tabelle)

Sicurezza: chiave "publishable" nel frontend (pensata per essere pubblica, protetta da RLS);
chiave "secret" mai nel frontend né nel repository; valori in .env non versionato.
Hosting del frontend: servizio con HTTPS (D12).
```

---

## D01 - Piattaforme da supportare

- **Decisione**: Windows, Linux, macOS, iOS, Android.
- **Problema**: definire dove deve funzionare l'app.
- **Alternative**: solo smartphone.
- **Scelta**: tutte e 5.
- **Motivazione**: fatto, requisito confermato dallo Studente A il 2026-09-28.
- **Conseguenze**: esclude soluzioni solo mobili (D03).
- **Stato**: APPROVATA.

---

## D02 - Tipo di applicazione: PWA

- **Decisione**: valutare una web app installabile (PWA) come direzione principale.
- **Problema**: un solo codice per 5 piattaforme, realizzabile da due principianti con i loro dispositivi.
- **Alternative**: A (React Native + Expo, bloccata), C (PWA + Capacitor, non necessaria ora). Vedi "Confronto delle alternative".
- **Fatti verificati**: vedi "Analisi: la PWA è adatta alle funzionalità del progetto?". Nessuna funzionalità "non adatta".
- **Cosa serve davvero per l'installabilità** (fatti):
  - HTTPS (o `localhost` in sviluppo) - MDN, web.dev;
  - manifest con `name` o `short_name`, `icons` 192 e 512 px, `start_url`, `display` (`standalone` o simili), senza `prefer_related_applications: true` - web.dev (criteri Chrome);
  - service worker: nella pagina attuale dei criteri Chrome non compare come requisito; serve comunque per la cache dei file dell'app - web.dev, vite-plugin-pwa;
  - iOS: nessun criterio tecnico obbligatorio, qualsiasi sito si può aggiungere alla Home; con manifest o `apple-touch-icon` si controllano icona e apertura senza barra del browser - WebKit.
- **Scelta**: proposta PWA.
- **Svantaggi**: vedi limitazioni SL/DV; niente store; niente GPS in background.
- **Da verificare prima dell'approvazione**:
  1. prova pratica su iPhone dello Studente A e sul telefono dello Studente B (mappa, GPS, fotocamera, installazione);
  2. risposta del docente (D19);
  3. conferma dello Studente B.
- **Stato**: DA DECIDERE.

---

## D03 - React Native + Expo + MapLibre React Native

- **Decisione**: valutata come base dell'app.
- **Problema che l'ha bloccata** (fatti):
  - MapLibre React Native avvolge MapLibre Native per Android e iOS; non utilizzabile in Expo Go (serve development build).
  - Expo SDK 57 (attuale) e 56 richiedono Xcode 26.4+; Xcode 26.4.1+ richiede macOS Tahoe 26.2; nessun MacBook Air Intel supporta Tahoe. Il MacBook Air Intel più recente (2020) arriva a Sequoia (Xcode fino a 26.3).
  - Installare una build cloud (EAS) su iPhone richiede la distribuzione ad hoc, quindi l'Apple Developer Program a 99 USD/anno.
  - Non copre Windows e Linux con la stessa mappa (D01).
- **Alternative**: D02.
- **Scelta**: non adottare.
- **Stato**: BLOCCATA. Si sblocca solo se cambiano D01 o i dispositivi disponibili.

---

## D04 - TypeScript

- **Decisione**: codice in TypeScript (JavaScript con i "tipi": il computer segnala molti errori prima dell'esecuzione).
- **Alternative**: JavaScript.
- **Motivazione (proposta)**: MapLibre GL JS è scritta in TypeScript; template ufficiale Vite `react-ts`; vale per qualsiasi alternativa (A, B o C).
- **Svantaggi**: concetto in più.
- **Storia**: segnata APPROVATA in Fase 0; **riaperta il 2026-09-28 all'avvio della Fase 2** su indicazione dello Studente A, che ha chiesto di non considerare approvata nessuna tecnologia.
- **Stato**: DA DECIDERE.

---

## D05 - Frontend: framework e strumento di sviluppo (candidati React / nessun framework; Vite)

- **Decisione**: React (libreria per costruire l'interfaccia a "componenti") + Vite (strumento che avvia il progetto in sviluppo e lo prepara per la pubblicazione).
- **Fatti**: Vite 8 richiede Node.js 20.19+ o 22.12+; esiste il template `react-ts`. Node.js 22 e 24 sono versioni LTS. La guida React di Supabase usa Vite con le variabili `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`. MapLibre documenta la configurazione del worker con Vite.
- **Alternative**: HTML/JS senza librerie (disordinato con molte schermate); Vue/Svelte (non analizzati).
- **Da verificare**: Node.js installabile sui computer di A e B (versione di macOS di A ancora sconosciuta).
- **Stato**: DA DECIDERE (dipende da D02).

---

## D06 - Libreria della mappa (candidati MapLibre GL JS / Leaflet / OpenLayers)

- **Fatti**: libreria TypeScript, WebGL, browser; nessuna chiave richiesta dalla libreria; `GeolocateControl` per la posizione dell'utente (richiede HTTPS).
- **Alternative**: Leaflet (più semplice, soprattutto tile raster).
- **Da verificare**: prestazioni sui telefoni reali.
- **Stato**: DA DECIDERE (dipende da D02 e da un test pratico).

---

## D07 - Non usare i tile pubblici di openstreetmap.org come fonte principale

- **Fatti** (OSMF Tile Usage Policy): best-effort, nessuna SLA, blocco possibile senza preavviso, User-Agent identificativo, cache minima 7 giorni, vietati download in blocco e funzioni offline.
- **Dati OSM**: licenza ODbL; attribuzione "© OpenStreetMap contributors" obbligatoria.
- **Stato**: APPROVATA.

---

## D08 - Provider dei tile

**Tile**: le "tessere" della mappa. **Stile**: le regole che decidono colori e simboli. **Attribuzione**: la scritta obbligatoria che cita chi fornisce dati e mappa.

| Criterio | OpenFreeMap | VersaTiles | MapTiler (piano Free) | Protomaps (self-hosting) |
| -------- | ----------- | ---------- | --------------------- | ------------------------ |
| Costo | Gratis (donazioni) | Gratis | Gratis entro i limiti | Gratis il software; serve uno spazio web |
| API key | No | No | Sì | No |
| Limiti | Nessuno dichiarato | Nessuno indicato nella pagina consultata (DV) | 5.000 sessioni mappa e 100.000 richieste/mese; oltre, servizio fermo fino al mese dopo | Dipende dall'hosting |
| Licenza/condizioni | Open source; ToS "as-is", servizio interrompibile senza preavviso; vietata la raccolta automatica di dati; **chi integra il servizio deve avere almeno 18 anni** | Software FLOSS (Unlicense); condizioni del server pubblico DV | Solo uso non commerciale/test; età minima 13 anni per l'account | BSD + ODbL |
| Attribuzione | "OpenFreeMap © OpenMapTiles Data from OpenStreetMap" (automatica con MapLibre) | DV | "© MapTiler" + "© OpenStreetMap" + logo MapTiler | © OpenStreetMap |
| Progetto scolastico | Consentito; attenzione al requisito dei 18 anni | DV | Uso non commerciale: da confermare che la scuola rientri (MapTiler non definisce il caso) | Sì |
| Affidabilità | Nessuna garanzia | Nessuna garanzia indicata | Servizio commerciale, ma si ferma al superamento dei limiti | Dipende da noi |
| Compatibilità MapLibre GL JS | Sì (stile `https://tiles.openfreemap.org/styles/liberty`) | Sì (stili pronti) | Sì | Sì (serve il protocollo PMTiles) |
| Adatto a una piccola PWA | Sì | Sì (DV) | Sì, ma chiave e limiti | Più complesso: piano B |

- **Proposta**: test pratico con OpenFreeMap e VersaTiles; MapTiler come riserva.
- **Da verificare**: chi può accettare i termini di OpenFreeMap (età minima 18 anni); condizioni del server pubblico VersaTiles.
- **Stato**: DA DECIDERE (scelta dopo test pratico, come richiesto).

---

## D09 - Backend e autenticazione (candidati Supabase / Firebase / backend proprio)

Fase 2: aggiunto Firebase tra i candidati. FATTO: Cloud Storage for Firebase richiede il piano Blaze (con carta di credito); i Termini contengono la frase "my use of any Firebase service is for purposes related to my trade, business, craft, or profession" (compatibilità con un progetto scolastico DV). Dettagli in `docs/15_TECNOLOGIE.md` §4.1. Sotto: dati su Supabase raccolti in Fase 0.

- **Fatti**:
  - Piano Free: 500 MB database, 1 GB storage file (massimo 50 MB per file), 50.000 utenti attivi/mese, 5 GB traffico, 2 progetti attivi, pausa dopo 1 settimana di inattività, nessun backup.
  - Auth: password salvate come hash bcrypt.
  - Guida ufficiale React + Vite.
  - **RLS (Row Level Security)**: regole nel database che decidono chi può leggere o modificare ogni riga. Una tabella esposta senza RLS è leggibile e scrivibile da chiunque abbia i permessi; con RLS attiva e senza regole non si legge nulla.
  - Chiave "publishable": può stare nel frontend (protetta da RLS). Chiave "secret": solo in backend, mai nel browser o nel repository.
  - Nei Termini di Supabase consultati non è indicata un'età minima.
- **Alternative**: backend scritto da noi (server da gestire).
- **Stato**: DA DECIDERE (docente, Studente B).

---

## D10 - Database (candidati relazionale PostgreSQL / a documenti Firestore)

- **Fatto**: ogni progetto Supabase include PostgreSQL.
- **Stato**: DA DECIDERE (segue D09).

---

## D11 - Coordinate: latitude/longitude oppure PostGIS

### Spiegazione semplice
- **A. Due numeri** (`latitude`, `longitude`): il punto è salvato come due colonne numeriche. Per "fontane entro 500 m" si fa in due passi: (1) il database restituisce i punti dentro un "rettangolo" attorno all'utente (confronto tra numeri, facile da capire); (2) si calcola la distanza esatta con una formula (es. Haversine) e si scartano quelli oltre 500 m.
- **B. PostGIS `geography(Point)`**: il punto è salvato come oggetto geografico. Per "entro 500 m" basta `ST_DWithin(posizione, mio_punto, 500)`: distanza in metri, calcolata sulla Terra, con indice spaziale.

### Fatti
- `ST_DWithin` su `geography` usa metri e sfrutta gli indici (documentazione PostGIS).
- Su Supabase PostGIS va installato nello schema `extensions`; dal client JavaScript i dati geografici arrivano in formato binario (WKB), quindi servono funzioni SQL chiamate con `rpc()` per leggerli comodamente.

### Confronto

| Aspetto | A. latitude + longitude | B. PostGIS |
| ------- | ----------------------- | ---------- |
| Salvare un punto | Due numeri | Serve costruire un punto geografico |
| Leggere i punti dal client | Diretto | Tramite vista o funzione `rpc()` |
| "Entro X metri" | Rettangolo + formula (più righe di codice) | Una funzione (`ST_DWithin`) |
| Precisione | Sufficiente a distanze di pochi km | Esatta |
| Velocità con pochi punti (Valle d'Aosta) | Sufficiente (da verificare con dati reali) | Ottima |
| Concetti nuovi | Pochi | Estensioni, tipi geografici, SRID, funzioni SQL |
| Spiegazione all'esame | Facile | Interessante se capita davvero |

### Proposta
A nell'MVP. Motivi concreti: il numero di punti previsto è piccolo; la mappa usa comunque longitudine e latitudine; niente `rpc()` obbligatorie per ogni lettura. Se in seguito servisse, si può aggiungere una colonna PostGIS calcolata dalle due colonne esistenti senza perdere dati (DV nella fase Database). PostGIS non viene scartato: viene rimandato finché non serve.

- **Stato**: DA DECIDERE (nella fase Database, con esempi reali).

---

## D12 - Hosting HTTPS

| Servizio | Fatti (piano gratuito) | Nota |
| -------- | ---------------------- | ---- |
| GitHub Pages | Con GitHub Free solo per repository **pubblici**; il nostro è privato. Sito max 1 GB, 100 GB/mese | Richiederebbe repository pubblico o GitHub Pro (DV se disponibile gratis per studenti) |
| Cloudflare Pages | 500 build/mese, 20.000 file, file max 25 MiB | Nessun limite di traffico indicato nella pagina limiti (DV) |
| Netlify | 300 crediti/mese; al superamento i siti vanno in pausa fino al mese successivo; HTTPS incluso | — |
| Vercel Hobby | Solo uso personale non commerciale; nessuna funzione di collaborazione in team | Poco adatto a due studenti |

- **Problema aggiuntivo**: provare l'app sul telefono durante lo sviluppo richiede HTTPS (vedi analisi, punto 20).
- **Da verificare**: età minima e condizioni per l'account; come fare test HTTPS dal telefono.
- **Stato**: DA DECIDERE.

---

## D13 - Stato "acqua potabile"

- **Proposta** (Fase 1): opzione A nell'MVP (`potabile` / `non_potabile` / `non_verificato`, predefinito `non_verificato`, etichette prudenti "Indicata come..." e avviso fisso), evoluzione verso l'opzione C in P2 (campo facoltativo "fonte dell'informazione"). Alternative e motivazioni: `docs/01_PROGETTO.md` §5.3 (requisito RQ-01).
- **Stato**: DA DECIDERE (conferma degli studenti).

---

## D14 - Git e rami

- **Scelta**: `main` (stabile), `dev-studente-A`, `dev-studente-B`; non si lavora direttamente su `main`.
- **Fatti** (verificati sul Mac dello Studente A): `main` allineato a `origin/main` (`635f8c4`); `dev-studente-A` (`b4a9dc3`) e `dev-studente-B` solo in locale.
- **Stato**: APPROVATA.

---

## D15 - Ruoli e dispositivi

- **Studente A**: Max. MacBook Air Intel (modello e macOS DV), iPhone (versione iOS DV).
- **Studente B**: Mayo. GitHub `invinco` (già collaboratore del repository). Windows 11 Pro (build 26200, 64 bit), 15,5 GB RAM, 49 GB liberi; Git 2.54.0, Node.js v24.21.0, npm 11.19.0; telefono iPhone 15 Pro Max. Dati riferiti dallo Studente B il 2026-09-30 tramite resoconto scritto (non verificati da questa chat).
- **Conseguenza**: entrambi i telefoni sono iPhone. TEST ANDROID e TEST LINUX: NON DISPONIBILI con i dispositivi attuali.
- **Stato**: DA DECIDERE (ruoli e dispositivi noti; resta da confermare con B chi fa cosa).

---

## D16 - Numerazione della documentazione

`docs/01_PROGETTO` ... `docs/14_PREPARAZIONE_ESAME` come nelle istruzioni originali. **Stato**: APPROVATA.

---

## D17 - Numerazione delle fasi

- **Scelta**: fasi 0-19 delle istruzioni originali (0 Analisi, 1 Requisiti, 2 Tecnologie, 3 Architettura, 4 Git/GitHub, ...). Le attività Git già svolte appartengono alla Fase 4, anticipata.
- **Motivazione**: il 2026-09-28 lo Studente A ha dichiarato completata la Fase 0 e avviato ufficialmente la "FASE 1 - REQUISITI".
- **Stato**: APPROVATA (da comunicare allo Studente B).

---

## D18 - Segreti e chiavi

- Password, token e chiave "secret" mai nel repository; file `.env` escluso da `.gitignore` (presente); `.env.example` senza valori reali.
- La chiave "publishable" di Supabase è pensata per essere visibile nel browser (fatto, Supabase API keys); la teniamo comunque in `.env` per avere tutta la configurazione in un solo posto.
- Se Supabase viene approvato: RLS attiva su ogni tabella (fatto: raccomandazione ufficiale).
- **Stato**: APPROVATA (regola sui segreti). La parte RLS segue D09.

---

## D19 - Domande al docente

Elenco aggiornato in Fase 1: `docs/01_PROGETTO.md` §19 (8 domande: PWA, Supabase, pubblicazione online, repository pubblico, regole della scuola su account/email/foto/privacy, scadenza, amministratore e moderazione delle foto, età minima per creare account sui servizi esterni).

**Stato**: DA DECIDERE, in attesa di risposta.

---

## D20 - Architettura complessiva

- **Proposta**: vedi "Architettura proposta". Niente è stato implementato.
- **Stato**: DA DECIDERE (dipende da D02, D05, D06, D08, D09, D11, D12).

---

## D22 - Storage delle immagini

- **Problema**: dopo l'MVP servono foto pubbliche, ridotte e senza metadati (`01_PROGETTO.md` §8).
- **Alternative**: Supabase Storage (FATTO: Free 1 GB, max 50 MB per file); Firebase Storage (FATTO: solo con piano Blaze, carta di credito); storage proprio (serve un server).
- **Stato**: DA DECIDERE (non serve per l'MVP).

---

## D23 - Ambiente di sviluppo locale

- **Problema**: quali programmi devono installare i due studenti.
- **Fatti**: Node.js ha binari per macOS da 13.5 e Windows da 10; Vite richiede Node 20.19+ o 22.12+; Docker serve solo per eseguire Supabase in locale; Docker Desktop su Mac Intel supporta la versione corrente di macOS e le due precedenti.
- **Verificato il 2026-09-29 (Mac di A)**: macOS 14.8.5, amministratore, Git 2.39.5, Node.js v26.0.0 (fase "Current", non LTS), npm 11.12.1, Docker 29.8.0; **solo 3,9 GB liberi su disco**. Dettagli in `docs/15_TECNOLOGIE.md` §1.3.
- **Da decidere**: quale versione di Node.js usare (LTS o quella già installata) in modo uguale per A e B; se tenere Docker (non necessario con backend online).
- **Da verificare**: computer di B.
- **Stato**: DA DECIDERE.

---

## D21 - Offline

- **Problema**: in montagna la rete può mancare.
- **Fatti**: policy OSM vieta prefetch dei tile; ToS OpenFreeMap vieta raccolta automatica senza permesso; il service worker può comunque salvare i file dell'app.
- **Proposta**: A (nessun offline) nell'MVP; B (cache minima dell'interfaccia) in P1 insieme all'installazione; C (offline con sincronizzazione) non prevista. Analisi: `docs/01_PROGETTO.md` §11.
- **Stato**: DA DECIDERE.

---

## Corrispondenza con le vecchie decisioni DT-xxx

| Vecchia | Nuova |
| ------- | ----- |
| DT-001 React Native + Expo + TS | D03, D04 |
| DT-002 MapLibre con development build | D03, D06 |
| DT-003 OpenFreeMap | D07, D08 |
| DT-004 Supabase | D09 |
| DT-005 PostGIS | D11 |
| DT-006 Numerazione 12 documenti | D16 (sostituita) |
| DT-007 Versioni Expo | D03, D05 |
| DT-008 PWA | D01, D02 |
| DT-009 Hosting | D12 |
| DT-010 React, Vite, versioni | D05 |
| DT-011 Stato potabile | D13 |
| DT-012 Docente | D19 |
| DT-013 Ruoli | D15 |

## Fonti ufficiali consultate (2026-09-28)

Mappe
- MapLibre GL JS: https://maplibre.org/maplibre-gl-js/docs/
- MapLibre GeolocateControl: https://maplibre.org/maplibre-gl-js/docs/API/classes/GeolocateControl/
- MapLibre React Native: https://maplibre.org/maplibre-react-native/docs/setup/getting-started e .../setup/expo
- OSMF Tile Usage Policy: https://operations.osmfoundation.org/policies/tiles/
- OpenStreetMap copyright: https://www.openstreetmap.org/copyright
- OpenFreeMap: https://openfreemap.org/ , https://openfreemap.org/quick_start/ , https://openfreemap.org/tos/
- VersaTiles: https://versatiles.org/ , https://docs.versatiles.org/
- MapTiler: https://www.maptiler.com/cloud/pricing/ , https://www.maptiler.com/terms/
- Stadia Maps: https://stadiamaps.com/pricing/
- Protomaps: https://docs.protomaps.com/

Web e PWA
- MDN Geolocation API: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
- MDN watchPosition: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition
- MDN PWA installabili: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable
- MDN attributo capture: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/capture
- web.dev criteri di installazione: https://web.dev/articles/install-criteria
- WebKit, web app su iOS 16.4: https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/
- WebKit, policy di archiviazione: https://webkit.org/blog/14403/updates-to-storage-policy/
- WebKit, limite 7 giorni: https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/
- WebKit bug beforeinstallprompt: https://bugs.webkit.org/show_bug.cgi?id=255716
- Vite: https://vite.dev/guide/
- vite-plugin-pwa: https://vite-pwa-org.netlify.app/guide/
- Node.js release: https://nodejs.org/en/about/previous-releases

Supabase e PostGIS
- Prezzi: https://supabase.com/pricing
- React quickstart: https://supabase.com/docs/guides/getting-started/quickstarts/reactjs
- RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- API keys: https://supabase.com/docs/guides/api/api-keys
- Limiti upload: https://supabase.com/docs/guides/storage/uploads/file-limits
- Password: https://supabase.com/docs/guides/auth/password-security
- PostGIS su Supabase: https://supabase.com/docs/guides/database/extensions/postgis
- Termini: https://supabase.com/terms
- PostGIS ST_DWithin: https://postgis.net/docs/ST_DWithin.html

Expo, Apple, Capacitor
- Expo versioni: https://docs.expo.dev/versions/latest/
- Expo development build: https://docs.expo.dev/develop/development-builds/introduction/
- EAS Build: https://docs.expo.dev/build/setup/ , https://docs.expo.dev/tutorial/eas/ios-development-build-for-devices/
- Expo prezzi: https://expo.dev/pricing
- Apple requisiti Xcode: https://developer.apple.com/xcode/system-requirements/
- Apple compatibilità Tahoe: https://support.apple.com/en-us/122867
- Apple compatibilità Sequoia: https://support.apple.com/en-us/120282
- Apple membership: https://developer.apple.com/support/compare-memberships/
- Capacitor ambiente: https://capacitorjs.com/docs/getting-started/environment-setup

Hosting
- GitHub Pages limiti: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- Cloudflare Pages limiti: https://developers.cloudflare.com/pages/platform/limits/
- Netlify prezzi: https://www.netlify.com/pricing/
- Vercel Hobby: https://vercel.com/docs/plans/hobby
