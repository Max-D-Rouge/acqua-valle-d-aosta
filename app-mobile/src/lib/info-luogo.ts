// Informazioni in più su un luogo toccato sulla mappa (orari, telefono, sito), lette da OpenStreetMap con Nominatim.
// Regole d'uso (https://operations.osmfoundation.org/policies/nominatim/): massimo 1 richiesta al secondo,
// User-Agent che identifica l'app, nessuna richiesta in background, risultati in cache.
// Parte SOLO quando l'utente preme "Più informazioni" e manda il nome del luogo e le sue coordinate (non la tua posizione).

export type InfoLuogo = { indirizzo?: string; orari?: string; telefono?: string; sito?: string };

const cache = new Map<string, InfoLuogo | null>();

type Tag = Record<string, string | undefined>;
type Risultato = { extratags?: Tag; address?: Tag };

export async function cercaInfo(nome: string, lat: number, lon: number): Promise<InfoLuogo | null> {
  const chiave = `${nome}|${lat.toFixed(4)},${lon.toFixed(4)}`;
  if (cache.has(chiave)) return cache.get(chiave) ?? null;

  // Cerchiamo per nome in un riquadro di circa 100 m attorno al punto toccato.
  const d = 0.001;
  const url =
    `https://nominatim.openstreetmap.org/search?format=jsonv2&extratags=1&addressdetails=1&limit=1&accept-language=it` +
    `&bounded=1&viewbox=${lon - d},${lat + d},${lon + d},${lat - d}&q=${encodeURIComponent(nome)}`;
  const controllo = new AbortController();
  const scadenza = setTimeout(() => controllo.abort(), 8000);
  try {
    const risposta = await fetch(url, {
      signal: controllo.signal,
      headers: { 'User-Agent': 'AcquaVDA-scuola/0.1 (https://github.com/Max-D-Rouge/acqua-valle-d-aosta)' },
    });
    if (!risposta.ok) return null;
    const r = ((await risposta.json()) as Risultato[])[0];
    if (!r) {
      cache.set(chiave, null);
      return null;
    }
    const t = r.extratags ?? {};
    const a = r.address ?? {};
    // Il sito si apre solo se è un indirizzo web (http/https); il telefono solo con cifre, + e spazi.
    const sito = t.website ?? t['contact:website'];
    const telefono = (t.phone ?? t['contact:phone'])?.replace(/[^0-9+ ]/g, '').trim();
    const via = [a.road, a.house_number].filter(Boolean).join(' ');
    const info: InfoLuogo = {
      indirizzo: via || undefined,
      orari: t.opening_hours,
      telefono: telefono || undefined,
      sito: sito && /^https?:\/\//i.test(sito) ? sito : undefined,
    };
    cache.set(chiave, info);
    return info;
  } catch {
    return null;
  } finally {
    clearTimeout(scadenza);
  }
}
