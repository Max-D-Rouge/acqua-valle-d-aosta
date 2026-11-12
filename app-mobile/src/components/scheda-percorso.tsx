import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { formattaDistanza, formattaDurata, type Percorso } from '@/lib/percorso';

type Props = {
  destinazione: string;
  percorso: Percorso;
  bottom: number;
  onAvvia: () => void;
  onChiudi: () => void;
};

// Scheda del percorso a piedi: distanza, tempo stimato e il pulsante per avviare la navigazione.
export function SchedaPercorso({ destinazione, percorso, bottom, onAvvia, onChiudi }: Props) {
  return (
    <View style={[styles.scheda, { bottom }]}>
      <Text style={styles.titolo}>Percorso {percorso.mezzo === 'auto' ? 'in auto' : 'a piedi'} verso {destinazione}</Text>
      <Text style={styles.riepilogo}>
        {formattaDistanza(percorso.distanzaM)} · circa {formattaDurata(percorso.durataS)}
      </Text>
      {percorso.statale > 50 ? (
        <Text style={styles.avviso}>⚠ Circa {formattaDistanza(percorso.statale)} del percorso passano su strada statale: attenzione al traffico.</Text>
      ) : null}
      <Text style={styles.nota}>Tempo stimato dal servizio: controlla sempre strada, sentiero e condizioni sul posto.</Text>
      <Pressable style={styles.pulsante} onPress={onAvvia}>
        <Text style={styles.testoPulsante}>Avvia navigazione</Text>
      </Pressable>
      <Pressable onPress={onChiudi}>
        <Text style={styles.chiudi}>Chiudi percorso</Text>
      </Pressable>
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
    borderLeftColor: '#2563eb',
    padding: Spacing.three,
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  titolo: { fontSize: 17, fontWeight: '700', color: '#18395a' },
  riepilogo: { fontSize: 16, fontWeight: '600', color: '#2563eb' },
  avviso: { fontSize: 13, color: '#b45309', fontWeight: '600' },
  nota: { fontSize: 12, color: '#6b7680' },
  pulsante: { backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  testoPulsante: { color: '#ffffff', fontSize: 15, fontWeight: '600' },
  chiudi: { color: '#d64545', textAlign: 'center', fontSize: 14, textDecorationLine: 'underline', marginTop: 4 },
});
