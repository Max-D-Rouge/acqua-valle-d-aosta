#!/usr/bin/env python3
"""Misura quanti marciapiedi sono segnati in OpenStreetMap lungo le strade statali della Valle d'Aosta (decisione D36).

Serve per capire SE possiamo fidarci dei dati prima di costruire "a piedi sulla statale solo dove c'è il marciapiede".
Si esegue dal Terminale del tuo Mac (serve internet; non servono librerie da installare):

    python3 strumenti/marciapiedi_statali.py

Crea due file nella cartella da cui lanci il comando:
  - marciapiedi_statali.svg   immagine da aprire nel browser: ogni tratto di statale è colorato in base ai dati
  - marciapiedi_statali.json  gli stessi dati in formato leggibile da un programma
e scrive un riassunto nel Terminale. Usa Overpass (servizio pubblico di OpenStreetMap): una richiesta alla volta, con calma.
Dati (c) OpenStreetMap contributors, licenza ODbL.

Come classifica ogni tratto di strada (way di OpenStreetMap):
  - "con marciapiede"     il tratto ha il tag sidewalk (both/left/right/yes) oppure sidewalk:left/right/both = yes
  - "marciapiede separato" tag sidewalk=separate, oppure c'è un percorso footway=sidewalk disegnato a meno di 15 m
  - "senza marciapiede"   tag sidewalk=no/none (o sidewalk:both=no)
  - "non indicato"        nessuna informazione: NON significa che il marciapiede non c'è, solo che nessuno l'ha segnato
"""
import json
import math
import subprocess
import sys
from collections import defaultdict
from xml.sax.saxutils import escape

ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
]
DISTANZA_MARCIAPIEDE_M = 15   # un percorso "sidewalk" entro questa distanza conta come marciapiede della strada
PASSO_CAMPIONE_M = 20         # ogni quanti metri controlliamo la strada
SOGLIA_COPERTURA = 0.6        # quota di campioni con un marciapiede vicino per dire "separato"

Q_STATALI = '[out:json][timeout:180];area["ISO3166-2"="IT-23"]->.a;way(area.a)["highway"~"^(trunk|primary)$"];out geom tags;'
Q_MARCIAPIEDI = '[out:json][timeout:180];area["ISO3166-2"="IT-23"]->.a;way(area.a)["highway"="footway"]["footway"="sidewalk"];out geom;'


def scarica(query):
    # "curl" è già sul Mac (il Python di sistema a volte non completa la connessione sicura); se un server non risponde si prova il successivo.
    for indirizzo in ENDPOINTS:
        print(f"Provo {indirizzo} ...", file=sys.stderr)
        r = subprocess.run(
            ["curl", "-sS", "--fail", "-m", "240", "-A", "AcquaVDA-progetto-scolastico/1.0", "--data-urlencode", "data@-", indirizzo],
            input=query.encode(), capture_output=True,
        )
        if r.returncode == 0 and r.stdout.strip().startswith(b"{"):
            return json.loads(r.stdout)
        print("  non ha funzionato: " + (r.stderr or r.stdout[:150]).decode(errors="replace").strip(), file=sys.stderr)
    sys.exit("Nessun server Overpass ha risposto. Riprova tra qualche minuto.")


def metri(lat0):
    """Metri per grado di latitudine e di longitudine alla latitudine data."""
    return 111320.0, 111320.0 * math.cos(math.radians(lat0))


def lunghezza_m(punti):
    tot = 0.0
    for (la1, lo1), (la2, lo2) in zip(punti, punti[1:]):
        my, mx = metri((la1 + la2) / 2)
        tot += math.hypot((la2 - la1) * my, (lo2 - lo1) * mx)
    return tot


def campiona(punti, passo):
    """Punti lungo la linea ogni 'passo' metri (compresi i vertici di partenza e arrivo)."""
    out = [punti[0]]
    resto = passo
    for (la1, lo1), (la2, lo2) in zip(punti, punti[1:]):
        my, mx = metri((la1 + la2) / 2)
        seg = math.hypot((la2 - la1) * my, (lo2 - lo1) * mx)
        pos = resto
        while pos < seg:
            t = pos / seg
            out.append((la1 + (la2 - la1) * t, lo1 + (lo2 - lo1) * t))
            pos += passo
        resto = pos - seg
    out.append(punti[-1])
    return out


class IndiceMarciapiedi:
    """Griglia di punti dei marciapiedi disegnati a parte, per chiedere 'c'è un marciapiede entro 15 m?' senza confrontare tutto con tutto."""

    def __init__(self, vie):
        self.cella = 30.0
        self.lat0 = 45.7
        self.my, self.mx = metri(self.lat0)
        self.griglia = defaultdict(list)
        for punti in vie:
            for la, lo in campiona(punti, 8):
                self.griglia[self._chiave(la, lo)].append((la * self.my, lo * self.mx))

    def _chiave(self, la, lo):
        return (int(la * self.my // self.cella), int(lo * self.mx // self.cella))

    def vicino(self, la, lo, raggio=DISTANZA_MARCIAPIEDE_M):
        y, x = la * self.my, lo * self.mx
        cy, cx = self._chiave(la, lo)
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                for py, px in self.griglia.get((cy + dy, cx + dx), ()):
                    if math.hypot(py - y, px - x) <= raggio:
                        return True
        return False


def da_tag(tags):
    """Classifica usando solo i tag della strada. Restituisce 'con', 'separato', 'senza' oppure None se non indicato."""
    s = tags.get("sidewalk")
    lr = [tags.get("sidewalk:left"), tags.get("sidewalk:right"), tags.get("sidewalk:both")]
    valori = [v for v in [s] + lr if v]
    if not valori:
        return None
    if any(v in ("both", "left", "right", "yes") for v in valori):
        return "con"
    if any(v == "separate" for v in valori):
        return "separato"
    if all(v in ("no", "none") for v in valori):
        return "senza"
    return None  # valore insolito: lo trattiamo come non indicato


def classifica(via, indice):
    tag = da_tag(via["tags"])
    if tag:
        return tag
    campioni = campiona(via["punti"], PASSO_CAMPIONE_M)
    vicini = sum(1 for la, lo in campioni if indice.vicino(la, lo))
    return "separato" if vicini / len(campioni) >= SOGLIA_COPERTURA else "non_indicato"


def leggi_vie(dati):
    vie = []
    for el in dati.get("elements", []):
        if el.get("type") == "way" and el.get("geometry") and len(el["geometry"]) >= 2:
            vie.append({"id": el["id"], "tags": el.get("tags", {}), "punti": [(g["lat"], g["lon"]) for g in el["geometry"]]})
    return vie


COLORI = {"con": "#1b8a3a", "separato": "#1a6fd1", "senza": "#d00000", "non_indicato": "#e08a00"}
ETICHETTE = {"con": "Con marciapiede (tag)", "separato": "Marciapiede separato", "senza": "Senza marciapiede (tag)", "non_indicato": "Non indicato (nessun dato)"}


def disegna_svg(vie, nome_file):
    tutti = [p for v in vie for p in v["punti"]]
    s, n = min(p[0] for p in tutti), max(p[0] for p in tutti)
    w, e = min(p[1] for p in tutti), max(p[1] for p in tutti)
    my, mx = metri((s + n) / 2)
    scala = 2200 / ((e - w) * mx)
    larghezza, altezza = (e - w) * mx * scala, (n - s) * my * scala
    righe = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{larghezza + 40:.0f}" height="{altezza + 40:.0f}" viewBox="-20 -20 {larghezza + 40:.0f} {altezza + 40:.0f}">',
             f'<rect x="-20" y="-20" width="{larghezza + 40:.0f}" height="{altezza + 40:.0f}" fill="#ffffff"/>']
    for stato in ("senza", "non_indicato", "separato", "con"):
        for v in vie:
            if v["stato"] != stato:
                continue
            pts = " ".join(f"{(lo - w) * mx * scala:.1f},{(n - la) * my * scala:.1f}" for la, lo in v["punti"])
            titolo = escape(f'{v["tags"].get("ref", "")} {v["tags"].get("name", "")} (way {v["id"]}, {ETICHETTE[stato]})')
            righe.append(f'<polyline points="{pts}" fill="none" stroke="{COLORI[stato]}" stroke-width="3" stroke-linecap="round"><title>{titolo}</title></polyline>')
    y = 10
    for stato, colore in COLORI.items():
        righe.append(f'<rect x="10" y="{y}" width="24" height="6" fill="{colore}"/><text x="42" y="{y + 7}" font-family="sans-serif" font-size="14">{escape(ETICHETTE[stato])}</text>')
        y += 22
    righe.append("</svg>")
    open(nome_file, "w", encoding="utf-8").write("\n".join(righe))


def riassunto(vie):
    km = defaultdict(float)
    per_ref = defaultdict(lambda: defaultdict(float))
    for v in vie:
        km[v["stato"]] += v["lunghezza"] / 1000
        per_ref[v["tags"].get("ref", "(senza ref)")][v["stato"]] += v["lunghezza"] / 1000
    totale = sum(km.values())
    print(f"\nStrade trunk/primary in Valle d'Aosta: {len(vie)} tratti, {totale:.1f} km in tutto\n")
    for stato in ("con", "separato", "senza", "non_indicato"):
        print(f"  {ETICHETTE[stato]:<32} {km[stato]:7.1f} km  ({100 * km[stato] / totale:4.1f}%)")
    print("\nPer numero di strada (km: con / separato / senza / non indicato):")
    for ref, d in sorted(per_ref.items(), key=lambda x: -sum(x[1].values())):
        print(f"  {ref:<14} {sum(d.values()):6.1f} km:  {d['con']:.1f} / {d['separato']:.1f} / {d['senza']:.1f} / {d['non_indicato']:.1f}")
    lunghi = sorted((v for v in vie if v["stato"] == "non_indicato"), key=lambda v: -v["lunghezza"])[:10]
    print("\nI 10 tratti più lunghi senza alcun dato (da controllare con Google Street View o sul posto):")
    for v in lunghi:
        la, lo = v["punti"][0]
        print(f"  {v['lunghezza']:6.0f} m  {v['tags'].get('ref', '')} {v['tags'].get('name', '')}  way {v['id']}  da {la:.5f},{lo:.5f}")


def main():
    print("1/2 Scarico le strade statali ...", file=sys.stderr)
    vie = leggi_vie(scarica(Q_STATALI))
    print(f"    {len(vie)} tratti.\n2/2 Scarico i marciapiedi disegnati a parte ...", file=sys.stderr)
    marc = leggi_vie(scarica(Q_MARCIAPIEDI))
    print(f"    {len(marc)} percorsi.", file=sys.stderr)
    if not vie:
        sys.exit("Nessuna strada trovata: controlla la connessione.")
    indice = IndiceMarciapiedi([m["punti"] for m in marc])
    for v in vie:
        v["stato"] = classifica(v, indice)
        v["lunghezza"] = lunghezza_m(v["punti"])
    riassunto(vie)
    disegna_svg(vie, "marciapiedi_statali.svg")
    json.dump([{"id": v["id"], "ref": v["tags"].get("ref"), "nome": v["tags"].get("name"), "stato": v["stato"], "lunghezza_m": round(v["lunghezza"]),
                "punti": v["punti"]} for v in vie], open("marciapiedi_statali.json", "w"), ensure_ascii=False)
    print("\nCreati marciapiedi_statali.svg (aprilo nel browser) e marciapiedi_statali.json")


if __name__ == "__main__":
    main()
