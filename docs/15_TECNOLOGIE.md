# 15 - Analisi delle tecnologie (FASE 2)

Stato del documento: FASE 2 - Tecnologie, prima analisi (2026-09-28); aggiunti i dati verificati del computer dello Studente A (2026-09-29). **Nessuna tecnologia è scelta in questo documento.**

## Come leggere questo documento

| Etichetta | Significato |
| --------- | ----------- |
| **FATTO** | Informazione verificata su documentazione ufficiale (fonte in §12) o dichiarata dagli studenti |
| **PROPOSTA** | Soluzione che potrebbe essere adatta; non approvata |
| **DECISIONE** | Scelta già approvata (elencate in `DECISIONI_TECNICHE.md` con stato APPROVATA) |
| **DA VERIFICARE (DV)** | Informazione che non conosciamo con certezza |
| **DA DECIDERE** | Scelta ancora aperta |

Le fonti sono state consultate il 2026-09-28 (alcune durante la Fase 0 nella stessa data). Prezzi, limiti e versioni cambiano: vanno ricontrollati al momento della scelta.

**Requisiti ≠ tecnologie.** I requisiti sono in `docs/01_PROGETTO.md`. Qui si confrontano i modi possibili di realizzarli. Nessun nuovo requisito è stato aggiunto.

---

## 1. Vincoli

### 1.1 Vincoli del progetto (FATTO: dichiarati dagli studenti o in `01_PROGETTO.md`)

| # | Vincolo |
| - | ------- |
| V1 | Due studenti principianti, senza esperienza significativa di app, backend e database |
| V2 | Progetto scolastico, da spiegare all'esame; ogni scelta va documentata |
| V3 | Costo obbligatorio: €0 (vincolo V-01 di `01_PROGETTO.md`) |
| V4 | Sviluppo da due computer diversi, collaborazione con Git/GitHub (D14 APPROVATA) |
| V5 | Uso su computer (Windows, Linux, macOS) e smartphone (iOS, Android) (D01 APPROVATA) |
| V6 | Mappa interattiva, posizione GPS, registrazione/login, database; immagini dopo l'MVP |
| V7 | Scadenza prevista: aprile 2027 (riferita, da confermare) |
| V8 | Rispetto di licenze, condizioni d'uso e privacy (`01_PROGETTO.md` §7) |
| V9 | Repository GitHub attualmente **privato** (FATTO, dichiarato dallo Studente A in Fase 0) |

### 1.2 Dispositivi (FATTO solo ciò che è stato dichiarato)

| Dispositivo | Cosa sappiamo | Cosa manca (DV) |
| ----------- | ------------- | --------------- |
| Computer Studente A | **Verificato dallo Studente A il 2026-09-29** (vedi §1.3): identificatore MacBookAir8,2; Intel Core i5 dual-core 1,6 GHz; 8 GB RAM; macOS 14.8.5 (23J423); disco dati 113 GB con **3,9 GB liberi** (97% pieno); amministratore: sì; Git 2.39.5 (Apple); Node.js v26.0.0; npm 11.12.1; Docker 29.8.0 | Anno (vedi incoerenza in §1.3) |
| Telefono Studente A | iPhone | Modello, versione di iOS, browser principale |
| Computer Studente B | **Riferito dallo Studente B il 2026-09-30**: Windows 11 Pro (build 26200, 64 bit); 15,5 GB RAM; 49 GB liberi su 953 GB; Git 2.54.0; Node.js v24.21.0; npm 11.19.0 | Modello, permessi di amministratore |
| Telefono Studente B | iPhone 15 Pro Max (riferito 2026-09-30) | Versione di iOS, browser principale |
| Linux | Nessun dispositivo noto | Possibile computer della scuola (DV) |

**TEST ANDROID: NON DISPONIBILE** e **TEST LINUX: NON DISPONIBILE** con le informazioni al 2026-09-30 (entrambi i telefoni sono iPhone). Da valutare per la fase Test: emulatore Android o dispositivo prestato; macchina virtuale Linux. Sono limitazioni da documentare, non bloccano il progetto.

### 1.3 Verifica del computer dello Studente A (2026-09-29)

Dati rilevati dallo Studente A sul proprio Mac con comandi di sola lettura e riportati in chat.

| Voce | Valore | Osservazione |
| ---- | ------ | ------------ |
| Identificatore | MacBookAir8,2 | FATTO (Apple): MacBookAir8,2 = "MacBook Air (Retina, 13-inch, **2019**)"; MacBookAir8,1 = 2018. Lo Studente A ha indicato "2018": **anno DA VERIFICARE** in "Informazioni su questo Mac". Per il progetto non cambia nulla: 2018 e 2019 supportano gli stessi macOS (fino a Sonoma 14) |
| Processore | Intel Core i5 dual-core 1,6 GHz | — |
| RAM | 8 GB | Sufficiente per sviluppo web; Docker Desktop richiede minimo 4 GB (FATTO) ma su 8 GB con 2 core è pesante |
| macOS | 14.8.5 Sonoma | Soddisfa il minimo di Node.js (13.5). Ultima versione installabile su questo modello (FATTO: non compatibile con Sequoia/Tahoe) → niente Xcode 26: conferma il blocco di D03 e dell'alternativa ibrida per iOS |
| Spazio libero | **3,9 GB su 113 GB (97%)** | **Problema principale.** Lo Studente A riferisce che un'installazione con Homebrew è già fallita per spazio. Obiettivo proposto dallo Studente A: liberare almeno 10–15 GB prima di installare dipendenze |
| Amministratore | Sì | Può installare software |
| Git | 2.39.5 (Apple) | Presente |
| Node.js | v26.0.0 | FATTO: Node 26 è in fase **"Current"** (uscita 5 maggio 2026), non LTS; la documentazione ufficiale indica di usare versioni LTS (oggi 22 e 24) in produzione. Soddisfa il minimo di Vite (20.19+/22.12+). Versione da usare nel progetto: DA DECIDERE (D23) |
| npm | 11.12.1 | Presente |
| Docker | 29.8.0 | Presente. Non necessario per le alternative con backend online. Supporto di Docker Desktop su Sonoma 14 dipende da quale sia oggi la versione corrente di macOS (DV). Occupa spazio su disco |


---

## 2. Tipo di applicazione (A)

Quattro alternative:

1. **Web tradizionale**: sito responsive che si usa dal browser, senza installazione.
2. **PWA**: lo stesso sito, più manifest e (di solito) service worker, installabile con un'icona.
3. **Nativa / cross-platform**: app compilata per iOS e Android. Opzione realistica analizzata: React Native + Expo. (Flutter e app native separate: non analizzate in dettaglio, stesso problema di Xcode per iOS.)
4. **Ibrida**: una web app "impacchettata" in un'app nativa (es. Capacitor).

| Criterio | 1. Web tradizionale | 2. PWA | 3. React Native + Expo | 4. Ibrida (Capacitor) |
| -------- | ------------------- | ------ | ---------------------- | --------------------- |
| PC (Win/Mac/Linux) | Sì, dal browser | Sì; installabile da Chrome/Edge, Safari 17+ su macOS; Firefox desktop non installa (FATTO, MDN) | No con MapLibre React Native, che supporta solo Android e iOS (FATTO). Expo ha un target web, ma la mappa andrebbe rifatta | Sì, come web app |
| iPhone | Sì, da Safari | Sì; installazione solo manuale da Condividi → "Aggiungi alla schermata Home" (FATTO, WebKit) | Build iOS: con Expo SDK 56/57 serve Xcode ≥ 26.4, che richiede macOS Tahoe, non installabile su nessun MacBook Air Intel (FATTO, Apple/Expo) | Capacitor 8 richiede Xcode ≥ 26.0 → macOS Sequoia 15.6 → solo MacBook Air Intel 2020 (FATTO); modello di A: DV |
| Android | Sì, da Chrome | Sì, Chrome propone l'installazione se i criteri sono rispettati (FATTO, web.dev) | Sì (development build) | Sì (Android Studio) |
| Difficoltà | Bassa-media | Media (in più: manifest, service worker, HTTPS) | Alta (toolchain native, development build) | Alta (web + toolchain native) |
| Store | No | No | Sì per la distribuzione; per i test build di sviluppo | Sì per la distribuzione |
| Mac/Xcode | No | No | Sì per iOS | Sì per iOS |
| Costi | €0 | €0 | €0 Android; per installare build cloud su iPhone serve Apple Developer Program (99 USD/anno, FATTO) | Come 3 |
| Manutenzione | Un progetto | Un progetto | Progetto + aggiornamenti SDK/native | Progetto web + progetti nativi |
| GPS | API del browser, solo HTTPS e con permesso (FATTO, MDN) | Come 1 | Completo, anche in background | Completo con plugin |
| Fotocamera | Tramite selezione file / attributo `capture` (non uniforme tra browser, FATTO, MDN) | Come 1 | Completa | Completa con plugin |
| Mappe | Librerie web (§5) | Come 1 | MapLibre React Native | Librerie web |
| Autenticazione | Servizi web (§3) | Come 1 | Come 1 | Come 1 |
| Evoluzione futura | → PWA con poco lavoro | → ibrida (4) se servisse uno store | Store | Store |
| Spiegazione all'esame | Facile | Facile-media | Media | Media |

**PROPOSTA (non decisione)**: le alternative 1 e 2 sono le uniche realizzabili oggi da entrambi gli studenti a €0 **con le informazioni disponibili**; 2 è l'evoluzione di 1 (si può partire da 1 e aggiungere l'installazione in P1, come previsto in `01_PROGETTO.md`). 3 resta **BLOCCATA** (D03) per l'iPhone dello Studente A; 4 dipende dal modello del Mac (DV) e non è necessaria per i requisiti attuali. → **DA DECIDERE (D02)**.

---

## 3. Frontend (B)

Frontend = la parte dell'app che l'utente vede e usa.

| Criterio | HTML/CSS/JavaScript senza framework | React | Vue / Svelte |
| -------- | ----------------------------------- | ----- | ------------ |
| Cos'è | Il web "di base", nessuna libreria per l'interfaccia | Libreria per costruire l'interfaccia a **componenti** (pezzi riutilizzabili) | Alternative a React |
| Difficoltà iniziale | Bassa | Media: JSX, componenti, stato, hook | Non analizzata in dettaglio |
| Struttura | La decidiamo noi: rischio di codice disordinato quando crescono schermate (mappa, dettaglio, login, registrazione, aggiunta, informazioni) | Imposta una struttura a componenti | — |
| Gestione dello stato (es. "l'utente è collegato?", "punto selezionato") | Manuale: bisogna aggiornare a mano ogni parte della pagina | L'interfaccia si aggiorna quando cambia lo stato | — |
| Mappe | MapLibre GL JS e Leaflet si usano direttamente | Le stesse librerie, dentro un componente (serve capire il ciclo di vita del componente) | — |
| GPS | API del browser, identica | Identica | — |
| Responsive | CSS, identico | CSS, identico | — |
| PWA | Possibile | Possibile | — |
| Documentazione per il nostro caso | Ampia in generale | FATTO: la guida ufficiale React di Supabase usa React + Vite; MapLibre documenta l'uso con Vite | — |
| Spiegazione all'esame | Più semplice da spiegare riga per riga | Concetti in più, ma struttura più chiara da mostrare | — |

Note:
- **Vite** (FATTO: v8, richiede Node.js 20.19+ o 22.12+) è uno strumento che avvia il progetto in sviluppo e lo prepara per la pubblicazione. Si può usare **sia** con React **sia** senza framework (template "vanilla"). La scelta dello strumento è quindi separata da quella del framework.
- **TypeScript o JavaScript**: TypeScript segnala molti errori prima dell'esecuzione ma è un concetto in più. Nella Fase 0 D04 era stata segnata APPROVATA; **su indicazione dello Studente A (avvio Fase 2) torna DA DECIDERE**.
- Vue e Svelte non sono stati analizzati: nessun motivo specifico emerso per preferirli; restano alternative citate.

**DA DECIDERE (D04, D05)**. Nessuna proposta vincolante: la scelta dipende da quanto gli studenti vogliono investire nell'apprendimento di React rispetto al rischio di disordine senza framework.

---

## 4. Backend, autenticazione, database, immagini (C, D, G)

Backend = la parte che sta sui server: conserva i dati, gestisce gli account, applica le regole di accesso.

### 4.1 Backend e autenticazione

| Criterio | Backend scritto da noi (es. Node.js + database) | Supabase | Firebase |
| -------- | ----------------------------------------------- | -------- | -------- |
| Autenticazione | Da scrivere (hash delle password, sessioni, recupero): **rischiosa per principianti** | Inclusa; password salvate con bcrypt (FATTO) | Inclusa (Firebase Authentication); Spark: 50.000 utenti attivi/mese (FATTO) |
| Database | A scelta | PostgreSQL relazionale (FATTO) | Cloud Firestore, **non relazionale** (documenti); Spark: 1 GiB, 50.000 letture e 20.000 scritture/giorno (FATTO) |
| API | Da scrivere | Generate automaticamente dalle tabelle | Librerie client |
| Autorizzazioni | Da scrivere | Row Level Security: regole SQL nel database (FATTO) | Security Rules (linguaggio proprio; DV dettagli) |
| Sicurezza chiavi | Da gestire | Chiave "publishable" pubblica, "secret" solo lato server (FATTO) | Configurazione pubblica protetta dalle regole (DV dettagli) |
| Piano gratuito | Serve un server sempre acceso: hosting gratuito per server **DV** | Free: 500 MB database, 1 GB file, 50.000 utenti attivi, 2 progetti; **pausa dopo 1 settimana di inattività**; nessun backup (FATTO) | Spark gratuito, ma **Cloud Storage richiede il piano Blaze** (a consumo, con carta di credito) dal 2024 (FATTO) |
| Carta di credito | DV (dipende dall'hosting) | DV (non indicato nella documentazione consultata) | Richiesta per Blaze (FATTO) |
| Dipendenza da servizio | Bassa | Alta (ma basato su PostgreSQL standard) | Alta (tecnologia proprietaria Google) |
| Facilità per principianti | Bassa | Media | Media |
| Documentazione | Generica | Ampia; guida React + Vite ufficiale | Ampia |
| Spiegabilità all'esame | Alta se riuscito, ma molto lavoro | Alta: SQL e regole di accesso visibili | Media: database a documenti e regole proprietarie |
| Condizioni d'uso | — | Età minima: non indicata nei Termini consultati (FATTO) | I Termini includono la frase "my use of any Firebase service is for purposes related to my trade, business, craft, or profession" (FATTO): **compatibilità con un progetto scolastico DV**; età minima DV |

Alternative non analizzate: PocketBase (va ospitato su un server proprio → stesso problema di hosting del backend scritto da noi), Appwrite (DV).

### 4.2 Database: relazionale o no

**Perché il progetto potrebbe beneficiare di un database relazionale** (PROPOSTA): i dati hanno relazioni chiare - un utente crea molti punti; un punto ha molte verifiche, segnalazioni e (dopo l'MVP) foto. In un database relazionale ogni "cosa" è una tabella e le relazioni si esprimono con riferimenti; le regole (campi obbligatori, valori ammessi, area valida) si possono imporre nel database stesso (SEC-009).

Rappresentazione **concettuale** (non ancora tabelle):

```
Utente (gestito dal sistema di autenticazione: email, password come hash)
  └─ crea ─► Punto d'acqua (tipo, nome, posizione, potabilità, stato, date, ...)
                ├─ ha ─► Verifica (esito, data, autore)          [P1]
                ├─ ha ─► Segnalazione (motivo, stato, autore)    [P2]
                └─ ha ─► Foto (file, autore)                     [P1]
```

Con un database a documenti (Firestore) le stesse informazioni si organizzano in "collezioni" di documenti; le relazioni si gestiscono con riferimenti o duplicando dati. Per principianti che devono spiegare le relazioni all'esame, il modello relazionale è più diretto da disegnare (PROPOSTA).

### 4.3 Coordinate: latitude/longitude oppure PostGIS

- **A. Due numeri** (`latitude`, `longitude`): semplici da salvare e leggere. "Entro X metri" si fa in due passi: filtro con un rettangolo + calcolo della distanza con una formula (sul dispositivo, coerente con §6 di `01_PROGETTO.md`).
- **B. PostGIS** (`geography(Point)`): estensione di PostgreSQL; `ST_DWithin` calcola in metri e usa gli indici (FATTO). Su Supabase va installata nello schema `extensions`; dal client i dati geografici arrivano in formato binario, servono funzioni SQL (`rpc()`) per leggerli (FATTO).
- Nota importante: il requisito "punti vicini" (RF-013) prevede il calcolo **sul dispositivo** per non inviare la posizione dell'utente. Con questo requisito PostGIS lato server **non serve** per i punti vicini; servirebbe solo se si decidesse di calcolare lato server (in contrasto con §6 / SEC-015).
- **DA DECIDERE (D11)**, non si decide ora se usare PostGIS.

### 4.4 Immagini (dopo l'MVP)

| Criterio | Storage proprio (server) | Supabase Storage | Firebase Storage |
| -------- | ------------------------ | ---------------- | ---------------- |
| Costo | Serve un server/spazio: gratis DV | Incluso nel Free: 1 GB totale, max 50 MB per file (FATTO) | Solo con piano Blaze (carta di credito) (FATTO) |
| Accesso pubblico | Da configurare | Configurabile per "bucket" (DV dettagli) | Regole proprie |
| Sicurezza / cancellazione | Da scrivere | Regole di accesso (collegate agli utenti) | Regole proprie |
| Compressione e rimozione metadati | Sul dispositivo prima dell'invio, **in tutti i casi** (RF-041, SEC-014) | Idem | Idem |
| Facilità | Bassa | Media | Media |

Altre alternative (es. servizi di gestione immagini) non analizzate: con 1 foto per punto e foto ridotte (proposta ~1 MB, RQ-09) lo spazio di 1 GB corrisponde all'ordine di mille foto (stima, non misurata).

**DA DECIDERE (D22)**.

---

## 5. Mappe (E)

### 5.1 Dati cartografici

- **OpenStreetMap (OSM)**: database geografico libero; licenza **ODbL** con attribuzione obbligatoria "© OpenStreetMap contributors" (FATTO). È richiesto dalle istruzioni del progetto.
- Alternative (dati commerciali di Google/Apple): non compatibili con le istruzioni del progetto; non analizzate.
- **OpenStreetMap ≠ servizio gratuito e illimitato di tile.** I *dati* sono liberi; le *immagini della mappa* (tile) vanno prese da qualcuno che le produce e le serve, alle sue condizioni.

### 5.2 Librerie per visualizzare la mappa

| Criterio | MapLibre GL JS | Leaflet | OpenLayers |
| -------- | -------------- | ------- | ---------- |
| Cos'è | Libreria TypeScript che disegna mappe **vettoriali** con WebGL (FATTO) | Libreria leggera (~42 KB gzip), pensata per tile **raster** (immagini) (FATTO) | Libreria completa, raster e vettoriale; licenza BSD-2 (FATTO) |
| Difficoltà | Media: stili, sorgenti, livelli | **Bassa**: la più semplice da iniziare | Media-alta: API ampia |
| Posizione utente | `GeolocateControl` incluso (FATTO) | Funzione di localizzazione (DV dettagli) | DV |
| Provider compatibili | OpenFreeMap, VersaTiles, MapTiler (vettoriali) | Provider di tile raster (OSM pubblico con policy, MapTiler raster, ...) — OpenFreeMap raster: DV | Entrambi |
| Uso con Vite / npm | Documentato (FATTO) | DV | DV |
| Note | Richiede WebGL | Versione 2.0 in alpha (FATTO: 2.0.0-alpha.1, agosto 2025): scegliere la versione stabile va verificato (DV) | Più di quanto serve al progetto |

### 5.3 Provider di tile (verificati in Fase 0, stessa data)

| Provider | Costo | API key | Limiti | Condizioni rilevanti | Privacy | Compatibilità |
| -------- | ----- | ------- | ------ | -------------------- | ------- | ------------- |
| Tile pubblici OSM (`tile.openstreetmap.org`) | Gratis | No | Best-effort, **bloccabile senza preavviso**; User-Agent, cache ≥ 7 giorni, niente download in blocco/offline (FATTO) | Già escluso come fonte principale (D07 APPROVATA) | Il server vede IP e zona | Raster (Leaflet) |
| OpenFreeMap | Gratis (donazioni) | No | Nessun limite dichiarato; nessuna SLA (FATTO) | ToS "as-is"; vietata raccolta automatica; **chi integra deve avere almeno 18 anni** (FATTO) | Dichiara nessun cookie e nessun database utenti (FATTO) | Vettoriale (MapLibre) |
| VersaTiles | Gratis | No | Nessun limite indicato; condizioni del server pubblico **DV** | Software Unlicense (FATTO) | Dichiara di non tracciare gli utenti (FATTO) | Vettoriale (MapLibre) |
| MapTiler Cloud (Free) | Gratis entro limiti | Sì | 5.000 sessioni mappa, 100.000 richieste/mese; oltre, servizio fermo fino al mese dopo (FATTO) | Solo non commerciale; logo obbligatorio; età minima 13 anni per l'account (FATTO); scuola = "non commerciale"? **DV** | Chiave visibile nel frontend (DV restrizioni per dominio) | Vettoriale e raster |
| Stadia Maps (Free) | Gratis entro limiti | Sì | 200.000 crediti/mese (FATTO) | Solo non commerciale (FATTO) | DV | Vettoriale e raster |
| Protomaps (PMTiles, self-hosting) | Software gratis; serve uno spazio web | No | Dipende dall'hosting | BSD + ODbL (FATTO) | Sotto il nostro controllo | Vettoriale (MapLibre con plugin) |

Privacy (tutti i provider): il servizio riceve l'indirizzo IP e le richieste della zona visualizzata; se la mappa è centrata sull'utente, rivela una posizione approssimativa (già documentato in `01_PROGETTO.md` §6, §7.6).

**DA DECIDERE (D06, D08)** dopo un test pratico, come stabilito in Fase 0.

---

## 6. GPS (F)

| Aspetto | Browser / PWA | App nativa |
| ------- | ------------- | ---------- |
| Mostrare la posizione | Geolocation API; con MapLibre `GeolocateControl` (FATTO) | API native |
| Permesso solo quando serve | Sì: il browser chiede il permesso quando l'app chiama la funzione di posizione (FATTO, MDN) | Sì |
| HTTPS | **Obbligatorio** (FATTO); `localhost` è considerato sicuro in sviluppo | Non applicabile |
| Rifiuto del permesso | Callback di errore; l'app può continuare (FATTO) | Sì |
| Errori e timeout | Opzioni `timeout` e callback di errore (DV dettagli per browser) | Sì |
| Background | Non verificato, **non richiesto** | Possibile |
| iPhone vs Android | Stessa API; comportamento del permesso e precisione dipendono da browser/sistema (DV, prova pratica) | — |
| Test su telefono durante lo sviluppo | Aprire l'app dal telefono con l'indirizzo di rete del computer **non** è HTTPS → GPS non funziona: serve una soluzione (DV) | Build di sviluppo |

Tutti i requisiti GPS di `01_PROGETTO.md` (§6, RF-010, RF-011, RF-038) risultano realizzabili sia nel browser sia in un'app nativa (PROPOSTA, da provare).

---

## 7. Hosting del frontend (H)

| Servizio | Costo | HTTPS | Dominio | Repository privato | Limiti gratuiti | Note |
| -------- | ----- | ----- | ------- | ------------------ | --------------- | ---- |
| GitHub Pages | Gratis | Sì (FATTO) | Sottodominio GitHub; dominio proprio possibile | **Solo repository pubblici con GitHub Free**; privati con GitHub Pro/Team (FATTO). GitHub Education per studenti: idoneità delle scuole superiori **DV** | 1 GB sito, 100 GB/mese (FATTO) | Vietato come hosting per attività commerciali (FATTO) |
| Vercel Hobby | Gratis | DV (standard del servizio) | DV | DV | Vedi documentazione (FATTO: tabella limiti) | **Solo uso personale non commerciale; nessuna funzione di collaborazione in team** (FATTO) |
| Netlify Free | Gratis | Sì, anche con dominio proprio (FATTO) | DV | **DV** | 300 crediti/mese; al superamento **tutti** i siti dell'account vanno in pausa fino al mese successivo (FATTO) | — |
| Cloudflare Pages | Gratis | DV (standard del servizio) | DV | **DV** | 500 build/mese, 20.000 file, file max 25 MiB (FATTO) | — |
| Firebase Hosting (Spark) | Gratis | DV | DV | DV | 10 GB spazio, 360 MB/giorno di traffico (FATTO) | Solo se si sceglie Firebase |
| Hosting "del backend" | — | — | — | — | — | Supabase: hosting di siti statici **DV** (non trovato nella documentazione consultata) |

**DA DECIDERE (D12)**. Dipende anche dalla domanda al docente sul repository pubblico/privato.

---

## 8. Vincoli dei nostri computer (I)

| Strumento | Serve per | Requisiti (FATTO) | Situazione | Esito |
| --------- | --------- | ----------------- | ---------- | ----- |
| Browser moderno | Qualsiasi alternativa web | — | Mac A: sì (macOS 14.8.5). B: DV | OK per A |
| Node.js | Vite, React, qualsiasi progetto web moderno; Expo | Binari macOS da **macOS 13.5**; supporto x64 (Intel) "Tier 2 fino a inizio 2028"; Windows da 10 (FATTO). Vite richiede Node 20.19+ o 22.12+ (FATTO); versioni LTS attuali: 22 e 24 (FATTO) | Mac A: **Node.js v26.0.0 già presente** su macOS 14.8.5 (verificato 2026-09-29); v26 non è LTS. B: **v24.21.0** (riferito 2026-09-30), che è una versione LTS | A: OK (versione da decidere); B: OK |
| Docker (o alternative compatibili) | **Solo** per eseguire Supabase in locale (FATTO); non serve se si usa il servizio online | Docker Desktop su Mac Intel: "versione corrente e due precedenti" di macOS, 4 GB RAM; gratuito per uso personale/educativo (FATTO) | A: Docker 29.8.0 già presente (verificato); supporto su Sonoma 14 DV; pesante con 8 GB e 2 core. B: DV | NON NECESSARIO per le alternative web con backend online |
| Xcode | Solo app iOS native/ibride | Vedi §2 | Mac A: MacBookAir8,2, macOS massimo Sonoma 14 → Xcode massimo 16.2 (FATTO, Apple) | Blocca l'alternativa 3 e la parte iOS dell'alternativa 4 |
| Android Studio | Solo app native/ibride Android | DV | DV | Non necessario per le alternative web |
| Telefoni per i test | Tutte | — | A: iPhone (iOS DV). B: DV. Android: nessuno noto | TEST ANDROID: NON DISPONIBILE |
| Spazio su disco | Tutte (dipendenze, build) | — | **A: 3,9 GB liberi** (verificato). B: DV | **Da risolvere prima di installare dipendenze** |

---

## 9. Costi e condizioni (riepilogo per servizio)

| Servizio | Costo iniziale | Costi futuri possibili | Limite gratuito | Account | Carta di credito | Licenza / condizioni rilevanti | Età / account | Problemi per progetto scolastico |
| -------- | -------------- | ---------------------- | --------------- | ------- | ---------------- | ------------------------------ | ------------- | -------------------------------- |
| Supabase | €0 | Piano Pro se si superano i limiti | §4.1 | Sì | DV | Pausa dopo 1 settimana inattiva | Non indicata nei Termini (FATTO) | Pausa prima dell'esame; nessun backup |
| Firebase | €0 (Spark) | Blaze a consumo | §4.1 | Sì (Google) | Sì per Blaze/Storage (FATTO) | Frase "trade, business, craft, or profession" (FATTO) | DV | Foto impossibili senza carta; condizioni da verificare |
| OpenFreeMap | €0 | — | Nessuno dichiarato | No | No | ToS "as-is" | **18 anni per chi integra** (FATTO) | Chi può integrarlo? (docente) |
| VersaTiles | €0 | — | DV | No | No | Unlicense; condizioni server DV | DV | DV |
| MapTiler | €0 | Piani a pagamento | 5.000 sessioni/mese | Sì | DV | Non commerciale; logo | 13 anni (FATTO) | "Non commerciale" per scuola: DV |
| Stadia Maps | €0 | Piani a pagamento | 200.000 crediti/mese | Sì | DV | Non commerciale | DV | DV |
| GitHub | €0 | Pro per Pages privato | — | Sì | DV | — | DV | Pages solo con repo pubblico |
| Netlify | €0 | Piani a pagamento | 300 crediti/mese | Sì | DV | — | DV | Pausa di tutti i siti al superamento |
| Cloudflare Pages | €0 | — | 500 build/mese | Sì | DV | — | DV | Repo privato DV |
| Vercel | €0 | Pro 20 USD/utente/mese (FATTO) | Hobby | Sì | DV | Solo personale non commerciale; niente team | DV | Due studenti = team? |
| Apple Developer Program | 99 USD/anno | — | — | Sì | Sì | — | DV | Viola il vincolo €0 |
| Expo EAS | €0 | Piani a pagamento | 15 build iOS + 15 Android/mese | Sì | DV | — | DV | Serve comunque Apple Developer per iPhone |
| Node.js, Vite, React, MapLibre GL JS, Leaflet, OpenLayers | €0 | — | — | No | No | Open source (licenze: MapLibre GL JS DV nel testo consultato; OpenLayers BSD-2 FATTO; Leaflet DV) | — | — |

---

## 10. Matrice di confronto

Combinazioni analizzate (nessuna scelta):

- **Soluzione A**: web/PWA + React + Supabase + libreria mappa web
- **Soluzione B**: web/PWA + HTML/CSS/JS senza framework + Supabase + libreria mappa web
- **Soluzione C**: web/PWA + React (o senza framework) + Firebase + libreria mappa web
- **Soluzione D**: React Native + Expo + Supabase + MapLibre React Native

| Criterio | A | B | C | D |
| -------- | - | - | - | - |
| Costo | €0 entro i limiti Free | €0 | €0 senza foto; foto solo con Blaze (carta) | €0 Android; iPhone: 99 USD/anno o impossibile |
| Difficoltà | Media (React + SQL + regole) | Più bassa all'inizio, più alta quando l'app cresce | Media (database a documenti, regole proprie) | Alta |
| PC | Sì | Sì | Sì | No (mappa nativa solo mobile) |
| iPhone | Sì (browser; installazione manuale) | Sì | Sì | Bloccato dal Mac Intel di A |
| Android | Sì | Sì | Sì | Sì |
| GPS | Browser, HTTPS | Browser, HTTPS | Browser, HTTPS | Nativo completo |
| Mappe | MapLibre/Leaflet + provider da scegliere | Idem | Idem | MapLibre Native |
| Autenticazione | Inclusa | Inclusa | Inclusa | Inclusa |
| Database | Relazionale (PostgreSQL) | Relazionale | A documenti | Relazionale |
| Immagini | Inclusa nel Free (1 GB) | Idem | Richiede Blaze | Idem A |
| Sicurezza | RLS in SQL, spiegabile | Idem | Security Rules | Idem A |
| Manutenzione | Un progetto web | Un progetto web, ordine a carico nostro | Un progetto web | Progetto nativo + SDK |
| Scalabilità | Sufficiente per il progetto; oltre i limiti piano a pagamento | Idem | Idem | Idem |
| Privacy | Dati presso Supabase; provider mappa vede IP/zona | Idem | Dati presso Google | Idem A |
| Licenze | Open source + termini dei servizi | Idem | Termini Firebase (clausola "trade, business...", DV) | Open source + Apple/Google |
| Dipendenza esterna | Supabase (su PostgreSQL standard) | Idem | Google/Firebase (proprietario) | Supabase + Expo + Apple |
| Spiegazione all'esame | Buona: componenti, SQL, regole | Buona per il codice, più difficile mostrare una struttura ordinata | Media | Media |
| Compatibilità con i vincoli | Compatibile (DV: computer di B, test HTTPS su telefono) | Compatibile (stesse DV) | Parziale: foto in conflitto con €0 senza carta | **Non compatibile** con D01 e con il Mac di A |

**Pro e contro in sintesi (nessun vincitore dichiarato)**:
- **A**: struttura chiara e ben documentata per la combinazione (guide ufficiali React + Vite di Supabase e MapLibre); ma più concetti da imparare all'inizio.
- **B**: il percorso più "leggero" da iniziare e più facile da spiegare riga per riga; rischio di disordine con login, moduli e più schermate.
- **C**: servizio molto diffuso; ma database non relazionale, foto solo con carta di credito e una clausola dei Termini da chiarire.
- **D**: la sola con app veramente nativa; ma bloccata dai dispositivi e dal requisito desktop.

---

## 11. Problemi emersi

1. **Firebase Storage** richiede il piano Blaze (carta di credito): conflitto con il vincolo €0 se si vogliono foto (FATTO).
2. **Termini Firebase**: la frase sull'uso "per trade, business, craft, or profession" va chiarita per un progetto scolastico (DV).
3. **OpenFreeMap**: età minima 18 anni per chi integra il servizio (FATTO) → domanda al docente già presente (§19, D19).
4. **Repository privato + GitHub Pages**: incompatibili con GitHub Free (FATTO).
5. **Vercel Hobby**: niente collaborazione in team e solo uso personale (FATTO) → poco adatto a due studenti.
6. **Netlify**: al superamento dei crediti si fermano **tutti** i siti dell'account (FATTO).
7. **Supabase Free**: pausa dopo 1 settimana di inattività (FATTO) → rischio prima dell'esame.
8. **Test GPS su telefono**: serve HTTPS anche in sviluppo (FATTO) → soluzione DV.
9. **Nessun telefono Android verificato** per i test (RNF-001, §15 di `01_PROGETTO.md`).
10. **Docker**: con macOS vecchio potrebbe non essere supportato (dipende dalla versione, DV); non necessario se il backend è online.
11. **Leaflet 2.0** in alpha: se si sceglie Leaflet, verificare quale versione usare (DV).
12. **D04 (TypeScript)**: era APPROVATA in Fase 0; ora riaperta DA DECIDERE su indicazione dello Studente A.

## 12. Da verificare (elenco)

- Mac A: anno esatto (identificatore 8,2 = 2019 secondo Apple, riferito 2018); spazio libero dopo la pulizia. (Modello, macOS, RAM, amministratore, Git, Node, npm, Docker: verificati il 2026-09-29.)
- iPhone A: modello e versione di iOS.
- Studente B: modello del computer, permessi di amministratore, versione di iOS. (Sistema, RAM, disco, Git, Node, npm, telefono, account GitHub: riferiti il 2026-09-30.)
- Disponibilità di un telefono Android e di un computer Linux per i test.
- Chi tra studenti/docente/scuola può creare account sui servizi e accettarne i termini (età minime: OpenFreeMap 18, MapTiler 13; altri DV). Non serve registrare l'età di nessuno: basta sapere chi crea gli account.
- Supabase: carta di credito richiesta? comportamento al superamento dei limiti Free.
- Firebase: condizioni d'uso per progetto scolastico; età minima.
- Cloudflare Pages e Netlify: deploy da repository privati sul piano gratuito.
- GitHub Education: accessibile a studenti di scuola superiore?
- VersaTiles: condizioni del server pubblico.
- MapTiler: un progetto scolastico è "non commerciale"?
- Leaflet: versione stabile consigliata; funzione di localizzazione.
- Licenza di MapLibre GL JS (non riportata nella pagina consultata).
- Come fare test HTTPS sul telefono durante lo sviluppo.
- Supabase: esiste hosting di siti statici?

## 13. Decisioni ancora aperte

Vedi `DECISIONI_TECNICHE.md`: D02, D04 (riaperta), D05, D06, D08, D09, D10, D11, D12, D13, D15, D19, D20, D21, D22 (nuova: storage immagini), D23 (nuova: ambiente di sviluppo locale).

## 14. Fonti ufficiali consultate

Fase 2 (2026-09-28):
- Firebase prezzi: https://firebase.google.com/pricing
- Firebase, modifiche a Cloud Storage: https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024
- Firebase termini: https://firebase.google.com/terms
- Leaflet: https://leafletjs.com/
- OpenLayers: https://openlayers.org/
- Docker Desktop su Mac: https://docs.docker.com/desktop/setup/install/mac-install/
- Apple, compatibilità macOS Sonoma: https://support.apple.com/en-us/105113
- Apple, identificare i modelli di MacBook Air: https://support.apple.com/en-us/102869 (2026-09-29)
- Node.js, stato delle versioni: https://nodejs.org/en/about/previous-releases (2026-09-29)
- Node.js piattaforme supportate: https://github.com/nodejs/node/blob/main/BUILDING.md
- Supabase sviluppo locale: https://supabase.com/docs/guides/local-development/cli/getting-started
- Supabase billing: https://supabase.com/docs/guides/platform/billing-on-supabase
- GitHub Education: https://docs.github.com/en/education/about-github-education/github-education-for-students/about-github-education-for-students
- Cloudflare Pages - GitHub: https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/
- Netlify - nuovo sito: https://docs.netlify.com/welcome/add-new-site/

Fase 0 (stessa data, elenco completo in `DECISIONI_TECNICHE.md`): MapLibre GL JS e React Native, Expo (versioni, EAS, prezzi), Apple (Xcode, compatibilità macOS, membership), Capacitor, OSMF Tile Policy, OSM copyright, OpenFreeMap (ToS), VersaTiles, MapTiler (prezzi, termini), Stadia Maps, Protomaps, Supabase (prezzi, RLS, API keys, Storage, PostGIS, password, termini), PostGIS ST_DWithin, MDN (Geolocation, PWA, capture), web.dev, WebKit, Vite, vite-plugin-pwa, Node.js release, GitHub Pages, Cloudflare Pages limiti, Netlify prezzi, Vercel Hobby.
