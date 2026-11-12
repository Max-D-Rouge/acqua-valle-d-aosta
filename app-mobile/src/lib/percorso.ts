// Calcola un percorso a piedi con OpenRouteService (dati OpenStreetMap, profilo "foot-hiking" = escursionismo).
// Serve una chiave gratuita (EXPO_PUBLIC_ORS_API_KEY nel file .env). Alla richiesta partono SOLO la posizione di partenza
// e quella di arrivo; non si salva niente. Limiti e condizioni del servizio: D33 in DECISIONI_TECNICHE.md.

import { distanzaM, type Coord } from '@/lib/geo';

export type Mezzo = 'piedi' | 'auto';

export type Punto = { lat: number; lon: number };
// "inizio" = numero del punto della linea in cui comincia questo passo.
export type Passo = { istruzione: string; distanzaM: number; inizio: number };
export type Percorso = {
  // Coordinate nel formato [longitudine, latitudine], come vuole la mappa.
  coordinate: [number, number][];
  distanzaM: number;
  durataS: number;
  passi: Passo[];
  // Metri del percorso che passano su strada statale (tipo di strada "state road" di ORS).
  statale: number;
  mezzo: Mezzo;
};

const CHIAVE = process.env.EXPO_PUBLIC_ORS_API_KEY;

// Quante volte, al massimo, proviamo a rifare il calcolo evitando i tratti su statale (ogni prova = 1 richiesta).
const TENTATIVI_EVITA_STATALE = 3;
// Metà della larghezza (in metri) della zona da evitare attorno a un tratto di statale.
const MARGINE_ZONA_M = 15;

type Esito = { percorso: Percorso; statali: Coord[][] } | { errore: string; fatale: boolean };

// Una richiesta al servizio. "zoneDaEvitare" = rettangoli (GeoJSON) che il percorso non deve attraversare.
async function chiedi(da: Punto, a: Punto, mezzo: Mezzo, zoneDaEvitare: Coord[][]): Promise<Esito> {
  if (!CHIAVE) return { errore: 'Il calcolo del percorso non è configurato (manca la chiave EXPO_PUBLIC_ORS_API_KEY nel file .env).', fatale: true };

  const controllo = new AbortController();
  const scadenza = setTimeout(() => controllo.abort(), 15000);
  try {
    const corpo: Record<string, unknown> = {
      coordinates: [
        [da.lon, da.lat],
        [a.lon, a.lat],
      ],
      language: 'it',
      instructions: true,
      // A piedi: quello "consigliato" dal servizio (preferisce sentieri e strade pedonali). In auto: il più veloce.
      preference: mezzo === 'auto' ? 'fastest' : 'recommended',
      // Chiediamo anche il tipo di strada di ogni tratto (per riconoscere la statale).
      extra_info: ['waytype'],
    };
    if (zoneDaEvitare.length > 0) {
      corpo.options = { avoid_polygons: { type: 'MultiPolygon', coordinates: zoneDaEvitare.map((anello) => [anello]) } };
    }
    const risposta = await fetch(`https://api.openrouteservice.org/v2/directions/${mezzo === 'auto' ? 'driving-car' : 'foot-hiking'}/geojson`, {
      method: 'POST',
      signal: controllo.signal,
      headers: { Authorization: CHIAVE, 'Content-Type': 'application/json', Accept: 'application/geo+json' },
      body: JSON.stringify(corpo),
    });
    if (risposta.status === 401 || risposta.status === 403) return { errore: 'La chiave del servizio dei percorsi non è valida.', fatale: true };
    if (risposta.status === 429) return { errore: 'Troppe richieste al servizio dei percorsi per oggi. Riprova più tardi.', fatale: true };
    if (!risposta.ok) {
      // Messaggio di controllo per noi (compare nel Terminale di Expo): cosa risponde il servizio.
      const testo = await risposta.text().catch(() => '');
      console.log(`[percorso] ERRORE ${risposta.status} (zone da evitare: ${zoneDaEvitare.length}):`, testo.slice(0, 400));
      return { errore: 'Non trovo un percorso tra la tua posizione e questo punto.', fatale: false };
    }

    const dati = (await risposta.json()) as {
      features?: {
        geometry: { coordinates: [number, number][] };
        properties: {
          summary: { distance: number; duration: number };
          // La documentazione scrive "waytype", alcune versioni del servizio rispondono "waytypes": accettiamo entrambi.
          extras?: { waytype?: { values?: [number, number, number][] }; waytypes?: { values?: [number, number, number][] } };
          segments?: { steps?: { instruction: string; distance: number; way_points?: [number, number] }[] }[];
        };
      }[];
    };
    const f = dati.features?.[0];
    if (!f) return { errore: 'Il servizio non ha restituito nessun percorso.', fatale: false };
    const coordinate = f.geometry.coordinates.map((c) => [c[0], c[1]] as Coord);

    // Tipo 1 = "strada statale" secondo ORS (strade primary/trunk di OpenStreetMap). Raccogliamo i tratti.
    const statali: Coord[][] = [];
    let statale = 0;
    for (const [inizio, fine, tipo] of (f.properties.extras?.waytype ?? f.properties.extras?.waytypes)?.values ?? []) {
      if (tipo !== 1) continue;
      const tratto = coordinate.slice(inizio, fine + 1);
      statali.push(tratto);
      for (let i = 0; i < tratto.length - 1; i++) statale += distanzaM(tratto[i], tratto[i + 1]);
    }
    console.log(`[percorso] ok: ${(f.properties.summary.distance / 1000).toFixed(1)} km, statale ${Math.round(statale)} m, tratti statale ${statali.length}, zone da evitare ${zoneDaEvitare.length}, extras: ${Object.keys(f.properties.extras ?? {}).join(',') || 'nessuno'}`);
    return {
      statali,
      percorso: {
        coordinate,
        statale: mezzo === 'piedi' ? statale : 0,
        mezzo,
        distanzaM: f.properties.summary.distance,
        durataS: f.properties.summary.duration,
        passi: (f.properties.segments?.[0]?.steps ?? []).map((s) => ({ istruzione: s.instruction, distanzaM: s.distance, inizio: s.way_points?.[0] ?? 0 })),
      },
    };
  } catch {
    return { errore: 'Non riesco a raggiungere il servizio dei percorsi. Controlla la connessione.', fatale: true };
  } finally {
    clearTimeout(scadenza);
  }
}

// Un rettangolo largo ~30 m attorno al segmento a-b, come anello chiuso [lon, lat].
function rettangolo(a: Coord, b: Coord): Coord[] {
  const [dx, dy] = [(b[0] - a[0]) * Math.cos((a[1] * Math.PI) / 180), b[1] - a[1]];
  const lunghezza = Math.hypot(dx, dy) || 1e-9;
  const margineGradi = MARGINE_ZONA_M / 111320;
  // Vettore perpendicolare al segmento, lungo quanto il margine.
  const nx = (-dy / lunghezza) * margineGradi;
  const ny = (dx / lunghezza) * margineGradi;
  const nxLon = nx / Math.cos((a[1] * Math.PI) / 180);
  return [
    [a[0] + nxLon, a[1] + ny],
    [b[0] + nxLon, b[1] + ny],
    [b[0] - nxLon, b[1] - ny],
    [a[0] - nxLon, a[1] - ny],
    [a[0] + nxLon, a[1] + ny],
  ];
}

// Trasforma i tratti su statale in zone da evitare: un rettangolo ogni ~40 m di strada.
function zoneDaiTratti(tratti: Coord[][]): Coord[][] {
  const zone: Coord[][] = [];
  for (const tratto of tratti) {
    let inizio = tratto[0];
    let fine = tratto[0];
    for (let i = 1; i < tratto.length; i++) {
      fine = tratto[i];
      if (distanzaM(inizio, fine) >= 40 || i === tratto.length - 1) {
        if (distanzaM(inizio, fine) > 1) zone.push(rettangolo(inizio, fine));
        inizio = fine;
      }
    }
  }
  return zone;
}

// Restituisce il percorso oppure un testo che spiega cosa non ha funzionato.
// A piedi: se il percorso passa sulla statale, rifà il calcolo evitando quei tratti (fino a 3 volte)
// e tiene il percorso con meno metri di statale. Se non ne trova uno senza, avvisa (vedi scheda-percorso).
export async function calcolaPercorso(da: Punto, a: Punto, mezzo: Mezzo = 'piedi'): Promise<{ percorso: Percorso } | { errore: string }> {
  let esito = await chiedi(da, a, mezzo, []);
  if ('errore' in esito) return { errore: esito.errore };
  let migliore = esito.percorso;
  if (mezzo === 'piedi') {
    let zone: Coord[][] = [];
    for (let prova = 0; prova < TENTATIVI_EVITA_STATALE && esito.statali.length > 0 && migliore.statale > 30; prova++) {
      zone = zone.concat(zoneDaiTratti(esito.statali));
      const nuovo = await chiedi(da, a, mezzo, zone);
      // Se il servizio non trova un altro percorso, teniamo il migliore trovato finora.
      if ('errore' in nuovo) break;
      esito = nuovo;
      if (nuovo.percorso.statale < migliore.statale) migliore = nuovo.percorso;
    }
  }
  return { percorso: migliore };
}

export function formattaDistanza(m: number): string {
  return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;
}

export function formattaDurata(s: number): string {
  const minuti = Math.max(1, Math.round(s / 60));
  if (minuti < 60) return `${minuti} min`;
  return `${Math.floor(minuti / 60)} h ${minuti % 60} min`;
}
