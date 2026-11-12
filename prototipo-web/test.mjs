import assert from "node:assert/strict";
import { distanzaMetri, ordina, filtra, formatDistanza, validaPunto, statoEffettivo, puoVerificare, vicinoEsistente } from "./geo.js";
import { PUNTI_INIZIALI } from "./data.js";

const aosta = { lat: 45.737, lon: 7.32 };
assert.equal(Math.round(distanzaMetri(aosta, aosta)), 0);
const d = distanzaMetri(aosta, { lat: 45.7969, lon: 6.9689 });
assert.ok(d > 27000 && d < 33000, `distanza inattesa ${d}`);
assert.equal(ordina(PUNTI_INIZIALI, aosta)[0].comune, "Aosta");
assert.equal(filtra(PUNTI_INIZIALI, { tipo: "sorgente" }).length, 2);
assert.equal(filtra(PUNTI_INIZIALI, { testo: "cogne" }).length, 1);
assert.ok(filtra(PUNTI_INIZIALI, { soloPotabili: true }).every((p) => p.potabile === "potabile"));
assert.ok(filtra(PUNTI_INIZIALI, { raggio: 1000, pos: aosta }).length === 2);
assert.equal(formatDistanza(420), "420 m");
assert.equal(formatDistanza(1500), "1.5 km");
// regola delle 3 risposte
const r = (...e) => e.map((esito) => ({ esito, ts: "2026-10-01T10:00:00Z" }));
assert.equal(statoEffettivo("non_verificato", r("si", "si")), "non_verificato");
assert.equal(statoEffettivo("non_verificato", r("si", "si", "si")), "funzionante");
assert.equal(statoEffettivo("funzionante", r("no", "no", "no")), "non_funzionante");
assert.equal(statoEffettivo("funzionante", r("no", "si", "no")), "funzionante");
assert.equal(puoVerificare([{ esito: "si", ts: new Date().toISOString() }], new Date(), true), false);
assert.equal(puoVerificare([{ esito: "si", ts: new Date().toISOString() }], new Date(), false), true);
// validazione
const ok = { tipo: "fontana", nome: "x", potabile: "non_verificato", stato: "non_verificato", lat: 45.7, lon: 7.3 };
assert.deepEqual(validaPunto(ok), []);
assert.ok(validaPunto({ ...ok, tipo: "boh" }).length);
assert.ok(validaPunto({ ...ok, lat: 48 }).length);
assert.ok(validaPunto({ ...ok, descrizione: "a".repeat(501) }).length);
assert.ok(validaPunto({ ...ok, nome: "a".repeat(81) }).length);
assert.ok(vicinoEsistente(PUNTI_INIZIALI, { lat: 45.73701, lon: 7.32001 }));
assert.equal(vicinoEsistente(PUNTI_INIZIALI, { lat: 45.70, lon: 7.20 }), null);
console.log("Tutti i test passati");
