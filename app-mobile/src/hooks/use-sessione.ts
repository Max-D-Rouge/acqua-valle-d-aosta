import type { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';

// Dice chi è collegato. sessione = null se nessuno ha fatto il login.
// caricamento = true finché l'app non ha letto la sessione salvata sul telefono.
export function useSessione() {
  const [sessione, setSessione] = useState<Session | null>(null);
  const [caricamento, setCaricamento] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSessione(data.session);
      setCaricamento(false);
    });

    // Si aggiorna da solo a ogni login, logout o rinnovo della sessione.
    const { data } = supabase.auth.onAuthStateChange((_evento, nuova) => setSessione(nuova));
    return () => data.subscription.unsubscribe();
  }, []);

  return { sessione, caricamento };
}
