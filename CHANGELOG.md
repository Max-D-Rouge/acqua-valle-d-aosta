# Changelog

Nessuna versione rilasciata. Il progetto dell'app esiste in `app-mobile/` (creato il 2026-10-23, ramo `dev-studente-A`; provato solo su iPhone con Expo Go, non su Android né su Windows). Il prototipo web non rilasciato è descritto nella sezione sotto.

La prima versione (0.1.0) verrà registrata quando il progetto dell'app sarà creato e verificato (Fase 5). Nota 2026-10-23: lo Studente A ha indicato Expo al posto di Flutter (D28 in `DECISIONI_TECNICHE.md`, approvata dallo Studente A il 2026-10-26; conferma di Mayo non registrata; D24 superata, D03 riaperta). Un progetto Expo è stato creato in `app-mobile/`.

## [Non rilasciato] - prototipo web

### Aggiunto (2026-10-07)
- Gruppi di punti (clustering): da lontano i punti vicini diventano un cerchio con il numero; più punti = cerchio più grande; clic = zoom.
- Icone disegnate per tipo di punto (fontana, fontanella, sorgente, punto in una struttura, altro), con simbolo di potabilità e ✖ se non funzionante.

### Modificato
- Stile ispirato a HydrantMap: colore principale #18395a, pulsanti quadrati arrotondati, nuova icona dell'app.

### Problemi conosciuti
- Provato con una mappa di base finta: manca la prova sul Mac con la mappa vera.
- Controlli del 12/10/2026 sul Mac di Max (riferiti da Max): `node prototipo-web/test.mjs` superato e `git diff --check` senza output. Non provano il funzionamento della mappa nel browser.
