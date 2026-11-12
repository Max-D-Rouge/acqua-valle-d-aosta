// Calcoli geometrici per la navigazione. Le coordinate sono nel formato [longitudine, latitudine].
// Su distanze di poche centinaia di metri trattiamo la Terra come "piatta" (proiezione locale): è precisa abbastanza.

export type Coord = [number, number];

const METRI_PER_GRADO = 111320;

function inMetri(p: Coord, origine: Coord): [number, number] {
  const fattoreLon = Math.cos((origine[1] * Math.PI) / 180);
  return [(p[0] - origine[0]) * METRI_PER_GRADO * fattoreLon, (p[1] - origine[1]) * METRI_PER_GRADO];
}

// Distanza in metri tra due punti.
export function distanzaM(a: Coord, b: Coord): number {
  const [x, y] = inMetri(b, a);
  return Math.hypot(x, y);
}

export type PostoSulPercorso = {
  // Quanto sei lontano dalla linea del percorso.
  distanzaDalPercorsoM: number;
  // Indice del tratto (coordinate[i] -> coordinate[i+1]) più vicino a te.
  segmento: number;
  // Dove sei dentro quel tratto: 0 = all'inizio, 1 = alla fine.
  t: number;
};

// Trova il punto del percorso più vicino alla posizione data.
export function postoSulPercorso(p: Coord, coords: Coord[]): PostoSulPercorso {
  let migliore: PostoSulPercorso = { distanzaDalPercorsoM: Infinity, segmento: 0, t: 0 };
  for (let i = 0; i < coords.length - 1; i++) {
    const [bx, by] = inMetri(coords[i + 1], coords[i]);
    const [px, py] = inMetri(p, coords[i]);
    const lunghezza2 = bx * bx + by * by;
    const t = lunghezza2 === 0 ? 0 : Math.max(0, Math.min(1, (px * bx + py * by) / lunghezza2));
    const d = Math.hypot(px - t * bx, py - t * by);
    if (d < migliore.distanzaDalPercorsoM) migliore = { distanzaDalPercorsoM: d, segmento: i, t };
  }
  return migliore;
}

// Metri di percorso che restano da fare da dove sei fino al vertice numero "indice".
export function metriFinoAlVertice(coords: Coord[], posto: PostoSulPercorso, indice: number): number {
  if (indice <= posto.segmento) return 0;
  let totale = (1 - posto.t) * distanzaM(coords[posto.segmento], coords[posto.segmento + 1]);
  for (let i = posto.segmento + 1; i < indice; i++) totale += distanzaM(coords[i], coords[i + 1]);
  return totale;
}
