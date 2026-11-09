// Legge comune e frazione dalle coordinate con Nominatim (il servizio di OpenStreetMap).
// Regole d'uso (https://operations.osmfoundation.org/policies/nominatim/): massimo 1 richiesta al secondo,
// User-Agent che identifica l'app, niente richieste in background, risultati messi in cache.
// Viene chiamata UNA volta quando l'utente sceglie dove aggiungere un punto; si mandano solo le coordinate di quel punto.

export type Luogo = { comune: string; frazione: string };

const cache = new Map<string, Luogo | null>();

type Indirizzo = Record<string, string | undefined>;

// Nominatim restituisce nomi diversi a seconda di come è mappato il posto:
// il comune può essere "municipality", "city", "town" o "village"; la frazione "hamlet", "suburb" o "neighbourhood".
function scegliLuogo(a: Indirizzo): Luogo {
  const comune = a.municipality ?? a.city ?? a.town ?? a.village ?? '';
  const frazione = a.hamlet ?? a.suburb ?? a.neighbourhood ?? a.quarter ?? (a.village && a.village !== comune ? a.village : '') ?? '';
  return { comune, frazione: frazione === comune ? '' : frazione };
}

export async function cercaLuogo(lat: number, lon: number): Promise<Luogo | null> {
  // Coordinate arrotondate (circa 10 m): lo stesso posto non viene cercato due volte.
  const chiave = `${lat.toFixed(4)},${lon.toFixed(4)}`;
  if (cache.has(chiave)) return cache.get(chiave) ?? null;

  const controllo = new AbortController();
  const scadenza = setTimeout(() => controllo.abort(), 6000);
  try {
    const risposta = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&zoom=18&accept-language=it&lat=${lat}&lon=${lon}`,
      {
        signal: controllo.signal,
        headers: { 'User-Agent': 'AcquaVDA-scuola/0.1 (https://github.com/Max-D-Rouge/acqua-valle-d-aosta)' },
      }
    );
    if (!risposta.ok) return null;
    const dati = (await risposta.json()) as { address?: Indirizzo };
    const luogo = dati.address ? scegliLuogo(dati.address) : null;
    cache.set(chiave, luogo);
    return luogo;
  } catch {
    // Rete assente o troppo lenta: l'utente scrive a mano comune e frazione.
    return null;
  } finally {
    clearTimeout(scadenza);
  }
}
