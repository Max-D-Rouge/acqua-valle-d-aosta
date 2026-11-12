// DATI DI ESEMPIO con coordinate approssimate: da verificare sul posto.
const base = { descrizione: "", bottiglia: "non_so", accesso: "non_so", carrozzina: "non_so", stagionalita: "non_so", stato: "non_verificato", potabile: "non_verificato", esempio: true };
const P = (id, nome, comune, tipo, lat, lon, extra = {}) => ({ ...base, id, nome, comune, tipo, lat, lon, creato: "2026-09-20", ...extra });
export const PUNTI_INIZIALI = [
  P("e1", "Fontana Piazza Chanoux", "Aosta", "fontana", 45.7370, 7.3200, { potabile: "potabile", stato: "funzionante", bottiglia: "si", carrozzina: "si", stagionalita: "tutto_anno", accesso: "strada", descrizione: "Nella piazza centrale, vicino al municipio." }),
  P("e2", "Fontana Arco d'Augusto", "Aosta", "fontana", 45.7355, 7.3225, { potabile: "potabile", stato: "funzionante", accesso: "strada", carrozzina: "si" }),
  P("e3", "Fontana del centro", "Courmayeur", "fontana", 45.7969, 6.9689, { potabile: "potabile", bottiglia: "si", accesso: "strada" }),
  P("e4", "Fontana del paese", "Cogne", "fontana", 45.6086, 7.3560, { potabile: "potabile", stato: "funzionante", stagionalita: "stagionale" }),
  P("e5", "Fontanella Cervinia", "Valtournenche", "fontanella", 45.9370, 7.6310, { potabile: "potabile", bottiglia: "si", stagionalita: "stagionale", descrizione: "Vicino agli impianti di risalita." }),
  P("e6", "Sorgente sul sentiero", "Gressoney-Saint-Jean", "sorgente", 45.7750, 7.8240, { accesso: "sentiero", stagionalita: "stagionale", descrizione: "Acqua di sorgente: non indicata come potabile." }),
  P("e7", "Fontana del centro", "Saint-Vincent", "fontana", 45.7500, 7.6500, { potabile: "potabile", stato: "non_funzionante" }),
  P("e8", "Fontana lungo la strada", "Pont-Saint-Martin", "fontana", 45.5970, 7.7960, { potabile: "non_potabile", descrizione: "Cartello \"acqua non potabile\"." }),
  P("e9", "Fontanella del rifugio", "Valsavarenche", "punto_struttura", 45.5977, 7.2330, { potabile: "potabile", bottiglia: "si", accesso: "sentiero", stagionalita: "stagionale" }),
  P("e10", "Fontana vicino al castello", "Bard", "fontana", 45.6035, 7.7458, { potabile: "potabile", carrozzina: "no" }),
  P("e11", "Fontana in piazza", "Morgex", "fontana", 45.7573, 7.0383, { potabile: "potabile", stato: "funzionante", bottiglia: "si" }),
  P("e12", "Sorgente (esempio)", "La Thuile", "sorgente", 45.7131, 6.9505, { accesso: "sentiero", stagionalita: "stagionale" }),
  P("e13", "Fontana del paese", "Etroubles", "fontana", 45.8197, 7.2158, { potabile: "potabile", bottiglia: "si", stagionalita: "tutto_anno" }),
  P("e14", "Fontana Châtillon", "Châtillon", "fontana", 45.7468, 7.6150, { potabile: "non_verificato" }),
];

// ACCOUNT DI PROVA (finti, solo per questo prototipo locale: nessun server, nessuna sicurezza reale).
export const ACCOUNT_PROVA = [
  { email: "prova1@acquavda.test", pw: "3n5s7nttkv" },
  { email: "prova2@acquavda.test", pw: "waqpd4u94j" },
];
// Punti già "scritti" da prova1, per poter provare subito modifica ed eliminazione.
export const PUNTI_UTENTE_PROVA = [
  { ...base, id: "u1", nome: "Fontana di prova (di prova1)", comune: "Aosta", tipo: "fontana", lat: 45.7390, lon: 7.4270, potabile: "potabile", stato: "non_verificato", descrizione: "Punto creato da prova1: solo prova1 può modificarlo.", creato: "2026-10-01T09:00:00.000Z", autore: "prova1@acquavda.test", esempio: false },
  { ...base, id: "u2", nome: "Sorgente di prova (di prova1)", comune: "Cogne", tipo: "sorgente", lat: 45.6150, lon: 7.3700, accesso: "sentiero", creato: "2026-10-02T09:00:00.000Z", autore: "prova1@acquavda.test", esempio: false },
];
