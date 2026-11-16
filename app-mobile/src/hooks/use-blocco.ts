import { useCallback, useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';

// Legge se l'utente collegato è bloccato (database/14): restituisce la data di fine blocco, oppure null.
// Il blocco lo decide il database; qui serve solo per avvisare l'utente prima che provi un'azione che verrebbe rifiutata.
export function useBlocco(utenteId: string | null) {
  const [fino, setFino] = useState<Date | null>(null);

  const carica = useCallback(async () => {
    if (!utenteId) {
      setFino(null);
      return;
    }
    const { data } = await supabase
      .from('blocchi')
      .select('fino_a')
      .gt('fino_a', new Date().toISOString())
      .order('fino_a', { ascending: false })
      .limit(1)
      .maybeSingle();
    setFino(data?.fino_a ? new Date(data.fino_a) : null);
  }, [utenteId]);

  useEffect(() => {
    carica();
  }, [carica]);

  return { fino, ricarica: carica };
}

// Testo mostrato all'utente bloccato.
export function testoBlocco(fino: Date): string {
  return `Il tuo account è bloccato fino al ${fino.toLocaleDateString('it-IT')}: puoi guardare la mappa, ma non puoi aggiungere punti, foto, segnalazioni o avvisi.`;
}
