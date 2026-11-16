import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Spacing, Palette } from '@/constants/theme';
import { testoBlocco, useBlocco } from '@/hooks/use-blocco';
import { useSessione } from '@/hooks/use-sessione';
import { supabase } from '@/lib/supabase';

type Props = {
  // Utente da segnalare (l'autore del punto) e punto da cui parte la segnalazione.
  utenteId: string;
  puntoId: string;
};

const MOTIVI = [
  { valore: 'informazioni_false', etichetta: 'Informazioni false' },
  { valore: 'contenuto_offensivo', etichetta: 'Contenuto offensivo' },
  { valore: 'spam', etichetta: 'Spam' },
  { valore: 'altro', etichetta: 'Altro' },
];

// "Segnala questo utente": il messaggio arriva agli amministratori (database/08), l'email dell'utente non viene mai mostrata.
export function SegnalaUtente({ utenteId, puntoId }: Props) {
  const { sessione } = useSessione();
  const { fino: bloccoFino } = useBlocco(sessione?.user.id ?? null);
  const [aperto, setAperto] = useState(false);
  const [motivo, setMotivo] = useState('informazioni_false');
  const [messaggio, setMessaggio] = useState('');
  const [esito, setEsito] = useState<string | null>(null);
  const [occupato, setOccupato] = useState(false);

  // Solo chi è collegato può segnalare, e non se stesso.
  if (!sessione || sessione.user.id === utenteId) return null;
  if (bloccoFino) return <Text style={styles.esito}>{testoBlocco(bloccoFino)}</Text>;

  async function invia() {
    setOccupato(true);
    setEsito(null);
    const { error } = await supabase.from('segnalazioni_utenti').insert({
      segnalato: utenteId,
      punto_id: puntoId,
      motivo,
      messaggio: messaggio.trim() || null,
    });
    setOccupato(false);
    if (error) {
      setEsito(error.code === '23505' ? 'Hai già segnalato questo utente.' : `Non inviata: ${error.message}`);
      return;
    }
    setEsito('Segnalazione inviata agli amministratori. Grazie.');
    setAperto(false);
    setMessaggio('');
  }

  return (
    <View style={styles.box}>
      <Pressable onPress={() => setAperto(!aperto)}>
        <Text style={styles.link}>{aperto ? 'Annulla' : 'Segnala questo utente'}</Text>
      </Pressable>
      {aperto ? (
        <View style={styles.modulo}>
          <View style={styles.riga}>
            {MOTIVI.map((m) => (
              <Pressable key={m.valore} style={[styles.scelta, motivo === m.valore && styles.sceltaAttiva]} onPress={() => setMotivo(m.valore)}>
                <Text style={[styles.testoScelta, motivo === m.valore && styles.testoSceltaAttiva]}>{m.etichetta}</Text>
              </Pressable>
            ))}
          </View>
          <TextInput
            style={styles.campo}
            placeholder="Cosa è successo? (facoltativo)"
            placeholderTextColor={Palette.testoSfumato}
            multiline
            maxLength={500}
            value={messaggio}
            onChangeText={setMessaggio}
          />
          <Pressable style={[styles.invia, occupato && styles.spento]} onPress={invia} disabled={occupato}>
            <Text style={styles.testoInvia}>{occupato ? 'Invio...' : 'Invia segnalazione'}</Text>
          </Pressable>
        </View>
      ) : null}
      {esito ? <Text style={styles.esito}>{esito}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { marginTop: 4, gap: 6 },
  link: { fontSize: 13, color: Palette.avviso, textDecorationLine: 'underline' },
  modulo: { gap: 8, marginTop: 4 },
  riga: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  scelta: { borderWidth: 1, borderColor: Palette.avviso, borderRadius: 16, paddingVertical: 5, paddingHorizontal: 10, backgroundColor: Palette.superficie },
  sceltaAttiva: { backgroundColor: Palette.avviso },
  testoScelta: { fontSize: 13, color: Palette.avviso },
  testoSceltaAttiva: { color: Palette.superficie, fontWeight: '600' },
  campo: { borderWidth: 1, borderColor: Palette.bordo, borderRadius: 10, padding: Spacing.two, fontSize: 14, backgroundColor: Palette.superficie, color: Palette.secondario, minHeight: 60, textAlignVertical: 'top' },
  invia: { backgroundColor: Palette.avviso, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  spento: { opacity: 0.5 },
  testoInvia: { color: Palette.superficie, fontSize: 14, fontWeight: '700' },
  esito: { fontSize: 13, color: Palette.testo },
});
