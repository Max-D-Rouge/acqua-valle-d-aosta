import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Spacing, Palette } from '@/constants/theme';
import { TIPI_AVVISO, type TipoAvviso } from '@/data/avvisi';
import { supabase } from '@/lib/supabase';

type Props = {
  visibile: boolean;
  // Posizione scelta toccando la mappa.
  posizione: { lat: number; lon: number } | null;
  onChiudi: () => void;
  onSalvato: () => void;
};

// Modulo rapido per un avviso: si sceglie il tipo, la nota è facoltativa. L'avviso dura 48 ore (database/10_avvisi.sql).
export function FormAvviso({ visibile, posizione, onChiudi, onSalvato }: Props) {
  const [tipo, setTipo] = useState<TipoAvviso>('sentiero_chiuso');
  const [nota, setNota] = useState('');
  const [messaggio, setMessaggio] = useState<string | null>(null);
  const [occupato, setOccupato] = useState(false);

  function chiudi() {
    setMessaggio(null);
    onChiudi();
  }

  async function salva() {
    if (!posizione) return;
    setOccupato(true);
    setMessaggio(null);
    // "autore" e "scade_il" non si mandano: li compila il database.
    const { error } = await supabase.from('avvisi').insert({ tipo, nota: nota.trim() || null, lat: posizione.lat, lon: posizione.lon });
    setOccupato(false);
    if (error) {
      setMessaggio(`Non è stato salvato: ${error.message}`);
      return;
    }
    setNota('');
    setTipo('sentiero_chiuso');
    onSalvato();
  }

  return (
    <Modal visible={visibile} animationType="slide" transparent onRequestClose={chiudi}>
      <KeyboardAvoidingView style={styles.sfondo} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.foglio}>
          <Text style={styles.titolo}>Nuovo avviso</Text>
          <Text style={styles.nota}>Resta visibile sulla mappa per 48 ore.</Text>
          <View style={styles.riga}>
            {TIPI_AVVISO.map((t) => (
              <Pressable key={t.valore} style={[styles.scelta, tipo === t.valore && styles.sceltaAttiva]} onPress={() => setTipo(t.valore)}>
                <Text style={[styles.testoScelta, tipo === t.valore && styles.testoSceltaAttiva]}>{t.etichetta}</Text>
              </Pressable>
            ))}
          </View>
          <TextInput
            style={styles.campo}
            placeholder="Nota (facoltativa)"
            placeholderTextColor={Palette.testoSfumato}
            maxLength={200}
            value={nota}
            onChangeText={setNota}
          />
          {messaggio ? <Text style={styles.messaggio}>{messaggio}</Text> : null}
          <Pressable style={[styles.pulsante, occupato && styles.spento]} onPress={salva} disabled={occupato}>
            <Text style={styles.testoPulsante}>{occupato ? 'Salvo...' : 'Pubblica avviso'}</Text>
          </Pressable>
          <Pressable onPress={chiudi}>
            <Text style={styles.annulla}>Annulla</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sfondo: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  foglio: { backgroundColor: Palette.sfondo, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: Spacing.four, gap: Spacing.two },
  titolo: { fontSize: 22, fontWeight: '700', color: Palette.secondario },
  nota: { fontSize: 14, color: Palette.testo },
  riga: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  scelta: { borderWidth: 1, borderColor: Palette.avviso, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14, backgroundColor: Palette.superficie },
  sceltaAttiva: { backgroundColor: Palette.avviso },
  testoScelta: { fontSize: 14, color: Palette.avviso },
  testoSceltaAttiva: { color: Palette.superficie, fontWeight: '600' },
  campo: { borderWidth: 1, borderColor: Palette.bordo, borderRadius: 10, padding: Spacing.three, fontSize: 16, backgroundColor: Palette.superficie, color: Palette.secondario },
  messaggio: { backgroundColor: Palette.avvisoSfondo, borderRadius: 8, padding: Spacing.two, color: Palette.avvisoTesto },
  pulsante: { backgroundColor: Palette.avviso, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  spento: { opacity: 0.5 },
  testoPulsante: { color: Palette.superficie, fontSize: 16, fontWeight: '700' },
  annulla: { color: Palette.secondario, textAlign: 'center', fontSize: 15, textDecorationLine: 'underline' },
});
