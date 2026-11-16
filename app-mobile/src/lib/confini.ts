import { CONFINE_VDA } from '@/data/confine-vda';

// Confine della Valle d'Aosta (ISTAT, semplificato a circa 100 m: vedi src/data/confine-vda.ts).
// Non è il confine esatto: entro circa 100 m dalla linea il risultato può differire da quello ufficiale.
// Il rettangolo serve solo per scartare subito i punti lontani (stessi numeri di database/09_confini_valle_d_aosta.sql).
const LAT_MIN = 45.46;
const LAT_MAX = 45.99;
const LON_MIN = 6.8;
const LON_MAX = 7.95;

// Punto dentro il poligono (metodo del raggio: si contano gli incroci con i lati). Coordinate [lon, lat].
function dentroPoligono(lat: number, lon: number, poligono: [number, number][]): boolean {
  let dentro = false;
  for (let i = 0, j = poligono.length - 1; i < poligono.length; j = i++) {
    const [xi, yi] = poligono[i];
    const [xj, yj] = poligono[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      dentro = !dentro;
    }
  }
  return dentro;
}

export function dentroValleDAosta(lat: number, lon: number): boolean {
  if (lat < LAT_MIN || lat > LAT_MAX || lon < LON_MIN || lon > LON_MAX) return false;
  return dentroPoligono(lat, lon, CONFINE_VDA);
}
