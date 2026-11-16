import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Spacing, Palette } from '@/constants/theme';
import { formattaDistanza, formattaDurata, type Percorso } from '@/lib/percorso';

type Props = {
  destinazione: string;
  percorso: Percorso;
  // L'altro percorso tra cui scegliere (se esiste): l'utente può passare dall'uno all'altro.
  alternativa: Percorso | null;
  onScegli: (dati: Percorso, altra: Percorso | null) => void;
  bottom: number;
  onAvvia: () => void;
  onChiudi: () => void;
};

// Scheda del percorso a piedi: distanza, tempo stimato e il pulsante per avviare la navigazione.
export function SchedaPercorso({ destinazione, percorso, alternativa, onScegli, bottom, onAvvia, onChiudi }: Props) {
  // Avviso forte: molta statale in tutto, o un singolo tratto lungo.
  const forte = percorso.statale >= 1000 || percorso.statalePiuLungo >= 500;
  return (
    <View style={[styles.scheda, { bottom }]}>
      <Text style={styles.titolo}>Percorso {percorso.mezzo === 'auto' ? 'in auto' : 'a piedi'} verso {destinazione}</Text>
      <Text style={styles.riepilogo}>
        {formattaDistanza(percorso.distanzaM)} · circa {formattaDurata(percorso.durataS)}
      </Text>
      {percorso.statale > 50 ? (
        <View style={[styles.riquadro, forte && styles.riquadroForte]}>
          <Text style={[styles.avviso, forte && styles.avvisoForte]}>
            {forte ? '⚠ ATTENZIONE: tratto lungo su strada statale' : '⚠ Tratto su strada statale'}
          </Text>
          <Text style={[styles.avviso, forte && styles.avvisoForte]}>
            In tutto {formattaDistanza(percorso.statale)} su statale, il pezzo più lungo senza interruzioni è {formattaDistanza(percorso.statalePiuLungo)}. Può non esserci il marciapiede: attenzione al traffico.
          </Text>
        </View>
      ) : percorso.mezzo === 'piedi' ? (
        <Text style={styles.ok}>Nessun tratto importante su strada statale.</Text>
      ) : null}
      {alternativa ? (
        <Pressable style={styles.alternativa} onPress={() => onScegli(alternativa, percorso)}>
          <Text style={styles.testoAlternativa}>
            {alternativa.statale < percorso.statale ? 'Vedi il percorso che evita la statale' : 'Vedi il percorso più diretto'}: {formattaDistanza(alternativa.distanzaM)} · circa {formattaDurata(alternativa.durataS)}
            {alternativa.statale > 50 ? `, statale ${formattaDistanza(alternativa.statale)}` : ', senza statale'}
          </Text>
        </Pressable>
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
    backgroundColor: Palette.superficie,
    borderRadius: 16,
    borderLeftWidth: 6,
    borderLeftColor: Palette.accento,
    padding: Spacing.three,
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  titolo: { fontSize: 17, fontWeight: '700', color: Palette.secondario },
  riepilogo: { fontSize: 16, fontWeight: '600', color: Palette.accento },
  avviso: { fontSize: 13, color: Palette.avviso, fontWeight: '600' },
  avvisoForte: { color: '#991b1b', fontSize: 14, fontWeight: '700' },
  riquadro: { backgroundColor: '#fff7ed', borderRadius: 10, padding: 8, gap: 2 },
  riquadroForte: { backgroundColor: '#fee2e2', borderWidth: 1, borderColor: '#dc2626' },
  ok: { fontSize: 13, color: '#15803d', fontWeight: '600' },
  alternativa: { borderWidth: 1, borderColor: Palette.accento, borderRadius: 10, padding: 8 },
  testoAlternativa: { fontSize: 13, color: Palette.accento, fontWeight: '600' },
  nota: { fontSize: 12, color: Palette.testoTenue },
  pulsante: { backgroundColor: Palette.accento, borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  testoPulsante: { color: Palette.superficie, fontSize: 15, fontWeight: '600' },
  chiudi: { color: Palette.pericolo, textAlign: 'center', fontSize: 14, textDecorationLine: 'underline', marginTop: 4 },
});
