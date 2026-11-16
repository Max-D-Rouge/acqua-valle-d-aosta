# Icone dei punti d'acqua

Icone da usare sulla mappa al posto dei pallini colorati. Sono 15 file SVG: 5 tipi di punto per 3 stati di potabilità.

Nome dei file: `<tipo>_<potabilita>.svg`, con gli stessi valori usati nel database e in `app-mobile/src/data/punti.ts`:

- tipo: `fontana`, `fontanella`, `sorgente`, `punto_struttura`, `altro`
- potabilità: `potabile`, `non_potabile`, `non_verificato`

## Come sono fatte
- **Segnaposto colorato**: verde = potabile, rosso = non potabile, grigio = non verificato. Sono gli stessi colori di `COLORI` in `app-mobile/src/components/mappa.tsx`.
- **Disegno al centro**: dice il tipo di punto (vasca a tronco, colonnina, sorgente tra le rocce, casetta, goccia).
- **Simbolo in alto a destra** (✓ ✕ ?): ripete la potabilità con una forma, non solo con il colore, così si capisce anche per chi non distingue bene i colori (requisito RF-004). È disegnato in SVG, non è un'emoji, quindi appare uguale su ogni telefono.
- La punta in basso indica la posizione esatta del punto: sulla mappa l'ancora dell'icona va messa in basso (`anchor: 'bottom'` in MapLibre).

Dimensione di partenza: 72 x 84. Sulla mappa vanno bene a circa 30-36 pixel di larghezza.

`anteprima_icone_punti.png` le mostra tutte, in grande e in piccolo.
