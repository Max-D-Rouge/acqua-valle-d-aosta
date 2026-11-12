#!/usr/bin/env python3
"""Disegna in un file SVG (immagine vettoriale) i sentieri e le strade principali di una zona, presi da OpenStreetMap.

Serve per controllare A MANO i dati su cui lavora il calcolo dei percorsi.
Si esegue dal Terminale del tuo Mac (serve internet; non servono librerie da installare):

    python3 strumenti/mappa_sentieri.py                      # zona predefinita: Aosta - Verrès
    python3 strumenti/mappa_sentieri.py --vicino 45.735,7.32 --raggio 2000
    python3 strumenti/mappa_sentieri.py --zona 45.66,7.30,45.76,7.72 --marciapiedi

Poi apri il file creato (mappa_sentieri.svg) con il browser: si può ingrandire senza perdere qualità.
I dati vengono scaricati da Overpass (servizio pubblico di OpenStreetMap): usalo con calma, una richiesta alla volta.
Dati (c) OpenStreetMap contributors, licenza ODbL.
"""
import argparse
import json
import math
import subprocess
import sys
from xml.sax.saxutils import escape

ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
]
# Zona predefinita: sud, ovest, nord, est (da Aosta a Verrès).
ZONA_PREDEFINITA = (45.66, 7.30, 45.76, 7.72)

# tipo di strada OSM -> (nome in legenda, colore, spessore in px, tratteggio)
STILI = {
    "motorway": ("Autostrada (A5)", "#111111", 3.0, None),
    "trunk": ("Statale / superstrada (trunk)", "#d00000", 3.5, None),
    "primary": ("Statale (primary)", "#d00000", 3.5, None),
    "secondary": ("Strada regionale (secondary)", "#e08a00", 2.0, None),
    "tertiary": ("Strada tertiary", "#b0b0b0", 1.5, None),
    "residential": ("Strada residenziale", "#cccccc", 1.0, None),
    "unclassified": ("Strada minore (unclassified)", "#cccccc", 1.0, None),
    "living_street": ("Zona a traffico limitato", "#cccccc", 1.0, None),
    "service": ("Strada di servizio", "#dddddd", 0.8, None),
    "road": ("Strada (road)", "#cccccc", 1.0, None),
    "path": ("Sentiero (path)", "#1b8a3a", 1.6, "6 3"),
    "track": ("Strada sterrata (track)", "#8b5a2b", 1.6, "8 3"),
    "footway": ("Percorso pedonale (footway)", "#1a6fd1", 1.4, None),
    "pedestrian": ("Zona pedonale", "#1a6fd1", 1.4, None),
    "cycleway": ("Ciclabile (cycleway)", "#8e24aa", 1.6, None),
    "bridleway": ("Mulattiera (bridleway)", "#6d4c41", 1.4, "4 3"),
    "steps": ("Scale (steps)", "#666666", 1.4, "2 2"),
}
ORDINE = ["service", "road", "unclassified", "living_street", "residential", "tertiary", "secondary", "track", "bridleway", "steps", "path", "footway", "pedestrian", "cycleway", "motorway", "trunk", "primary"]


def costruisci_query(zona, marciapiedi, strade):
    s, w, n, e = zona
    box = f"({s},{w},{n},{e})"
    sentieri = "path|footway|track|pedestrian|steps|cycleway|bridleway"
    filtro_marc = "" if marciapiedi else '["footway"!~"^(sidewalk|crossing)$"]'
    pezzi = [
        f'way["highway"~"^({sentieri})$"]{filtro_marc}{box};',
        f'way["highway"~"^(motorway|trunk|primary)$"]{box};',
    ]
    if strade:
        pezzi.append(f'way["highway"~"^(secondary|tertiary|residential|unclassified|living_street|service|road)$"]{box};')
    return "[out:json][timeout:180];\n(\n  " + "\n  ".join(pezzi) + "\n);\nout geom;"


def scarica(query):
    # Usiamo "curl" (già presente sul Mac): il Python di sistema a volte non completa la connessione sicura.
    # Se un server non risponde, proviamo il successivo.
    ultimo_errore = ""
    for indirizzo in ENDPOINTS:
        print(f"Provo {indirizzo} ...", file=sys.stderr)
        r = subprocess.run(
            ["curl", "-sS", "--fail", "-m", "240", "-A", "AcquaVDA-progetto-scolastico/1.0",
             "--data-urlencode", "data@-", indirizzo],
            input=query.encode(), capture_output=True,
        )
        if r.returncode == 0 and r.stdout.strip().startswith(b"{"):
            return json.loads(r.stdout)
        ultimo_errore = (r.stderr or r.stdout[:200]).decode(errors="replace").strip()
        print(f"  non ha funzionato: {ultimo_errore}", file=sys.stderr)
    sys.exit("Nessun server Overpass ha risposto. Riprova tra qualche minuto, oppure con una zona più piccola (--vicino).")


def disegna(elementi, zona, larghezza_px, titolo):
    s, w, n, e = zona
    lat0 = (s + n) / 2
    k = math.cos(math.radians(lat0))
    larg_gradi = (e - w) * k
    alt_gradi = n - s
    scala = larghezza_px / larg_gradi
    altezza_px = alt_gradi * scala
    margine = 40

    def proietta(lat, lon):
        return (margine + (lon - w) * k * scala, margine + (n - lat) * scala)

    per_tipo = {}
    conteggio = {}
    for el in elementi:
        if el.get("type") != "way" or "geometry" not in el:
            continue
        tipo = el.get("tags", {}).get("highway")
        if tipo not in STILI:
            continue
        punti = [proietta(p["lat"], p["lon"]) for p in el["geometry"]]
        if len(punti) < 2:
            continue
        per_tipo.setdefault(tipo, []).append((punti, el.get("tags", {}), el.get("id")))
        conteggio[tipo] = conteggio.get(tipo, 0) + 1

    out = []
    tot_w, tot_h = larghezza_px + 2 * margine, altezza_px + 2 * margine + 30 * (len(STILI) // 2 + 3)
    out.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{tot_w:.0f}" height="{tot_h:.0f}" viewBox="0 0 {tot_w:.0f} {tot_h:.0f}" font-family="Helvetica, Arial, sans-serif">')
    out.append(f'<rect width="100%" height="100%" fill="#ffffff"/>')
    out.append(f'<text x="{margine}" y="26" font-size="18" font-weight="bold">{escape(titolo)}</text>')

    # Griglia ogni 0,05 gradi di latitudine/longitudine, con le coordinate scritte (per orientarsi).
    passo = 0.05
    lon = math.ceil(w / passo) * passo
    while lon <= e:
        x, _ = proietta(s, lon)
        out.append(f'<line x1="{x:.1f}" y1="{margine}" x2="{x:.1f}" y2="{margine + altezza_px:.1f}" stroke="#eeeeee" stroke-width="1"/>')
        out.append(f'<text x="{x + 2:.1f}" y="{margine + altezza_px + 14:.1f}" font-size="10" fill="#888">{lon:.2f}</text>')
        lon += passo
    lat = math.ceil(s / passo) * passo
    while lat <= n:
        _, y = proietta(lat, w)
        out.append(f'<line x1="{margine}" y1="{y:.1f}" x2="{margine + larghezza_px:.1f}" y2="{y:.1f}" stroke="#eeeeee" stroke-width="1"/>')
        out.append(f'<text x="2" y="{y - 2:.1f}" font-size="10" fill="#888">{lat:.2f}</text>')
        lat += passo
    out.append(f'<rect x="{margine}" y="{margine}" width="{larghezza_px}" height="{altezza_px:.1f}" fill="none" stroke="#999"/>')

    # Le linee: prima le strade secondarie, poi i sentieri, per ultime le statali (restano ben visibili).
    for tipo in ORDINE:
        if tipo not in per_tipo:
            continue
        nome, colore, spessore, tratteggio = STILI[tipo]
        out.append(f'<g id="{tipo}" fill="none" stroke="{colore}" stroke-width="{spessore}" stroke-linecap="round" stroke-linejoin="round"' + (f' stroke-dasharray="{tratteggio}"' if tratteggio else "") + ">")
        for punti, tags, id_osm in per_tipo[tipo]:
            d = "M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in punti)
            etichetta = tags.get("name") or tags.get("ref") or ""
            out.append(f'<path d="{d}"><title>{escape(str(etichetta))} (way {id_osm}, {tipo})</title></path>')
        out.append("</g>")

    # Sigle delle statali (SS26, SR45...) scritte una volta per strada.
    scritti = set()
    for tipo in ("trunk", "primary", "motorway"):
        for punti, tags, _ in per_tipo.get(tipo, []):
            ref = tags.get("ref")
            if ref and ref not in scritti and len(punti) > 2:
                scritti.add(ref)
                x, y = punti[len(punti) // 2]
                out.append(f'<text x="{x:.1f}" y="{y - 4:.1f}" font-size="12" font-weight="bold" fill="#d00000" stroke="#fff" stroke-width="3" paint-order="stroke">{escape(ref)}</text>')

    # Legenda in fondo.
    y0 = margine + altezza_px + 40
    out.append(f'<text x="{margine}" y="{y0}" font-size="14" font-weight="bold">Legenda (numero di tratti scaricati)</text>')
    for i, tipo in enumerate(t for t in ORDINE if t in per_tipo):
        nome, colore, spessore, tratteggio = STILI[tipo]
        colonna, riga = i % 2, i // 2
        x = margine + colonna * 420
        y = y0 + 24 + riga * 24
        out.append(f'<line x1="{x}" y1="{y - 4}" x2="{x + 50}" y2="{y - 4}" stroke="{colore}" stroke-width="{max(spessore, 2.5)}"' + (f' stroke-dasharray="{tratteggio}"' if tratteggio else "") + "/>")
        out.append(f'<text x="{x + 60}" y="{y}" font-size="13">{escape(nome)}: {conteggio[tipo]}</text>')
    out.append(f'<text x="{margine}" y="{tot_h - 8:.0f}" font-size="11" fill="#666">Dati © OpenStreetMap contributors (ODbL). Passa il mouse su una linea per vedere nome e numero OSM.</text>')
    out.append("</svg>")
    return "\n".join(out), conteggio


def main():
    ap = argparse.ArgumentParser(description="Disegna i sentieri OpenStreetMap di una zona in un file SVG.")
    ap.add_argument("--zona", help="sud,ovest,nord,est in gradi (es. 45.66,7.30,45.76,7.72)")
    ap.add_argument("--vicino", help="lat,lon del centro (alternativa a --zona)")
    ap.add_argument("--raggio", type=float, default=2000, help="raggio in metri con --vicino (predefinito 2000)")
    ap.add_argument("--marciapiedi", action="store_true", help="includi anche i marciapiedi e gli attraversamenti")
    ap.add_argument("--strade", action="store_true", help="includi anche le strade minori (più pesante)")
    ap.add_argument("--larghezza", type=int, default=3000, help="larghezza del disegno in pixel")
    ap.add_argument("--uscita", default="mappa_sentieri.svg")
    ap.add_argument("--da-file", help="usa un file JSON di Overpass già scaricato invece di scaricare (per prove)")
    a = ap.parse_args()

    if a.vicino:
        lat, lon = (float(v) for v in a.vicino.split(","))
        dlat = a.raggio / 111320
        dlon = a.raggio / (111320 * math.cos(math.radians(lat)))
        zona = (lat - dlat, lon - dlon, lat + dlat, lon + dlon)
    elif a.zona:
        zona = tuple(float(v) for v in a.zona.split(","))
    else:
        zona = ZONA_PREDEFINITA

    if a.da_file:
        with open(a.da_file) as f:
            dati = json.load(f)
    else:
        print("Scarico i dati da Overpass (può richiedere un minuto)...", file=sys.stderr)
        dati = scarica(costruisci_query(zona, a.marciapiedi, a.strade))
    if not a.da_file:
        # Teniamo anche i dati grezzi: servono per controllare i collegamenti tra i sentieri.
        with open(a.uscita.replace(".svg", ".json"), "w", encoding="utf-8") as f:
            json.dump(dati, f)
    svg, conteggio = disegna(dati.get("elements", []), zona, a.larghezza, "Sentieri e strade principali (OpenStreetMap)")
    with open(a.uscita, "w", encoding="utf-8") as f:
        f.write(svg)
    print(f"Creato {a.uscita}. Tratti per tipo: {conteggio}")


if __name__ == "__main__":
    main()
