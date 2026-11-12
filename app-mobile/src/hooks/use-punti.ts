import { useCallback, useEffect, useState } from 'react';

import type { PuntoAcqua } from '@/data/punti';
import { supabase } from '@/lib/supabase';

// Legge i punti dalla tabella "punti" di Supabase all'apertura della schermata.
// punti = null finché non sono arrivati; errore = testo dell'errore se qualcosa va storto.
// ricarica() rilegge i punti (si usa dopo averne aggiunto uno).
export function usePunti() {
  const [punti, setPunti] = useState<PuntoAcqua[] | null>(null);
  const [errore, setErrore] = useState<string | null>(null);

  const ricarica = useCallback(async () => {
    const { data, error } = await supabase
      .from('punti')
      .select('id, nome, comune, frazione, autore, esempio, tipo, lat, lon, potabile, descrizione, stato, bottiglia, accesso, carrozzina, stagionalita, stagionalita_nota');
    if (error) setErrore(error.message);
    else {
      setErrore(null);
      setPunti(data as PuntoAcqua[]);
    }
  }, []);

  useEffect(() => {
    ricarica();
  }, [ricarica]);

  return { punti, errore, ricarica };
}
