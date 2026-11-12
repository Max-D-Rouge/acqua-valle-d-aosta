import { PUNTI_INIZIALI, ACCOUNT_PROVA, PUNTI_UTENTE_PROVA } from "./data.js";
import * as L from "./labels.js";
import { filtra, ordina, formatDistanza, validaPunto, statoEffettivo, puoVerificare, titolo, vicinoEsistente } from "./geo.js";

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const K = { punti: "acquavda.punti", ris: "acquavda.risposte", segn: "acquavda.segnalazioni", utente: "acquavda.utente", demo: "acquavda.demo", seed: "acquavda.seed", sat: "acquavda.satellite" };
const leggi = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const scrivi = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } };

let locali = leggi(K.punti, []);
let risposte = leggi(K.ris, {});      // id -> [{esito, ts}]
let segnalazioni = leggi(K.segn, []);
let utente = leggi(K.utente, null);   // {email}
let demo = leggi(K.demo, true);
if (!leggi(K.seed, false)) { locali = [...locali, ...PUNTI_UTENTE_PROVA]; scrivi(K.punti, locali); scrivi(K.seed, true); }
if (utente && !ACCOUNT_PROVA.some((a) => a.email === utente.email)) { utente = null; scrivi(K.utente, null); }
let spostaId = null, modificaId = null;
let pos = null, selId = null, tipoF = "", raggioF = 0, nuovo = null, modoAdd = false, in3D = true;
const F = { soloPotabili: false, soloBottiglia: false, soloFunzionanti: false };

const tutti = () => [...PUNTI_INIZIALI, ...locali].map((p) => ({ ...p, statoEffettivo: statoEffettivo(p.stato, risposte[p.id] || []) }));
const data = (iso) => iso ? new Date(iso).toLocaleDateString("it-IT") : "";

function toast(msg) {
  const t = $("toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2800);
}

/* ---------- mappa 3D ---------- */
maplibregl.setWorkerUrl("vendor/maplibre-gl-csp-worker.js");
const map = new maplibregl.Map({
  container: "mappa", style: "https://tiles.openfreemap.org/styles/liberty",
  center: [7.4, 45.6], zoom: 9.2, pitch: 58, bearing: -15, maxPitch: 80,
  maxBounds: [[5.8, 44.9], [8.9, 46.6]],
});
window.mappa3d = map;
map.on("error", (e) => console.warn("Errore mappa:", e.error?.message || e));
map.addControl(new maplibregl.ScaleControl({ maxWidth: 90 }), "bottom-left");
map.on("load", () => {
  map.addSource("dem", { type: "raster-dem", tiles: ["https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"], encoding: "terrarium", tileSize: 256, maxzoom: 14, attribution: "Terrain: Mapzen/AWS" });
  map.addSource("dem2", { type: "raster-dem", tiles: ["https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"], encoding: "terrarium", tileSize: 256, maxzoom: 14 });
  const primoSimbolo = map.getStyle().layers.find((l) => l.type === "symbol")?.id;
  map.addLayer({ id: "ombre", type: "hillshade", source: "dem2", paint: { "hillshade-exaggeration": 0.3, "hillshade-shadow-color": "#4b6b7a" } }, primoSimbolo);
  map.addSource("sat", { type: "raster", tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"], tileSize: 256, maxzoom: 18, attribution: "Immagini: Esri, Maxar, Earthstar Geographics" });
  map.addLayer({ id: "satellite", type: "raster", source: "sat", layout: { visibility: "none" } }, primoSimbolo);
  if (in3D) map.setTerrain({ source: "dem", exaggeration: 1.4 });
  creaLivelli(); impostaSat(leggi(K.sat, false)); disegna();
});

// Punti, "io" e nuovo punto sono livelli disegnati nella mappa (non elementi HTML): restano agganciati al terreno in 3D.
// Ogni punto ha un'icona disegnata in base al TIPO (fontana, fontanella, ...); il bordo colorato e il simbolo
// piccolo indicano la potabilità (simbolo + colore, non solo colore: RF-004).
const COL_POT = { potabile: "#0ea5e9", non_potabile: "#dc2626", non_verificato: "#94a3b8" };
// Disegni in un riquadro 24x24, scritti come tracciati SVG: il canvas li disegna con Path2D.
const DISEGNI = {
  fontana: [
    { d: "M5 3h3.5v13H5z", f: "#8b5a2b" }, { d: "M8.5 5.4h5v1.7h-5z", f: "#64748b" },
    { d: "M13.6 6.3c2 .3 3 2.6 3.2 6.4", s: "#0ea5e9", w: 1.7 },
    { d: "M2 12.5h20l-1.6 6.4a1.6 1.6 0 0 1-1.5 1.1H5.1a1.6 1.6 0 0 1-1.5-1.1z", f: "#7a4a24" },
    { d: "M3 12.5h18v1.5H3z", f: "#38bdf8" }, { d: "M4 16.5h16", s: "#5a3418", w: .8 },
  ],
  fontanella: [
    { d: "M7.5 6a3 2 0 0 1 6 0z", f: "#14532d" }, { d: "M8.2 6h4.6v13H8.2z", f: "#166534" },
    { d: "M12.8 8.6h3.2", s: "#14532d", w: 1.8 }, { d: "M16 9c1.7.5 2.3 3.2 2.3 7", s: "#0ea5e9", w: 1.6 },
    { d: "M15.6 16.6h5.4v1.6h-5.4z", f: "#64748b" }, { d: "M6 19h9v2.2H6z", f: "#14532d" },
  ],
  sorgente: [
    { d: "M1.5 19l4-8.5 3.6 2 3.2-5.5 5.2 6.2 5 5.8z", f: "#78716c" }, { d: "M12.3 7l-1.6 4 2.6-.8z", f: "#a8a29e" },
    { d: "M12 11.5c0 3.2 1 5.4 2.8 8.3", s: "#0ea5e9", w: 1.9 },
    { d: "M9.5 20.3a5 1.5 0 1 0 10 0a5 1.5 0 1 0-10 0z", f: "#38bdf8" },
  ],
  punto_struttura: [
    { d: "M3.5 11.5 12 4.8l8.5 6.7V21h-17z", f: "#b45309" },
    { d: "M1.6 11.6 12 3.3l10.4 8.3-1.3 1.6L12 6 2.9 13.2z", f: "#7c2d12" },
    { d: "M12 10.5s-3 3.5-3 5.5a3 3 0 0 0 6 0c0-2-3-5.5-3-5.5z", f: "#38bdf8" },
  ],
  altro: [{ d: "M12 3S6 10.5 6 14.5a6 6 0 0 0 12 0C18 10.5 12 3 12 3z", f: "#0ea5e9" }],
};
function immagineIcona(tipo, pot, off) {
  const R = 2, w = 48, h = 56, c = document.createElement("canvas"); c.width = w * R; c.height = h * R;
  const x = c.getContext("2d"); x.scale(R, R);
  // fondo: cerchio bianco con punta in basso (la punta indica la posizione esatta)
  x.beginPath(); x.arc(24, 22, 19, Math.PI * 0.62, Math.PI * 2.38); x.lineTo(24, 51); x.closePath();
  x.shadowColor = "rgba(15,40,60,.4)"; x.shadowBlur = 6; x.shadowOffsetY = 2; x.fillStyle = "#fff"; x.fill();
  x.shadowColor = "transparent"; x.lineWidth = 3.5; x.strokeStyle = COL_POT[pot]; x.stroke();
  // disegno del tipo
  x.save(); if (off) x.globalAlpha = 0.45;
  x.translate(24 - 12 * 1.15, 22 - 12 * 1.15); x.scale(1.15, 1.15);
  for (const el of DISEGNI[tipo] || DISEGNI.altro) {
    const path = new Path2D(el.d);
    if (el.f) { x.fillStyle = el.f; x.fill(path); }
    if (el.s) { x.strokeStyle = el.s; x.lineWidth = el.w; x.lineCap = "round"; x.stroke(path); }
  }
  x.restore();
  // simbolo di potabilità in alto a destra
  x.beginPath(); x.arc(39, 8, 7.5, 0, 7); x.fillStyle = "#fff"; x.fill(); x.lineWidth = 2; x.strokeStyle = COL_POT[pot]; x.stroke();
  x.font = "9px system-ui, 'Apple Color Emoji', 'Segoe UI Emoji'"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillStyle = "#000"; x.fillText(L.GLIFO_POT[pot], 39, 8.5);
  if (off) { x.beginPath(); x.arc(9, 8, 7, 0, 7); x.fillStyle = "#b91c1c"; x.fill(); x.strokeStyle = "#fff"; x.lineWidth = 1.5; x.stroke(); x.fillStyle = "#fff"; x.font = "bold 8px system-ui"; x.fillText("✖", 9, 8.5); }
  return x.getImageData(0, 0, w * R, h * R);
}
const nomeIcona = (tipo, pot, off) => `ico-${DISEGNI[tipo] ? tipo : "altro"}-${pot}${off ? "-off" : ""}`;
const vuoto = { type: "FeatureCollection", features: [] };
function creaLivelli() {
  for (const tipo of Object.keys(DISEGNI)) for (const pot of Object.keys(COL_POT)) for (const off of [false, true])
    map.addImage(nomeIcona(tipo, pot, off), immagineIcona(tipo, pot, off), { pixelRatio: 2 });
  // cluster: da lontano i punti vicini si raggruppano in un cerchio con il numero di punti.
  // Il cerchio è più grande dove ci sono più punti; oltre lo zoom 13 si vedono i singoli punti.
  map.addSource("punti", { type: "geojson", data: vuoto, cluster: true, clusterRadius: 55, clusterMaxZoom: 13 });
  map.addSource("nuovo", { type: "geojson", data: vuoto });
  map.addSource("io", { type: "geojson", data: vuoto });
  const pin = { "icon-anchor": "bottom", "icon-allow-overlap": true, "icon-ignore-placement": true, "icon-pitch-alignment": "viewport", "icon-rotation-alignment": "viewport" };
  const raggio = (base) => ["step", ["get", "point_count"], base, 3, base + 6, 6, base + 12, 12, base + 20];
  const cerchio = { "circle-pitch-alignment": "viewport", "circle-pitch-scale": "viewport" };
  map.addLayer({ id: "gruppi-alone", type: "circle", source: "punti", filter: ["has", "point_count"], paint: { ...cerchio, "circle-radius": raggio(24), "circle-color": "#38bdf8", "circle-opacity": 0.3 } });
  map.addLayer({ id: "gruppi", type: "circle", source: "punti", filter: ["has", "point_count"], paint: { ...cerchio, "circle-radius": raggio(16), "circle-color": ["step", ["get", "point_count"], "#0284c7", 6, "#1e4e7c", 12, "#18395a"], "circle-stroke-color": "#fff", "circle-stroke-width": 3 } });
  // il numero del gruppo è un'immagine disegnata dall'app (non un testo con i font del server della mappa):
  // così si vede anche offline e un font mancante non fa sparire i gruppi.
  map.addLayer({ id: "gruppi-num", type: "symbol", source: "punti", filter: ["has", "point_count"], layout: { "icon-image": ["concat", "num-", ["to-string", ["get", "point_count"]]], "icon-allow-overlap": true, "icon-ignore-placement": true, "icon-pitch-alignment": "viewport" } });
  map.on("styleimagemissing", (e) => {
    if (!e.id.startsWith("num-") || map.hasImage(e.id)) return;
    const n = e.id.slice(4), R = 2, c = document.createElement("canvas"); c.width = c.height = 48 * R;
    const x = c.getContext("2d"); x.scale(R, R);
    x.font = `bold ${n.length > 2 ? 14 : 17}px system-ui, sans-serif`; x.fillStyle = "#fff"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(n, 24, 25);
    map.addImage(e.id, x.getImageData(0, 0, 48 * R, 48 * R), { pixelRatio: R });
  });
  map.addLayer({ id: "punti", type: "symbol", source: "punti", filter: ["!", ["has", "point_count"]], layout: { ...pin, "icon-image": ["get", "img"], "icon-size": ["case", ["get", "sel"], 1.3, 1], "symbol-sort-key": ["case", ["get", "sel"], 1, 0] } });
  map.addLayer({ id: "nuovo", type: "symbol", source: "nuovo", layout: { ...pin, "icon-image": nomeIcona("altro", "non_verificato", false) } });
  map.addLayer({ id: "io", type: "circle", source: "io", paint: { "circle-radius": 8, "circle-color": "#ef4444", "circle-stroke-color": "#fff", "circle-stroke-width": 3, "circle-pitch-alignment": "viewport" } });
  map.on("click", "punti", (e) => { if (modoAdd) return; e.originalEvent.cancelBubble = true; scegli(e.features[0].properties.id, false); });
  // clic su un gruppo: zoom fino al livello in cui il gruppo si divide
  map.on("click", "gruppi", async (e) => {
    if (modoAdd) return;
    const g = e.features[0];
    const z = await map.getSource("punti").getClusterExpansionZoom(g.properties.cluster_id);
    map.easeTo({ center: g.geometry.coordinates, zoom: z + 0.3, duration: 800 });
  });
  for (const id of ["punti", "gruppi"]) {
    map.on("mouseenter", id, () => { map.getCanvas().style.cursor = "pointer"; });
    map.on("mouseleave", id, () => { map.getCanvas().style.cursor = ""; });
  }
}
const puntoGeo = (lon, lat, props = {}) => ({ type: "Feature", properties: props, geometry: { type: "Point", coordinates: [lon, lat] } });
const imposta = (src, feats) => map.getSource(src)?.setData({ type: "FeatureCollection", features: feats });

function disegna() {
  let punti = filtra(tutti(), { ...F, tipo: tipoF, testo: $("cerca").value, raggio: raggioF, pos });
  punti = ordina(punti, pos);
  imposta("punti", punti.map((p) => puntoGeo(p.lon, p.lat, { id: p.id, sel: p.id === selId, img: nomeIcona(p.tipo, p.potabile, p.statoEffettivo === "non_funzionante") })));
  $("conta").textContent = `${punti.length} ${punti.length === 1 ? "punto" : "punti"}`;
  $("ordine").textContent = pos ? "Ordinati per distanza da te" : "Ordinati per nome (attiva la posizione per la distanza)";
  $("lista").innerHTML = punti.length ? punti.map(riga).join("") : '<li class="vuoto">Nessun punto trovato 💧</li>';
}

function riga(p) {
  const r = risposte[p.id] || [];
  const ultima = r[r.length - 1];
  const tag = (t, c = "") => `<span class="tag ${c}">${esc(t)}</span>`;
  const potC = { potabile: "ok", non_potabile: "bad", non_verificato: "" }[p.potabile];
  const stC = { funzionante: "ok", non_funzionante: "bad", non_verificato: "" }[p.statoEffettivo];
  const tags = [tag(L.POTABILE[p.potabile], potC), tag(L.STATO[p.statoEffettivo], stC)];
  if (p.bottiglia === "si") tags.push(tag("🍼 Bottiglia"));
  if (p.accesso !== "non_so") tags.push(tag(L.ACCESSO[p.accesso]));
  if (p.carrozzina !== "non_so") tags.push(tag("♿ " + L.SINO[p.carrozzina]));
  if (p.stagionalita !== "non_so") tags.push(tag(L.STAGIONE[p.stagionalita]));
  const ultimi = r.slice(-3).map((x) => (x.esito === "si" ? "✔" : "✖")).join(" ");
  return `<li class="item ${p.id === selId ? "sel" : ""}" data-id="${p.id}">
    <button class="row" data-act="apri"><div class="ico">${L.EMOJI_TIPO[p.tipo]}</div>
      <div class="info"><b>${esc(titolo(p))}</b><small>${esc(p.comune || L.TIPI[p.tipo])}</small></div>
      ${p.distanza != null ? `<div class="dist">${formatDistanza(p.distanza)}</div>` : ""}<span class="caret">▾</span></button>
    <div class="det">
      <div class="tags">${tags.join("")}</div>
      ${p.descrizione ? `<p>${esc(p.descrizione)}</p>` : ""}
      ${p.stagionalitaNota ? `<p class="muted">Stagionalità: ${esc(p.stagionalitaNota)}</p>` : ""}
      ${p.foto ? `<img src="${p.foto}" alt="Foto del punto">` : ""}
      <p class="avviso">⚠ ${L.AVVISO}</p>
      <div class="ver"><span>C'è ancora acqua?</span>
        <button class="mini si" data-act="si">Sì</button><button class="mini no" data-act="no">No</button>
        ${ultimi ? `<small class="muted">ultime: ${ultimi}</small>` : ""}</div>
      <p class="muted">${ultima ? `Ultima verifica: ${data(ultima.ts)} (${ultima.esito === "si" ? "c'è acqua" : "non c'è acqua"}) · ` : ""}Aggiunto il ${data(p.creato)}${p.esempio ? " · dato di esempio" : ""}</p>
      <div class="azioni"><a class="mini" target="_blank" rel="noopener" href="https://www.openstreetmap.org/directions?to=${p.lat},${p.lon}">🧭 Indicazioni</a>
        <button class="mini" data-act="segnala">🚩 Segnala</button>
        ${utente && p.autore === utente.email ? '<button class="mini" data-act="modifica">✏ Modifica</button><button class="mini no" data-act="elimina">🗑 Elimina</button>' : ""}</div>
    </div></li>`;
}

function scegli(id, vola = true) {
  selId = id;
  const p = tutti().find((x) => x.id === id);
  if (vola && p) map.flyTo({ center: [p.lon, p.lat], zoom: Math.max(map.getZoom(), 14.5), duration: 1200, pitch: in3D ? 62 : 0 });
  else if (p) map.easeTo({ center: [p.lon, p.lat], duration: 600 });
  apriPanel(true); disegna();
  document.querySelector(".item.sel")?.scrollIntoView({ block: "nearest", behavior: "smooth" });
}
function apriPanel(on) {
  $("panel").classList.toggle("open", on);
  $("apriLista").setAttribute("aria-expanded", on);
}

$("apriLista").onclick = () => apriPanel(!$("panel").classList.contains("open"));
$("lista").addEventListener("click", (e) => {
  const li = e.target.closest(".item"); if (!li) return;
  const id = li.dataset.id, act = e.target.closest("[data-act]")?.dataset.act;
  if (act === "apri") { if (selId === id) { selId = null; disegna(); } else scegli(id); }
  else if (act === "si" || act === "no") verifica(id, act);
  else if (act === "segnala") apriSegnalazione(id);
  else if (act === "modifica") { const p = locali.find((x) => x.id === id); if (p && p.autore === utente?.email) apriForm({ lat: p.lat, lon: p.lon }, p); }
  else if (act === "elimina") eliminaPunto(id);
});
$("cerca").addEventListener("input", () => { disegna(); if ($("cerca").value) apriPanel(true); });
$("chips").addEventListener("click", (e) => {
  const b = e.target.closest("[data-f]"); if (!b) return;
  F[b.dataset.f] = !F[b.dataset.f]; b.setAttribute("aria-pressed", F[b.dataset.f]); disegna();
});

/* ---------- verifica Sì/No (RQ-14) ---------- */
function verifica(id, esito) {
  if (!utente) { toast("Accedi per rispondere"); return apriAccount(); }
  const r = risposte[id] || [];
  if (!puoVerificare(r, new Date(), !demo)) return toast("Hai già risposto oggi per questo punto");
  const prima = statoEffettivo("x", r);
  risposte[id] = [...r, { esito, ts: new Date().toISOString() }];
  scrivi(K.ris, risposte);
  const dopo = statoEffettivo("x", risposte[id]);
  const n = Math.min(3, risposte[id].length);
  toast(dopo !== "x" && dopo !== prima ? `Stato aggiornato: ${L.STATO[dopo].toLowerCase()}` : `Grazie! Risposte utili registrate: ${n}/3 (lo stato cambia dopo 3 uguali)`);
  disegna();
}

/* ---------- segnalazioni (P2) ---------- */
let segnId = null;
function apriSegnalazione(id) {
  if (!utente) return toast("Accedi per segnalare un problema"), apriAccount();
  segnId = id; $("segnPunto").textContent = titolo(tutti().find((p) => p.id === id));
  $("formSegn").reset(); $("dlgSegn").showModal();
}
$("invSegn").onclick = () => {
  const d = new FormData($("formSegn"));
  const aperte = segnalazioni.filter((s) => s.id === segnId && s.autore === utente.email && s.stato === "aperta");
  if (aperte.length) return toast("Hai già una segnalazione aperta per questo punto");
  segnalazioni.push({ id: segnId, motivo: d.get("motivo"), descrizione: d.get("descrizione"), autore: utente.email, ts: new Date().toISOString(), stato: "aperta" });
  scrivi(K.segn, segnalazioni); toast("Segnalazione inviata (l'autore del punto non saprà chi sei)");
};

/* ---------- posizione ---------- */
function posizione(volaci = true, dopo) {
  if (!navigator.geolocation) return toast("Geolocalizzazione non disponibile");
  toast("Cerco la tua posizione…");
  navigator.geolocation.getCurrentPosition((r) => {
    pos = { lat: r.coords.latitude, lon: r.coords.longitude };
    imposta("io", [puntoGeo(pos.lon, pos.lat)]);
    if (volaci) map.flyTo({ center: [pos.lon, pos.lat], zoom: 14.5, duration: 1200 });
    disegna(); dopo?.();
  }, () => toast("Posizione non disponibile o permesso negato: la mappa resta utilizzabile"), { timeout: 15000 });
}
$("vicino").onclick = () => posizione();

/* ---------- satellite ---------- */
let inSat = false;
function impostaSat(on) {
  inSat = on; scrivi(K.sat, on); $("btnSat").classList.toggle("on", on);
  if (!map.getLayer("satellite")) return;
  map.setLayoutProperty("satellite", "visibility", on ? "visible" : "none");
  map.setLayoutProperty("ombre", "visibility", on ? "none" : "visible");
}
$("btnSat").onclick = () => impostaSat(!inSat);

/* ---------- 2D / 3D ---------- */
$("btn3d").classList.add("on");
$("btn3d").onclick = () => {
  in3D = !in3D; $("btn3d").classList.toggle("on", in3D); $("btn3d").firstChild.textContent = in3D ? "3D" : "2D";
  if (!map.getSource("dem")) return;
  map.setTerrain(in3D ? { source: "dem", exaggeration: 1.4 } : null);
  map.easeTo({ pitch: in3D ? 60 : 0, bearing: in3D ? map.getBearing() : 0, duration: 900 });
};
$("nord").onclick = () => map.easeTo({ bearing: 0, duration: 600 });

/* ---------- aggiunta punto (RF-030, 031, 037, 038) ---------- */
const riempi = (sel, ob, vuoto) => { sel.innerHTML = Object.entries(ob).map(([k, v]) => `<option value="${k}">${v}</option>`).join(""); if (vuoto) sel.value = vuoto; };
const f = $("formAdd").elements;
riempi(f.tipo, L.TIPI, "fontana"); riempi(f.potabile, L.POTABILE, "non_verificato"); riempi(f.stato, L.STATO, "non_verificato");
riempi(f.bottiglia, L.SINO, "non_so"); riempi(f.accesso, L.ACCESSO, "non_so"); riempi(f.carrozzina, L.SINO, "non_so"); riempi(f.stagionalita, L.STAGIONE, "non_so");
riempi($("formFiltri").elements.tipo, L.TIPI); $("formFiltri").elements.tipo.insertAdjacentHTML("afterbegin", '<option value="">Tutti</option>'); $("formFiltri").elements.tipo.value = "";
riempi($("formSegn").elements.motivo, L.MOTIVI);

function modoAggiungi(on) { modoAdd = on; $("banner").hidden = !on; document.body.classList.toggle("adding", on); }
$("aggiungi").onclick = () => {
  if (!utente) { toast("Per aggiungere un punto serve un account"); return apriAccount(); }
  nuovo = null; modoAggiungi(true); apriPanel(false);
};
$("annullaAdd").onclick = () => { spostaId = null; modoAggiungi(false); };
const sceltaPos = (c) => { modoAggiungi(false); const p = spostaId ? locali.find((x) => x.id === spostaId) : null; spostaId = null; apriForm(c, p); };
$("usaPos").onclick = () => posizione(true, () => sceltaPos({ lat: +pos.lat.toFixed(6), lon: +pos.lon.toFixed(6) }));
map.on("click", (e) => { if (modoAdd) sceltaPos({ lat: +e.lngLat.lat.toFixed(6), lon: +e.lngLat.lng.toFixed(6) }); });
$("spostaBtn").onclick = () => { spostaId = modificaId; $("dlgAdd").close(); modoAggiungi(true); toast("Tocca la nuova posizione"); };
function apriForm(c, p = null) {
  nuovo = c; modificaId = p?.id ?? null; $("formAdd").reset(); $("errAdd").textContent = "";
  const v = { tipo: "fontana", potabile: "non_verificato", stato: "non_verificato", bottiglia: "non_so", accesso: "non_so", carrozzina: "non_so", stagionalita: "non_so", ...(p || {}) };
  for (const k of ["tipo", "nome", "comune", "potabile", "stato", "descrizione", "bottiglia", "accesso", "carrozzina", "stagionalita", "stagionalitaNota"]) f[k].value = v[k] ?? "";
  $("titoloAdd").textContent = p ? "Modifica punto" : "Nuovo punto acqua"; $("spostaBtn").hidden = !p;
  imposta("nuovo", [puntoGeo(c.lon, c.lat)]);
  const doppio = vicinoEsistente(tutti(), c);
  $("coord").textContent = `📍 ${c.lat}, ${c.lon}` + (doppio ? ` · ⚠ a meno di 20 m da "${titolo(doppio)}": possibile doppione` : "");
  $("dlgAdd").showModal();
}
$("dlgAdd").addEventListener("close", () => imposta("nuovo", []));

function riduci(file) { // ridimensiona e ricodifica: i metadati del file originale (GPS, data) non vengono copiati
  return new Promise((ok, ko) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const s = Math.min(1, 640 / Math.max(img.width, img.height)), c = document.createElement("canvas");
      c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url); ok(c.toDataURL("image/jpeg", 0.7));
    };
    img.onerror = () => ko(new Error("Immagine non valida")); img.src = url;
  });
}
$("formAdd").addEventListener("submit", async (ev) => {
  if (ev.submitter?.id !== "salvaAdd") return;
  ev.preventDefault();
  const d = new FormData($("formAdd"));
  if (!utente) return;
  const vecchio = modificaId ? locali.find((x) => x.id === modificaId) : null;
  if (modificaId && (!vecchio || vecchio.autore !== utente.email)) { $("errAdd").textContent = "Non puoi modificare questo punto"; return; }
  const p = vecchio ? { ...vecchio, ...nuovo, modificato: new Date().toISOString() } : { id: "l" + Date.now(), ...nuovo, autore: utente.email, creato: new Date().toISOString() };
  for (const k of ["tipo", "nome", "comune", "potabile", "stato", "descrizione", "bottiglia", "accesso", "carrozzina", "stagionalita", "stagionalitaNota"]) p[k] = d.get(k) ?? "";
  const err = nuovo ? validaPunto(p) : ["Posizione non scelta"];
  if (err.length) { $("errAdd").textContent = err.join(". "); return; }
  const file = d.get("foto");
  if (file && file.size) { try { p.foto = await riduci(file); } catch { $("errAdd").textContent = "Foto non valida"; return; } }
  const nuovaLista = vecchio ? locali.map((x) => (x.id === p.id ? p : x)) : [...locali, p];
  if (!scrivi(K.punti, nuovaLista)) { $("errAdd").textContent = "Salvataggio non riuscito (spazio pieno?). I dati inseriti restano nel modulo."; return; }
  locali = nuovaLista; $("dlgAdd").close(); selId = p.id; apriPanel(true); disegna(); toast(vecchio ? "Punto modificato ✔" : "Punto aggiunto ✔");
});

function eliminaPunto(id) {
  const p = locali.find((x) => x.id === id);
  if (!p || p.autore !== utente?.email) return toast("Puoi eliminare solo i tuoi punti");
  if (!confirm(`Eliminare "${titolo(p)}"? L'operazione non si può annullare.`)) return;
  locali = locali.filter((x) => x.id !== id); scrivi(K.punti, locali); selId = null; disegna(); toast("Punto eliminato");
}

/* ---------- filtri ---------- */
$("apriFiltri").onclick = () => $("dlgFiltri").showModal();
$("formFiltri").addEventListener("submit", (ev) => {
  const e = $("formFiltri").elements;
  if (ev.submitter?.id === "resetF") { tipoF = ""; raggioF = 0; e.tipo.value = ""; e.raggio.value = "0"; }
  else { tipoF = e.tipo.value; raggioF = +e.raggio.value; if (raggioF && !pos) { posizione(false); toast("Attivo la posizione per usare il raggio"); } }
  disegna();
});

/* ---------- account simulato ---------- */
function apriAccount() {
  $("accLogin").hidden = !!utente; $("accLoggato").hidden = !utente;
  $("accTitolo").textContent = utente ? "Il tuo account" : "Accedi o registrati";
  $("accOk").textContent = utente ? "Esci" : "Entra";
  if (utente) { $("accEmail").textContent = utente.email; $("miei").textContent = locali.filter((p) => p.autore === utente.email).length; }
  $("errAcc").textContent = ""; $("dlgAcc").showModal();
}
$("accountBtn").onclick = apriAccount;
$("formAcc").addEventListener("submit", (ev) => {
  if (ev.submitter?.id !== "accOk") return;
  if (utente) { utente = null; scrivi(K.utente, null); $("accountBtn").classList.remove("on"); toast("Uscito dall'account"); disegna(); return; }
  const e = $("formAcc").elements;
  const acc = ACCOUNT_PROVA.find((a) => a.email === e.email.value.trim().toLowerCase() && a.pw === e.pw.value);
  if (!acc) { ev.preventDefault(); $("errAcc").textContent = "Email o password errate"; return; }
  utente = { email: acc.email }; scrivi(K.utente, utente); e.pw.value = ""; $("accountBtn").classList.add("on"); disegna(); toast("Accesso effettuato");
});
if (utente) $("accountBtn").classList.add("on");

/* ---------- info ---------- */
$("avvisoInfo").textContent = "⚠ " + L.AVVISO;
$("infoBtn").onclick = () => { $("demo").checked = demo; $("dlgInfo").showModal(); };
$("demo").onchange = () => { demo = $("demo").checked; scrivi(K.demo, demo); };
$("cancellaDati").onclick = () => {
  if (!confirm("Cancellare punti aggiunti, verifiche e segnalazioni salvati su questo dispositivo?")) return;
  Object.values(K).forEach((k) => { try { localStorage.removeItem(k); } catch {} }); location.reload();
};

disegna();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
