# Changelog

Nessuna versione rilasciata. Il progetto dell'app esiste in `app-mobile/` (creato il 2026-10-23, ramo `dev-studente-A`; provato solo su iPhone con Expo Go, non su Android né su Windows). Il prototipo web non rilasciato è descritto nella sezione sotto.

La prima versione (0.1.0) verrà registrata quando il progetto dell'app sarà creato e verificato (Fase 5). Nota 2026-10-23: lo Studente A ha indicato Expo al posto di Flutter (D28 in `DECISIONI_TECNICHE.md`, approvata dallo Studente A il 2026-10-26; conferma di Mayo non registrata; D24 superata, D03 riaperta). Un progetto Expo è stato creato in `app-mobile/`.

## [Non rilasciato] - app Expo (`app-mobile/`, ramo `dev-studente-A`)

### Aggiunto (2026-11-06 / 2026-11-09)
- Accesso, registrazione e uscita con email e password tramite Supabase Auth; la sessione resta salvata sul telefono (schermata Profilo, sostituisce la demo "Explore").
- Menu a ventaglio in basso a sinistra con le azioni "Dove sono" e "Aggiungi punto".
- Aggiunta punto: si tocca la mappa per scegliere la posizione e si compila il modulo (tipo, nome, potabile, funzionamento, bottiglia, accesso, carrozzina, stagionalità, descrizione). Script `database/02_punti_scrittura.sql` e `database/03_campi_punto.sql`.

### Corretto
- Errore `window is not defined` all'avvio di `expo start` (rendering sul server).
- Testi illeggibili nel Profilo con l'iPhone in modo scuro.

### Verificato (riferito da Max, iPhone con Expo Go, 2026-11-09)
- Mappa e punti da Supabase, "Dove sono", registrazione, login, sessione dopo la chiusura, logout, tema scuro, salvataggio di un nuovo punto visibile su Supabase.

### Problemi conosciuti
- Non provato su Android né su Windows; la mappa non funziona nel browser (WebView).
- `tsc` non completato dopo le ultime modifiche (2 errori precedenti in `mappa.tsx` e `app-tabs.web.tsx`).
- Non verificati: salvataggio di tutti i campi del modulo, controllo "punto dentro la Valle d'Aosta" (non ancora scritto), nome utente pubblico (D29).
- 11 vulnerabilità segnalate da `npm audit` (dipendenze di sviluppo); non corrette di proposito.

## [Non rilasciato] - prototipo web

### Aggiunto (2026-10-07)
- Gruppi di punti (clustering): da lontano i punti vicini diventano un cerchio con il numero; più punti = cerchio più grande; clic = zoom.
- Icone disegnate per tipo di punto (fontana, fontanella, sorgente, punto in una struttura, altro), con simbolo di potabilità e ✖ se non funzionante.

### Modificato
- Stile ispirato a HydrantMap: colore principale #18395a, pulsanti quadrati arrotondati, nuova icona dell'app.

### Problemi conosciuti
- Provato con una mappa di base finta: manca la prova sul Mac con la mappa vera.
- Controlli del 12/10/2026 sul Mac di Max (riferiti da Max): `node prototipo-web/test.mjs` superato e `git diff --check` senza output. Non provano il funzionamento della mappa nel browser.

### Aggiunto (2026-11-10 / 2026-11-11, non ancora tutto provato)
- Percorso verso un punto con tre modi: a piedi, in auto (OpenRouteService), mezzi (apre l'app mappe del telefono).
- Navigazione passo passo con GPS attivo solo durante la guida, ricalcolo se si esce dal percorso, avviso di arrivo.
- Avviso arancione se il percorso a piedi usa strade statali (riconoscimento ancora da verificare, vedi PS-003).
- Pulsante "Satellite" nel ventaglio (EOX Sentinel-2 cloudless, risoluzione circa 10 m); ventaglio più grande.
- Strumento `strumenti/mappa_sentieri.py` per disegnare in SVG i sentieri OSM di una zona.
- Problema conosciuto: il percorso a piedi può ancora passare sulla statale (PS-003).

### Aggiunto (2026-11-12, non ancora tutto provato)
- Foto dei punti: scatto con la fotocamera (solo entro 50 m dal punto), miniature, ingrandimento, eliminazione delle proprie; foto obbligatoria quando si aggiunge un punto.
- "Come si raggiunge": nuova scelta "Strada e sentiero".
- Satellite più nitido (ortofoto AGEA sopra Sentinel-2), rilievo 3D, pulsanti sotto lo zoom.
- Luoghi della mappa toccabili (negozi, ristoranti, rifugi...) con scheda, percorso e "Più informazioni".

## Aggiunto (2026-11-12, sera) - da provare
- Segnalazione di una foto (3 motivi), con `database/13_segnalazioni_foto.sql`.
- Pagina Informazioni: privacy su percorsi, luoghi, foto, mappa; crediti satellite, 3D, percorsi.
- `docs/08_GPS.md`.
