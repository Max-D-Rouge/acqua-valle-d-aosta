# Nota per la chat di Code (prototipo web) - 2026-10-07

La chat Cowork di Max ha modificato `prototipo-web/` mentre questa chat era chiusa. Prima di lavorarci, leggi qui.

## Cosa è cambiato
- `app.js`
  - `immaginePin()` è stata sostituita da `immagineIcona(tipo, pot, off)` + `DISEGNI` (tracciati SVG 24x24 disegnati con Path2D). Le immagini si chiamano `ico-<tipo>-<potabile>[-off]` (funzione `nomeIcona`).
  - Sorgente `punti` con `cluster: true, clusterRadius: 55, clusterMaxZoom: 13`.
  - Nuovi livelli: `gruppi-alone`, `gruppi` (cerchi, raggio a gradini su `point_count`), `gruppi-num` (numero come immagine `num-N` creata in `styleimagemissing`), poi `punti` con filtro `!has point_count`.
  - Clic su `gruppi` → `getClusterExpansionZoom` (Promise, MapLibre 4.7.1) → `easeTo`.
- `style.css`: in fondo, blocco "stile ispirato a HydrantMap" (`--navy:#18395a`, pulsanti quadrati arrotondati).
- `index.html` e `manifest.webmanifest`: theme color #18395a. `icon.svg`: logo nuovo (da `design/loghi/stile_mappa/icona_segnaposto.svg`).
- `sw.js`: cache `acquavda-v8`.

## Perché il numero dei gruppi è un'immagine
Con `text-field` e i font di OpenFreeMap, se i glifi non si scaricano i tile della sorgente raggruppata non vengono caricati e i gruppi spariscono (visto nei test). Disegnarlo come immagine lo rende indipendente dai font.

## Test fatti
- `node test.mjs` OK.
- Chromium automatico con mappa di base sostituita (OpenFreeMap non raggiungibile da quell'ambiente): gruppi, numeri, zoom al clic e icone OK.
- Non provato con la mappa vera in 3D: da fare.

## Registrato in
`DIARIO_SVILUPPO.md` (2026-10-07), `CHANGELOG.md` (Non rilasciato), `DECISIONI_TECNICHE.md` (D27).
