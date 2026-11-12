import { useCallback, useEffect, useState } from 'react';

import type { Avviso } from '@/data/avvisi';
import { supabase } from '@/lib/supabase';

// Legge gli avvisi in corso (il database restituisce solo quelli non scaduti).
// Se non riesce a leggerli la mappa funziona lo stesso, senza avvisi.
export function useAvvisi() {
  const [avvisi, setAvvisi] = useState<Avviso[]>([]);

  const ricarica = useCallback(async () => {
    const { data } = await supabase.from('avvisi').select('id, tipo, nota, lat, lon, autore, creato_il, scade_il');
    setAvvisi((data as Avviso[] | null) ?? []);
  }, []);

  useEffect(() => {
    ricarica();
  }, [ricarica]);

  return { avvisi, ricarica };
}
