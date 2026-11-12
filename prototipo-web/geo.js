// Funzioni pure (testabili con Node): distanze, filtri, validazione, regola delle 3 verifiche.
import { TIPI, POTABILE, STATO, SINO, ACCESSO, STAGIONE } from "./labels.js";

export function distanzaMetri(a, b) {
  const R = 6371000, rad = (x) => (x * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat), dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function ordina(punti, pos) {
  if (!pos) return [...punti].sort((a, b) => titolo(a).localeCompare(titolo(b), "it"));
  return punti.map((p) => ({ ...p, distanza: distanzaMetri(pos, p) })).sort((x, y) => x.distanza - y.distanza);
}

export const titolo = (p) => p.nome?.trim() || TIPI[p.tipo] || "Punto d'acqua";

// F: {testo, tipo, soloPotabili, soloBottiglia, soloFunzionanti, raggio (m), pos}
export function filtra(punti, F = {}) {
  const t = (F.testo || "").trim().toLowerCase();
  return punti
    .map((p) => (F.pos ? { ...p, distanza: distanzaMetri(F.pos, p) } : p))
    .filter((p) =>
      (!F.tipo || p.tipo === F.tipo) &&
      (!F.soloPotabili || p.potabile === "potabile") &&
      (!F.soloBottiglia || p.bottiglia === "si") &&
      (!F.soloFunzionanti || p.statoEffettivo !== "non_funzionante") &&
      (!F.raggio || !F.pos || p.distanza <= F.raggio) &&
      (!t || `${p.nome || ""} ${p.descrizione || ""} ${p.comune || ""}`.toLowerCase().includes(t)));
}

export function formatDistanza(m) {
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;
}

// RQ-14 (proposta): lo stato cambia solo dopo 3 risposte uguali consecutive (le ultime 3).
export function statoEffettivo(base, risposte = []) {
  const u = risposte.slice(-3).map((r) => r.esito);
  if (u.length === 3 && u.every((e) => e === u[0])) return u[0] === "si" ? "funzionante" : "non_funzionante";
  return base;
}

export function puoVerificare(risposte, adesso = new Date(), limiteGiornaliero = true) {
  if (!limiteGiornaliero || !risposte.length) return true;
  const ultima = new Date(risposte[risposte.length - 1].ts);
  return ultima.toDateString() !== adesso.toDateString();
}

export function validaPunto(p) {
  const e = [];
  if (!(p.tipo in TIPI)) e.push("Tipo non valido");
  if ((p.nome || "").length > 80) e.push("Nome oltre 80 caratteri");
  if ((p.descrizione || "").length > 500) e.push("Descrizione oltre 500 caratteri");
  if ((p.stagionalitaNota || "").length > 200) e.push("Nota oltre 200 caratteri");
  if (!(p.potabile in POTABILE)) e.push("Potabilità non valida");
  if (!(p.stato in STATO)) e.push("Stato non valido");
  for (const [c, v] of [["bottiglia", SINO], ["carrozzina", SINO], ["accesso", ACCESSO], ["stagionalita", STAGIONE]])
    if (p[c] !== undefined && !(p[c] in v)) e.push(`Valore non valido: ${c}`);
  if (!(Number.isFinite(p.lat) && Number.isFinite(p.lon) && p.lat >= 45.4 && p.lat <= 45.99 && p.lon >= 6.7 && p.lon <= 7.95))
    e.push("Posizione fuori dalla Valle d'Aosta");
  return e;
}

// RF-037: avviso di possibile doppione entro `soglia` metri.
export function vicinoEsistente(punti, nuovo, soglia = 20) {
  return punti.find((p) => distanzaMetri(p, nuovo) <= soglia) ?? null;
}
