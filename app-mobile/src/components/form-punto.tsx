import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import type { Potabilita, TipoPunto } from '@/data/punti';
import { cercaLuogo } from '@/lib/luogo';
import { supabase } from '@/lib/supabase';

type Props = {
  visibile: boolean;
  // Posizione scelta toccando la mappa.
  posizione: { lat: number; lon: number } | null;
  onChiudi: () => void;
  // Chiamata dopo che il punto è stato salvato.
  onSalvato: () => void;
};

type Scelta<T extends string> = { valore: T; etichetta: string }[];

const TIPI: Scelta<TipoPunto> = [
  { valore: 'fontana', etichetta: 'Fontana' },
  { valore: 'fontanella', etichetta: 'Fontanella' },
  { valore: 'sorgente', etichetta: 'Sorgente' },
  { valore: 'punto_struttura', etichetta: 'In una struttura' },
  { valore: 'altro', etichetta: 'Altro' },
];
const POTABILITA: Scelta<Potabilita> = [
  { valore: 'potabile', etichetta: 'Potabile' },
  { valore: 'non_potabile', etichetta: 'Non potabile' },
  { valore: 'non_verificato', etichetta: 'Non so' },
];
type Stato = 'funzionante' | 'non_funzionante' | 'non_verificato';
const STATI: Scelta<Stato> = [
  { valore: 'funzionante', etichetta: 'Funziona' },
  { valore: 'non_funzionante', etichetta: 'Non funziona' },
  { valore: 'non_verificato', etichetta: 'Non so' },
];
type SiNo = 'si' | 'no' | 'non_so';
const SI_NO: Scelta<SiNo> = [
  { valore: 'si', etichetta: 'Sì' },
  { valore: 'no', etichetta: 'No' },
  { valore: 'non_so', etichetta: 'Non so' },
];
type Accesso = 'strada' | 'sentiero' | 'non_so';
const ACCESSI: Scelta<Accesso> = [
  { valore: 'strada', etichetta: 'Su strada' },
  { valore: 'sentiero', etichetta: 'Su sentiero' },
  { valore: 'non_so', etichetta: 'Non so' },
];
type Stagione = 'tutto_anno' | 'stagionale' | 'non_so';
const STAGIONI: Scelta<Stagione> = [
  { valore: 'tutto_anno', etichetta: 'Tutto l\'anno' },
  { valore: 'stagionale', etichetta: 'Stagionale' },
  { valore: 'non_so', etichetta: 'Non so' },
];

// Riga di bottoni tra cui scegliere (una sola scelta).
function Scegli<T extends string>({ etichetta, opzioni, valore, onCambia }: { etichetta: string; opzioni: Scelta<T>; valore: T; onCambia: (v: T) => void }) {
  return (
    <>
      <Text style={styles.etichetta}>{etichetta}</Text>
      <View style={styles.riga}>
        {opzioni.map((o) => (
          <Pressable key={o.valore} style={[styles.scelta, valore === o.valore && styles.sceltaAttiva]} onPress={() => onCambia(o.valore)}>
            <Text style={[styles.testoScelta, valore === o.valore && styles.testoSceltaAttiva]}>{o.etichetta}</Text>
          </Pressable>
        ))}
      </View>
    </>
  );
}

// Modulo per aggiungere un punto d'acqua. Obbligatori solo posizione (toccata sulla mappa) e tipo:
// tutto il resto ha un valore predefinito "non so" (docs/01_PROGETTO.md, §5.1).
export function FormPunto({ visibile, posizione, onChiudi, onSalvato }: Props) {
  const [nome, setNome] = useState('');
  const [comune, setComune] = useState('');
  const [frazione, setFrazione] = useState('');
  const [cercando, setCercando] = useState(false);
  const [tipo, setTipo] = useState<TipoPunto>('fontana');
  const [potabile, setPotabile] = useState<Potabilita>('non_verificato');
  const [stato, setStato] = useState<Stato>('non_verificato');
  const [bottiglia, setBottiglia] = useState<SiNo>('non_so');
  const [accesso, setAccesso] = useState<Accesso>('non_so');
  const [carrozzina, setCarrozzina] = useState<SiNo>('non_so');
  const [stagionalita, setStagionalita] = useState<Stagione>('non_so');
  const [notaStagione, setNotaStagione] = useState('');
  const [descrizione, setDescrizione] = useState('');
  const [messaggio, setMessaggio] = useState<string | null>(null);
  const [occupato, setOccupato] = useState(false);

  // Quando si apre il modulo, comune e frazione si compilano da soli dalle coordinate (si possono sempre correggere).
  useEffect(() => {
    if (!visibile || !posizione) return;
    let annullato = false;
    setCercando(true);
    cercaLuogo(posizione.lat, posizione.lon).then((luogo) => {
      if (annullato) return;
      if (luogo) {
        // Non si sovrascrive quello che l'utente ha già scritto.
        setComune((c) => c || luogo.comune);
        setFrazione((f) => f || luogo.frazione);
      }
      setCercando(false);
    });
    return () => {
      annullato = true;
    };
  }, [visibile, posizione]);

  function chiudi() {
    setMessaggio(null);
    onChiudi();
  }

  async function salva() {
    setMessaggio(null);
    if (!posizione) {
      setMessaggio('Manca la posizione: chiudi e tocca la mappa.');
      return;
    }
    setOccupato(true);

    // "autore" non si manda: lo compila il database con l'utente collegato.
    const { error } = await supabase.from('punti').insert({
      // Il nome nel database è obbligatorio: se vuoto usiamo il tipo (es. "Fontana").
      nome: nome.trim() || (TIPI.find((t) => t.valore === tipo)?.etichetta ?? 'Punto d\'acqua'),
      comune: comune.trim() || null,
      frazione: frazione.trim() || null,
      tipo,
      lat: posizione.lat,
      lon: posizione.lon,
      potabile,
      stato,
      bottiglia,
      accesso,
      carrozzina,
      stagionalita,
      stagionalita_nota: notaStagione.trim() || null,
      descrizione: descrizione.trim() || null,
    });
    setOccupato(false);

    if (error) {
      setMessaggio(`Non è stato salvato: ${error.message}`);
      return;
    }
    setNome('');
    setComune('');
    setFrazione('');
    setDescrizione('');
    setNotaStagione('');
    setTipo('fontana');
    setPotabile('non_verificato');
    setStato('non_verificato');
    setBottiglia('non_so');
    setAccesso('non_so');
    setCarrozzina('non_so');
    setStagionalita('non_so');
    onSalvato();
  }

  return (
    <Modal visible={visibile} animationType="slide" onRequestClose={chiudi}>
      <KeyboardAvoidingView style={styles.sfondo} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.contenuto} keyboardShouldPersistTaps="handled">
          <Text style={styles.titolo}>Nuovo punto d'acqua</Text>
          {posizione ? (
            <Text style={styles.nota}>
              Posizione scelta: {posizione.lat.toFixed(5)}, {posizione.lon.toFixed(5)}
            </Text>
          ) : null}

          <Scegli etichetta="Tipo *" opzioni={TIPI} valore={tipo} onCambia={setTipo} />

          <Text style={styles.etichetta}>Nome (facoltativo)</Text>
          <TextInput style={styles.campo} placeholder="Es. Fontana della piazza" placeholderTextColor="#7a8590" maxLength={80} value={nome} onChangeText={setNome} />

          <Text style={styles.nota}>
            {cercando ? 'Cerco comune e frazione...' : 'Comune e frazione sono letti da OpenStreetMap: correggili se sono sbagliati.'}
          </Text>
          <Text style={styles.etichetta}>Comune (facoltativo)</Text>
          <TextInput style={styles.campo} placeholder="Es. Châtillon" placeholderTextColor="#7a8590" maxLength={80} value={comune} onChangeText={setComune} />
          <Text style={styles.etichetta}>Frazione (facoltativa)</Text>
          <TextInput style={styles.campo} placeholder="Es. Panorama" placeholderTextColor="#7a8590" maxLength={80} value={frazione} onChangeText={setFrazione} />

          <Scegli etichetta="L'acqua è potabile?" opzioni={POTABILITA} valore={potabile} onCambia={setPotabile} />
          <Scegli etichetta="Funziona?" opzioni={STATI} valore={stato} onCambia={setStato} />
          <Scegli etichetta="Si può riempire una bottiglia?" opzioni={SI_NO} valore={bottiglia} onCambia={setBottiglia} />
          <Scegli etichetta="Come si raggiunge?" opzioni={ACCESSI} valore={accesso} onCambia={setAccesso} />
          <Scegli etichetta="Accessibile in carrozzina?" opzioni={SI_NO} valore={carrozzina} onCambia={setCarrozzina} />
          <Scegli etichetta="Stagionalità" opzioni={STAGIONI} valore={stagionalita} onCambia={setStagionalita} />
          {stagionalita === 'stagionale' ? (
            <TextInput style={styles.campo} placeholder="Es. aperta da giugno a settembre" placeholderTextColor="#7a8590" maxLength={200} value={notaStagione} onChangeText={setNotaStagione} />
          ) : null}

          <Text style={styles.etichetta}>Descrizione (facoltativa)</Text>
          <TextInput
            style={[styles.campo, styles.campoLungo]}
            placeholder="Come raggiungerla, note utili"
            placeholderTextColor="#7a8590"
            multiline
            maxLength={500}
            value={descrizione}
            onChangeText={setDescrizione}
          />

          {messaggio ? <Text style={styles.messaggio}>{messaggio}</Text> : null}

          <Pressable style={[styles.pulsante, occupato && styles.disattivo]} onPress={salva} disabled={occupato}>
            <Text style={styles.testoPulsante}>{occupato ? 'Salvo...' : 'Salva punto'}</Text>
          </Pressable>
          <Pressable onPress={chiudi} disabled={occupato}>
            <Text style={styles.link}>Annulla</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sfondo: { flex: 1, backgroundColor: '#f7f5f2' },
  contenuto: { padding: Spacing.four, paddingTop: 60, paddingBottom: 80, gap: Spacing.two },
  titolo: { fontSize: 24, fontWeight: '700', color: '#18395a' },
  nota: { fontSize: 14, color: '#4a5560', marginBottom: Spacing.two },
  etichetta: { fontSize: 15, fontWeight: '600', color: '#18395a', marginTop: Spacing.two },
  campo: { borderWidth: 1, borderColor: '#c5ccd3', borderRadius: 10, padding: Spacing.three, fontSize: 16, backgroundColor: '#ffffff', color: '#18395a' },
  campoLungo: { minHeight: 80, textAlignVertical: 'top' },
  riga: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  scelta: { borderWidth: 1, borderColor: '#18395a', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14, backgroundColor: '#ffffff' },
  sceltaAttiva: { backgroundColor: '#18395a' },
  testoScelta: { color: '#18395a', fontSize: 15 },
  testoSceltaAttiva: { color: '#ffffff' },
  messaggio: { backgroundColor: '#fff3cd', borderRadius: 8, padding: Spacing.two, color: '#5c4400', marginTop: Spacing.two },
  pulsante: { backgroundColor: '#18395a', borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginTop: Spacing.three },
  disattivo: { opacity: 0.5 },
  testoPulsante: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  link: { color: '#18395a', textAlign: 'center', fontSize: 15, textDecorationLine: 'underline', marginTop: Spacing.two },
});
