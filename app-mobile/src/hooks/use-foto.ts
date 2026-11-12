import { useCallback, useEffect, useState } from 'react';

import type { Foto } from '@/lib/foto';
import { supabase } from '@/lib/supabase';

// Elenco delle foto di un punto. "attivo" = false evita di leggere finché la scheda non è aperta.
export function useFoto(puntoId: string, attivo: boolean) {
  const [foto, setFoto] = useState<Foto[]>([]);

  const ricarica = useCallback(async () => {
    const { data } = await supabase.from('foto_punti').select('id, percorso, autore').eq('punto_id', puntoId).order('creato_il');
    setFoto((data as Foto[] | null) ?? []);
  }, [puntoId]);

  useEffect(() => {
    if (attivo) ricarica();
  }, [attivo, ricarica]);

  return { foto, ricarica };
}
