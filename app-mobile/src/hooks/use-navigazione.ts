import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';

import { metriFinoAlVertice, postoSulPercorso, type Coord } from '@/lib/geo';
import type { Percorso } from '@/lib/percorso';

// Oltre questa distanza dalla linea consideriamo che l'utente sia fuori strada.
const SOGLIA_FUORI_ROTTA_M = 40;
// Sotto questa distanza dalla fine consideriamo di essere arrivati.
const SOGLIA_ARRIVO_M = 25;
// Tra un ricalcolo e l'altro aspettiamo almeno questi secondi (per non consumare le richieste gratuite).
const PAUSA_RICALCOLO_S = 20;

export type StatoNavigazione = {
  posizione: { lat: number; lon: number } | null;
  // Numero del passo in cui ti trovi.
  passo: number;
  // Metri di percorso fino al prossimo cambio di direzione.
  distanzaProssimoM: number;
  // Metri e secondi che mancano all'arrivo.
  restanteM: number;
  restanteS: number;
  // Metri già fatti dalla partenza.
  fattiM: number;
  fuoriRotta: boolean;
  arrivato: boolean;
};

const STATO_INIZIALE: StatoNavigazione = {
  posizione: null,
  passo: 0,
  distanzaProssimoM: 0,
  restanteM: 0,
  restanteS: 0,
  fattiM: 0,
  fuoriRotta: false,
  arrivato: false,
};

// Segue la posizione dell'utente MENTRE la navigazione è attiva e calcola dove si trova lungo il percorso.
// La posizione resta solo in memoria: non viene salvata. Se esci dal percorso chiama "onFuoriRotta"
// (l'app allora chiede un nuovo percorso al servizio). Quando "attiva" torna false, il GPS viene spento.
export function useNavigazione(attiva: boolean, percorso: Percorso | null, onFuoriRotta: (da: { lat: number; lon: number }) => void) {
  const [stato, setStato] = useState<StatoNavigazione>(STATO_INIZIALE);
  const [errore, setErrore] = useState<string | null>(null);

  // Teniamo sempre l'ultimo percorso e l'ultima funzione, senza riavviare il GPS a ogni cambio.
  const percorsoRef = useRef(percorso);
  const fuoriRef = useRef(onFuoriRotta);
  percorsoRef.current = percorso;
  fuoriRef.current = onFuoriRotta;
  const ultimoRicalcolo = useRef(0);
  const lettureFuori = useRef(0);

  useEffect(() => {
    if (!attiva) {
      setStato(STATO_INIZIALE);
      setErrore(null);
      return;
    }
    let abbonamento: Location.LocationSubscription | null = null;
    let annullato = false;
    ultimoRicalcolo.current = Date.now();
    lettureFuori.current = 0;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrore('Senza il permesso di posizione non posso guidarti.');
        return;
      }
      const a = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.BestForNavigation, distanceInterval: 4, timeInterval: 2000 },
        (loc) => {
          const p = percorsoRef.current;
          if (!p || p.coordinate.length < 2) return;
          const qui: Coord = [loc.coords.longitude, loc.coords.latitude];
          const posto = postoSulPercorso(qui, p.coordinate);
          const ultimo = p.coordinate.length - 1;

          // Passo attuale = l'ultimo che è già iniziato.
          let passo = 0;
          for (let i = 0; i < p.passi.length; i++) if (p.passi[i].inizio <= posto.segmento) passo = i;
          const prossimo = p.passi[passo + 1];
          const distanzaProssimoM = prossimo ? metriFinoAlVertice(p.coordinate, posto, prossimo.inizio) : metriFinoAlVertice(p.coordinate, posto, ultimo);
          const restanteM = metriFinoAlVertice(p.coordinate, posto, ultimo);
          const restanteS = p.distanzaM > 0 ? (p.durataS * restanteM) / p.distanzaM : 0;

          // Un GPS impreciso (es. tra gli alberi) non basta per dire che sei fuori strada.
          const precisoAbbastanza = (loc.coords.accuracy ?? 999) <= 35;
          const lontano = precisoAbbastanza && posto.distanzaDalPercorsoM > SOGLIA_FUORI_ROTTA_M;
          lettureFuori.current = lontano ? lettureFuori.current + 1 : 0;
          const fuoriRotta = lettureFuori.current >= 2;
          if (fuoriRotta && Date.now() - ultimoRicalcolo.current > PAUSA_RICALCOLO_S * 1000) {
            ultimoRicalcolo.current = Date.now();
            lettureFuori.current = 0;
            fuoriRef.current({ lat: loc.coords.latitude, lon: loc.coords.longitude });
          }

          if (!annullato) {
            setStato({
              posizione: { lat: loc.coords.latitude, lon: loc.coords.longitude },
              passo,
              distanzaProssimoM,
              restanteM,
              restanteS,
              fattiM: Math.max(0, p.distanzaM - restanteM),
              fuoriRotta,
              arrivato: restanteM < SOGLIA_ARRIVO_M,
            });
          }
        }
      );
      if (annullato) a.remove();
      else abbonamento = a;
    })().catch(() => setErrore('Non riesco a leggere la posizione.'));

    return () => {
      annullato = true;
      abbonamento?.remove();
    };
  }, [attiva]);

  return { stato, errore };
}
