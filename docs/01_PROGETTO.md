# 01 - Progetto e requisiti

Stato del documento: FASE 1 - Requisiti, revisione 3 (2026-09-28): revisione di coerenza interna dopo la revisione privacy. In attesa di conferma degli studenti e delle risposte del docente.

**Valori numerici**: tutti i numeri usati nei requisiti (tempi, distanze, dimensioni, lunghezze dei testi, quantità, soglie) sono **proposte provvisorie**, elencate in RQ-09 e da confermare dopo le prime prove. Un requisito o un criterio di accettazione che usa un numero si intende riferito al valore che verrà approvato in RQ-09.

Legenda: **Fatto** = verificato o dichiarato dagli studenti; **Proposto** = non ancora approvato; **Da verificare (DV)** = informazione mancante.

> **Requisiti e tecnologie sono cose diverse.** Questo documento descrive **COSA** deve fare il sistema. **COME** lo realizzeremo (librerie, servizi, database) è in `DECISIONI_TECNICHE.md`. Dove un requisito ha una possibile realizzazione già proposta, è indicata solo come riferimento (es. "vedi D09"), senza considerarla approvata.

---

## 1. Obiettivo dell'applicazione

"Acqua Valle d'Aosta" (nome provvisorio, anche "AcquaVDA") permette di **trovare, visualizzare e gestire in modo collaborativo i punti d'acqua della Valle d'Aosta**:

- chiunque può vedere su una mappa dove si trovano i punti d'acqua e le loro informazioni;
- gli utenti registrati possono aggiungerli e, dopo l'MVP, correggerli, fotografarli, verificarli e segnalare problemi.

Obiettivo didattico: due studenti principianti devono costruirla e saperla spiegare tecnicamente.

### Problema che risolve

Chi cammina, corre o va in bicicletta in Valle d'Aosta vuole sapere dove trovare acqua. Le informazioni sono sparse, incomplete o non aggiornate. L'app le raccoglie in un solo posto e le fa mantenere aggiornate dagli utenti stessi.

### Cosa l'app NON fa

- Non certifica che un'acqua sia sicura da bere: riporta informazioni fornite dagli utenti (vedi §5.3).
- Non è un navigatore: non calcola percorsi.
- Non è un'app di escursionismo generica: tratta solo punti d'acqua.

### Tipi di punto d'acqua

Proposta minima (solo categorie che cambiano l'informazione per chi cerca acqua):

| Valore | Significato | Esempio |
| ------ | ----------- | ------- |
| `fontana` | Fontana con getto continuo e spesso una vasca | Fontana in piazza di un paese |
| `fontanella` | Erogatore pensato per bere o riempire borracce, spesso a pulsante o rubinetto | Fontanella in un parco |
| `sorgente` | Acqua che esce naturalmente dal terreno, non attrezzata | Sorgente lungo un sentiero |
| `punto_struttura` | Rubinetto o fontana presso una struttura (rifugio, bivacco, area attrezzata) | Rubinetto esterno di un rifugio |
| `altro` | Qualsiasi punto d'acqua che non rientra nei precedenti | — |

Note:
- I rifugi non sono una categoria propria: interessano solo se offrono un punto d'acqua, quindi rientrano in `punto_struttura`. Il nome della struttura va nel nome o nella descrizione.
- Non si introducono altre categorie (es. lavatoi, abbeveratoi) finché non servono davvero: si usa `altro`. DV con gli studenti.

---

## 2. Piattaforme (contesto)

Fatto: l'app deve funzionare su Windows, Linux, macOS, iOS e Android (D01).

### Sito responsive, PWA, app nativa: differenze

- **Sito web responsive**: un sito che si adatta allo schermo. Si apre dal browser.
- **PWA installabile**: un sito responsive con un *manifest* (nome, icone, modalità di apertura) servito in HTTPS, di solito con un *service worker* (script che salva i file dell'app). Si "installa" dal browser e si apre da un'icona. Su iPhone si installa a mano (Condividi → "Aggiungi alla schermata Home"); su Android Chrome propone l'installazione.
- **App nativa**: programma compilato per iOS o Android, distribuito tramite store o build di sviluppo.

Proposto (non approvato): PWA (D02). Analisi di idoneità: `DECISIONI_TECNICHE.md`.

---

## 3. Tipi di utente

### 3.1 Utente non autenticato (visitatore)

| Azione | Consentita | Motivo |
| ------ | ---------- | ------ |
| Vedere la mappa | Sì | È lo scopo principale; chi ha sete non deve registrarsi |
| Vedere i punti | Sì | Idem |
| Vedere i dettagli di un punto | Sì | Idem |
| Usare il GPS per vedere la propria posizione | Sì | L'app non invia né salva questa posizione nel proprio backend (§6) |
| Cercare e filtrare | Sì (quando disponibili, dopo l'MVP) | Sola lettura |
| Vedere le fotografie | Sì (quando disponibili) | Sola lettura |
| Aggiungere, modificare, fotografare, verificare, segnalare | **No** | Serve sapere chi ha inserito un dato, per limitare abusi e permettere correzioni |

### 3.2 Utente autenticato

| Azione | Fase | Note |
| ------ | ---- | ---- |
| Tutto ciò che può fare il visitatore | MVP | — |
| Aggiungere un punto | MVP | — |
| Modificare ed eliminare **i propri** punti | P1 | Non i punti degli altri |
| Caricare una fotografia su un punto | P1 | Anche su punti di altri |
| Verificare lo stato di un punto | P1 | Anche su punti di altri |
| Segnalare un problema | P2 | Anche su punti di altri |
| Gestire il proprio profilo | P2 | Elenco dei propri punti; nome visualizzato solo se confermato (RQ-06, RQ-11). Il logout è già nell'MVP (RF-023) |

### 3.3 Amministratore

- **Cosa potrebbe fare**: nascondere o eliminare qualsiasi punto o foto; correggere dati errati; chiudere segnalazioni; bloccare un utente che inserisce contenuti inappropriati.
- **Permessi**: modifica ed eliminazione su tutti i contenuti; nessun accesso alle password (non esistono in chiaro).
- **Perché servirebbe**: i contenuti sono inseriti da chiunque; foto e segnalazioni rendono necessaria una moderazione.
- **Serve nell'MVP?** Proposta (RQ-05, DA DECIDERE): **no**. Nell'MVP non ci sono foto né segnalazioni, gli utenti saranno pochi (studenti, docente, tester). Le correzioni straordinarie vengono fatte dai due sviluppatori direttamente sui dati, fuori dall'app, e annotate nel diario.
- **Quando**: da rivalutare prima di introdurre le fotografie (P1); un ruolo amministratore minimo potrebbe diventare necessario lì.
- Il sistema amministrativo **non** viene progettato ora. Da chiedere al docente se è richiesto (§19).

---

## 4. MVP (versione minima funzionante)

### 4.1 Valutazione critica dell'elenco proposto

| # | Voce proposta | Valutazione |
| - | ------------- | ----------- |
| 1 | Apertura dell'app | OK |
| 2 | Visualizzazione della mappa | OK |
| 3 | Visualizzazione dei punti | OK |
| 4 | Visualizzazione dei dettagli | OK |
| 5 | Localizzazione dell'utente | OK: complessità bassa, tutto sul dispositivo |
| 6 | Registrazione | OK, ma la conferma via email dipende dall'invio di email (DV) |
| 7 | Login / logout | OK |
| 8 | Aggiunta di un punto | OK, con pochissimi campi obbligatori |
| 9 | Salvataggio nel database | OK (è parte della voce 8) |

Aggiunte **necessarie** (non per "ingrandire" il progetto):
- avviso sulla potabilità visibile nel dettaglio (sicurezza delle persone);
- attribuzione dei dati cartografici (obbligo di licenza);
- pagina "Informazioni" con avviso, attribuzioni e informazioni sui dati personali (serve appena esiste la registrazione);
- controllo dei dati inseriti e regola "solo l'autore può modificare" applicata dal server (sicurezza, anche se la modifica arriva dopo).

Esclusioni motivate:
- **Modifica/eliminazione dei propri punti**: esclusa dall'MVP, priorità P1 subito dopo. Rischio accettato: un errore nell'MVP si corregge solo intervenendo sui dati (sviluppatori).
- **Punti vicini con distanza, filtri, ricerca, foto, verifiche, segnalazioni, profilo**: dopo l'MVP.
- **Installazione con icona sul dispositivo** (RF-070): P1. Come avverrà dipende dalla tecnologia che verrà scelta (D02, Fase 2).

### 4.2 Proposta: MVP in due tappe

Stesso contenuto, ordine diverso, per avere presto qualcosa di funzionante da provare:

- **MVP-1 (sola lettura)**: apertura, mappa, punti, dettagli, posizione GPS, pagina Informazioni. I punti di prova vengono inseriti dagli sviluppatori.
- **MVP-2 (scrittura)**: registrazione, login/logout, aggiunta punto, salvataggio.

Stato: **proposta, DA DECIDERE (RQ-04)**. Finché RQ-04 è aperta, l'MVP resta un'unica versione con il contenuto di §4.3; la divisione in due tappe riguarda solo l'ordine di lavoro e non cambia i requisiti.

### 4.3 MVP finale

RF-001 ... RF-006, RF-010, RF-011, RF-020, RF-022 ... RF-024, RF-030 ... RF-033, RF-036, RF-038, RF-071 (vedi §17).

---

## 5. Il punto d'acqua (modello concettuale)

Modello **concettuale**: descrive le informazioni, non le tabelle del database (che saranno progettate nella fase Database).

### 5.1 Campi

| Campo | Obbl. | Tipo di dato | Valori ammessi | Chi lo imposta / modifica | Fase |
| ----- | ----- | ------------ | -------------- | ------------------------- | ---- |
| ID | Automatico | Identificatore unico | Generato dal sistema | Nessuno | MVP |
| Nome | No | Testo, max 80 caratteri | Se vuoto si mostra il tipo (es. "Fontana") | Autore | MVP |
| Tipo | **Sì** | Valore da elenco | `fontana`, `fontanella`, `sorgente`, `punto_struttura`, `altro` | Autore | MVP |
| Latitudine | **Sì** | Numero decimale (gradi) | Dentro l'area della Valle d'Aosta (§5.4) | Autore | MVP |
| Longitudine | **Sì** | Numero decimale (gradi) | Dentro l'area della Valle d'Aosta (§5.4) | Autore | MVP |
| Acqua potabile | Sì, con valore predefinito | Valore da elenco | Valori e valore predefinito prudente: DA DECIDERE (§5.3, RQ-01, D13) | Autore | MVP |
| Stato di funzionamento | Sì, con valore predefinito | Valore da elenco | `funzionante`, `non_funzionante`, `non_verificato` (predefinito) | Autore alla creazione; poi le verifiche (P1) | MVP |
| Descrizione | No | Testo, max 500 caratteri | Testo libero (come raggiungerlo, note) | Autore | MVP |
| Si può riempire una bottiglia | No | Valore da elenco | `si`, `no`, `non_so` (predefinito) | Autore | P1 |
| Accesso | No | Valore da elenco | `strada` (raggiungibile con veicoli o a piedi su strada), `sentiero`, `non_so` (predefinito) | Autore | P2 |
| Accessibile in carrozzina | No | Valore da elenco | `si`, `no`, `non_so` (predefinito) | Autore | P2 |
| Stagionalità | No | Valore da elenco + nota | `tutto_anno`, `stagionale`, `non_so` (predefinito); nota testuale facoltativa | Autore | P2 |
| Fotografie | No | Collegamento a 0 o più foto | Nella prima versione con foto (P1): massimo 1 (§8) | Chi carica la foto | P1 |
| Autore | Automatico | Riferimento all'utente | Utente autenticato che crea il punto | Nessuno | MVP |
| Data di creazione | Automatico | Data e ora (conservate) | Precisione mostrata pubblicamente: DA DECIDERE (RQ-13) | Nessuno | MVP |
| Data ultima modifica | Automatico | Data e ora (conservate) | Precisione mostrata pubblicamente: DA DECIDERE (RQ-13) | Nessuno | P1 |
| Ultima verifica | Automatico | Data e ora (conservate) + esito | Dalla verifica più recente; precisione mostrata pubblicamente: DA DECIDERE (RQ-13) | Nessuno (calcolato) | P1 |

Nell'MVP l'utente inserisce **al massimo 2 dati obbligatori**: posizione e tipo. Tutto il resto è facoltativo o ha un valore predefinito.

Dati volutamente **non** previsti: altitudine (ricavabile, non necessaria), orari, qualità dell'acqua misurata (l'app non misura nulla).

### 5.2 Chi può modificare

- MVP: nessuno modifica dopo la creazione (solo gli sviluppatori, sui dati, in casi straordinari).
- P1: l'autore modifica ed elimina i propri punti; campi automatici mai modificabili dall'utente.
- Futuro: amministratore su tutti i punti (se approvato).

### 5.3 Campo "acqua potabile": analisi

Il problema: un utente può scrivere "potabile" senza saperlo; un'acqua potabile può smettere di esserlo. L'app non può garantire nulla.

| Opzione | Descrizione | Pro | Contro |
| ------- | ----------- | --- | ------ |
| A. Sì / No / Non verificato | Tre valori, predefinito "Non verificato" | Semplice, chiaro sulla mappa | "Sì" sembra una garanzia; non si sa da dove arriva l'informazione |
| B. Basato su ciò che si vede | "Cartello: acqua potabile" / "Cartello: acqua non potabile" / "Nessun cartello" / "Non so" | Registra un fatto osservabile, non un giudizio | Più valori; "nessun cartello" non dice se si può bere |
| C. A + fonte dell'informazione | I tre valori di A + campo facoltativo "fonte": `cartello_sul_posto`, `fonte_ufficiale`, `esperienza_personale` | Chiaro sulla mappa e onesto sull'origine | Un campo in più (facoltativo) |

Proposta (non approvata): **A nell'MVP**, con etichette prudenti ("Indicata come potabile", "Indicata come non potabile", "Non verificato") e avviso fisso nel dettaglio: *"Informazione inserita dagli utenti: non garantisce che l'acqua sia sicura. In caso di dubbio non bere."* Evoluzione verso **C** in P2. Stato: **DA DECIDERE** (D13).

### 5.4 Area geografica valida

Un punto è accettato solo se le coordinate sono dentro un rettangolo che contiene la Valle d'Aosta (valori esatti da fissare nella fase Database, DV). Controllo semplice e verificabile; non esclude i punti appena fuori regione dentro il rettangolo, accettato come limite.

---

## 6. Posizione GPS

In parole semplici: l'app usa la posizione dell'utente in **due modi diversi**.

Per "nostro sistema" o "backend" si intende la parte dell'app che sta sui server (dati, archivi, account), non il telefono o il computer dell'utente.

1. **Per orientarsi** ("dove sono? quali fontane ho vicino?"): l'app usa la posizione solo sul telefono o sul computer dell'utente, per disegnare il pallino sulla mappa e calcolare le distanze. **L'app non la salva e non la invia al proprio backend.** Quando si chiude l'app, l'app non ne conserva traccia. (Il browser o il sistema operativo del dispositivo possono avere funzioni proprie di localizzazione e cronologia, indipendenti dall'app e regolate dalle loro impostazioni.)
2. **Per creare un nuovo punto** ("la fontana è qui dove sono io"): solo se l'utente lo sceglie, la sua posizione in quel momento viene proposta come posizione della fontana. Prima del salvataggio l'app mostra il punto sulla mappa e chiede una **conferma esplicita**. **Solo dopo la conferma** la coordinata viene inviata e diventa un **dato pubblico del punto**, visibile a tutti, come se l'utente avesse toccato quel luogo sulla mappa.

| Domanda | Requisito |
| ------- | --------- |
| Quando si chiede il permesso | Quando l'utente tocca il pulsante "La mia posizione" o sceglie "Usa la mia posizione" nell'aggiunta di un punto, **e** il permesso non è già disponibile. La richiesta non viene fatta dall'app all'apertura. Quante volte il dispositivo la ripresenti dipende dal browser o dal sistema operativo. |
| Perché | Centrare la mappa, mostrare dove si trova l'utente, calcolare la distanza dai punti, precompilare la posizione di un nuovo punto. Il motivo è scritto vicino al pulsante. |
| Se l'utente nega | Messaggio breve che spiega come riattivarlo dalle impostazioni; la mappa resta utilizzabile, centrata sulla Valle d'Aosta; l'aggiunta di un punto si fa toccando la mappa. |
| Viene salvata? | **No**, quando serve per orientarsi: l'app non la salva né sul dispositivo né nel proprio backend. |
| Viene inviata al nostro sistema? | **No**, quando serve per orientarsi: distanze e punti vicini si calcolano sul dispositivo. Unico caso in cui viene inviata: creazione di un punto, dopo la conferma (riga successiva). |
| Eccezione: creazione di un punto | Se l'utente sceglie "Usa la mia posizione" per un **nuovo punto**, quella coordinata diventa la posizione del punto (dato pubblico). Prima del salvataggio l'app mostra il punto sulla mappa con il messaggio "Questa posizione sarà visibile a tutti come posizione del punto d'acqua" e l'utente deve confermare (RF-038). Senza conferma nulla viene inviato. |
| Servizio che fornisce la mappa | Per disegnare la mappa il dispositivo scarica le "tessere" della zona visualizzata dal servizio cartografico esterno. Se la mappa è centrata sulla posizione dell'utente, quel servizio riceve richieste per quella zona (insieme ai normali dati tecnici di connessione). Non è un invio della posizione da parte nostra, ma va indicato nella pagina Informazioni. |
| Punti vicini (P1) | Il dispositivo calcola la distanza tra la posizione e i punti caricati e li ordina; raggi selezionabili (proposti: 500 m, 1 km, 5 km). |
| GPS non disponibile / troppo lento | Dopo un tempo massimo (proposto 15 s) messaggio "Posizione non disponibile"; la mappa resta utilizzabile. |
| Posizione imprecisa | Se nell'aggiunta di un punto la precisione dichiarata è peggiore di 50 m (valore proposto), avviso e invito a correggere il punto sulla mappa. |
| In background | Non richiesto: la posizione si usa solo con l'app aperta. |

---

## 7. Privacy e dati trattati

> **Nota importante.** Gli obblighi giuridici **non** sono stati analizzati e **non** sono risolti. I punti elencati in §7.7 sono questioni aperte da verificare con il docente/la scuola prima di qualsiasi pubblicazione con utenti reali. La pagina "Informazioni" dell'app (RF-071) è una spiegazione per gli utenti, **non** sostituisce un'eventuale informativa privacy.

### 7.1 Principio: solo i dati necessari

L'app chiede un dato personale solo se senza di esso una funzione non può funzionare. Per usare mappa e punti **non serve alcun dato personale**: la registrazione serve solo per inserire contenuti.

Nelle tabelle, "database", "archivio file" e "servizio di autenticazione" indicano **dove** il sistema conserva i dati, non un prodotto specifico: le tecnologie non sono ancora scelte (vedi `DECISIONI_TECNICHE.md`).

### 7.2 Dati dell'account

| Dato | Perché serve | Dove viene conservato | Chi può accedervi | Obbligatorio | Conservazione | Se l'utente non lo fornisce |
| ---- | ------------ | --------------------- | ----------------- | ------------ | ------------- | --------------------------- |
| Email | Identificare l'account per il login; inviare la conferma dell'account (se prevista, RF-021) e il recupero password (P1) | Servizio di autenticazione | L'utente stesso. Gli sviluppatori/amministratori del progetto solo tramite il pannello di gestione, per gestire l'account. **Mai** mostrata ad altri utenti né leggibile pubblicamente | Sì, solo per registrarsi | Non definita: finché esiste l'account (DV, §7.7) | Non può registrarsi; può comunque usare l'app come visitatore |
| Password | Proteggere l'account | Il servizio di autenticazione conserva solo un **hash** (trasformazione non reversibile). La password in chiaro non viene salvata da nessuna parte | **Nessuno**: né gli altri utenti, né gli sviluppatori, né gli amministratori possono leggerla o recuperarla. Se dimenticata si crea una nuova password (RF-025, da P1; nell'MVP non è previsto il recupero) | Sì, solo per registrarsi | Hash finché esiste l'account | Non può registrarsi |
| Nome visualizzato (P2, **solo se confermato**: RQ-06, RQ-11) | Mostrare un nome al posto di "Utente" accanto ai propri contributi | Database | Tutti, se l'utente lo imposta e se si decide di mostrare l'autore | **No** | Finché esiste l'account (DV) | Compare "Utente" |
| Dati di sessione (tessera di accesso salvata sul dispositivo per restare collegati, RF-024) | Non dover rifare il login a ogni apertura | Sul dispositivo dell'utente | L'app su quel dispositivo | Automatico dopo il login | Fino al logout o alla scadenza della sessione (durata DV) | — |
| Altri dati del profilo | **Nessuno previsto.** Non si chiedono nome reale, data di nascita, telefono, indirizzo, foto profilo | — | — | — | — | — |

### 7.3 Contenuti inseriti dagli utenti

- I **punti d'acqua creati diventano pubblici**: posizione, tipo, nome, descrizione, stati e date sono visibili a chiunque apra l'app, anche senza account (precisione pubblica delle date: RQ-13). L'utente lo sa prima di salvare (RF-038).
- I contenuti devono rispettare le **regole dell'app** (proposta; rese consultabili nella registrazione e nella pagina Informazioni; se debbano anche essere "accettate" formalmente è una questione aperta, §7.7):
  - inserire solo punti d'acqua reali;
  - non scrivere dati personali propri o di altri (nomi, telefoni, indirizzi) in nome e descrizione;
  - niente testi offensivi o pubblicità;
  - per le foto, regole in §8.
- Il **collegamento tra un contenuto e il suo autore** è conservato per permettere all'autore di modificarlo e per gestire gli abusi. Nell'MVP non è mostrato pubblicamente (RQ-06).
- Come gestire contenuti che violano le regole (segnalazioni, moderazione, amministratore) sarà definito nelle fasi successive (§3.3, §8, §9; domanda al docente §19).

| Dato | Perché serve | Dove | Chi può accedervi | Obbligatorio | Conservazione | Se non fornito |
| ---- | ------------ | ---- | ----------------- | ------------ | ------------- | -------------- |
| Punto d'acqua (campi di §5) | Scopo dell'app | Database | **Tutti** | Posizione e tipo, per creare un punto | Finché non viene eliminato (dall'autore da P1). Cosa succede ai punti se l'autore elimina l'account: DV (RQ-10) | Il punto non viene creato |
| Autore del punto (riferimento all'account) | Permessi di modifica; gestione abusi | Database | L'autore stesso e gli amministratori. Pubblico: no nell'MVP; dopo l'MVP DA DECIDERE (RQ-06, RQ-11) | Automatico | Come il punto | — |
| Verifica (P1): esito, data e ora, nota, autore | Tenere aggiornato lo stato del punto; limitare le verifiche ripetute | Database | Pubblico: data (precisione RQ-13) ed esito dell'ultima verifica. Autore della verifica: solo amministratori | No | Non definita (DV, RQ-12) | Il punto resta con lo stato precedente |
| Segnalazione (P2): motivo, descrizione, data e ora, autore | Correggere dati sbagliati | Database | Autore del punto (vede motivo e descrizione, **non** chi ha segnalato) e amministratori | No | Non definita (DV) | — |

**Attenzione (dato indiretto sulla posizione)**: una verifica o un punto creato con "Usa la mia posizione", collegati a un account e a data e ora, indicano che quella persona si trovava in quel luogo in quel momento. Per questo il collegamento autore-contenuto **non** è pubblico e l'autore delle verifiche non viene mostrato (SEC-013). Se in futuro l'autore venisse mostrato (RQ-06), l'ora esatta pubblica di creazione e verifica renderebbe il problema visibile a tutti: per questo la precisione pubblica delle date è una decisione aperta (RQ-13).

### 7.4 Posizione GPS

| Uso | Perché | Dove | Chi può accedervi | Obbligatorio | Conservazione | Se l'utente nega il permesso |
| --- | ------ | ---- | ----------------- | ------------ | ------------- | ---------------------------- |
| Orientarsi: pallino sulla mappa, distanze, punti vicini | Aiutare a trovare l'acqua più vicina | L'app la tiene solo nella memoria di lavoro del dispositivo, mentre è aperta | Solo l'utente | No | L'app non la conserva e non la invia al proprio backend | Mappa utilizzabile, centrata sulla Valle d'Aosta; niente distanze |
| Creare un punto con "Usa la mia posizione" | Indicare dove si trova la fontana | Dopo la conferma esplicita (RF-038) diventa la posizione del punto nel database | **Tutti** (è la posizione pubblica del punto) | No: si può toccare la mappa | Come il punto | Si indica il punto toccando la mappa |

Il browser o il sistema operativo possono ricordare la **scelta** dell'utente sul permesso (concesso o negato) e possono avere funzioni proprie di localizzazione. Sono comportamenti del dispositivo, indipendenti dall'app e regolati dalle sue impostazioni: l'app non li controlla e non ne dipende.

### 7.5 Fotografie (P1)

| Dato | Perché | Dove | Chi può accedervi | Obbligatorio | Conservazione | Se non fornito |
| ---- | ------ | ---- | ----------------- | ------------ | ------------- | -------------- |
| Foto di un punto | Riconoscere il punto sul posto | Archivio file | **Tutti**: una foto associata a un punto è pubblica. L'utente lo sa prima del caricamento (testo nel modulo) | No | Finché non viene eliminata (da chi l'ha caricata o dall'amministratore) o finché esiste il punto (DV) | Il punto resta senza foto |
| Metadati della foto (posizione GPS, data, modello del telefono salvati dentro il file) | **Non servono** | **Rimossi sul dispositivo prima dell'invio**: non arrivano mai al sistema | — | — | Mai conservati | — |
| Chi ha caricato la foto | Permesso di eliminazione | Database | Chi l'ha caricata e amministratori | Automatico | Come la foto | — |

Non devono essere caricate **intenzionalmente** foto con persone riconoscibili (e, per prudenza, targhe o interni di proprietà private). Non è previsto alcun sistema automatico di riconoscimento: la regola è comunicata all'utente e le violazioni saranno gestite con segnalazioni/moderazione (fasi successive).

### 7.6 Dati tecnici presso servizi esterni

| Dato | Chi lo tratta | Nota |
| ---- | ------------- | ---- |
| Indirizzo IP, tipo di browser, orari di accesso | Servizi esterni usati dall'app (hosting, servizio cartografico, servizio di autenticazione e dati) | Non controllato da noi; condizioni dei singoli servizi DV |
| Zona della mappa visualizzata | Servizio cartografico (§6) | Se la mappa è centrata sull'utente, rivela indirettamente una posizione approssimativa |

### 7.7 Questioni giuridiche da verificare (NON risolte)

Da chiedere al docente/alla scuola (§19) **prima** di aprire l'app a utenti reali:

1. Serve un'informativa privacy? Chi la scrive e chi ne è responsabile?
2. Serve un consenso o un'altra base giuridica per trattare email e contenuti?
3. Esiste un'età minima per usare il servizio e registrarsi?
4. Quali autorizzazioni servono per creare account sui servizi esterni, accettarne i termini e pubblicare contenuti degli utenti?
5. Come si gestiscono le richieste degli utenti sui propri dati (vedere, correggere, cancellare)?
6. Per quanto tempo si conservano i dati, anche dopo l'esame? Si cancella tutto a fine progetto?

Il fatto che queste domande compaiano qui **non** significa che siano risolte.

### 7.8 Controllo di minimizzazione (esito)

| Dato | Necessario? | Osservazione |
| ---- | ----------- | ------------ |
| Email | Sì | Indispensabile per login e recupero password |
| Password (hash) | Sì | Indispensabile per il login |
| Nome visualizzato | **Discutibile** | Serve solo se si decide di mostrare l'autore (RQ-06). Se l'autore non viene mai mostrato, questo dato si può eliminare (RQ-11) |
| Autore di punti, foto, verifiche, segnalazioni | Sì | Serve per permessi e limiti anti-abuso; non pubblico |
| Autore delle verifiche | **Da valutare** | Serve solo per il limite "1 verifica al giorno" e per gli abusi; crea una traccia indiretta di posizione (§7.3). Alternativa da valutare: conservarlo solo per un periodo limitato (RQ-12) |
| Data e ora esatte (creazione, modifica, verifiche) | **Da valutare** | Mostrarle pubblicamente con l'ora può rivelare quando una persona era in un luogo; precisione pubblica DA DECIDERE (RQ-13) |
| Metadati delle foto | No | Rimossi |
| Posizione GPS per orientarsi | Non salvata dall'app | Usata solo sul dispositivo, non inviata al backend |
| Nome reale, età, telefono, indirizzo, foto profilo | No | Non richiesti |

---

## 8. Fotografie

Le foto **non** fanno parte dell'MVP (priorità P1).

| Aspetto | Requisito proposto |
| ------- | ------------------ |
| Chi può caricarle | Utenti autenticati |
| Numero massimo | **1 per punto** nella prima versione (sufficiente per riconoscere il punto). Più foto in P3 (proposto: max 3) |
| Origine | Galleria o fotocamera del telefono; file dal computer |
| Formati accettati in ingresso | JPEG, PNG, WebP; HEIC (formato predefinito di iPhone): DV |
| Formato salvato | Un solo formato compresso (da decidere nella fase Immagini) |
| Dimensione | Ridotta prima dell'invio: lato lungo massimo e peso massimo del file con valori proposti 1600 px e 1 MB (RQ-09) |
| Chi può vederle | Tutti, anche senza account: una foto associata a un punto è pubblica; l'utente lo legge prima di caricarla |
| Chi può eliminarle | Chi l'ha caricata; l'amministratore, se esisterà |
| Sostituzione | Eliminare e caricare di nuovo |
| Moderazione | Proposta: pubblicazione immediata + segnalazione "foto inappropriata" (P2) + rimozione da parte degli sviluppatori/amministratore. Da chiedere al docente se serve un controllo **prima** della pubblicazione |
| Metadati | Posizione, data e dati del dispositivo contenuti nel file vengono rimossi sul dispositivo **prima** dell'invio (§7.5) |
| Contenuto | Non caricare intenzionalmente persone riconoscibili; nessun riconoscimento automatico previsto |

---

## 9. Verifiche e segnalazioni

Proposta di distinzione:

| | Verifica (P1) | Segnalazione (P2) |
| - | ------------- | ----------------- |
| Cos'è | Un'osservazione datata dello stato del punto: "oggi l'ho visto" | Una richiesta di correzione rivolta a chi gestisce i dati |
| Esempi | "Oggi funziona", "Oggi non funziona" | "Posizione sbagliata", "Non esiste più", "Dati errati", "Foto inappropriata", "Pericolo" |
| Effetto | Aggiorna automaticamente *stato di funzionamento* e *ultima verifica* del punto | Non cambia i dati: resta aperta finché autore o amministratore non la gestiscono |
| Dati memorizzati | Punto, autore, data e ora, esito (`funziona` / `non_funziona`), nota facoltativa (max 200 caratteri) | Punto, autore, data e ora, motivo (da elenco), descrizione facoltativa (max 500), stato (`aperta` / `chiusa`), data di chiusura |
| Chi la vede | Tutti: data ed esito dell'ultima verifica (non chi l'ha fatta) | Autore del punto (senza sapere chi ha segnalato) e amministratori |
| Limiti (proposti, RQ-09) | Massimo 1 verifica per utente per punto al giorno | Massimo 1 segnalazione aperta per utente per punto |

**Differenza rispetto all'esempio della consegna**: "Questa fontana non funziona" nella proposta è una **verifica con esito negativo**, perché descrive lo stato attuale e deve aggiornarlo subito. Le segnalazioni restano per i problemi che richiedono una correzione. Alternativa: considerare "non funziona" una segnalazione, lasciando alle verifiche solo le conferme positive, ma lo stato del punto cambierebbe solo dopo l'intervento di qualcuno. Stato: **DA DECIDERE** con gli studenti (RQ-02). Tutta la tabella sopra è una proposta legata a RQ-02.

---

## 10. Ricerca e filtri

| Funzione | Descrizione | Fase |
| -------- | ----------- | ---- |
| Filtro per acqua potabile | Mostra solo i punti indicati come potabili (etichetta e valori secondo RQ-01) | P1 |
| Filtro per tipo | Uno o più tipi | P1 |
| Punti vicini | Elenco ordinato per distanza entro un raggio scelto (proposti: 500 m / 1 km / 5 km; richiede posizione) | P1 |
| Filtro per stato di funzionamento | Nasconde i punti "non funzionante" | P2 |
| Ricerca per nome | Testo nel nome o nella descrizione | P2 |
| Ricerca per località/indirizzo | Scrivere "Cogne" e spostare la mappa lì | P3: richiederebbe un servizio esterno di ricerca luoghi, non analizzato |
| Filtro "riempimento bottiglia" | Utile a escursionisti e ciclisti | P2 |

Nell'MVP la ricerca coincide con lo spostamento della mappa e la posizione GPS.

---

## 11. Offline

| Opzione | Cosa significa | Difficoltà | Vantaggi | Svantaggi | Utilità per noi |
| ------- | -------------- | ---------- | -------- | --------- | --------------- |
| A. Nessun supporto | Senza rete l'app non funziona e lo dice | Bassa | Nessuna complessità | In montagna la rete può mancare | Sufficiente per l'MVP |
| B. Cache minima dell'interfaccia | I file dell'app sono salvati sul dispositivo: si apre anche senza rete e mostra "sei offline" | Media | App più rapida da aprire; collegata all'installazione con icona (RF-070) | Rischio di vedere una versione vecchia dopo un aggiornamento; mappa e punti comunque non disponibili | Buona, insieme all'installazione (P1) |
| C. Offline completo con sincronizzazione | Mappe e punti salvati sul dispositivo; punti aggiunti offline inviati al ritorno della rete | Alta | Utile in montagna | Conflitti tra dati, mappe offline vietate dai provider pubblici gratuiti analizzati, molto più codice | Fuori dalla portata del progetto |

Proposta: **A nell'MVP, B in P1, C non prevista**. Stato: DA DECIDERE (D21).

---

## 12. Sicurezza (requisiti)

| ID | Requisito | Decisione tecnica collegata (proposta, NON approvata) |
| -- | --------- | ------------------------------------------ |
| SEC-001 | Le password sono gestite da un sistema di autenticazione dedicato e salvate solo come hash | D09 |
| SEC-002 | Il database dell'applicazione non contiene password | — |
| SEC-003 | Nessuna chiave segreta nel codice eseguito dal browser | D09, D18 |
| SEC-004 | Configurazione e chiavi in variabili d'ambiente; nessun segreto nel repository | D18 |
| SEC-005 | Le regole di accesso ai dati sono applicate dal server/database, non solo dall'interfaccia: un utente non può leggere o modificare ciò che non gli è consentito neanche chiamando direttamente il servizio | D09 |
| SEC-006 | Lettura pubblica solo dei dati pubblici; scrittura solo per utenti autenticati | D09 (da definire nella fase Database) |
| SEC-007 | Un punto può essere modificato o eliminato solo dal suo autore (e dall'amministratore, se approvato) | D09 (da definire nella fase Database) |
| SEC-008 | Una foto può essere eliminata solo da chi l'ha caricata (e dall'amministratore); l'archivio accetta solo immagini entro la dimensione massima | D09 (da definire nella fase Immagini) |
| SEC-009 | Tutti i dati inseriti sono controllati **sia** nell'interfaccia **sia** dal server: campi obbligatori, lunghezze massime, valori ammessi, coordinate nell'area valida | Da definire nella fase Database |
| SEC-010 | I testi inseriti dagli utenti vengono mostrati come testo, mai eseguiti come codice | — |
| SEC-011 | Tutto il traffico in HTTPS | D12 |
| SEC-012 | Password con lunghezza minima (proposta: 8 caratteri, RQ-09) | D09 |
| SEC-013 | Email degli utenti, collegamenti autore-contenuto e autori di verifiche e segnalazioni **non** sono leggibili pubblicamente, nemmeno chiamando direttamente il servizio | D09 (da definire nella fase Database) |
| SEC-014 | I metadati delle foto vengono rimossi sul dispositivo prima dell'invio | Da definire nella fase Immagini |
| SEC-015 | La posizione dell'utente usata per orientarsi non viene mai inclusa nelle richieste al nostro sistema | Da definire nella fase GPS |

Nota: il vecchio SEC-016 (accesso degli sviluppatori ai dati) non è un requisito del software ma una regola di lavoro: è stato spostato in §20 come ORG-01.

---

## 13. Requisiti funzionali

Priorità: **MVP** = prima versione; **P1** = subito dopo l'MVP; **P2** = utile, se c'è tempo; **P3** = eventuale.

### Mappa e punti

| ID | Requisito | Priorità | Dipende da |
| -- | --------- | -------- | ---------- |
| RF-001 | L'utente apre l'app e vede la mappa senza registrarsi | MVP | — |
| RF-002 | Al primo avvio la mappa mostra l'intera Valle d'Aosta; l'utente può spostarla e cambiare lo zoom con dita, mouse e pulsanti | MVP | RF-001 |
| RF-003 | Sulla mappa è sempre visibile l'attribuzione dei dati cartografici | MVP | RF-002 |
| RF-004 | La mappa mostra tutti i punti d'acqua salvati; il simbolo di ogni punto permette di distinguere i valori di potabilità previsti (RQ-01) senza affidarsi al solo colore (per esempio con icona, forma o etichetta: la soluzione grafica è da definire) | MVP | RF-002, RQ-01 |
| RF-005 | Toccando un punto si apre il dettaglio con tutti i campi compilati | MVP | RF-004 |
| RF-006 | Il dettaglio mostra sempre l'avviso sulla potabilità (§5.3) | MVP | RF-005 |
| RF-007 | Il dettaglio mostra data e esito dell'ultima verifica | P1 | RF-050 |

### Posizione

| ID | Requisito | Priorità | Dipende da |
| -- | --------- | -------- | ---------- |
| RF-010 | Con il pulsante "La mia posizione", se il permesso di localizzazione non è già disponibile l'app lo richiede al dispositivo; se la posizione è disponibile, l'app centra la mappa e mostra la posizione dell'utente | MVP | RF-002 |
| RF-011 | Se il permesso è negato o la posizione non è disponibile entro un tempo massimo (proposto: 15 s, RQ-09), compare un messaggio e la mappa resta utilizzabile | MVP | RF-010 |
| RF-012 | Se la posizione è nota, il dettaglio di un punto mostra la distanza in linea d'aria | P1 | RF-010, RF-005 |
| RF-013 | L'utente vede l'elenco dei punti entro un raggio scelto tra alcuni valori (proposti: 500 m / 1 km / 5 km), ordinati per distanza | P1 | RF-010 |

### Account

| ID | Requisito | Priorità | Dipende da |
| -- | --------- | -------- | ---------- |
| RF-020 | Il visitatore si registra con email e password (lunghezza minima: SEC-012); il modulo chiede solo questi due dati e mostra il collegamento alle regole dell'app e alla pagina Informazioni. Se servano anche un'accettazione dei termini, un consenso o un'informativa privacy **non è deciso**: dipende dalle risposte di docente/scuola (§7.7, §19); questo requisito non li prevede né li esclude | MVP | — |
| RF-021 | Conferma dell'email: **decisione aperta (RQ-03)**. Da decidere se l'account diventa utilizzabile solo dopo che l'utente ha confermato l'email oppure subito dopo la registrazione. Finché RQ-03 è aperta, nessuno dei due comportamenti è un requisito | DA DECIDERE | RF-020, RQ-03 |
| RF-022 | L'utente registrato fa login con email e password; con dati errati vede un messaggio | MVP | RF-020 |
| RF-023 | L'utente fa logout; dopo il logout non può più aggiungere punti | MVP | RF-022 |
| RF-024 | Riaprendo l'app sullo stesso dispositivo l'utente non deve rifare il login finché la sessione è valida; la sessione termina con il logout o per scadenza (durata DV). A sessione terminata l'app chiede di nuovo il login senza errori né perdita di dati pubblici | MVP | RF-022 |
| RF-025 | L'utente recupera la password tramite email | P1 | RF-020 |
| RF-026 | Profilo: elenco dei propri punti; nome visualizzato facoltativo solo se confermato (RQ-06, RQ-11) | P2 | RF-022 |
| RF-027 | L'utente può chiedere l'eliminazione del proprio account | P2 (obblighi DV) | RF-022 |

### Gestione punti

| ID | Requisito | Priorità | Dipende da |
| -- | --------- | -------- | ---------- |
| RF-030 | L'utente autenticato aggiunge un punto indicando la posizione (toccando la mappa o con "Usa la mia posizione") e il tipo; gli altri campi sono facoltativi | MVP | RF-022, RF-002 |
| RF-031 | Il sistema rifiuta un punto senza posizione o tipo, con coordinate fuori dall'area valida o con testi oltre le lunghezze massime, spiegando il motivo | MVP | RF-030 |
| RF-032 | Dopo il salvataggio il punto è visibile sulla mappa a tutti gli utenti (dopo aver ricaricato la mappa) | MVP | RF-030 |
| RF-033 | Se il salvataggio fallisce, l'utente vede un messaggio e i dati inseriti non vanno persi | MVP | RF-030 |
| RF-034 | L'autore modifica i dati e la posizione dei propri punti | P1 | RF-030 |
| RF-035 | L'autore elimina i propri punti, dopo una conferma | P1 | RF-030 |
| RF-036 | Nessun utente può modificare o eliminare punti di altri, nemmeno aggirando l'interfaccia | MVP | RF-030 |
| RF-037 | Se si aggiunge un punto entro una distanza minima da un altro (proposta: 20 m, RQ-09), l'app avvisa di un possibile doppione | P2 | RF-030 |
| RF-038 | Prima del salvataggio di un nuovo punto l'app mostra la posizione sulla mappa, avvisa che posizione e dati saranno visibili a tutti e chiede una conferma esplicita; senza conferma nulla viene inviato | MVP | RF-030 |

### Fotografie

| ID | Requisito | Priorità | Dipende da |
| -- | --------- | -------- | ---------- |
| RF-040 | L'utente autenticato aggiunge 1 foto a un punto, dalla galleria o dalla fotocamera | P1 | RF-030 |
| RF-041 | La foto viene ridotta e privata dei metadati prima dell'invio | P1 | RF-040 |
| RF-042 | Tutti vedono la foto nel dettaglio del punto | P1 | RF-040 |
| RF-043 | Chi ha caricato la foto può eliminarla | P1 | RF-040 |
| RF-044 | Più foto per punto (proposto: fino a 3) | P3 | RF-040 |

### Verifiche e segnalazioni

| ID | Requisito | Priorità | Dipende da |
| -- | --------- | -------- | ---------- |
| RF-050 | L'utente autenticato registra una verifica con nota facoltativa; esiti possibili secondo RQ-02 (proposta: "funziona" / "non funziona") | P1 | RF-022, RQ-02 |
| RF-051 | La verifica più recente aggiorna stato di funzionamento e data di ultima verifica | P1 | RF-050 |
| RF-052 | L'utente autenticato invia una segnalazione scegliendo un motivo da elenco (elenco secondo RQ-02) | P2 | RF-022, RQ-02 |
| RF-053 | L'autore del punto vede le segnalazioni sui propri punti e può chiuderle | P2 | RF-052 |

### Ricerca e filtri

| ID | Requisito | Priorità | Dipende da |
| -- | --------- | -------- | ---------- |
| RF-060 | Filtro che mostra solo i punti indicati come potabili | P1 | RF-004, RQ-01 |
| RF-061 | Filtro per tipo | P1 | RF-004 |
| RF-062 | Filtro per stato di funzionamento | P2 | RF-051 |
| RF-063 | Ricerca per nome/descrizione | P2 | RF-004 |
| RF-064 | Ricerca per località | P3 | servizio esterno DV |

### Altro

| ID | Requisito | Priorità | Dipende da |
| -- | --------- | -------- | ---------- |
| RF-070 | L'app si può aprire da un'icona con il proprio nome sulla schermata principale di Android e iPhone (modalità di installazione dipendente dalla tecnologia, D02) | P1 | D02 |
| RF-071 | Pagina "Informazioni": scopo, avviso potabilità, attribuzioni, regole dei contenuti, spiegazione semplice di quali dati personali vengono usati e come (§7) | MVP | — |
| RF-072 | Ruolo amministratore (moderazione) | P3 / DA DECIDERE | domanda al docente |
| RF-073 | Interfaccia anche in francese | P3 | — |

---

## 14. Requisiti non funzionali

| ID | Categoria | Requisito verificabile |
| -- | --------- | ---------------------- |
| RNF-001 | Compatibilità smartphone | Funziona su iPhone (Safari) e Android (Chrome) nelle versioni correnti al momento dei test |
| RNF-002 | Compatibilità desktop | Funziona su Windows, macOS e Linux con i browser di §15 nelle versioni correnti al momento dei test |
| RNF-003 | Responsive | Utilizzabile da una larghezza minima (proposta: 360 px) fino allo schermo di un computer, senza scorrimento orizzontale |
| RNF-004 | Prestazioni | Mappa e punti visibili entro un tempo massimo (proposto: 5 s, RQ-09) su connessione mobile 4G, misurato a mano su un telefono reale |
| RNF-005 | Prestazioni | Con un numero di punti di prova proposto di 2.000 (RQ-09) la mappa si sposta senza blocchi evidenti (prova manuale descritta in `docs/12_TEST.md`) |
| RNF-006 | Usabilità | Aggiungere un punto richiede al massimo 2 dati obbligatori (posizione e tipo) ed è completabile entro un tempo proposto di 1 minuto (RQ-09) da un utente che non conosce l'app |
| RNF-007 | Usabilità | Dalla mappa ogni funzione principale è raggiungibile con al massimo 2 tocchi |
| RNF-008 | Accessibilità | Informazioni mai affidate al solo colore; testi leggibili con contrasto sufficiente; pulsanti di dimensione minima (proposta: 44×44 px); foto con testo alternativo; interfaccia utilizzabile con lo zoom al 200% |
| RNF-009 | Lingua | Interfaccia in italiano |
| RNF-010 | HTTPS | In produzione l'app è raggiungibile solo in HTTPS |
| RNF-011 | Sicurezza | Rispetta SEC-001 ... SEC-015 |
| RNF-012 | Privacy | La posizione dell'utente usata per orientarsi (pallino sulla mappa, distanze, punti vicini) non viene salvata dall'app né inviata al suo backend; diventa un dato salvato solo quando l'utente la usa per creare un punto e conferma (RF-038, §6) |
| RNF-013 | Gestione errori | Messaggi in italiano, senza codici tecnici, per: rete assente, permesso GPS negato, login errato, salvataggio fallito, servizio mappa non disponibile; mai una pagina bianca |
| RNF-014 | Affidabilità | Se il servizio mappa o il database non rispondono, l'app lo comunica e resta utilizzabile per ciò che è possibile |
| RNF-015 | Licenze | Attribuzioni dei dati cartografici sempre visibili; condizioni d'uso dei servizi rispettate |
| RNF-016 | — | Spostato in §20 come vincolo di progetto V-01 (nessun costo obbligatorio): non descrive un comportamento del software |
| RNF-017 | Manutenzione | Codice e struttura del database salvati nel repository; documentazione aggiornata a ogni fase; nomi e struttura concordati tra i due studenti |
| RNF-018 | Comprensibilità | Ogni parte del codice è spiegabile da entrambi gli studenti |

---

## 15. Compatibilità: dispositivi e browser da testare

| Sistema | Dispositivo | Browser | Stato |
| ------- | ----------- | ------- | ----- |
| macOS | MacBook Air Intel dello Studente A (modello e versione macOS DV) | Safari, Chrome, Firefox | Disponibile |
| iOS | iPhone dello Studente A (modello e versione iOS DV) | Safari (+ installazione, se prevista da D02) | Disponibile |
| Windows | Computer dello Studente B? | Chrome, Edge, Firefox | **Da confermare** |
| Linux | Nessun dispositivo noto | Chrome o Firefox | **Da confermare** (es. computer della scuola) |
| Android | Telefono dello Studente B? | Chrome (+ installazione, se prevista da D02) | **Da confermare** |

La scelta dei browser presuppone un'app utilizzabile tramite browser, come nella proposta D02: se la Fase 2 sceglierà diversamente, questa tabella andrà aggiornata.

Il simulatore di dimensioni dello schermo del browser serve per il layout, ma **non sostituisce** la prova su un telefono reale (GPS, fotocamera, installazione).

---

## 16. Criteri di accettazione

Una funzione è **completata** quando tutti i suoi criteri sono verificati, il risultato è registrato in `docs/12_TEST.md` (da creare) e la documentazione è aggiornata.

| ID | Funzione | Completata quando... |
| -- | -------- | -------------------- |
| CA-01 | Apertura e mappa | Aprendo l'app su iPhone, Android e un computer compare la mappa della Valle d'Aosta senza login; si sposta e si ingrandisce con dita, mouse e pulsanti; l'attribuzione è visibile |
| CA-02 | Punti sulla mappa | Tutti i punti di prova (proposto: almeno 10, che coprano tutti i tipi e tutti i valori di potabilità e stato) compaiono nella posizione corretta; guardando la mappa in scala di grigi si distinguono tutti i valori di potabilità decisi in RQ-01 |
| CA-03 | Dettaglio | Toccando ogni punto di prova compaiono i suoi dati corretti e l'avviso sulla potabilità; un campo vuoto non mostra errori |
| CA-04 | GPS | Se il permesso non è disponibile, toccando "La mia posizione" viene richiesto; concedendolo l'utente vede la propria posizione; negandolo vede un messaggio e continua a usare la mappa; con GPS spento o senza risposta entro il tempo massimo (RQ-09) vede un messaggio; usando la posizione solo per orientarsi, nessuna posizione compare nei dati salvati né nelle richieste inviate al backend (verificato osservando le richieste di rete e i dati salvati; controllo documentato) |
| CA-05 | Registrazione | Con email valida e password della lunghezza minima (SEC-012) l'account viene creato; con email già usata, email non valida o password corta compare un messaggio; nei dati conservati non compare la password in chiaro. Il comportamento sulla conferma email si verifica solo dopo la decisione RQ-03 |
| CA-06 | Login / logout | Con dati corretti si entra; con dati errati compare un messaggio; chiudendo e riaprendo l'app mentre la sessione è valida si è ancora collegati; dopo il logout o a sessione scaduta l'app chiede di nuovo il login e "Aggiungi punto" non è disponibile |
| CA-07 | Aggiunta punto | Un utente collegato crea un punto con solo posizione e tipo e lo vede sulla mappa; il punto compare anche su un altro dispositivo dopo aver ricaricato la mappa; posizione fuori area, tipo mancante e testi troppo lunghi vengono rifiutati con messaggio; senza rete compare un messaggio e i dati del modulo restano; senza la conferma esplicita (RF-038) il punto non viene inviato |
| CA-08 | Permessi e privacy | Un visitatore non riesce a salvare un punto; un utente non riesce a modificare o eliminare il punto di un altro; un visitatore non riesce a leggere email né autori dei contenuti; tutto provato anche chiamando direttamente il servizio (test documentato) |
| CA-09 | Pagina Informazioni | Raggiungibile da ogni schermata; contiene tutte le voci di RF-071; ogni dato elencato in §7 (email, password, sessione, contenuti, posizione, foto, dati tecnici) è menzionato (verifica con lista di controllo) |
| CA-10 | Modifica/eliminazione (P1) | L'autore modifica e elimina i propri punti; le modifiche sono visibili a tutti; l'eliminazione chiede conferma |
| CA-11 | Punti vicini (P1) | Con posizione nota l'elenco mostra solo i punti entro il raggio scelto, ordinati per distanza; per almeno 3 punti la distanza indicata differisce di non più di una tolleranza proposta (5%, RQ-09) da quella misurata con uno strumento di misura su una mappa |
| CA-12 | Filtri (P1) | Con ogni filtro attivo compaiono solo i punti corrispondenti; togliendolo ricompaiono tutti |
| CA-13 | Installazione (P1) | Su un telefono Android e su un iPhone l'app viene aggiunta alla schermata principale con la procedura prevista dalla tecnologia scelta (D02), si apre dall'icona con il proprio nome e le funzioni MVP superano CA-01 ... CA-09 anche così |
| CA-14 | Foto (P1) | Una foto scattata dal telefono e una scelta dalla galleria vengono caricate, ridotte sotto il peso massimo (RQ-09); il file salvato non contiene metadati di posizione né del dispositivo (controllato con uno strumento di lettura dei metadati); prima del caricamento l'utente vede che la foto sarà pubblica; solo chi l'ha caricata può eliminarla |
| CA-15 | Verifiche (P1) | Dopo una verifica il punto mostra stato ed esito aggiornati e la data con la precisione decisa in RQ-13; una verifica oltre il limite (RQ-09) viene rifiutata. Il caso "non funziona" dipende da RQ-02 |
| CA-16 | Segnalazioni (P2) | La segnalazione viene salvata con motivo e data; non cambia i dati del punto; l'autore del punto la vede senza sapere chi l'ha inviata e la chiude. Dipende da RQ-02 |
| CA-17 | Offline (P1, solo se approvata l'opzione B, D21) | Dopo un primo utilizzo con rete, senza rete l'app si apre e mostra "Sei offline" invece di una pagina di errore |

---

## 17. Tabella MVP / futuro

| ID | Funzione | MVP | Futuro | Priorità | Criterio di accettazione |
| -- | -------- | --- | ------ | -------- | ------------------------ |
| RF-001/002/003 | Apertura e mappa | ✔ | | MVP | CA-01 |
| RF-004 | Punti sulla mappa | ✔ | | MVP | CA-02 |
| RF-005/006 | Dettaglio + avviso potabilità | ✔ | | MVP | CA-03 |
| RF-010/011 | Posizione GPS | ✔ | | MVP | CA-04 |
| RF-020 | Registrazione | ✔ | | MVP | CA-05 |
| RF-021 | Conferma email | DA DECIDERE (RQ-03) | | DA DECIDERE | CA-05 (dopo RQ-03) |
| RF-022/023/024 | Login, logout, sessione | ✔ | | MVP | CA-06 |
| RF-030/031/032/033/038 | Aggiunta e salvataggio punto con conferma | ✔ | | MVP | CA-07 |
| RF-036 | Permessi sui punti | ✔ | | MVP | CA-08 |
| RF-071 | Pagina Informazioni | ✔ | | MVP | CA-09 |
| RF-034/035 | Modifica/eliminazione propri punti | | ✔ | P1 | CA-10 |
| RF-012/013 | Distanza e punti vicini | | ✔ | P1 | CA-11 |
| RF-060/061 | Filtri potabilità e tipo | | ✔ | P1 | CA-12 |
| RF-070 | Apertura da icona (installazione) | | ✔ | P1 | CA-13 |
| — | Cache minima interfaccia (offline B, se approvata: D21) | | ✔ | P1 | CA-17 |
| RF-040...043 | Una foto per punto | | ✔ | P1 | CA-14 |
| RF-050/051/007 | Verifiche (dipende da RQ-02) | | ✔ | P1 | CA-15 |
| RF-025 | Recupero password | | ✔ | P1 | Email ricevuta e nuova password funzionante |
| RF-052/053 | Segnalazioni (dipende da RQ-02) | | ✔ | P2 | CA-16 |
| RF-026/027 | Profilo, eliminazione account | | ✔ | P2 | Da definire |
| RF-062/063 | Filtro stato, ricerca per nome | | ✔ | P2 | Da definire |
| RF-037 | Avviso doppioni | | ✔ | P2 | Da definire |
| — | Campi bottiglia, accesso, carrozzina, stagionalità, fonte potabilità | | ✔ | P1-P2 | Da definire |
| RF-044/064/072/073 | Più foto, ricerca località, amministratore, francese | | ✔ | P3 | Da definire |

---

## 18. Decisioni di requisito ancora aperte

Le proposte **non** sono approvate: ogni RQ resta DA DECIDERE finché gli studenti (e, dove indicato, il docente) non la confermano.

| ID | Domanda | Proposta (non approvata) |
| -- | ------- | -------- |
| RQ-01 | Modello "acqua potabile" (§5.3; decisione tecnica collegata D13): valori, valore predefinito, etichette | A nell'MVP, C in P2 |
| RQ-02 | "Non funziona" è verifica o segnalazione? (§9) | Verifica con esito negativo |
| RQ-03 | Conferma email obbligatoria? (RF-021) | Nessuna proposta vincolante: dipende dalla possibilità di inviare email (DV, Fase 2) e dalle risposte del docente |
| RQ-04 | MVP in due tappe (§4.2)? | Sì |
| RQ-05 | Amministratore nell'MVP? (§3.3) | No, salvo richiesta del docente |
| RQ-06 | Autore visibile pubblicamente? | No nell'MVP; nome visualizzato facoltativo da P2 |
| RQ-07 | Coordinate esatte dell'area valida (§5.4) | Da fissare nella fase Database |
| RQ-08 | Elenco dei tipi (§1) | 5 tipi proposti |
| RQ-09 | Tutti i valori numerici provvisori: timeout GPS 15 s; soglia di precisione 50 m; raggi 500 m / 1 km / 5 km; foto 1600 px e 1 MB; max 3 foto (P3); doppioni 20 m; caricamento 5 s; 2.000 punti di prova; almeno 10 punti di prova; 1 minuto per aggiungere un punto; 2 tocchi; 360 px; 44×44 px; password 8 caratteri; testi 80/500/200/500 caratteri; 1 verifica al giorno; tolleranza distanze 5% | Da confermare o correggere dopo le prime prove |
| RQ-10 | Se un utente elimina l'account, i suoi punti vengono eliminati o restano senza autore? | Da decidere (dipende anche da §7.7) |
| RQ-11 | Il nome visualizzato serve davvero? | Solo se si decide di mostrare l'autore (RQ-06); altrimenti eliminarlo |
| RQ-12 | Conservazione interna dell'autore delle verifiche: sempre, per un periodo limitato, o no? | Da decidere |
| RQ-13 | Precisione con cui vengono **mostrate pubblicamente** le date (creazione, ultima modifica, verifiche): data e ora, solo giorno, o forma relativa ("3 giorni fa")? L'ora esatta, insieme all'autore, può rivelare quando una persona era in un luogo | Da decidere (collegata a RQ-06 e RQ-12) |

---

## 19. Decisioni che richiedono risposta del docente

1. Una PWA è accettata come "app" per il progetto?
2. Supabase (servizio esterno per account, dati e foto) è accettato?
3. È richiesta la pubblicazione online con utenti reali, o basta una dimostrazione?
4. Il repository può essere pubblico? (Cambia le opzioni di pubblicazione gratuite.)
5. Quali regole della scuola valgono per account, email e fotografie? In particolare (dettaglio in §7.7): informativa privacy; consenso o altra base giuridica; età minima degli utenti; autorizzazioni per account, servizi esterni e pubblicazione dei contenuti; gestione delle richieste sui dati personali; durata di conservazione dei dati dopo l'esame.
6. La scadenza di aprile 2027 è confermata?
7. È necessario un sistema amministratore / di moderazione? Le foto devono essere controllate prima della pubblicazione?
8. Alcuni servizi esterni hanno un'età minima per chi crea l'account o accetta i termini (es. un provider di mappe richiede 18 anni): chi deve creare gli account e accettare i termini (studenti, docente, scuola)?

---

## 20. Vincoli

- Due studenti principianti, su computer diversi, con due conversazioni Claude separate.
- Studente A: MacBook Air Intel (modello e macOS DV), iPhone (versione iOS DV).
- Studente B: computer e telefono **da confermare**.
- **V-01 (ex RNF-016) — Costo**: nessun costo obbligatorio per sviluppare, pubblicare e usare l'app. Un'eventuale eccezione va decisa e documentata.
- Scadenza: aprile 2027 (riferita, da confermare).
- Licenze e policy dei dati cartografici da rispettare.
- Tecnologie soggette ad approvazione del docente.

### Regole organizzative del progetto

- **ORG-01 (ex SEC-016)**: gli sviluppatori accedono ai dati degli utenti solo per gestione e correzioni, e annotano ogni intervento nel diario. È una regola di lavoro, non un requisito del software.

## 21. Rischi principali

| Rischio | Effetto | Contromisura proposta |
| ------- | ------- | --------------------- |
| Il docente non accetta la direzione tecnica proposta | Architettura da rivedere | Domande §19 subito |
| Dati "potabile" sbagliati | Rischio per la salute | Valore predefinito prudente, avviso fisso (§5.3) |
| Contenuti inappropriati (foto, testi) | Problemi con la scuola | Foto dopo l'MVP; moderazione da definire (§8, §19) |
| MVP troppo grande | Nessuna versione funzionante in tempo | MVP ridotto; proposta di due tappe (§4.2, RQ-04) |
| Se si adotta la PWA (D02): su iPhone installazione manuale e dati separati da Safari | Utenti confusi | Istruzioni nella pagina Informazioni; prova pratica |
| GPS non provabile sul telefono durante lo sviluppo senza HTTPS | Test impossibili | Soluzione da trovare (D12) |
| Mancanza di dispositivi Windows, Linux o Android per i test | Compatibilità non verificata | Conferma dispositivi Studente B; computer della scuola |
| Servizi gratuiti che si fermano o vanno in pausa | App non funzionante all'esame | Controllo la settimana prima dell'esame |
| Conflitti Git tra i due studenti | Lavoro perso | Rami separati, commit piccoli, pull frequenti |

## 22. Fasi di sviluppo

Elenco delle istruzioni del progetto (D17):

0 Analisi · 1 Requisiti · 2 Tecnologie · 3 Architettura · 4 Git/GitHub · 5 Creazione progetto · 6 Database · 7 Backend · 8 Autenticazione · 9 Mappa · 10 Visualizzazione punti · 11 Aggiunta punti · 12 GPS · 13 Immagini · 14 Segnalazioni/verifiche · 15 Profilo · 16 Test · 17 Sicurezza e rifinitura · 18 Documentazione finale · 19 Preparazione esposizione

Nota: parte della Fase 4 (repository Git, primo commit, push di `main`) è già stata svolta in anticipo.

**Fase corrente**: FASE 1 - Requisiti. Documento completo, in attesa di conferma degli studenti e delle risposte del docente.

## 23. Cosa dobbiamo sapere spiegare (per ora)

- Differenza tra requisito funzionale ("cosa fa") e non funzionale ("come deve comportarsi": velocità, sicurezza, ...).
- Differenza tra requisito e decisione tecnica.
- Cos'è un MVP e perché lo abbiamo tenuto piccolo.
- Perché la posizione dell'utente non viene salvata.
- Perché il campo "acqua potabile" ha un valore predefinito prudente.
- Differenza tra verifica e segnalazione.
- Cos'è un criterio di accettazione.

### Domande possibili del professore
- "Perché un visitatore può vedere i punti senza registrarsi, ma non aggiungerli?"
- "Cosa succede se un utente segna come potabile un'acqua che non lo è?"
- "Dove finisce la posizione GPS dell'utente?"
- "Come fate a sapere che una funzione è finita?"

Guida completa all'esame: `docs/14_PREPARAZIONE_ESAME.md` (non ancora creato).
