import { useCallback, useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';

export const FORMATO_NOME = /^[A-Za-z0-9_]{3,20}$/;

// Legge il profilo (nome utente pubblico) dell'utente collegato.
// profilo = null se non ha ancora scelto un nome. salva() crea il profilo o cambia il nome.
export function useProfilo(utenteId: string | null) {
  const [nomeUtente, setNomeUtente] = useState<string | null>(null);
  const [caricamento, setCaricamento] = useState(true);

  const carica = useCallback(async () => {
    if (!utenteId) {
      setNomeUtente(null);
      setCaricamento(false);
      return;
    }
    const { data } = await supabase.from('profili').select('nome_utente').eq('id', utenteId).maybeSingle();
    setNomeUtente(data?.nome_utente ?? null);
    setCaricamento(false);
  }, [utenteId]);

  useEffect(() => {
    carica();
  }, [carica]);

  // Restituisce un testo di errore, oppure null se è andato tutto bene.
  async function salva(nome: string): Promise<string | null> {
    if (!utenteId) return 'Devi essere collegato.';
    const pulito = nome.trim();
    if (!FORMATO_NOME.test(pulito)) return 'Da 3 a 20 caratteri: lettere, numeri e _ (niente spazi).';
    const { error } = nomeUtente
      ? await supabase.from('profili').update({ nome_utente: pulito }).eq('id', utenteId)
      : await supabase.from('profili').insert({ id: utenteId, nome_utente: pulito });
    if (error) return error.code === '23505' ? 'Questo nome utente è già usato.' : error.message;
    await carica();
    return null;
  }

  return { nomeUtente, caricamento, salva };
}
