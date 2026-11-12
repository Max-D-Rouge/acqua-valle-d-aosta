// Rettangolo che contiene la Valle d'Aosta (stessi numeri di database/09_confini_valle_d_aosta.sql).
// Non è il confine esatto: vicino ai bordi qualche punto fuori regione può passare.
const LAT_MIN = 45.46;
const LAT_MAX = 45.99;
const LON_MIN = 6.8;
const LON_MAX = 7.95;

export function dentroValleDAosta(lat: number, lon: number): boolean {
  return lat >= LAT_MIN && lat <= LAT_MAX && lon >= LON_MIN && lon <= LON_MAX;
}
