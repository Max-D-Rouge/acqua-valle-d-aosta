# Resoconto per lo Studente B (Mayo) — aggiornato il 12/10/2026

Scritto dalla chat dello Studente A (Max) dopo un controllo (audit) dei file del repository. Sostituisce il resoconto del 05/10/2026 (la versione del 05/10 risulta modificata e non salvata con un commit; la versione già nel commit è precedente).
**Correzioni del 12/10/2026 (pomeriggio)**: verificato da Max che `origin/dev-studente-A` e `origin/dev-studente-B` puntano entrambi a `bb9b849`; una versione precedente di questo file diceva che `dev-studente-B` non risultava su GitHub, ed era sbagliato. Corretti anche alcuni stati nei documenti (vedi `DIARIO_SVILUPPO.md`, voce 12/10).
**Scopo**: farti avere, senza leggere le chat, lo stato reale del progetto, cosa è deciso, cosa è solo proposto e cosa devi dirci tu.

**Come leggere le etichette**
- **[FILE]** = verificato leggendo i file del repository il 12/10/2026.
- **[NOTA]** = viene da una nota di passaggio o da ciò che ha riferito Max; non l'ho potuto controllare.
- **DA VERIFICARE** = non si sa con certezza.
- Gli stati delle decisioni (APPROVATA, DA DECIDERE, BLOCCATA, PROPOSTA) sono quelli scritti in `DECISIONI_TECNICHE.md`. Non li ho cambiati.

---

## 1. In breve (10 righe)
1. Il progetto è un'app per trovare i punti d'acqua della Valle d'Aosta. La **Fase 2 (Tecnologie) è ancora aperta**: nessuno stack è approvato.
2. **Flutter (D24) è solo una proposta di Max** e tu non l'hai ancora confermata. La PWA (D02) è BLOCCATA come soluzione unica, ma esiste un **prototipo web** funzionante come "piano B".
3. Il prototipo non è l'app definitiva: dati di esempio, account finti, tutto salvato nel browser.
4. I test automatici del prototipo passano (Max il 12/10; li ho rieseguiti anch'io, vedi §13), ma non provano la mappa vera nel browser.
5. L'ordine di sviluppo dell'MVP (D26) è approvato **solo da Max**.
6. Le modifiche di ottobre ai documenti e tutto il prototipo sono **solo sul computer di Max**: non sono in un commit.
7. In `docs/` esistono solo 2 dei 15 documenti previsti.
8. Su GitHub `main` è ancora al primo commit (`635f8c4`), mentre `dev-studente-A` e `dev-studente-B` puntano entrambi a `bb9b849` (verificato il 12/10/2026): sul tuo ramo non c'è lavoro nuovo.
9. Ci sono 3 rischi da guardare: servizi di mappa esterni (anche il satellite del prototipo), password di prova scritte nel repository, e il computer di Max (Mac Intel con 8 GB) per Flutter/iPhone/emulatore.
10. Servono le tue risposte alle domande del §18 per poter decidere insieme.

## 2. Il progetto
- **Nome**: "Acqua Valle d'Aosta" (provvisorio, anche AcquaVDA). Repository: https://github.com/Max-D-Rouge/acqua-valle-d-aosta. Visibilità **da confermare**: Max e un resoconto di revisione lo indicano pubblico (clone senza credenziali), il diario del 28/09 lo dava reso privato e alcuni documenti dicevano "privato"; Claude non ha potuto aprirlo. Cartella locale di Max: `~/Desktop/ProgettoFontane`.
- **Problema**: chi cammina, corre o va in bici in Valle d'Aosta non sa dove trovare acqua; le informazioni sono sparse o vecchie. [FILE: `docs/01_PROGETTO.md` §1]
- **Soluzione**: mappa con fontane, fontanelle e sorgenti, che gli utenti registrati possono aumentare.
- **Scadenza**: aprile 2027 (da confermare con il docente, §19 n. 6 di `01_PROGETTO.md`). **Budget**: 0 € (vincolo V-01).
- **Obiettivo didattico**: noi due, principianti, dobbiamo saperla spiegare tecnicamente.

## 3. Obiettivi, utenti, limiti
- **Visitatore (senza account)**: vede mappa, punti e dettagli, e può usare il GPS.
- **Utente registrato**: aggiunge punti (MVP); dopo l'MVP modifica/elimina i propri, verifica, segnala, carica una foto.
- **Amministratore**: non previsto nell'MVP (RQ-05, DA DECIDERE; da chiedere al docente).
- **Limiti dichiarati**: l'app **non certifica la potabilità dell'acqua** (c'è un avviso fisso nel dettaglio), non è un navigatore, non è un'app di escursionismo generica.

## 4. Requisiti e priorità MVP [FILE: `docs/01_PROGETTO.md`, revisione 4 del 05/10]
Il documento è pronto ma **in attesa della conferma tua e del docente**. Tutti i numeri (tempi, distanze, lunghezze) sono proposte provvisorie (RQ-09).
- **MVP (§4.3)**: RF-001…006 (mappa, punti, dettaglio, avviso potabilità), RF-010/011 (GPS), RF-020/022/023/024 (registrazione, login, logout, sessione), RF-030…033 e RF-038 (aggiunta punto con conferma), RF-036 (nessuno modifica i punti degli altri), RF-071 (pagina Informazioni). RF-021 (conferma email) è DA DECIDERE (RQ-03).
- **P1** (subito dopo): modifica/eliminazione dei propri punti (RF-034/035), distanze e punti vicini (RF-012/013), filtri (RF-060/061), installazione da icona (RF-070), una foto per punto (RF-040…043), verifiche (RF-050/051/007), recupero password (RF-025).
- **P2**: segnalazioni (RF-052/053), profilo (RF-026/027), filtro stato e ricerca per nome (RF-062/063), avviso doppioni (RF-037).
- **P3**: più foto, ricerca località, amministratore, francese.
- **Sicurezza**: SEC-001…015. **Non funzionali**: RNF-001…018. **Criteri di accettazione**: CA-01…CA-17.
- **Ordine di lavoro (D26)**: 1) mappa e GPS → 2) punti dal database → 3) registrazione e login → 4) aggiunta punto. È **la proposta di Max, approvata solo da lui**. Non c'è prova che tu l'abbia accettata.

## 5. Tipi di punto e dati
- **Tipi**: `fontana`, `fontanella`, `sorgente`, `punto_struttura`, `altro` (RQ-08: 5 tipi proposti, non ancora approvati).
- **Obbligatori nell'MVP**: solo **posizione e tipo**. Il resto è facoltativo o ha un valore predefinito.
- **Altri campi**: nome (max 80 caratteri), descrizione (max 500), potabilità, stato di funzionamento, bottiglia, accesso, carrozzina, stagionalità, foto, autore e date automatici.
- **Area valida**: un rettangolo attorno alla Valle d'Aosta; le coordinate esatte sono da fissare in Fase 6 (RQ-07).

## 6. Privacy, GPS, account, potabilità
- **GPS**: serve solo per mostrare dove sei e le distanze. L'app **non lo salva e non lo invia al proprio backend**. L'unica eccezione è "Usa la mia posizione" per un nuovo punto: la coordinata diventa pubblica, ma solo dopo una conferma esplicita (RF-038). Il permesso si chiede solo quando tocchi il pulsante. Se lo neghi, la mappa resta usabile.
- **Account**: email e password (la password solo come hash, gestita da un servizio di autenticazione). Non si chiedono altri dati personali. Il **nome visualizzato** è previsto solo **da P2 e solo se confermato** (RQ-06/RQ-11); nel prototipo non c'è. L'autore di un punto non è mostrato pubblicamente nell'MVP.
- **Potabilità**: la proposta (A, RQ-01/D13, ancora DA DECIDERE) ha tre valori — "Indicata come potabile", "Indicata come non potabile", "Potabilità non verificata" — con **partenza da "non verificato"** e avviso fisso: *"Informazione inserita dagli utenti: non garantisce che l'acqua sia sicura. In caso di dubbio non bere."*
- **Questioni legali NON risolte** (§7.7): informativa privacy, consenso, età minima, conservazione dei dati dopo l'esame, chi crea gli account sui servizi esterni. Vanno chieste alla scuola prima di aprire l'app a utenti reali.

## 7. Ruoli e Git
- **Max (A)**: `dev-studente-A`. Proposta D15 (**DA DECIDERE**): interfaccia, mappa, GPS, app iPhone.
- **Mayo (B)**: `dev-studente-B`. Proposta D15: database e login, grafica (logo/icone), test Android con l'emulatore. **Da confermare da te.**
- Insieme: Git/GitHub, documentazione. Le decisioni ufficiali stanno nei file del repository, non nelle chat.
- **Rami (D14, APPROVATA)**: `main` (stabile) · `dev-studente-A` · `dev-studente-B`. Non si lavora direttamente su `main`.
- Regola: nessun commit/push senza richiesta esplicita (da `CLAUDE.md`).

## 8. Fasi (D17, APPROVATA: fasi 0–19)
| Fase | Stato |
|---|---|
| 0 Analisi | Completata |
| 1 Requisiti | Documento pronto; **manca la conferma di Mayo e del docente** |
| 2 Tecnologie | **In corso**: nessuna tecnologia approvata tranne D07, D14, D16, D17, D18, D23 |
| 4 Git/GitHub | In parte anticipata: repository, primo commit, push (`main` è però ancora al primo commit) |
| 3, 5–19 | Non iniziate |
| Prototipo web | Lavoro **fuori dall'ordine delle fasi**, nato come "piano B" della D24 |

## 9. Documenti del repository
| File | A cosa serve | Stato |
|---|---|---|
| `README.md` | Presentazione e stato | Corretto il 12/10: dice che il prototipo esiste solo in locale |
| `docs/01_PROGETTO.md` | Requisiti, MVP, privacy, rischi, domande al docente | Aggiornato 05/10 |
| `docs/15_TECNOLOGIE.md` | Analisi delle tecnologie (§15 = Flutter) | Aggiornato 05/10; §2–10 descrivono l'analisi PWA precedente |
| `DECISIONI_TECNICHE.md` | Decisioni D01–D27 con stato | Vedi §10 |
| `DIARIO_SVILUPPO.md` | Cronologia reale del lavoro | Ultima voce 12/10 (audit e correzioni documentali) |
| `CHANGELOG.md` | Versioni | Corretto il 12/10 (prototipo non rilasciato, Expo mai creato) |
| `CLAUDE.md` | Istruzioni per Claude | Nuovo; percorso personale di Max rimosso il 12/10 |
| `NOTA_PER_CHAT_CODE.md` | Nota temporanea di passaggio (07/10) | Materiale di lavoro |
| `prototipo-web/` | Prototipo (§12) | Nuovo, non nel repository |
| `design/loghi/`, `Claude outputs/`, `presentazioni/` | Proposte di logo, immagini di test, copia iniziale del pitch (non aggiornata) | Materiale di lavoro |
Mancano `docs/02`…`14` (si creano quando inizia la fase relativa), `docs/12_TEST.md` compreso. D16 parla di "14 documenti" ma `15_TECNOLOGIE.md` è un quindicesimo: da sistemare nella numerazione.

## 10. Decisioni (codici D esatti, stati da `DECISIONI_TECNICHE.md`)
**APPROVATE (da Max; non risulta una conferma scritta di Mayo)**: D07 (niente tile pubblici di openstreetmap.org come fonte principale) · D14 (rami Git) · D16 (14 documenti) · D17 (fasi 0–19) · D18 (segreti fuori dal repository) · D23 (Node 24.21.0, npm 11.19.0; da rivedere se passa D24) · D26 (ordine MVP — **solo Max**).
**PROPOSTA**: D27 (gruppi di punti e icone nel prototipo) — da confermare con te.
**BLOCCATE**: D02 (PWA come soluzione unica) · D03 (React Native + Expo).
**DA DECIDERE**: D01 (piattaforme) · D04 · D05 (seguono D24) · D06 (`flutter_map`) · D08 (provider tile) · D09 (backend; candidato Supabase) · D10 · D11 · D12 · D13 · D15 · D19 · D20 · D21 (offline) · D22 · **D24 (Flutter)** · **D25 (emulatore Android)**.
Nota: D27 è stata aggiunta alla tabella riassuntiva il 12/10. In `DECISIONI_TECNICHE.md` c'è anche una sezione che elenca le differenze rispetto alla versione pubblicata (`bb9b849`): D01 era APPROVATA e D02 era "proposta principale", D23 senza versione.

## 11. Tecnologie candidate e rischi da verificare
- **Flutter/Dart + `flutter_map` (D24, D06)**: un solo codice per iPhone, Android e web. Rischi [FILE, fonti del 05/10, da ricontrollare]: l'app iPhone si compila solo su Mac con Xcode; il Mac di Max (Intel, macOS 14.8.5) arriva a Xcode 16.2 e Flutter dichiara che in futuro richiederà Apple Silicon; con account Apple gratuito l'app dura 7 giorni; l'App Store costa 99 $/anno (contro il vincolo 0 €). Anche la web app sarebbe in Flutter: il piano B "web su iPhone" non risolve il rischio di non imparare Dart in tempo. In D24 è proposta una **prova a tempo fino a fine novembre 2026**; se non c'è una mappa con punti funzionante in Flutter, si torna alla PWA. **Non ancora confermata da te.**
- **PWA (React + Vite + MapLibre, D02/D05/D06)**: già analizzata e bloccata come soluzione unica; il prototipo è scritto in JavaScript puro con MapLibre (senza React/Vite).
- **Emulatore Android (D25)**: Google indica 16 GB di RAM e 16 GB di disco; il Mac di Max (8 GB) non basta; il tuo PC (15,5 GB RAM, 49 GB liberi) è al limite. Nessuna prova fatta.
- **Mappa**: i tile di openstreetmap.org non sono un servizio illimitato (D07). Provider candidati (D08): OpenFreeMap, VersaTiles, MapTiler — da scegliere dopo un test pratico, verificando condizioni d'uso e costi.
- **Backend (D09)**: Supabase è il candidato, ma i limiti del piano gratuito, la pausa dei progetti inattivi e le regole RLS sono da verificare. Serve anche la risposta del docente (§19 n. 2).
- **Offline (D21)**: desiderato da Max dopo l'MVP; non si possono scaricare i tile dai server pubblici.

## 12. Prototipo web (`prototipo-web/`) — cosa c'è davvero
Disponibile per Mayo solo dopo commit e push di Max. Avvio: `cd prototipo-web && python3 -m http.server 8000`, poi `http://localhost:8000`. Test: `node test.mjs`. Nessuna installazione: MapLibre è copiato in `vendor/`.

| IMPLEMENTATO (letto nel codice) | SIMULATO | SOLO PREVISTO (non nel prototipo) |
|---|---|---|
| Mappa MapLibre 3D/2D con rilievo; gruppi di punti; icone per tipo con simbolo di potabilità (non solo colore) | **Account**: 2 utenti di prova con password scritte nel codice, nessuna autenticazione reale | Registrazione vera, database, backend |
| Elenco con dettaglio, ricerca, filtri (potabili, bottiglia, funzionanti, tipo, raggio) | **Dati**: 14 punti di esempio con coordinate approssimate e 2 punti "di prova1" | Mappa offline, ricerca per località |
| GPS con timeout di 15 s e messaggio se negato; la posizione non viene salvata | **"Server"**: punti, verifiche e segnalazioni stanno nel browser (`localStorage`) | Conferma email, recupero password, profilo, amministratore |
| Aggiunta punto con conferma di visibilità, controllo doppioni (20 m), controlli su lunghezze e area valida; foto ridimensionata senza metadati | **Regola delle 3 risposte** (RQ-14, proposta) con "modalità prova" che toglie il limite giornaliero | Controlli lato server (SEC-005/009) |
| Verifica Sì/No e segnalazioni; solo l'autore modifica/elimina i propri punti (nell'interfaccia) | | |
| Testi mostrati con escape (`esc()`); avviso di potabilità; pagina Info con attribuzioni; PWA con service worker (cache `acquavda-v8`) | | |
**Limiti importanti**
- I dati di esempio sono segnati "dato di esempio" nel dettaglio e dall'Info ("dati di esempio e non verificati"), **ma 10 punti di esempio su 14 mostrano comunque "Indicata come potabile"** e 4 "Funzionante". Da controllare nel browser che l'avviso sia abbastanza evidente (DA VERIFICARE).
- "Le regole" (solo l'autore modifica, area valida) sono applicate solo dal codice del browser: chiunque può aggirarle. Nell'app vera devono stare sul server.
- Il prototipo carica da internet: stile OpenFreeMap, rilievo AWS Terrain Tiles e **immagini satellitari Esri** (`server.arcgisonline.com`, indicate "uso didattico"). Le condizioni d'uso del satellite Esri e il loro uso in un'app pubblica non sono stati verificati: DA VERIFICARE prima di qualsiasi pubblicazione.
- Il commento in `sw.js` e il README del prototipo citano "D26" per la policy OSM: il codice giusto è **D07** (D26 è l'ordine dell'MVP).
- `prototipo-web/ACCOUNT_PROVA.md` e `data.js` contengono le password di prova. Sono finte, ma se i file entrassero in un repository **pubblico** resterebbero visibili a tutti: da decidere (§16).

## 13. Test eseguiti e cosa NON dimostrano
- **12/10/2026, Max, sul suo Mac** [NOTA]: `node prototipo-web/test.mjs` → "Tutti i test passati"; `git diff --check` senza output; `prototipo-web/` = 1,2 MB (di cui `vendor/` 1,1 MB).
- **12/10/2026, audit**: ho rieseguito `node test.mjs` sul computer dove lavoro (Linux, Node v22.23.2, **non** la versione 24 del progetto) → "Tutti i test passati". Il file `test.mjs` ha 22 controlli (`assert`) su `geo.js` (distanze, filtri, regola delle 3 risposte, validazione, doppioni).
- **07/10, Chromium automatico** [FILE: diario e nota]: gruppi, numeri, zoom al clic e icone OK, **ma con una mappa di base finta**, perché OpenFreeMap non era raggiungibile dall'ambiente di prova.
- **Non dimostrano**: che la mappa vera funzioni in 2D e in 3D su un browser vero; il GPS su un telefono; l'uso su iPhone/Android; l'accessibilità; le prestazioni con molti punti; nessun test per `app.js`. Non ci sono test della sicurezza lato server perché non c'è un server. `docs/12_TEST.md` non esiste ancora.

## 14. Stato Git (dato del 12/10/2026, letto dal repository)
- **Branch corrente**: `dev-studente-A`; **ultimo commit**: `bb9b849` "Fase 2: analisi delle tecnologie e aggiornamento requisiti". Storia: `635f8c4` (Fase 0) → `b4a9dc3` (diario) → `bb9b849`.
- `origin/dev-studente-A` e `origin/dev-studente-B` puntano entrambi a `bb9b849` (verificato il 12/10/2026 su indicazione di Max; la sessione di Claude non ha potuto interrogare GitHub). `origin/main` è a `635f8c4` (copia locale). Il resoconto di revisione dice che Mayo ha clonato il 30/09 ed è su `dev-studente-B` a `bb9b849` senza lavoro proprio (da riconfermare da Mayo).
- Nel clone di Max il ramo locale `dev-studente-B` è ancora a `635f8c4`: è una copia locale indietro, non una differenza su GitHub.
- Nota: una versione precedente di questo resoconto diceva che `dev-studente-B` non risultava su GitHub. Era una conclusione sbagliata, basata su una copia locale non aggiornata.
- **Modificati e non salvati**: `CHANGELOG.md`, `DECISIONI_TECNICHE.md`, `DIARIO_SVILUPPO.md`, `README.md`, `RESOCONTO_PER_STUDENTE_B.md` (questo file), `docs/01_PROGETTO.md`, `docs/15_TECNOLOGIE.md` (7 file, +448/−109 righe prima di questo aggiornamento).
- **Nuovi (non tracciati)**: `.claude/` (5 definizioni di agenti), `CLAUDE.md`, `Claude outputs/` (3 immagini di test, 412 KB), `NOTA_PER_CHAT_CODE.md`, `design/` (1,8 MB di proposte di logo), `presentazioni/` (AcquaVDA_Pitch.pptx), `prototipo-web/`.
- `.gitignore` esclude `.env`, `node_modules`, `.DS_Store` ecc.; il controllo "segreti" sul testo del repository non ha trovato chiavi o token (le uniche password sono quelle di prova di cui sopra).
- Per portarti questi file: dopo il commit e push di Max, dal tuo ramo `git fetch origin` poi `git merge origin/dev-studente-A` (non `git pull`).

## 15. Rischi
- **Mappe**: servizi gratuiti che cambiano condizioni; satellite Esri non verificato; policy OSM sul download massivo.
- **Dati di esempio**: possono sembrare dati reali se non vengono segnati bene.
- **Account**: password di prova nel repository; autenticazione vera da fare.
- **Segreti**: oggi non ce ne sono; quando arriva Supabase, la chiave "secret" non deve mai entrare nel repository (D18).
- **Licenze**: MapLibre, OpenFreeMap, AWS Terrain, Esri — da riportare in modo chiaro nella pagina Info e in `docs`.
- **Compatibilità e costi**: iPhone da Mac Intel; Flutter che lascia i Mac Intel; emulatore Android al limite; Apple Developer 99 $/anno.
- **Tempo**: imparare Dart e Flutter entro aprile 2027.
- **Privacy**: questioni legali non risolte (§6).
- **Gestione del progetto**: documenti non allineati (§9) e tante modifiche non salvate in un solo posto.

## 16. Decisioni che richiedono il tuo parere o quello del professore
- **Tuo (con Max)**: D01, D24 (Flutter, prova a tempo), D25, D26, D27, D15 (ruoli), RQ-01 (potabilità), RQ-14 (regola delle 3 risposte).
- **Da decidere insieme**: cosa fare con `ACCOUNT_PROVA.md`/password di prova prima di salvare il prototipo (opzioni: tenerlo fuori dal repository; non scrivere le password nei documenti, tenerle solo nel codice del prototipo; oppure generarle all'avvio); quali file di lavoro (`design/`, `Claude outputs/`, `NOTA_PER_CHAT_CODE.md`, `.claude/`, pitch .pptx) vanno nel repository ufficiale.
- **Professore** (`docs/01_PROGETTO.md` §19): 1) Flutter, emulatore e limite dei 7 giorni su iPhone · 2) Supabase · 3) pubblicazione con utenti reali · 4) **repository pubblico** (il repository risulta già pubblico: non c'è traccia di una risposta) · 5) regole della scuola su account/email/foto/privacy · 6) scadenza aprile 2027 · 7) amministratore/moderazione · 8) chi crea gli account sui servizi esterni.

## 17. Prossime attività (in ordine di priorità)
**Max**
1. Provare il prototipo con la mappa vera in 2D e 3D su Mac (Cmd+Shift+R) e annotare l'esito nel diario. *Perché*: oggi l'unica prova con la mappa è con una base finta.
2. Decidere insieme a Mayo cosa entra nel repository e poi fare lui commit/push. *Perché*: ora c'è tanto lavoro solo sul suo Mac.
3. Prova pratica Flutter: `flutter doctor` con Xcode 16.2 e app di prova su iPhone (D24, punti 1–2). *Perché*: serve per decidere con dati veri.
**Mayo**
4. Rispondere alle domande del §18 e dire cosa conferma e cosa no.
5. Controllare spazio e RAM reali prima di accettare l'emulatore (D25). **Non installare ancora niente** finché non decidiamo D24.
6. Verificare i concorrenti della slide 4 prima del pitch.
**Insieme**
7. Decidere D01/D24/D25 (con prova a tempo).
8. Sistemare i documenti non allineati (README, CHANGELOG, tabella di `DECISIONI_TECNICHE.md`, numero dei documenti) e scrivere la voce di diario del 12/10.
9. Mandare le domande al docente (§16).
10. Scegliere il provider della mappa con un test e controllare le condizioni d'uso (D08), compreso il satellite Esri.

## 18. Domande per Mayo (risposte brevi bastano)
1. Sei d'accordo con l'ordine dell'MVP di D26 (mappa/GPS → punti da database → login → aggiunta)? Se no, quale ordine?
2. Accetti una **prova a tempo fino a fine novembre** per Flutter con ritorno alla PWA se fallisce? Altra data o altra condizione?
3. Sei d'accordo con le piattaforme di D01 (app iPhone/Android + web app per PC)?
4. Quanto spazio libero e quanta RAM hai davvero oggi sul PC, e sei d'accordo a provare l'emulatore (D25) solo dopo la decisione su D24?
5. Ti va bene la divisione proposta in D15 (Max: interfaccia/mappa/GPS/iPhone; Mayo: database/login/grafica/test Android)? Cosa cambieresti?
6. Sei d'accordo che la potabilità parta da "non verificato" con i tre valori della proposta A (RQ-01)?
7. Confermi D27 (gruppi di punti e icone per tipo)? E le 3 risposte di RQ-14 devono arrivare da 3 utenti diversi?
8. Cosa facciamo con le password di prova (§16)?
9. Quali file di `design/`, `Claude outputs/` e `presentazioni/` vanno nel repository ufficiale?
10. Hai sul tuo PC `dev-studente-B` e i file aggiornati? Quando fai il primo `git fetch`/`merge`?

## 19. Dal resoconto del 05/10 (contenuto ancora utile)
- **Pitch** (Google Slides "AcquaVDA_Pitch", 7 slide, 8 minuti, da consegnare su Classroom il giorno prima): 1 titolo e team (Max); 2 il problema (Mayo); 3 la soluzione (Max); 4 cosa esiste già: Fontanelle, Refill, Nasoni Roma (Mayo); 5 competenze (Max); 6 sfide tecniche (Mayo); 7 tempi, rischi (Max le fasi, Mayo MVP e rischi). Divisione proposta, da confermare; **tutti e due devono conoscere tutto**. La copia in `presentazioni/` non è aggiornata. [NOTA: non ho letto le slide.]
- **Piano proposto dei tempi** (slide 7, proposta): ott analisi; nov studio Dart/Flutter e progetto base; dic–gen mappa, GPS, punti dal database; feb registrazione, login, aggiunta punto (MVP); mar mappa offline, verifiche Sì/No, test Android; apr rifinitura ed esposizione.
- **Regole per la chat di Mayo**: le decisioni ufficiali sono nei file del repository; se qualcosa contraddice `DECISIONI_TECNICHE.md`, segnalarlo; non creare il progetto né installare dipendenze finché D24 non è confermata da entrambi.
- **Ambienti** (da riconfermare): Max = MacBook Air 2019 Intel, macOS 14.8.5, 8 GB RAM, circa 15 GB liberi, Node 24.21.0/npm 11.19.0 con nvm (non Homebrew), Docker Desktop disinstallato. Mayo = Windows 11 Pro, 15,5 GB RAM, circa 49 GB liberi, Node 24.21.0/npm 11.19.0 (metodo di installazione non noto). Dati riferiti: non verificati da me oggi.
- **Fonti interne consultate per questo resoconto**: tutti i file indicati nel §9, il codice di `prototipo-web/` (`app.js` solo in parte), il comando Git di sola lettura, e il resoconto del 05/10. Non erano accessibili: GitHub online, le slide Google, il file .pptx, le immagini e i loghi (non aperti).
