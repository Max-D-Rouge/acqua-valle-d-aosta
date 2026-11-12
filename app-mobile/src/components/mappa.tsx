import { useEffect, useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

import type { Avviso } from '@/data/avvisi';
import type { PuntoAcqua } from '@/data/punti';

type Props = {
  punti: PuntoAcqua[];
  // Avvisi in corso: compaiono come quadratini arancioni con "!".
  avvisi: Avviso[];
  // Percorso a piedi da disegnare (coordinate [lon, lat]); null = nessun percorso.
  percorso: [number, number][] | null;
  onSelectAvviso: (id: string | null) => void;
  // Posizione dell'utente: quando cambia, la mappa si centra lì. null = nessuna posizione.
  posizione: { lat: number; lon: number } | null;
  // true durante la navigazione: la mappa segue l'utente da vicino invece di mostrare tutto il percorso.
  segui: boolean;
  // true = foto satellitari al posto della mappa disegnata.
  satellite: boolean;
  // true = rilievo 3D (montagne e edifici in prospettiva).
  rilievo: boolean;
  // Tocco su un luogo della mappa di base (negozio, ristorante, rifugio...).
  onSelectLuogo: (luogo: { nome: string; classe?: string; sottoclasse?: string; lat: number; lon: number }) => void;
  // Chiamata quando si tocca un punto (id) o la mappa vuota (null).
  onSelect: (id: string | null) => void;
  // Quando è true, il prossimo tocco sulla mappa sceglie la posizione di un nuovo punto.
  sceltaAttiva: boolean;
  onScelta: (posizione: { lat: number; lon: number }) => void;
};

const COLORI = {
  potabile: '#1f9d55',
  non_potabile: '#d64545',
  non_verificato: '#8a94a0',
};

// La mappa è una pagina web (MapLibre GL JS + stile OpenFreeMap) mostrata in una WebView.
// I punti vengono scritti dentro la pagina; i tocchi tornano all'app con postMessage.
function creaHtml(punti: PuntoAcqua[], avvisi: Avviso[]) {
  const dati = JSON.stringify(punti).replace(/</g, '\\u003c');
  const datiAvvisi = JSON.stringify(avvisi).replace(/</g, '\\u003c');
  const colori = JSON.stringify(COLORI);
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<link rel="stylesheet" href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css">
<style>
  html, body, #mappa { margin: 0; height: 100%; }
  /* Tasti zoom alla stessa altezza del pulsante "Dove sono" (top: 60 in index.tsx; i 10px di margine sono già di MapLibre). */
  .maplibregl-ctrl-top-right { top: 50px; }
  .io { width: 18px; height: 18px; border-radius: 50%; background: #2563eb; border: 3px solid #fff; box-shadow: 0 0 0 6px rgba(37,99,235,.25); }
  .avv { width: 26px; height: 26px; border-radius: 6px; background: #f59e0b; border: 3px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,.5); color: #fff; font: bold 16px/20px sans-serif; text-align: center; }
  .pin { width: 22px; height: 22px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,.5); }
</style>
</head>
<body>
<div id="mappa"></div>
<script src="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"></script>
<script>
  var PUNTI = ${dati};
  var AVVISI = ${datiAvvisi};
  var COLORI = ${colori};
  function invia(messaggio) {
    window.ReactNativeWebView.postMessage(JSON.stringify(messaggio));
  }
  var map = new maplibregl.Map({
    container: 'mappa',
    style: 'https://tiles.openfreemap.org/styles/liberty',
    center: [7.4, 45.7],
    zoom: 8.3
  });
  // Errori della mappa (es. tile che non si caricano): li mandiamo all'app, che li scrive nel Terminale di Expo.
  var erroriInviati = 0;
  map.on('error', function (e) {
    if (erroriInviati++ > 15) return;
    invia({ tipo: 'log', fonte: e && e.sourceId, testo: (e && e.error && e.error.message) || 'errore della mappa' });
  });
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
  PUNTI.forEach(function (p) {
    var el = document.createElement('div');
    el.className = 'pin';
    el.style.background = COLORI[p.potabile];
    el.addEventListener('click', function (e) {
      e.stopPropagation();
      invia({ tipo: 'seleziona', id: p.id });
    });
    new maplibregl.Marker({ element: el }).setLngLat([p.lon, p.lat]).addTo(map);
  });
  AVVISI.forEach(function (a) {
    var el = document.createElement('div');
    el.className = 'avv';
    el.textContent = '!';
    el.addEventListener('click', function (e) {
      e.stopPropagation();
      invia({ tipo: 'avviso', id: a.id });
    });
    new maplibregl.Marker({ element: el }).setLngLat([a.lon, a.lat]).addTo(map);
  });
  // Modalità "scegli posizione": il tocco sulla mappa manda le coordinate all'app.
  var sceltaAttiva = false;
  var marcatoreScelta = null;
  function impostaScelta(attiva) {
    sceltaAttiva = attiva;
    if (!attiva && marcatoreScelta) { marcatoreScelta.remove(); marcatoreScelta = null; }
  }
  map.on('click', function (e) {
    if (sceltaAttiva) {
      if (marcatoreScelta) marcatoreScelta.remove();
      var el = document.createElement('div');
      el.className = 'pin';
      el.style.background = '#2563eb';
      marcatoreScelta = new maplibregl.Marker({ element: el }).setLngLat(e.lngLat).addTo(map);
      invia({ tipo: 'scelta', lat: e.lngLat.lat, lon: e.lngLat.lng });
    } else {
      // Tocco su un luogo della mappa di base (negozio, ristorante...)? Cerchiamo nel livello "poi" attorno al dito.
      var r = 14;
      var trovati = map.queryRenderedFeatures([[e.point.x - r, e.point.y - r], [e.point.x + r, e.point.y + r]])
        .filter(function (f) { return f.sourceLayer === 'poi' && f.properties && f.properties.name; });
      if (trovati.length > 0) {
        var f = trovati[0];
        var c = f.geometry.type === 'Point' ? f.geometry.coordinates : [e.lngLat.lng, e.lngLat.lat];
        invia({ tipo: 'luogo', nome: f.properties.name, classe: f.properties['class'], sottoclasse: f.properties.subclass, lat: c[1], lon: c[0], proprieta: f.properties });
      } else {
        invia({ tipo: 'deseleziona' });
      }
    }
  });

  // Chiamate dall'app (injectJavaScript): disegnano o tolgono la linea del percorso.
  function mostraPercorso(coords, adatta) {
    function disegna() {
      var dati = { type: 'Feature', geometry: { type: 'LineString', coordinates: coords } };
      if (map.getSource('percorso')) {
        map.getSource('percorso').setData(dati);
      } else {
        map.addSource('percorso', { type: 'geojson', data: dati });
        map.addLayer({
          id: 'percorso-linea', type: 'line', source: 'percorso',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: { 'line-color': '#2563eb', 'line-width': 5, 'line-opacity': 0.85 }
        });
      }
      var limiti = new maplibregl.LngLatBounds(coords[0], coords[0]);
      coords.forEach(function (c) { limiti.extend(c); });
      if (adatta) map.fitBounds(limiti, { padding: 60, duration: 800 });
    }
    if (map.isStyleLoaded()) disegna(); else map.once('load', disegna);
  }
  function togliPercorso() {
    if (map.getLayer('percorso-linea')) map.removeLayer('percorso-linea');
    if (map.getSource('percorso')) map.removeSource('percorso');
  }

  // Chiamata dall'app (injectJavaScript): mette o toglie le foto satellitari.
  // Sotto c'è Sentinel-2 di EOX (tutta l'Italia, ma sfocata: circa 10 m per pixel, fino a zoom 14);
  // sopra le ortofoto nazionali AGEA 2022, 2023 e 2024 (molto più nitide, fino a zoom 18; trasparenti dove non coprono).
  // I livelli vanno sotto le scritte ma sopra strade e campi, così i nomi restano leggibili.
  var LIVELLI_SATELLITE = [
    { id: 'sat-sentinel', maxzoom: 14, attribution: 'EOxCloudless https://cloudless.eox.at by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2025)',
      url: 'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2025_3857/default/g/{z}/{y}/{x}.jpg' },
    { id: 'sat-agea2022', maxzoom: 18, attribution: '© AGEA – Agenzia per le Erogazioni in Agricoltura (CC BY 4.0)',
      url: 'https://geoportale.agea.gov.it/image/rest/services/AgEA/Ortofoto_AgEA_2022/ImageServer/WMTS/tile/1.0.0/AgEA_Ortofoto_AgEA_2022/default/GoogleMapsCompatible/{z}/{y}/{x}' },
    { id: 'sat-agea2023', maxzoom: 18, attribution: '© AGEA – Agenzia per le Erogazioni in Agricoltura (CC BY 4.0)',
      url: 'https://geoportale.agea.gov.it/image/rest/services/AgEA/Ortofoto_AgEA_2023/ImageServer/WMTS/tile/1.0.0/AgEA_Ortofoto_AgEA_2023/default/GoogleMapsCompatible/{z}/{y}/{x}' },
    { id: 'sat-agea2024', maxzoom: 18, attribution: '© AGEA – Agenzia per le Erogazioni in Agricoltura (CC BY 4.0)',
      url: 'https://geoportale.agea.gov.it/image/rest/services/AgEA/Ortofoto_AgEA_2024/ImageServer/WMTS/tile/1.0.0/AgEA_Ortofoto_AgEA_2024/default/GoogleMapsCompatible/{z}/{y}/{x}' }
  ];
  // Stato desiderato: i pulsanti cambiano solo queste due variabili, poi applicaStato() allinea la mappa.
  // I livelli si creano UNA volta e poi si mostrano/nascondono (ricrearli a ogni tocco faceva lag).
  var voglioSatellite = false, voglio3D = false, inAttesa = false, satelliteCreato = false;
  function creaSatellite() {
    if (satelliteCreato) return;
    var primaScritte;
    map.getStyle().layers.forEach(function (l) { if (!primaScritte && l.type === 'symbol') primaScritte = l.id; });
    LIVELLI_SATELLITE.forEach(function (l) {
      // Le ortofoto AGEA non esistono a zoom bassi (il server risponde 400): non le chiediamo sotto zoom 12.
      var minzoom = l.id === 'sat-sentinel' ? 0 : 12;
      map.addSource(l.id, { type: 'raster', tiles: [l.url], tileSize: 256, minzoom: minzoom, maxzoom: l.maxzoom, attribution: l.attribution });
      map.addLayer({ id: l.id, type: 'raster', source: l.id, layout: { visibility: 'none' } }, primaScritte);
    });
    satelliteCreato = true;
    invia({ tipo: 'log', fonte: 'satellite', testo: 'livelli creati, prima di: ' + primaScritte });
  }
  function applicaStato() {
    if (voglioSatellite) creaSatellite();
    if (satelliteCreato) {
      LIVELLI_SATELLITE.forEach(function (l) {
        map.setLayoutProperty(l.id, 'visibility', voglioSatellite ? 'visible' : 'none');
      });
    }
    if (voglio3D) {
      if (!map.getSource('rilievo')) {
        map.addSource('rilievo', {
          type: 'raster-dem',
          tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
          encoding: 'terrarium',
          tileSize: 256,
          maxzoom: 15,
          attribution: 'Quote: Mapzen / Tilezen Terrain Tiles; Europe terrain data produced using Copernicus data and information funded by the European Union - EU-DEM layers'
        });
      }
      map.setTerrain({ source: 'rilievo', exaggeration: 1.3 });
      map.easeTo({ pitch: 55, duration: 800 });
    } else {
      if (map.getTerrain()) map.setTerrain(null);
      if (map.getPitch() > 0) map.easeTo({ pitch: 0, bearing: 0, duration: 600 });
    }
  }
  // Se lo stile sta ancora caricando aspettiamo 'idle', ma una sola volta: tocchi ripetuti non si accumulano.
  function richiediStato() {
    if (map.isStyleLoaded()) { applicaStato(); return; }
    if (inAttesa) return;
    inAttesa = true;
    map.once('idle', function () { inAttesa = false; applicaStato(); });
  }
  // Chiamata dall'app (injectJavaScript): mette o toglie le foto satellitari.
  function impostaSatellite(attivo) { voglioSatellite = !!attivo; richiediStato(); }
  // Chiamata dall'app (injectJavaScript): rilievo 3D. Le quote vengono da Terrain Tiles (AWS Open Data, dati Mapzen/Tilezen).
  function imposta3D(attivo) { voglio3D = !!attivo; richiediStato(); }

  // Chiamata dall'app (injectJavaScript): mostra il pallino blu e porta la mappa lì.
  var marcatoreUtente = null;
  function centraSu(lat, lon, segui) {
    if (!marcatoreUtente) {
      var el = document.createElement('div');
      el.className = 'io';
      marcatoreUtente = new maplibregl.Marker({ element: el }).setLngLat([lon, lat]).addTo(map);
    } else {
      marcatoreUtente.setLngLat([lon, lat]);
    }
    if (segui) map.easeTo({ center: [lon, lat], zoom: Math.max(map.getZoom(), 16.5), duration: 700 });
    else map.flyTo({ center: [lon, lat], zoom: 14 });
  }
</script>
</body>
</html>`;
}

export function Mappa({ punti, avvisi, percorso, posizione, segui, satellite, rilievo, onSelectLuogo, onSelect, onSelectAvviso, sceltaAttiva, onScelta }: Props) {
  const html = useMemo(() => creaHtml(punti, avvisi), [punti, avvisi]);
  const webviewRef = useRef<WebView>(null);

  // Quando arriva una nuova posizione, mandiamo un comando alla pagina della mappa.
  useEffect(() => {
    if (!posizione) return;
    webviewRef.current?.injectJavaScript(
      `if (typeof centraSu === 'function') { centraSu(${posizione.lat}, ${posizione.lon}, ${segui}); } true;`
    );
  }, [posizione]);

  // Disegna il percorso a piedi (o lo toglie quando è null).
  useEffect(() => {
    if (percorso && percorso.length > 1) {
      webviewRef.current?.injectJavaScript(`if (typeof mostraPercorso === 'function') { mostraPercorso(${JSON.stringify(percorso)}, ${!segui}); } true;`);
    } else {
      webviewRef.current?.injectJavaScript(`if (typeof togliPercorso === 'function') { togliPercorso(); } true;`);
    }
  }, [percorso, html]);

  // Foto satellitari accese o spente (si rimettono anche quando la pagina della mappa si ricarica).
  useEffect(() => {
    webviewRef.current?.injectJavaScript(`if (typeof impostaSatellite === 'function') { impostaSatellite(${satellite}); } true;`);
  }, [satellite, html]);

  // Rilievo 3D acceso o spento.
  useEffect(() => {
    webviewRef.current?.injectJavaScript(`if (typeof imposta3D === 'function') { imposta3D(${rilievo}); } true;`);
  }, [rilievo, html]);

  // Attiva o spegne la modalità "scegli posizione" dentro la pagina della mappa.
  useEffect(() => {
    webviewRef.current?.injectJavaScript(
      `if (typeof impostaScelta === 'function') { impostaScelta(${sceltaAttiva}); } true;`
    );
  }, [sceltaAttiva]);

  function gestisciMessaggio(evento: WebViewMessageEvent) {
    try {
      const msg = JSON.parse(evento.nativeEvent.data);
      if (msg.tipo === 'seleziona') onSelect(msg.id);
      else if (msg.tipo === 'avviso') onSelectAvviso(msg.id);
      else if (msg.tipo === 'deseleziona') onSelect(null);
      else if (msg.tipo === 'scelta') onScelta({ lat: msg.lat, lon: msg.lon });
      else if (msg.tipo === 'luogo') {
        // Le proprietà complete le scriviamo nel Terminale di Expo per vedere quali dati offre la mappa.
        console.log('[mappa] luogo', JSON.stringify(msg.proprieta));
        onSelectLuogo({ nome: msg.nome, classe: msg.classe, sottoclasse: msg.sottoclasse, lat: msg.lat, lon: msg.lon });
      } else if (msg.tipo === 'log') console.log('[mappa]', msg.fonte ?? '', msg.testo);
    } catch {
      // Messaggio non valido: lo ignoriamo.
    }
  }

  return (
    <WebView
      ref={webviewRef}
      style={styles.mappa}
      originWhitelist={['*']}
      source={{ html }}
      onMessage={gestisciMessaggio}
    />
  );
}

const styles = StyleSheet.create({
  mappa: { flex: 1 },
});
