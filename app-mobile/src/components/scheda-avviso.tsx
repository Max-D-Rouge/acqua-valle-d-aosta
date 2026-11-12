import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { TIPI_AVVISO, type Avviso } from '@/data/avvisi';
import { useSessione } from '@/hooks/use-sessione';
import { supabase } from '@/lib/supabase';

type Props = {
  avviso: Avviso;
  bottom: number;
  // Chiamata dopo aver rimosso l'avviso.
  onRimosso: () => void;
};

// Scheda di un avviso: tipo, nota e quanto manca alla scadenza. Chi lo ha creato può rimuoverlo.
export function SchedaAvviso({ avviso, bottom, onRimosso }: Props) {
  const { sessione } = useSessione();
  const [errore, setErrore] = useState<string | null>(null);
  const etichetta = TIPI_AVVISO.find((t) => t.valore === avviso.tipo)?.etichetta ?? 'Avviso';
  const ore = Math.max(1, Math.round((new Date(avviso.scade_il).getTime() - Date.now()) / 3600000));
  const mio = !!sessione && sessione.user.id === avviso.autore;

  async function rimuovi() {
    const { error } = await supabase.from('avvisi').delete().eq('id', avviso.id);
    if (error) setErrore(error.message);
    else onRimosso();
  }

  return (
    <View style={[styles.scheda, { bottom }]}>
      <View style={styles.badge}>
        <Text style={styles.testoBadge}>⚠ Avviso</Text>
      </View>
      <Text style={styles.titolo}>{etichetta}</Text>
      {avviso.nota ? <Text style={styles.nota}>{avviso.nota}</Text> : null}
      <Text style={styles.scadenza}>Visibile ancora per circa {ore} {ore === 1 ? 'ora' : 'ore'}. Segnalato da altri utenti: non è stato controllato.</Text>
      {mio ? (
        <Pressable onPress={rimuovi}>
          <Text style={styles.rimuovi}>Rimuovi avviso</Text>
        </Pressable>
      ) : null}
      {errore ? <Text style={styles.scadenza}>{errore}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  scheda: {
    position: 'absolute',
    left: Spacing.three,
    right: Spacing.three,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderLeftWidth: 6,
    borderLeftColor: '#f59e0b',
    padding: Spacing.three,
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  badge: { alignSelf: 'flex-start', backgroundColor: '#ffedd5', borderRadius: 14, paddingVertical: 4, paddingHorizontal: 10 },
  testoBadge: { fontSize: 13, fontWeight: '700', color: '#b45309' },
  titolo: { fontSize: 18, fontWeight: '700', color: '#18395a' },
  nota: { fontSize: 14, color: '#4a5560' },
  scadenza: { fontSize: 12, color: '#6b7680' },
  rimuovi: { fontSize: 14, color: '#d64545', textDecorationLine: 'underline' },
});
