import { useEffect, useState } from 'react';

import type { PuntoAcqua } from '@/data/punti';
import { supabase } from '@/lib/supabase';

// Legge i punti dalla tabella "punti" di Supabase, una volta sola all'apertura della schermata.
// punti = null finché non sono arrivati; errore = testo dell'errore se qualcosa va storto.
export function usePunti() {
  const [punti, setPunti] = useState<PuntoAcqua[] | null>(null);
  const [errore, setErrore] = useState<string | null>(null);

  useEffect(() => {
    let annullato = false;

    supabase
      .from('punti')
      .select('id, nome, comune, tipo, lat, lon, potabile, descrizione')
      .then(({ data, error }) => {
        if (annullato) return;
        if (error) setErrore(error.message);
        else setPunti(data as PuntoAcqua[]);
      });

    // Se la schermata si chiude prima della risposta, ignoriamo il risultato.
    return () => {
      annullato = true;
    };
  }, []);

  return { punti, errore };
}
