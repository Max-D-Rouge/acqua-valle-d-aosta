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

---

## 2026-09-28 - FASE 0: chiusura e revisione delle decisioni

- Sviluppatore: Studente A (Max). Studente B: non coinvolto in questa sessione.
- Fase: 0 - Analisi (chiusura).
- Obiettivo: ricontrollare tutte le scelte tecnologiche sulla situazione reale del progetto, senza considerare approvato nulla solo perché era stato proposto.

### Cosa abbiamo analizzato
React Native + Expo + TypeScript; MapLibre React Native con development build; MapLibre GL JS; tile pubblici OpenStreetMap; OpenFreeMap e alternative (MapTiler, Stadia Maps, Protomaps); Supabase; PostgreSQL; PostGIS rispetto a colonne latitude/longitude; PWA; GPS nel browser; Git.

### Cosa è stato verificato (fonti ufficiali)
- MapLibre React Native funziona solo su Android e iOS e non con Expo Go.
- Expo SDK 57 (attuale) richiede Xcode 26.4+; Xcode 26.4.1+ richiede macOS Tahoe 26.2; nessun MacBook Air Intel supporta Tahoe (Apple). Quindi il Mac dello Studente A non può compilare per iOS con l'Expo attuale.
- Per installare una build cloud (EAS) su un iPhone serve l'Apple Developer Program (99 USD/anno); con account gratuito solo build locali da Xcode, valide 7 giorni.
- Policy dei tile OSM: best-effort, nessuna garanzia, User-Agent, cache, niente download in blocco.
- OpenFreeMap: gratuito, senza chiave, senza limiti dichiarati, nessuna SLA.
- MapTiler e Stadia Maps: piani gratuiti solo per uso non commerciale, con chiave.
- Supabase Free: 500 MB database, 1 GB storage, 2 progetti, pausa dopo 1 settimana di inattività, nessun backup; password con bcrypt.
- PostGIS su Supabase: schema `extensions`, `geography(POINT)`, lettura dal client tramite funzioni `rpc()`.
- Geolocation API e PWA: solo HTTPS e permesso dell'utente; installazione PWA supportata da Chrome/Edge, Safari (macOS e iOS 16.4+), non da Firefox desktop.
- Elenco completo delle fonti: fondo di `DECISIONI_TECNICHE.md`.

### Informazioni fornite dallo Studente A in questa sessione
- Il requisito "Windows, Linux, macOS, iOS, Android" è ancora valido.
- Il modello esatto del MacBook Air Intel non è noto al momento.
- La documentazione torna alla numerazione originale a 14 documenti.

### Decisioni
- APPROVATE: D01 piattaforme, D04 TypeScript, D07 niente tile OSM pubblici come fonte principale, D14 rami Git, D16 numerazione a 14 documenti, D18 segreti fuori dal repository.
- BLOCCATA: D03 React Native + Expo + MapLibre React Native.
- DA DECIDERE: D02 PWA, D05 React + Vite, D06 MapLibre GL JS, D08 OpenFreeMap, D09 Supabase, D10 PostgreSQL, D11 PostGIS, D12 hosting, D13 stato potabile, D15 dispositivi dello Studente B, D17 numerazione fasi, D19 risposta del docente.
- Le vecchie decisioni "APPROVATA (delegata)" sono state riportate a DA DECIDERE dove dipendono da informazioni mancanti.

### File
- Creati: nessuno.
- Modificati: `README.md`, `docs/01_PROGETTO.md`, `DECISIONI_TECNICHE.md` (riscritto con nuove schede D01-D19 e tabella di corrispondenza con DT-001...DT-013), `DIARIO_SVILUPPO.md`.

### Problemi
- Le istruzioni iniziali di questa sessione proponevano React Native + Expo, in contrasto con il requisito multipiattaforma e con la vecchia DT-008: segnalato e chiarito con lo Studente A.
- L'elenco delle fasi usato finora non corrisponde a quello delle istruzioni del progetto (D17).
- Un `git status` eseguito da Claude ha lasciato di nuovo il file `.git/index.lock` (stesso problema della Fase 1). Soluzione: permesso di eliminazione concesso da Max, file rimosso; verificato che non ci sono altri lock.

### Test effettuati
Nessuno: non esiste codice.

### Risultato
Fase 0 documentata. Non è ancora conclusa formalmente: servono la conferma dello Studente B e la risposta del docente sulle decisioni principali.

### Commit Git
Nessuno. Le modifiche sono sul ramo `dev-studente-A`, non ancora salvate in un commit.

### Cosa abbiamo imparato
- Una scelta tecnologica dipende anche dall'hardware: un Mac Intel limita la versione di Xcode e quindi la versione di Expo.
- Differenza tra dati OSM (licenza ODbL), tile, provider e libreria di mappa.
- "Gratuito" non vuol dire "senza limiti": pausa di Supabase, uso non commerciale di MapTiler e Stadia, nessuna garanzia di OpenFreeMap.

### Attività successive
1. Studente B: confermare computer, sistema operativo, telefono e versione del sistema; confermare o discutere le decisioni.
2. Studente A: verificare modello del Mac, versione macOS e versione iOS dell'iPhone.
3. Chiedere al docente (D19).
4. Decidere D17 (numerazione fasi).
5. Poi: Fase 1 (Requisiti).

---

## 2026-09-28 - FASE 0: analisi di idoneità della PWA (seconda revisione)

- Sviluppatore: Studente A (Max). Studente B: non coinvolto in questa sessione.
- Fase: 0 - Analisi.
- Obiettivo: verificare se una PWA (React + Vite + TypeScript + MapLibre GL JS + Supabase) è davvero adatta a tutte le funzionalità previste, prima di approvarla.

### Perché abbiamo abbandonato React Native + Expo
- Problema tecnico: l'Expo attuale (SDK 56-57) richiede Xcode 26.4 o successivo, che richiede macOS Tahoe; nessun MacBook Air Intel può installare Tahoe. Lo Studente A non può quindi compilare l'app per il proprio iPhone. L'alternativa (compilazione nel cloud) richiede l'Apple Developer Program a 99 USD/anno.
- Inoltre MapLibre React Native funziona solo su Android e iOS: non copre Windows, Linux e macOS (requisito D01).
- Stato: D03 BLOCCATA.

### Perché abbiamo considerato la PWA
- Un solo codice per tutte le piattaforme; si sviluppa con Node.js e un browser su qualsiasi computer; nessun costo; MapLibre GL JS e Supabase documentano ufficialmente l'uso con Vite (verificato dagli studenti e ricontrollato).

### Cosa abbiamo verificato (documentazione ufficiale)
- 22 funzionalità analizzate una per una: nessuna "non adatta"; limitazioni su GPS (solo HTTPS, app aperta), fotocamera (`capture` non uniforme tra browser), installazione su iPhone (solo manuale, niente prompt automatico), dati della PWA installata separati da Safari, test su telefono in sviluppo (serve HTTPS).
- Criteri di installazione: HTTPS, manifest con nome, icone 192/512, `start_url`, `display`; il service worker non compare più tra i criteri Chrome ma serve per la cache.
- Provider mappe: OpenFreeMap (gratuito, senza chiave, ma ToS richiedono 18 anni a chi lo integra), VersaTiles (gratuito, senza chiave, condizioni da verificare), MapTiler (chiave, limiti, uso non commerciale, logo).
- Supabase: RLS, chiavi publishable/secret, limite 50 MB per file nel piano Free.
- PostGIS `ST_DWithin` (metri, indici) confrontato con latitude/longitude.
- Hosting: GitHub Pages gratuito solo per repository pubblici; Cloudflare Pages e Netlify candidati; Vercel Hobby solo uso personale.
- Capacitor 8 richiede Xcode 26.0 (macOS Sequoia 15.6): non risolve il problema del Mac Intel per iOS.
- Elenco completo delle fonti in fondo a `DECISIONI_TECNICHE.md`.

### Vantaggi e limiti della PWA
- Vantaggi: un solo codice, nessuno store, nessun Xcode, costo zero, facile da spiegare.
- Limiti: installazione manuale su iPhone, niente GPS in background, fotocamera tramite browser, HTTPS obbligatorio anche per i test su telefono, dati cancellabili da Safari dopo 7 giorni senza uso (non per le PWA installate usate regolarmente).

### Decisioni
- Invariate APPROVATE: D01, D04, D07, D14, D16, D18.
- BLOCCATA: D03.
- DA DECIDERE: D02 (PWA), D05, D06, D08 (test pratico tra OpenFreeMap, VersaTiles, MapTiler), D09, D10, D11 (proposta cambiata: latitude/longitude nell'MVP, PostGIS rimandato), D12, D13, D15, D17, D19 (domande al docente ampliate), nuove D20 (architettura) e D21 (offline).
- Rispetto alla prima revisione di oggi (non salvata in un commit): aggiunte l'analisi delle 22 funzionalità, il confronto A/B/C, VersaTiles, l'analisi hosting, D20 e D21; cambiata la proposta di D11.

### File
- Creati: nessuno.
- Modificati: `DECISIONI_TECNICHE.md`, `docs/01_PROGETTO.md`, `README.md`, `DIARIO_SVILUPPO.md`.

### Problemi
- OpenFreeMap richiede che chi integra il servizio abbia almeno 18 anni: da chiarire con il docente.
- Nessun test pratico ancora possibile (non c'è codice e la Fase 0 non lo prevede).

### Test effettuati
Nessuno.

### Risultato
La PWA risulta tecnicamente adeguata sulla carta. Non è approvata: mancano prove pratiche su iPhone e sul telefono dello Studente B, la conferma dello Studente B e la risposta del docente.

### Commit Git
Nessuno. Modifiche sul ramo `dev-studente-A`, non salvate in un commit.

### Cosa abbiamo imparato
- Differenza tra sito responsive, PWA installabile e app nativa.
- L'hardware può escludere una tecnologia (Mac Intel → Xcode → Expo).
- Anche i servizi "gratuiti" hanno condizioni: età minima, uso non commerciale, limiti mensili, pause.
- Una tecnologia più avanzata (PostGIS) non è automaticamente la scelta giusta: dipende dalla dimensione del problema.

### Attività successive
1. Studente B: dispositivi e conferma delle decisioni.
2. Studente A: modello del Mac, versione macOS, versione iOS.
3. Domande al docente (D19).
4. Decidere D17; poi Fase 1 (Requisiti).

---

## 2026-09-28 - FASE 1: Requisiti

- Sviluppatore: Studente A (Max). Studente B: non coinvolto in questa sessione.
- Fase: 1 - Requisiti (avviata ufficialmente dallo Studente A, che ha dichiarato completata la Fase 0).
- Obiettivo: trasformare l'idea in requisiti precisi e verificabili, separati dalle decisioni tecnologiche.

### Attività svolte
- Definiti obiettivo, limiti ("cosa l'app non fa") e 5 tipi di punto d'acqua proposti.
- Definiti i permessi di visitatore, utente autenticato e amministratore (amministratore proposto fuori dall'MVP).
- Valutato criticamente l'MVP: confermate le 9 voci; aggiunti solo elementi necessari (avviso potabilità, attribuzione, pagina Informazioni, permessi lato server); proposto MVP in due tappe (sola lettura, poi scrittura).
- Modello concettuale del punto d'acqua (campi, tipi, obbligatorietà, chi modifica); analisi di 3 alternative per il campo "acqua potabile".
- Requisiti su GPS (posizione mai salvata né inviata), privacy (con obblighi giuridici da verificare), foto (1 per punto, dopo l'MVP), verifiche e segnalazioni, ricerca e filtri, offline (A/B/C), sicurezza (SEC-001...012).
- RF-001...RF-073, RNF-001...RNF-018, criteri di accettazione CA-01...CA-17, tabella MVP/futuro, decisioni aperte RQ-01...RQ-09, 8 domande per il docente.

### File
- Creati: nessuno.
- Modificati: `docs/01_PROGETTO.md` (riscritto con i requisiti), `DECISIONI_TECNICHE.md` (D13, D17 → APPROVATA, D19, D21), `README.md`, `DIARIO_SVILUPPO.md`.

### Decisioni
- D17 (numerazione fasi) APPROVATA: la Fase 1 è "Requisiti".
- Nessuna tecnologia approvata: i requisiti descrivono cosa fa il sistema, non come.

### Problemi
- La proposta distingue verifica e segnalazione diversamente dall'esempio iniziale ("non funziona" diventa una verifica negativa): da confermare (RQ-02).
- Alcuni valori numerici (15 s, 50 m, 1 MB, 20 m, 5 s) sono proposte da confermare con prove reali (RQ-09).
- Obblighi di privacy e regole della scuola non analizzati: domande al docente.

### Test effettuati
Nessuno (non esiste codice).

### Risultato
Documento dei requisiti completo, in attesa di conferma degli studenti e delle risposte del docente.

### Commit Git
Nessuno. Modifiche sul ramo `dev-studente-A`, non salvate in un commit.

### Cosa abbiamo imparato
- Differenza tra requisito funzionale, non funzionale e decisione tecnica.
- Un requisito è utile solo se è verificabile: per questo ogni funzione importante ha un criterio di accettazione.
- Un MVP piccolo riduce il rischio di non avere nulla di funzionante.

### Attività successive
1. Studente B: leggere e confermare i requisiti; indicare i propri dispositivi.
2. Decidere RQ-01...RQ-09.
3. Inviare le domande al docente.
4. Dopo conferma: Fase 2 (Tecnologie).

---

## 2026-09-28 - FASE 1: controllo privacy dei requisiti

- Sviluppatore: Studente A (Max). Studente B: non coinvolto.
- Obiettivo: controllare la sezione privacy di `docs/01_PROGETTO.md` (dati trattati, GPS, foto, contenuti, obblighi giuridici, minimizzazione, coerenza con la sicurezza), senza scegliere tecnologie.

### Attività svolte
- Riscritta §7: per ogni dato ora sono indicati motivo, luogo di conservazione, chi vi accede, obbligatorietà, conservazione (quasi sempre "non definita, da verificare") e cosa succede se l'utente non lo fornisce.
- Account: distinti email, password, nome visualizzato, dati di sessione; dichiarato che non si chiedono altri dati del profilo; la password è descritta come non leggibile da nessuno, sviluppatori e amministratori compresi.
- GPS (§6): aggiunta una spiegazione in linguaggio semplice dei due usi (orientarsi / creare un punto) e del messaggio di conferma; nuovo requisito RF-038 (conferma esplicita prima del salvataggio).
- Foto: resa esplicita la pubblicità delle foto, la rimozione dei metadati sul dispositivo e l'assenza di riconoscimento automatico.
- Contenuti: punti pubblici, regole dell'app (proposta), moderazione rimandata.
- Obblighi giuridici: elenco di 6 questioni aperte (§7.7), dichiarate NON risolte; domanda 5 al docente ampliata.
- Minimizzazione (§7.8): segnalati come discutibili il nome visualizzato e autore/ora esatta delle verifiche (RQ-11, RQ-12); aggiunta RQ-10 (sorte dei punti se l'account viene eliminato).
- Sicurezza: aggiunti SEC-013...SEC-016.

### Contraddizioni trovate e corrette
- RNF-012 e CA-04 dicevano che la posizione non viene mai salvata né inviata, in contrasto con la creazione di un punto tramite GPS: precisato "quando è usata per orientarsi", con l'eccezione confermata (RF-038).
- La riga "Chi può vedere" delle segnalazioni non diceva se l'autore del punto vede chi ha segnalato: precisato di no (coerente con SEC-013).
- La sezione privacy citava il recupero password e la conferma email come se fossero sicuri, ma sono P1 e DA DECIDERE: allineato.
- SEC-006 non elencava quali dati sono non pubblici: aggiunto SEC-013 e ampliato CA-08.
- Riferimento a sezione errato (§4.3 → §17): corretto.
- Nuovo rischio emerso: il servizio che fornisce la mappa riceve le richieste della zona visualizzata, quindi indirettamente una posizione approssimativa; documentato in §6 e §7.6.

### File
- Modificati: `docs/01_PROGETTO.md`, `DIARIO_SVILUPPO.md`. Nessun file creato.

### Test effettuati
Nessuno (nessun codice).

### Commit Git
Nessuno. Ramo `dev-studente-A`.

### Cosa abbiamo imparato
- Un dato può essere personale anche indirettamente: "utente X ha verificato la fontana Y alle 10:32" dice dove si trovava quella persona.
- Minimizzare significa anche togliere dati che sembravano innocui, non solo non chiederne di nuovi.

---

## 2026-09-28 - FASE 1: revisione di coerenza interna dei requisiti

- Sviluppatore: Studente A (Max). Studente B: non coinvolto.
- Obiettivo: correggere in `docs/01_PROGETTO.md` solo incoerenze, ambiguità e formulazioni troppo assolute, senza aggiungere funzionalità e senza scegliere tecnologie.

### Cosa è stato controllato
RF-020 (obblighi legali), RF-021 (conferma email), RF-024 (sessione), GPS e privacy, RF-004 (potabilità), RF-010 (permesso GPS), SEC-016, date pubbliche, RNF-016, valori numerici, MVP-1/MVP-2, criteri di accettazione, coerenza generale (DA DECIDERE presentati come decisi, MVP senza requisito, dati pubblici/privati).

### Correzioni effettuate e perché
- Revisione del documento aggiornata a "revisione 3"; nota iniziale: tutti i valori numerici sono provvisori (RQ-09, elenco completato).
- RF-020: dichiarato che accettazione dei termini, consenso e informativa privacy non sono decisi (§7.7, §19); il requisito non li prevede né li esclude. §7.3: le regole sono "consultabili", l'eventuale accettazione formale è aperta.
- RF-021: riscritto come decisione aperta (RQ-03) senza indicare un comportamento; RQ-03 senza proposta vincolante; CA-05 verifica la conferma email solo dopo RQ-03.
- RF-024 / CA-06 / §7.2: sessione valida fino al logout **o alla scadenza**; a sessione terminata l'app richiede il login senza errori.
- GPS: definito "backend"; "l'app non la salva/invia" invece di affermazioni assolute sul dispositivo; aggiunta nota su funzioni proprie di browser e sistema operativo; la posizione per un nuovo punto diventa pubblica solo **dopo** la conferma (§6, §7.4). §3.1 e §7.8 allineati.
- RF-010 e §6: il permesso viene richiesto quando serve e non è già disponibile; tolto "solo la prima volta".
- RF-004 / CA-02 / RF-060 / §5.1 / §10: la distinzione della potabilità non fissa icone, forme o colori e dipende da RQ-01 (D13); mantenuto il principio "non solo colore" (prova in scala di grigi).
- SEC-016 spostato in §20 come regola organizzativa ORG-01 (non eliminato); RNF-011 ora cita SEC-001...SEC-015; colonna "realizzazione" della sicurezza resa neutra (solo riferimenti a decisioni non approvate, nessun nome di prodotto).
- Date: aggiunta RQ-13 (precisione pubblica delle date di creazione, modifica, verifiche) collegata a privacy dell'autore; RQ-12 ristretta alla conservazione interna dell'autore delle verifiche; §5.1, §7.3, §7.8, CA-15 allineati.
- RNF-016 spostato in §20 come vincolo V-01 (stesso significato: nessun costo obbligatorio).
- Valori numerici marcati come proposti in RF-011, RF-013, RF-037, RF-044, RNF-003/004/005/006/008, SEC-012, §6, §8, §9, §10, CA-02/04/05/11/14/15.
- MVP-1/MVP-2: dichiarata DA DECIDERE (RQ-04); finché aperta non cambia i requisiti. Rischio in §21 allineato. Amministratore: proposta collegata a RQ-05.
- Criteri resi verificabili: CA-04 (osservazione di richieste e dati), CA-09 (lista di controllo), CA-11 (tolleranza proposta), CA-13 (non legato a una tecnologia), CA-15/CA-16 (dipendenza da RQ-02), CA-17 (solo se approvata D21), CA-07 (dopo aver ricaricato la mappa).
- Coerenza generale: logout tolto dal profilo P2 (è MVP); nome visualizzato e autore pubblico dopo l'MVP marcati DA DECIDERE (RQ-06, RQ-11) in §3.2, §7.2, §7.3, RF-026; RF-001, RF-070, §4.1, §11, §15, §17 e §21 non presuppongono più una PWA; RF-050 e RF-052 collegati a RQ-02; intestazione di §18 "proposte non approvate".

### Nuove domande aperte
- RQ-13: precisione pubblica delle date.

### File
- Modificati: `docs/01_PROGETTO.md`, `DIARIO_SVILUPPO.md`. Nessun file creato.

### Test / Commit
Nessun test (nessun codice). Nessun commit. Ramo `dev-studente-A`.

---

## 2026-09-28 - FASE 2: Tecnologie (avvio e prima analisi)

- Sviluppatore: Studente A (Max). Studente B: non coinvolto.
- Fase: 2 - Tecnologie (avviata dallo Studente A dopo la revisione della Fase 1).
- Obiettivo: analizzare le alternative tecnologiche rispetto a requisiti e vincoli, **senza scegliere lo stack**.

### Attività svolte
- Riletti `docs/01_PROGETTO.md`, `DIARIO_SVILUPPO.md`, `DECISIONI_TECNICHE.md`.
- Confrontate: tipo di app (web, PWA, React Native + Expo, ibrida con Capacitor); frontend (HTML/CSS/JS, React; Vue/Svelte citati); backend (proprio, Supabase, Firebase); database (relazionale vs documenti; lat/lon vs PostGIS); mappe (dati OSM; MapLibre GL JS, Leaflet, OpenLayers; 6 provider di tile); GPS (browser vs nativo); immagini (Supabase Storage, Firebase Storage, storage proprio); hosting (GitHub Pages, Vercel, Netlify, Cloudflare Pages, Firebase Hosting); requisiti dei computer (Node.js, Docker, Xcode, Android Studio).
- Nuove verifiche su fonti ufficiali: prezzi e limiti Firebase, modifiche a Cloud Storage for Firebase, Termini Firebase, Leaflet, OpenLayers, Docker Desktop su Mac, piattaforme supportate da Node.js, compatibilità macOS Sonoma, Supabase in locale (Docker), fatturazione Supabase, GitHub Education, Cloudflare Pages e Netlify con GitHub.
- Creato `docs/15_TECNOLOGIE.md` con vincoli, alternative, matrice A/B/C/D, costi e condizioni, problemi, elenco DV, fonti.

### Risultati principali (FATTI)
- Cloud Storage for Firebase richiede il piano Blaze con carta di credito.
- Nei Termini Firebase c'è una frase sull'uso "per trade, business, craft, or profession": compatibilità con un progetto scolastico da verificare.
- Node.js: binari macOS da 13.5; i MacBook Air Intel 2018-2020 supportano Sonoma 14; i modelli precedenti no.
- Supabase in locale richiede Docker o equivalente; non serve se si usa il servizio online.
- Leaflet 2.0 è in versione alpha.

### Decisioni
- Nessuna tecnologia approvata.
- D04 (TypeScript) riaperta: da APPROVATA a DA DECIDERE, su indicazione dello Studente A.
- D05, D06, D09, D10 riformulate come elenco di candidati.
- Nuove D22 (storage immagini) e D23 (ambiente di sviluppo locale), DA DECIDERE.

### File
- Creati: `docs/15_TECNOLOGIE.md`.
- Modificati: `DECISIONI_TECNICHE.md`, `DIARIO_SVILUPPO.md`, `README.md` (stato attuale).

### Problemi / da verificare
Vedi `docs/15_TECNOLOGIE.md` §11 e §12 (dispositivi di A e B, telefono Android, chi può creare gli account, condizioni di Firebase/MapTiler/VersaTiles, deploy da repository privati, test HTTPS sul telefono).

### Test / Commit
Nessun test (nessun codice). Nessun commit. Ramo `dev-studente-A`.

### Cosa abbiamo imparato
- "Gratuito" può richiedere comunque una carta di credito (Firebase Blaze).
- La scelta dello strumento di sviluppo (Vite) è separata da quella del framework (React o nessuno).
- Il requisito "punti vicini calcolati sul dispositivo" riduce l'utilità di PostGIS lato server.

---

## 2026-09-29 - FASE 2: verifica dell'ambiente di sviluppo dello Studente A

- Sviluppatore: Studente A (Max). Studente B: non coinvolto.
- Obiettivo: raccogliere dati reali sul computer prima delle decisioni tecniche.
- Attività: preparata una checklist di comandi di sola lettura (nessuna installazione); lo Studente A li ha eseguiti sul proprio Mac e ha riportato i risultati.

### Risultati (riferiti dallo Studente A)
MacBookAir8,2; Intel Core i5 dual-core 1,6 GHz; 8 GB RAM; macOS 14.8.5 (23J423); disco dati 113 GB con 3,9 GB liberi (97%); amministratore: sì; Git 2.39.5 (Apple); Node.js v26.0.0; npm 11.12.1; Docker 29.8.0.

### Controlli su fonti ufficiali
- Apple: MacBookAir8,2 corrisponde al modello 2019 (lo Studente A aveva indicato 2018): anno da ricontrollare, nessun effetto sulle scelte.
- Node.js: v26 è in fase "Current", non LTS; per la produzione la documentazione indica le versioni LTS (22, 24).

### Problemi
- **Spazio su disco: 3,9 GB liberi.** Lo Studente A riferisce che un'installazione con Homebrew è già fallita per mancanza di spazio (evento non registrato in precedenza nel diario). Obiettivo: liberare almeno 10–15 GB prima di installare dipendenze.
- Docker Desktop è pesante su 8 GB / 2 core e occupa disco; non necessario con backend online.
- Node.js installato non è una versione LTS: versione da concordare con lo Studente B (D23).

### Esiti per il progetto
- Confermato il blocco delle soluzioni che richiedono Xcode recente (macOS massimo: Sonoma 14).
- Per lo sviluppo web non serve installare altro sul Mac di A (Git, Node.js, npm presenti).
- TEST ANDROID: NON DISPONIBILE; TEST LINUX: NON DISPONIBILE (informazioni attuali).

### File
- Modificati: `docs/15_TECNOLOGIE.md` (§1.2, nuova §1.3, §8, §12, fonti), `DECISIONI_TECNICHE.md` (D23), `DIARIO_SVILUPPO.md`.

### Commit
Nessuno. Ramo `dev-studente-A`.

### Ancora da raccogliere
Dati dell'iPhone di A; tutti i dati dello Studente B.

---

## 2026-09-30 - FASE 2: resoconto per lo Studente B e preparazione del commit

- Sviluppatore: Studente A (Max). Studente B: non coinvolto.
- Obiettivo: dare allo Studente B (e alla sua chat Claude) un riepilogo dello stato del progetto; preparare il salvataggio su GitHub del lavoro non ancora in un commit.
- Attività svolte: riletti `DIARIO_SVILUPPO.md`, `DECISIONI_TECNICHE.md`, `README.md`, `git status`; scritto il resoconto.
- File creati: `RESOCONTO_PER_STUDENTE_B.md`.
- File modificati: `DIARIO_SVILUPPO.md`.
- Problema: su GitHub c'è solo `main` al commit `635f8c4`; il lavoro di Fase 0 (revisione), Fase 1 e Fase 2 non è in un commit; i rami `dev-studente-A` e `dev-studente-B` esistono solo in locale.
- Soluzione proposta: commit sul ramo `dev-studente-A`, push dei due rami, invito dello Studente B come collaboratore. Comandi eseguiti da Max sul proprio Mac (Claude non può raggiungere GitHub da qui).
- Test effettuati: nessuno (nessun codice).
- Attività successive: verificare su GitHub che i due rami siano presenti; Studente B segue i passi del resoconto.

---

## 2026-09-30 - FASE 2: ricevuto il resoconto dello Studente B

- Sviluppatore: Studente A (Max). Fonte: `RESOCONTO_PER_STUDENTE_A.md`, scritto dalla chat dello Studente B (Mayo) e incollato da Max. Dati non verificati da questa chat.
- Dati di B: GitHub `invinco`, già collaboratore del repository; Windows 11 Pro (build 26200, 64 bit), 15,5 GB RAM, 49 GB liberi; Git 2.54.0, Node.js v24.21.0, npm 11.19.0; iPhone 15 Pro Max.
- Stato di B: nessun file scritto, nulla installato, repository non ancora clonato; in attesa del push di A per leggere e confermare requisiti e decisioni.
- Correzione: il resoconto di B dice che Node 24 non è LTS e che le LTS sono 22 e 20. Secondo la nostra verifica del 2026-09-29 (`docs/15_TECNOLOGIE.md` §1.3) le LTS sono 22 e 24, quindi la v24 di B è LTS; non è LTS la v26 di A.
- Conseguenza: entrambi i telefoni sono iPhone; TEST ANDROID e TEST LINUX restano NON DISPONIBILI (da valutare emulatore Android e macchina virtuale Linux nella fase Test).
- Problema: un `git status` eseguito da Claude ha lasciato di nuovo `.git/index.lock`. Soluzione: permesso di eliminazione concesso da Max, file rimosso. Regola per il futuro: Claude non esegue più comandi Git sul Mac di A, li esegue Max.
- File modificati: `DECISIONI_TECNICHE.md` (D15), `docs/15_TECNOLOGIE.md` (§1.2, §8, §12), `DIARIO_SVILUPPO.md`.
- Test / commit: nessuno.
