# 08 - GPS e posizione dell'utente

> Documento di studio. Descrive solo ciò che l'app fa **davvero** (stato al 2026-11-12). Le parti non verificate sono segnate.

## Cos'è
Il GPS è il sistema con cui il telefono calcola dove si trova (latitudine e longitudine). Nell'app lo leggiamo con la libreria `expo-location`.

## Perché serve
1. Mostrare "Dove sono" sulla mappa.
2. Proporre la posizione quando si aggiunge un punto.
3. Calcolare un percorso verso un punto e guidare l'utente (navigazione).
4. Controllare che chi scatta la foto di un punto sia nella sua zona.

## Quando viene richiesta e quali permessi servono
- Solo con l'app aperta ("in uso"): **nessun permesso in background**.
- Il sistema chiede il permesso la prima volta che serve. Il testo mostrato è in `app.json`.
- Se l'utente **nega** il permesso: la mappa funziona lo stesso, ma "Dove sono", i percorsi, la navigazione e le foto non sono disponibili e l'app mostra un messaggio.

## Cosa succede alla posizione (nel nostro progetto)
| Uso | Dove va la posizione | Salvata? |
|---|---|---|
| Pallino blu / "Dove sono" | resta nel telefono | No |
| Nuovo punto | le coordinate **del punto** (scelte dall'utente) vanno nel database e sono pubbliche | Sì, ma sono quelle del punto, non quelle dell'utente |
| Percorso | la posizione di partenza e la destinazione vanno a OpenRouteService per il calcolo | No, da parte nostra. Il servizio esterno ha le sue regole (da verificare nei suoi termini) |
| Navigazione | posizione letta di continuo (`watchPositionAsync`), tenuta in memoria; riinviata a OpenRouteService solo se si esce dal percorso (soglia 40 m, 2 letture consecutive, almeno 20 s tra un ricalcolo e l'altro) | No |
| Controllo area per la foto | letta una volta sola e confrontata col punto (entro 50 m, precisione ≤ 50 m) | No |
| Più informazioni su un luogo | a Nominatim vanno nome e coordinate **del luogo**, non quelle dell'utente | No |

## Controllo "sei nell'area" per le foto
- Non si può controllare a 1-1,5 m: il GPS sbaglia di 3-10 m e il punto è stato messo toccando la mappa. Per questo l'area è di 50 m.
- È un **deterrente**, non una prova: chi sa falsificare la posizione può aggirarlo. L'abbiamo deciso così (vedi `DECISIONI_TECNICHE.md`).
- Le foto si scattano solo con la fotocamera dell'app (niente galleria).
- NON verificato: se la ricompressione della foto elimina i metadati (EXIF/GPS) del file originale.

## Codice importante
- `src/lib/foto.ts` → `controllaArea`
- `src/hooks/use-navigazione.ts` → lettura continua e uscita dal percorso
- `src/lib/geo.ts` → distanze e distanza da un percorso

## Cosa dobbiamo sapere spiegare
- Che differenza c'è tra latitudine e longitudine, e perché nel codice le coordinate sono `[lon, lat]` (ordine usato da GeoJSON e MapLibre).
- Perché la posizione è un dato sensibile e come la trattiamo.
- Perché l'accuratezza del GPS limita le funzioni (50 m).
- Cosa succede se il permesso è negato.

## Domande possibili
- "Salvate la posizione degli utenti?" → No: resta nel telefono, salvo le coordinate di un punto che l'utente decide di creare.
- "Chi riceve la posizione?" → OpenRouteService, per il percorso. Nominatim riceve solo luoghi.
- "Si può falsificare il controllo della foto?" → Sì, è un deterrente.
- "Funziona in background?" → No, solo con app aperta (ed è segnato come limite: lo schermo può spegnersi durante la navigazione).
