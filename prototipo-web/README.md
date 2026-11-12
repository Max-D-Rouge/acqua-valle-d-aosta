# Prototipo web (PWA) - Acqua VdA

Prototipo della mappa dei punti acqua, realizzato come piano B della D24 (PWA). Nessuna build e nessun `npm install`: MapLibre è già copiato in `vendor/`.
Le mappe (OpenFreeMap/OpenStreetMap) e il rilievo (AWS Terrain Tiles) si caricano da internet; la policy OSM non permette il download massivo dei tile (D26).

## Funzioni (campi e regole da `docs/01_PROGETTO.md`)
- Mappa 3D chiara con rilievo e pulsante 2D/3D; marker con simbolo di potabilità (💧 / 🚫 / ❓, non solo il colore, RF-004).
- Elenco **a tendina** con dettaglio a fisarmonica: tutti i campi (tipo, nome, potabilità, stato, descrizione, bottiglia, accesso, carrozzina, stagionalità, foto, date), avviso sulla potabilità (RF-006), distanza.
- Ricerca per nome/descrizione, filtri rapidi (potabili, bottiglia, funzionanti), filtro per tipo e raggio 500 m / 1 km / 5 km.
- **Visitatore**: vede mappa, elenco e dettagli. **Con account**: aggiunge punti, risponde "C'è ancora acqua? Sì/No" (lo stato cambia dopo 3 risposte uguali, RQ-14), segnala problemi, **modifica ed elimina solo i propri punti** (RF-034/035/036).
- Aggiunta con conferma di visibilità pubblica (RF-038), avviso doppione entro 20 m (RF-037), controlli su lunghezze e area valida (RF-031), foto ridimensionata e privata dei metadati.
- Account di prova: vedi `ACCOUNT_PROVA.md`.

## Avvio
```bash
cd prototipo-web
python3 -m http.server 8000   # poi apri http://localhost:8000
node test.mjs                 # test della logica
```
Se non vedi le modifiche, ricarica forzando (Cmd+Shift+R): c'è un service worker.

## Limiti noti
- Dati di esempio con coordinate approssimate. Nessun server: punti, verifiche e segnalazioni restano nel browser.
- Account simulati (password in chiaro nel codice): solo per provare i flussi.
- La "modalità prova" (Info) toglie il limite di 1 verifica al giorno per punto, così si prova la regola delle 3 risposte.
- Potabilità: implementata la proposta A di RQ-01 (decisione ancora aperta).
