# Decisioni tecniche

Ultima revisione: 2026-10-26 (Expo al posto di Flutter su indicazione dello Studente A: nuova D28, D03 riaperta, D24 superata; nessuna conferma di B né del docente). Revisione precedente: 2026-10-05 (FASE 2, preparazione del pitch: lo Studente A ha indicato **Flutter** al posto della PWA, con **app vera per iPhone e Android** e **web app** nel browser per i PC; Android si prova con l'emulatore di Android Studio, consigliato dal docente. Modificate D01, D02, D03, D04, D05, D06, D12, D15, D20, D21; nuove D24, D25, D26). Revisione precedente: 2026-10-02 (D23 APPROVATA, Node.js 24 LTS con nvm). Revisione ancora precedente: 2026-09-28 (FASE 2 - Tecnologie, avvio: D04 riaperta; D05, D06, D09, D10 resi neutrali rispetto ai candidati; nuove D22, D23). Analisi completa delle alternative: `docs/15_TECNOLOGIE.md`. I requisiti (COSA fa il sistema) sono in `docs/01_PROGETTO.md`; questo file contiene solo le decisioni su COME realizzarlo.

Revisione 2026-10-12: **solo correzioni documentali, nessuna decisione è stata cambiata**. Aggiunti: la riga D27 nella tabella, le precisazioni su chi ha approvato, lo stato dei rami Git e la sezione "Differenze rispetto alla versione pubblicata".

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
- **Chi ha approvato** (stato al 12/10/2026): salvo indicazione diversa, APPROVATA significa approvata dallo Studente A. Nei documenti non risulta una conferma scritta dello Studente B né del docente per nessuna decisione; per D23–D27 in particolare non c'è alcuna conferma esplicita. Una decisione "condivisa" lo diventa solo quando B la conferma per iscritto (e, dove serve, il docente risponde).
- Le versioni con le vecchie schede DT-001...DT-013 sono nella storia Git (commit `635f8c4`, `b4a9dc3`). La prima revisione D01-D19 non era stata salvata in un commit: questa la sostituisce (le differenze sono riassunte in `DIARIO_SVILUPPO.md`).

---

## Tabella riassuntiva

| ID | Decisione | Scelta proposta | Motivazione | Alternative | Stato |
| -- | --------- | --------------- | ----------- | ----------- | ----- |
| D01 | Piattaforme | App per iPhone e Android; web app nel browser per i PC (Windows, Linux, macOS) | Indicazione dello Studente A (2026-10-05) | Tutte e 5 come app installate; PWA per tutto | DA DECIDERE (indicata da A; B chiede conferma comune e risposta del docente) |
| D02 | Tipo di app | PWA come soluzione unica | Superata il 2026-10-05: app vera per i telefoni + web app per i PC, entrambe con Flutter (D24) | Flutter (D24) | BLOCCATA |
| D03 | React Native + Expo + MapLibre React Native | Expo in uso in via provvisoria (D28); MapLibre React Native non usato | Build iOS ancora bloccata sul Mac Intel di A (Xcode 26.4+); si lavora con Expo Go | Flutter (D24, superata) | RIAPERTA (vedi D28) |
| D04 | Linguaggio | Dart (segue D24); TypeScript/JavaScript non servono più | Flutter usa solo Dart | TypeScript, JavaScript | DA DECIDERE (segue D24) |
| D05 | Frontend: framework | Flutter (D24), sia per le app sia per la web app | Un solo codice | React + Vite | DA DECIDERE (segue D24) |
| D06 | Libreria della mappa | Proposta: `flutter_map` (funziona su telefoni e web) | `15_TECNOLOGIE.md` §15 | MapLibre GL JS, Leaflet, OpenLayers | DA DECIDERE |
| D07 | Tile pubblici openstreetmap.org come fonte principale | Non usarli | Best-effort, bloccabili senza preavviso | — | APPROVATA |
| D08 | Provider dei tile | Candidati: OpenFreeMap, VersaTiles, MapTiler | Scelta dopo un test pratico | Protomaps (self-hosting) | DA DECIDERE |
| D09 | Backend e autenticazione | Candidati: Supabase, Firebase, backend scritto da noi | Confronto in `15_TECNOLOGIE.md` §4.1 | PocketBase, Appwrite (non analizzati) | DA DECIDERE |
| D10 | Database | Candidati: relazionale (PostgreSQL), a documenti (Firestore) | Segue D09; `15_TECNOLOGIE.md` §4.2 | SQLite | DA DECIDERE |
| D11 | Coordinate | Proposto: `latitude` + `longitude` numerici nell'MVP; PostGIS aggiungibile dopo | Per la scala del progetto basta; meno concetti; nessuna funzione `rpc()` obbligatoria | PostGIS `geography(Point)` subito | DA DECIDERE |
| D12 | Hosting HTTPS | Candidati: Cloudflare Pages, Netlify (per la web app dei PC) | La web app va pubblicata in HTTPS (serve anche al GPS nel browser); GitHub Pages non disponibile per repository privati con account gratuito | Vercel Hobby, GitHub Pages | DA DECIDERE |
| D13 | Stato "acqua potabile" | 3 valori con predefinito "non verificato" + avviso; campo "fonte" in P2 | Prudenza; analisi in `01_PROGETTO.md` §5.3 | Sì/no; valori basati sul cartello | DA DECIDERE |
| D14 | Git e rami | `main`, `dev-studente-A`, `dev-studente-B` | `main` stabile | — | APPROVATA |
| D15 | Ruoli e dispositivi | A = Max (MacBook Air Intel, iPhone): interfaccia, mappa, GPS, build iPhone; B = Mayo (Windows 11, iPhone 15 Pro Max): database, login, grafica, test Android con emulatore (proposta del pitch) | Dati riferiti da entrambi | — | DA DECIDERE |
| D16 | Numerazione documenti | 14 documenti originali | Richiesta dello Studente A | 12 documenti | APPROVATA |
| D17 | Numerazione fasi | Fasi 0-19 originali (Fase 1 = Requisiti) | Lo Studente A ha avviato ufficialmente la Fase 1 = Requisiti | Vecchio elenco | APPROVATA |
| D18 | Segreti | Mai nel repository; `.env` ignorato da Git | Sicurezza | — | APPROVATA |
| D19 | Domande al docente | Vedi scheda | Da esse dipendono D02, D09, D12 | — | DA DECIDERE |
| D20 | Architettura complessiva | App Flutter (iPhone, Android, web) + Supabase (proposta) | Sintesi di D24, D09, D06, D12, D21 | Architettura PWA (superata) | DA DECIDERE |
| D22 | Storage delle immagini (dopo l'MVP) | Candidati: Supabase Storage, Firebase Storage (richiede piano Blaze con carta), storage proprio | `15_TECNOLOGIE.md` §4.4 | — | DA DECIDERE |
| D23 | Ambiente di sviluppo locale | Node.js 24 LTS (24.21.0, npm 11.19.0) su entrambi i computer; su A gestito con nvm, non con Homebrew; Docker non installato | Stessa versione principale per A e B; 24 è Active LTS | Node 26 (Current); Node con Homebrew; Docker per backend locale | APPROVATA da A (conferma esplicita di B non registrata; già applicata; da rivedere se D24 viene approvata: con Flutter Node non serve per l'app) |
| D21 | Offline | Mappa offline della Valle d'Aosta nelle app per telefono, dopo l'MVP, da una fonte che lo permetta | Richiesta dello Studente A (2026-10-05) | Nessun offline | DA DECIDERE |
| D24 | Tecnologia dell'app | Flutter (linguaggio Dart): un solo codice per app iPhone, app Android e web app per PC | Scelta dello Studente A per il pitch (2026-10-05); `15_TECNOLOGIE.md` §15 | Tauri 2; PWA (D02) | SUPERATA il 2026-10-23 (vedi D28) |
| D25 | Test su Android | Emulatore di Android Studio (consiglio del docente) | Nessun telefono Android disponibile | Telefono prestato | DA DECIDERE (prova pratica) |
| D26 | Ordine dell'MVP | Mappa e GPS → punti letti dal database → registrazione e login → aggiunta punto | Indicazione dello Studente A (2026-10-05) | Registrazione per prima | APPROVATA dallo Studente A soltanto (conferma di B non registrata) |
| D27 | Prototipo: gruppi di punti e icone | Clustering MapLibre (raggio 55 px, fino a zoom 13) e icone disegnate per tipo | Idea da HydrantMap, proposta di A (2026-10-07) | Pin uguali; marker HTML | PROPOSTA di A (da confermare con B) |
| D28 | Tecnologia dell'app | React Native + Expo (TypeScript, Expo Router) | Indicazione di A (2026-10-23); D03, D24 | Flutter (D24), PWA (D02) | APPROVATA da A (26/10/2026); conferma di B non registrata e non richiesta |
| D29 | Distribuzione e dati pubblici | Web app + file Android da GitHub; iPhone usa la web app; email/foto/account pubblici | Indicazione di A (2026-10-26); D28 | Apple Developer a pagamento; email non pubbliche | APPROVATA da A (26/10/2026); da verificare (web, Android, Xcode, privacy) |
---

## Differenze rispetto alla versione pubblicata (commit `bb9b849`) e approvazioni

Stato al 12/10/2026. "Pubblicata" = contenuto del commit `bb9b849` (30/09), presente su `origin/dev-studente-A` e `origin/dev-studente-B`. Le modifiche locali non sono ancora state salvate con un commit. Nessuna riga è cambiata di stato in questa revisione: la tabella documenta soltanto le differenze.

| ID | Versione pubblicata (`bb9b849`) | Versione locale (12/10) | Chi ha approvato / accordo |
| -- | ------------------------------- | ----------------------- | -------------------------- |
| D01 | APPROVATA, 5 piattaforme | DA DECIDERE, app iPhone/Android + web app per PC | La versione pubblicata era approvata da A. Il 05/10 B ha chiesto una conferma comune e la risposta del docente: nessuna conferma di B o del docente |
| D02 | DA DECIDERE, "proposta principale" | BLOCCATA come soluzione unica | Cambiamento deciso da A il 05/10; B non lo ha confermato |
| D04 | Tabella: DA DECIDERE (riaperta il 28/09); il diario del 28/09 la elenca tra le APPROVATE | DA DECIDERE (segue D24) | Incoerenza storica nel diario; lo stato valido è DA DECIDERE |
| D23 | DA DECIDERE, senza versione | APPROVATA (Node 24.21.0, npm 11.19.0, nvm su A) | Approvata da A (verificata sul suo Mac il 30/09); conferma esplicita di B non registrata |
| D24 | Non presente | DA DECIDERE (Flutter) | Proposta di A; B non conferma (05/10); nessuna risposta del docente |
| D25 | Non presente | DA DECIDERE (emulatore Android) | Proposta di A, su consiglio del docente; prova pratica da fare |
| D26 | Non presente | APPROVATA | Solo A; B non ha confermato |
| D27 | Non presente | PROPOSTA | Proposta di A (07/10); da confermare con B |

PWA e Flutter **non sono scelte definitive condivise**: D02 è bloccata come soluzione unica, D24 è solo una proposta di A.

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

- **Decisione**: app vera per **iPhone e Android**; **web app** usata dal browser per i PC (Windows, Linux, macOS).
- **Problema**: definire dove deve funzionare l'app e in che forma.
- **Alternative**: le 5 piattaforme come app installate (approvate il 2026-09-28); solo Windows, Linux, iOS come app (ipotesi intermedia del 2026-10-05, superata lo stesso giorno); PWA per tutto (D02).
- **Scelta**: app per i telefoni + web app per i PC.
- **Motivazione**: indicazione dello Studente A del 2026-10-05. Per Android, che nessuno dei due possiede, il docente ha consigliato l'emulatore di Android Studio (D25).
- **Conseguenze**: per i PC non servono programmi da installare né build separate (niente Visual Studio, niente computer Linux): basta un browser. La web app va pubblicata in HTTPS (D12). L'app iPhone si può compilare solo sul Mac di A (D24).
- **Stato**: DA DECIDERE. Indicata dallo Studente A il 2026-10-05; lo Studente B (05/10) è d'accordo solo se la confermiamo insieme e la chiediamo al docente (§19 n. 1 di `01_PROGETTO.md`).

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
- **Scelta**: proposta PWA fino al 2026-10-05. **Superata**: lo Studente A ha scelto app vere per i telefoni e una web app per i PC, entrambe con Flutter (D24). L'analisi sui limiti del browser (GPS solo in HTTPS, permessi) resta valida per la web app.
- **Svantaggi**: vedi limitazioni SL/DV; niente store; niente GPS in background.
- **Da verificare prima dell'approvazione**:
  1. prova pratica su iPhone dello Studente A e sul telefono dello Studente B (mappa, GPS, fotocamera, installazione);
  2. risposta del docente (D19);
  3. conferma dello Studente B.
- **Stato**: BLOCCATA dal 2026-10-05 come soluzione unica (era DA DECIDERE).

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
- **Stato**: RIAPERTA il 2026-10-23 (vedi D28): Expo è in uso con Expo Go, ma il blocco su iPhone e su MapLibre React Native non è risolto. Stato precedente: BLOCCATA. Si sbloccava solo se cambiavano D01 o i dispositivi disponibili. Nota 2026-10-05: con le nuove piattaforme (telefoni + web) resta bloccata per l'iPhone (Xcode richiesto non installabile sul Mac Intel di A); l'app si fa con Flutter (D24).

---

## D04 - TypeScript

- **Decisione**: codice in TypeScript (JavaScript con i "tipi": il computer segnala molti errori prima dell'esecuzione).
- **Alternative**: JavaScript.
- **Motivazione (proposta)**: MapLibre GL JS è scritta in TypeScript; template ufficiale Vite `react-ts`; vale per qualsiasi alternativa (A, B o C).
- **Svantaggi**: concetto in più.
- **Storia**: segnata APPROVATA in Fase 0; **riaperta il 2026-09-28 all'avvio della Fase 2** su indicazione dello Studente A, che ha chiesto di non considerare approvata nessuna tecnologia.
- **Aggiornamento 2026-10-05**: con Flutter (D24) il linguaggio è **Dart**; la scelta TypeScript/JavaScript non serve più.
- **Stato**: DA DECIDERE (segue D24).

---

## D05 - Frontend: framework e strumento di sviluppo (candidati React / nessun framework; Vite)

- **Decisione**: React (libreria per costruire l'interfaccia a "componenti") + Vite (strumento che avvia il progetto in sviluppo e lo prepara per la pubblicazione).
- **Fatti**: Vite 8 richiede Node.js 20.19+ o 22.12+; esiste il template `react-ts`. Node.js 22 e 24 sono versioni LTS. La guida React di Supabase usa Vite con le variabili `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`. MapLibre documenta la configurazione del worker con Vite.
- **Alternative**: HTML/JS senza librerie (disordinato con molte schermate); Vue/Svelte (non analizzati).
- **Da verificare**: Node.js installabile sui computer di A e B (versione di macOS di A ancora sconosciuta).
- **Aggiornamento 2026-10-05**: React + Vite non servono più; app e web app si costruiscono con Flutter (D24).
- **Stato**: DA DECIDERE (segue D24).

---

## D06 - Libreria della mappa (candidati MapLibre GL JS / Leaflet / OpenLayers)

- **Fatti**: libreria TypeScript, WebGL, browser; nessuna chiave richiesta dalla libreria; `GeolocateControl` per la posizione dell'utente (richiede HTTPS).
- **Alternative**: Leaflet (più semplice, soprattutto tile raster).
- **Da verificare**: prestazioni sui telefoni reali.
- **Aggiornamento 2026-10-05**: per Flutter la proposta è `flutter_map`, che funziona su tutte le piattaforme di Flutter (telefoni e web). La sua documentazione avverte che i tile pubblici di OpenStreetMap "NON sono liberi per tutti" e permette di usare tile di un altro server o salvati sul dispositivo. Da verificare: tile vettoriali e mappa offline.
- **Stato**: DA DECIDERE (dipende da D24 e da un test pratico).

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
| GitHub Pages | Con GitHub Free solo per repository **pubblici**; la visibilità del nostro repository è contraddittoria nei documenti (diario 28/09: privato; Max, 12/10: pubblico): da confermare. Sito max 1 GB, 100 GB/mese | Richiederebbe repository pubblico o GitHub Pro (DV se disponibile gratis per studenti) |
| Cloudflare Pages | 500 build/mese, 20.000 file, file max 25 MiB | Nessun limite di traffico indicato nella pagina limiti (DV) |
| Netlify | 300 crediti/mese; al superamento i siti vanno in pausa fino al mese successivo; HTTPS incluso | — |
| Vercel Hobby | Solo uso personale non commerciale; nessuna funzione di collaborazione in team | Poco adatto a due studenti |

- **Problema aggiuntivo**: provare l'app sul telefono durante lo sviluppo richiede HTTPS (vedi analisi, punto 20).
- **Da verificare**: età minima e condizioni per l'account; come fare test HTTPS dal telefono.
- **Aggiornamento 2026-10-05**: serve per pubblicare la **web app per i PC** (Flutter web). Le app per telefono non usano l'hosting.
- **Stato**: DA DECIDERE.

---

## D13 - Stato "acqua potabile"

- **Proposta** (Fase 1): opzione A nell'MVP (`potabile` / `non_potabile` / `non_verificato`, predefinito `non_verificato`, etichette prudenti "Indicata come..." e avviso fisso), evoluzione verso l'opzione C in P2 (campo facoltativo "fonte dell'informazione"). Alternative e motivazioni: `docs/01_PROGETTO.md` §5.3 (requisito RQ-01).
- **Stato**: DA DECIDERE (conferma degli studenti).

---

## D14 - Git e rami

- **Scelta**: `main` (stabile), `dev-studente-A`, `dev-studente-B`; non si lavora direttamente su `main`.
- **Fatti** (verificati sul Mac dello Studente A): `main` allineato a `origin/main` (`635f8c4`); `dev-studente-A` (`b4a9dc3`) e `dev-studente-B` solo in locale. **Aggiornamento 2026-10-12**: `origin/dev-studente-A` e `origin/dev-studente-B` puntano entrambi a `bb9b849` (verificato il 12/10/2026 su indicazione di Max; la sessione di Claude non ha potuto interrogare GitHub); `origin/main` è a `635f8c4` (copia locale). Il ramo locale `dev-studente-B` di Max è ancora a `635f8c4`: è una copia locale indietro, non una differenza su GitHub.
- **Stato**: APPROVATA.

---

## D15 - Ruoli e dispositivi

- **Studente A**: Max. MacBook Air Intel (modello e macOS DV), iPhone (versione iOS DV).
- **Studente B**: Mayo. GitHub `invinco` (già collaboratore del repository). Windows 11 Pro (build 26200, 64 bit), 15,5 GB RAM, 49 GB liberi; Git 2.54.0, Node.js v24.21.0, npm 11.19.0; telefono iPhone 15 Pro Max. Dati riferiti dallo Studente B il 2026-09-30 tramite resoconto scritto (non verificati da questa chat).
- **Conseguenza**: entrambi i telefoni sono iPhone. TEST ANDROID: con l'emulatore di Android Studio (D25), meglio sul PC di B. TEST LINUX: basta un browser su Linux (web app); dispositivo ancora DV.
- **Divisione proposta nel pitch (2026-10-05)**: A interfaccia, mappa e GPS (e build iPhone, possibile solo su Mac); B database, login e grafica (e test Android con emulatore).
- **Stato**: DA DECIDERE (resta da confermare con B chi fa cosa).

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

**Risposte riferite dallo Studente A il 2026-10-26** (nessuna conferma scritta del docente nel repository): 1 sì (app Expo con Expo Go accettabile); 2 sì (Supabase); 3 serve la pubblicazione online; 4 repository pubblico; 5 riferito da A: foto, account e soprattutto email pubblici per contattare chi carica informazioni false (da verificare con il docente, rischio privacy, vedi D29); 6 sì (scadenza aprile 2027); 7 scelta degli studenti, la gestirebbe A; 8 nessuna età minima. Dettaglio in `docs/01_PROGETTO.md` §19.

**Stato**: PARZIALE: risposte riferite da A, nessuna conferma scritta del docente; sulla 5 (privacy) resta da verificare se le email pubbliche siano accettabili. Da D19 dipendono D02, D09, D12.

---

## D20 - Architettura complessiva

- **Proposta**: fino al 2026-10-05 vedi "Architettura proposta" (PWA, superata). Nuova proposta: un solo progetto **Flutter** che produce app iPhone, app Android e web app per i PC; mappa `flutter_map`; backend **Supabase** (esiste un pacchetto per Flutter, DV); web app pubblicata in HTTPS (D12); mappa offline nelle app dopo l'MVP (D21). Niente è stato implementato.
- **Stato**: DA DECIDERE (dipende da D24, D06, D08, D09, D11, D12, D21).

---

## D22 - Storage delle immagini

- **Problema**: dopo l'MVP servono foto pubbliche, ridotte e senza metadati (`01_PROGETTO.md` §8).
- **Alternative**: Supabase Storage (FATTO: Free 1 GB, max 50 MB per file); Firebase Storage (FATTO: solo con piano Blaze, carta di credito); storage proprio (serve un server).
- **Stato**: DA DECIDERE (non serve per l'MVP).

---

## D23 - Ambiente di sviluppo locale

- **Problema**: quali programmi devono installare i due studenti, con quali versioni, in modo che i due ambienti siano uguali.
- **Fatti**: Node.js ha binari per macOS da 13.5 e Windows da 10; Vite richiede Node 20.19+ o 22.12+; Node 24 è **Active LTS**, Node 22 Maintenance LTS, Node 26 "Current" (nodejs.org, verificato 2026-09-30); Docker serve solo per eseguire Supabase in locale.
- **Alternative considerate**: tenere Node 26 su A (diverso da B, non LTS); installare Node 24 con Homebrew (escluso dallo Studente A); pacchetto ufficiale da nodejs.org (sovrascrive il collegamento di Homebrew in `/usr/local/bin`, una sola versione); **nvm** (version manager, più versioni, nessun Homebrew).
- **Scelta**:
  - **Node.js 24 LTS** su entrambi i computer. Versione attuale: **24.21.0**, npm **11.19.0**.
  - Studente A (Mac Intel x86_64, macOS 14.8.5): Node installato e gestito con **nvm 0.40.3** (script ufficiale, cartella `~/.nvm`, righe di caricamento in `~/.zshrc`); `default -> 24`.
  - **Homebrew non deve essere usato per gestire Node** nel progetto.
  - Docker non installato: non serve finché il backend è online (D09).
- **Motivazione**: stessa versione principale per A e B evita differenze tra gli ambienti; LTS è la versione consigliata per i progetti; nvm permette di cambiare versione in futuro senza Homebrew.
- **Verificato sul Mac di A (2026-09-30, output del Terminale)**: `node -v` = v24.21.0, `npm -v` = 11.19.0, `which node` = `~/.nvm/versions/node/v24.21.0/bin/node`, `nvm current` = v24.21.0, `nvm alias default` = `default -> 24 (-> v24.21.0)` in un Terminale nuovo.
- **Riferito dallo Studente A (non verificato da Claude)**: Node 26 di Homebrew rimosso (2026-10-02).
- **Studente B**: Node v24.21.0, npm 11.19.0 (riferito 2026-09-30); metodo di installazione su Windows non noto.
- **Conseguenze**: ogni nuovo Terminale di A carica nvm; chi aggiunge un computer al progetto deve installare Node 24. Se in futuro D09 richiedesse un backend in locale, la parte su Docker va rivalutata. Da valutare più avanti: un file `.nvmrc` nel repository con la versione concordata (modifica del progetto, non ancora fatta).
- **Nota 2026-10-05**: lo Studente B ha chiesto di sospendere la modifica di Node 26 sul Mac di A. La modifica era già stata fatta il 30/09-02/10 (Node 24 con nvm, Node 26 di Homebrew rimosso): non c'è nulla da sospendere. Con Flutter (D24) Node non serve per l'app; D23 resta com'è e verrà rivista quando D24 sarà decisa.
- **Stato**: APPROVATA da A. B ha riferito le stesse versioni (Node v24.21.0, npm 11.19.0) il 30/09, ma una conferma esplicita della decisione non è registrata (stato al 12/10/2026).

---

## D21 - Offline

- **Problema**: in montagna la rete può mancare.
- **Fatti**: policy OSM vieta prefetch dei tile; ToS OpenFreeMap vieta raccolta automatica senza permesso; il service worker può comunque salvare i file dell'app.
- **Proposta**: A (nessun offline) nell'MVP; B (cache minima dell'interfaccia) in P1 insieme all'installazione; C (offline con sincronizzazione) non prevista. Analisi: `docs/01_PROGETTO.md` §11.
- **Aggiornamento 2026-10-05**: lo Studente A vuole una **mappa offline** (in montagna spesso non c'è campo); è un punto di forza nel pitch. Proposta: dopo l'MVP, nelle **app per telefono**, una mappa della sola Valle d'Aosta salvata sul dispositivo, presa da una fonte che lo permette (es. estratto OSM in un file tipo PMTiles; DV). Vietato scaricarla dai server pubblici OSM (D07). Nella web app per PC l'offline non è previsto.
- **Stato**: DA DECIDERE.

---

## D24 - Tecnologia dell'app: Flutter

- **Decisione**: costruire con **Flutter** un'app vera per iPhone e Android e la web app per i PC.
- **Problema**: il 2026-10-05 lo Studente A ha chiesto un'app vera per i telefoni e una web app per i PC.
- **Spiegazione semplice**: Flutter è un kit di Google per creare app; si scrive il codice una volta nel linguaggio **Dart** e si ottengono l'app iPhone, l'app Android e un sito (web app).
- **Alternative**: Tauri 2 (interfaccia web + Rust: due linguaggi); PWA per tutto (D02, sul telefono non è un'app vera); React Native + Expo (D03, bloccata).
- **Fatti** (fonti in fondo, 2026-10-05):
  - Flutter supporta Android, iOS 15+, web (Chrome, Firefox, Edge: ultime 2 versioni; Safari 15.6+), oltre a Windows, Linux e macOS;
  - l'app iPhone si compila **solo su un Mac con Xcode**; l'app Android con Android Studio (su qualsiasi sistema); la web app con un browser Chrome;
  - **Flutter sta abbandonando i Mac Intel**: "Future Flutter releases will require Apple Silicon"; nessuna data indicata;
  - il Mac di A (Intel, macOS 14.8.5) può installare al massimo **Xcode 16.2** (Xcode 16.3 e successivi richiedono macOS 15);
  - con un account Apple gratuito l'app va solo sui propri dispositivi (max 3) e il profilo scade dopo **7 giorni**: va reinstallata; pubblicarla sull'App Store richiede l'Apple Developer Program (99 USD/anno, contro il vincolo €0).
- **Scelta**: Flutter (scelta dello Studente A per il pitch).
- **Conseguenze**: D04 diventa Dart; cambiano D05 e D06; l'app iPhone dipende dal Mac di A; la web app va pubblicata (D12); piano B per iPhone: usare la web app anche sul telefono.
- **Da verificare prima dell'approvazione**:
  1. installare Flutter sul Mac di A e verificare che `flutter doctor` accetti Xcode 16.2;
  2. installare un'app di prova su un iPhone (DV: Xcode 16.2 con iOS aggiornato);
  3. installare Flutter e Android Studio sul PC di B, creare un'app di prova e avviarla nell'emulatore Android (D25) e nel browser (web);
  4. conferma dello Studente B e del docente (domanda §19 n. 1 di `01_PROGETTO.md`).
- **Rete di sicurezza (punto sollevato dallo Studente B, 05/10)**: il piano B "web app su iPhone" copre solo il problema dell'installazione su iPhone, **non** il rischio di non imparare Dart e Flutter in tempo, perché anche la web app è fatta in Flutter. Proposta: prova a tempo fino a **fine novembre 2026**: se entro quella data non abbiamo in Flutter una mappa con alcuni punti di prova funzionante sul web e su almeno un telefono (o emulatore), si torna alla PWA (D02: React + Vite + MapLibre GL JS), già analizzata e utilizzabile anche sui telefoni dal browser. Da confermare da entrambi.
- **Stato**: SUPERATA il 2026-10-23 su indicazione dello Studente A (vedi D28). Prima era DA DECIDERE: lo Studente B (05/10) non aveva confermato. Testo conservato come storico.

---

## D25 - Test su Android con l'emulatore di Android Studio

- **Decisione**: provare l'app Android con l'emulatore di Android Studio, come consigliato dal docente.
- **Problema**: nessuno dei due ha un telefono Android.
- **Spiegazione semplice**: un emulatore è un programma che simula un telefono Android sul computer.
- **Fatti** (developer.android.com, 2026-10-05): per un'esperienza buona l'emulatore richiede **16 GB di RAM**, **16 GB di disco** e Windows 10+ o macOS 12+ a 64 bit; con meno risorse "potrebbe funzionare, ma non in modo fluido".
- **Conseguenza**: il Mac di A (8 GB RAM, circa 15 GB liberi) è sotto i requisiti; il PC di B (15,5 GB RAM, 49 GB liberi) è vicino ai requisiti. Proposta: emulatore sul PC di B.
- **Limiti**: nell'emulatore la posizione GPS si imposta a mano; non sostituisce del tutto un telefono reale.
- **Da verificare**: installazione e avvio dell'emulatore sul PC di B.
- **Stato**: DA DECIDERE (prova pratica).

---

## D26 - Ordine di sviluppo dell'MVP

- **Decisione**: 1) mappa con la posizione GPS; 2) punti d'acqua letti dal database; 3) registrazione e login; 4) aggiunta di un nuovo punto.
- **Problema**: in che ordine costruire l'MVP.
- **Alternative**: "registrazione → login → mappa → ..." (istruzioni del progetto); MVP in due tappe (RQ-04, `01_PROGETTO.md` §4.2), che aveva già questo spirito.
- **Motivazione**: indicazione dello Studente A del 2026-10-05; prima si vede la mappa funzionante, poi si affronta la parte degli account.
- **Conseguenze**: i primi punti di prova vengono inseriti dagli sviluppatori; RQ-04 si considera risolta in questo senso.
- **Stato**: APPROVATA dallo Studente A soltanto. Non risulta una conferma di B (stato al 12/10/2026): non è una decisione condivisa.

---

## D27 - Prototipo: gruppi di punti e icone per tipo

- **Decisione**: nella mappa del prototipo i punti vicini si raggruppano (clustering) e ogni punto ha un'icona disegnata in base al tipo.
- **Problema**: con molti punti, da lontano la mappa si riempie di pin uguali; non si capisce dove ci sono più fontane né di che tipo sono.
- **Alternative**: pin uguali per tutti (com'era); marker HTML (si staccano dal terreno in 3D); gruppi con testo dei font della mappa.
- **Scelta**: clustering di MapLibre (raggio 55 px, fino allo zoom 13), cerchi più grandi con più punti, numero disegnato come immagine; icone disegnate con canvas per tipo, potabilità indicata con colore + simbolo.
- **Motivazione**: idea presa da HydrantMap (hydrantmap.org), proposta dello Studente A del 2026-10-07; il numero come immagine evita che i gruppi spariscano se i font non si scaricano (offline).
- **Conseguenze**: più codice in `app.js` (disegni delle icone); nell'app vera (Flutter, D24) servirà l'equivalente (per flutter_map esistono plugin di clustering, da verificare).
- **Stato**: PROPOSTA dallo Studente A, da confermare con lo Studente B.

---

## D28 - Tecnologia dell'app: React Native + Expo

- **Decisione**: costruire l'app per iPhone e Android con **React Native + Expo** (TypeScript, Expo Router), al posto di Flutter (D24).
- **Problema**: il 2026-10-23 lo Studente A ha chiesto di abbandonare Flutter e iniziare subito a sviluppare con Expo.
- **Spiegazione semplice**: React Native è un kit per fare app per telefono con JavaScript/TypeScript; Expo è uno strumento che semplifica sviluppo e prova: con l'app Expo Go si vede l'app sul telefono senza compilarla.
- **Alternative**: Flutter (D24, superata); PWA (D02, bloccata come soluzione unica).
- **Fatti** (documentazione ufficiale, controllata il 2026-10-19/23):
  - Expo SDK 58 richiede React Native 0.88, Node.js 22.13+ e, per le build iOS locali, Xcode 26.4+, che il Mac Intel di A non può installare;
  - Expo Go non richiede Xcode e include `react-native-webview` e `expo-location`;
  - MapLibre React Native non funziona in Expo Go (serve una development build); su iPhone una build nel cloud (EAS) richiede l'Apple Developer Program, 99 USD/anno, contro il vincolo €0;
  - i tile pubblici di OpenStreetMap vietano il download offline e non danno garanzie di servizio.
- **Cosa è stato fatto**: `app-mobile/` creato con `create-expo-app` (SDK 58); mappa MapLibre GL JS in una WebView con stile OpenFreeMap (come nel prototipo web); GPS con `expo-location` solo su richiesta dell'utente; punti letti da Supabase (tabella `punti`, `database/01_punti.sql`, lettura pubblica e nessuna scrittura). Commit `dde27f3` e `4c44a91` su `dev-studente-A`.
- **Scelta**: Expo, per iniziare (scelta dello Studente A).
- **Conseguenze**: Dart non serve più; D04 (linguaggio) torna a TypeScript, ancora DA DECIDERE; D06 (mappa): al momento MapLibre GL JS in una WebView, provvisorio; su iPhone si lavora con Expo Go e non esiste una build installabile senza Apple Developer a pagamento; la web app per i PC non è stata decisa.
- **Non verificato**: Android (Mayo su Windows), mappa offline, limiti e pausa dei progetti Supabase gratuiti, pubblicazione sugli store.
- **Stato**: APPROVATA dallo Studente A il 2026-10-26 ("decido io, non serve la conferma di Mayo"). **Conferma dello Studente B non registrata e non richiesta da A.** Il docente, secondo quanto riferito da A, ha risposto di sì alla domanda 1 del §19 (app Expo con Expo Go accettabile).
  - Aggiornamento 2026-10-26: lo Studente A ha ribadito "useremo Expo e non Flutter". Nessuna conferma scritta di B o del docente è registrata: lo stato resta PROPOSTA finché non viene registrata.

---

## D29 - Distribuzione, pubblicazione e dati pubblici degli utenti

- **Decisione (proposta di A, 2026-10-26)**: pubblicare da GitHub (1) una web app, (2) un file installabile per Android; su iPhone gli utenti usano la web app. All'esame l'app verrebbe mostrata con Xcode. Foto, account e soprattutto email degli utenti sarebbero pubblici, per poter contattare chi carica informazioni false.
- **Problema**: il docente ha confermato (riferito da A) la pubblicazione online e il repository pubblico; senza Apple Developer a pagamento un'app vera per iPhone non è distribuibile (D28, V-01).
- **Fatti** (documentazione ufficiale, 2026-10-26):
  - web app: `npx expo export -p web` crea la cartella `dist`; per GitHub Pages si imposta `experiments.baseUrl` a `/nome-del-repository` in `app.json` e si usa `gh-pages --nojekyll -d dist` (guida "Publishing websites", docs.expo.dev);
  - EAS Build, piano Free: "un numero limitato di build a bassa priorità" al mese; la pagina dei piani non dà i numeri (docs.expo.dev/billing/plans);
  - su iPhone non si installa da GitHub: serve l'Apple Developer Program, 99 USD/anno (D28).
- **Da verificare (DV)**:
  1. **Web**: la mappa di `app-mobile` usa `react-native-webview`, che per quanto so non è pensato per il web: la mappa potrebbe richiedere un'altra soluzione nella versione web. Non è stato provato nessun `expo export -p web`.
  2. **Android**: numeri e condizioni del piano Free di EAS; alternativa da analizzare: build locale con Android Studio sul PC di B.
  3. **Xcode all'esame**: D28 riporta che Expo SDK 58 richiede Xcode 26.4+ per le build iOS locali e che il Mac Intel di A non può installarlo. Mostrare l'app con Xcode quindi potrebbe non essere possibile; alternative già disponibili: Expo Go sull'iPhone (provato il 23-26/10) e la web app.
  4. **Privacy**: email pubbliche di utenti reali (senza età minima, quindi anche minorenni) espongono a spam e molestie e richiedono una base giuridica e un'informativa. Alternative da valutare con il docente: nome utente pubblico + pulsante "contatta/segnala" che inoltra il messaggio senza mostrare l'email; email visibile solo agli amministratori.
- **Aggiornamento 2026-10-26 (14:52), scelta di A sulla privacy**: gli utenti hanno un **nome utente pubblico**; l'email **non** è mai mostrata. Chi vuole segnalare o contattare un utente usa un pulsante "contatta/segnala" e il messaggio viene inoltrato senza rivelare l'email. Conseguenze da progettare (Fasi 6-8 e 14): nome utente separato dall'email nella tabella dei profili; un modo per inoltrare i messaggi (serve un pezzo di backend e probabilmente un servizio di invio email: limiti e costi DV); regole di accesso (RLS) che impediscano di leggere le email degli altri.
- **Intenzione di A sull'esame**: ottenere Xcode con un hackintosh. Non analizzato né deciso: vedi nota sotto.
- **Nota hackintosh (DV)**: la licenza di macOS ammette l'uso solo su computer Apple; non è verificato che una versione di macOS adatta a Xcode 26.4+ funzioni sul tuo hardware. Non è un requisito per l'esame: Expo Go sull'iPhone e la web app sono alternative già disponibili.
- **Nota download (DV)**: un'app iPhone scaricabile da chiunque richiede in ogni caso l'Apple Developer Program (99 USD/anno), con o senza Xcode. Gratis resta: codice su GitHub (chi vuole se la compila), web app per tutti, file installabile per Android.
- **Stato**: APPROVATA da A il 2026-10-26 ("decido io"); conferma di B non registrata e non richiesta da A. A (14:56) considera sufficiente il pulsante "contatta/segnala" per la privacy degli utenti e non chiede altre verifiche al docente. Resta comunque vero che l'app conserva le email degli utenti: con utenti reali servono un'informativa privacy e regole di accesso (RLS) che le proteggano (era la domanda 5 del §19: la scelta sul contatto riduce il rischio privacy ma resta da verificare).

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

## Fonti consultate il 2026-10-05

- Flutter, piattaforme supportate: https://docs.flutter.dev/reference/supported-platforms
- Flutter, installazione (nota sui Mac Intel): https://docs.flutter.dev/install/manual
- Flutter, deprecazione di Intel su macOS: https://github.com/flutter/flutter/issues/188328
- flutter_map: https://docs.fleaflet.dev/
- Apple, requisiti di Xcode: https://developer.apple.com/xcode/system-requirements
- Apple, account gratuito e programma a pagamento: https://developer.apple.com/support/compare-memberships/
- Android Emulator, requisiti: https://developer.android.com/studio/run/emulator
- OSMF Tile Usage Policy: https://operations.osmfoundation.org/policies/tiles/

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
