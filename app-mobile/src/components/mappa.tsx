import { useEffect, useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

import type { PuntoAcqua } from '@/data/punti';

type Props = {
  punti: PuntoAcqua[];
  // Posizione dell'utente: quando cambia, la mappa si centra lì. null = nessuna posizione.
  posizione: { lat: number; lon: number } | null;
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
function creaHtml(punti: PuntoAcqua[]) {
  const dati = JSON.stringify(punti).replace(/</g, '\\u003c');
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
  .pin { width: 22px; height: 22px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,.5); }
</style>
</head>
<body>
<div id="mappa"></div>
<script src="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"></script>
<script>
  var PUNTI = ${dati};
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
      invia({ tipo: 'deseleziona' });
    }
  });

  // Chiamata dall'app (injectJavaScript): mostra il pallino blu e porta la mappa lì.
  var marcatoreUtente = null;
  function centraSu(lat, lon) {
    if (!marcatoreUtente) {
      var el = document.createElement('div');
      el.className = 'io';
      marcatoreUtente = new maplibregl.Marker({ element: el }).setLngLat([lon, lat]).addTo(map);
    } else {
      marcatoreUtente.setLngLat([lon, lat]);
    }
    map.flyTo({ center: [lon, lat], zoom: 14 });
  }
</script>
</body>
</html>`;
}

export function Mappa({ punti, posizione, onSelect, sceltaAttiva, onScelta }: Props) {
  const html = useMemo(() => creaHtml(punti), [punti]);
  const webviewRef = useRef<WebView>(null);

  // Quando arriva una nuova posizione, mandiamo un comando alla pagina della mappa.
  useEffect(() => {
    if (!posizione) return;
    webviewRef.current?.injectJavaScript(
      `if (typeof centraSu === 'function') { centraSu(${posizione.lat}, ${posizione.lon}); } true;`
    );
  }, [posizione]);

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
      else if (msg.tipo === 'deseleziona') onSelect(null);
      else if (msg.tipo === 'scelta') onScelta({ lat: msg.lat, lon: msg.lon });
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
