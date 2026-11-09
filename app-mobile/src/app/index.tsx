import * as Location from 'expo-location';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FormPunto } from '@/components/form-punto';
import { Mappa } from '@/components/mappa';
import { MenuVentaglio } from '@/components/menu-ventaglio';
import { SchedaPunto } from '@/components/scheda-punto';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { usePunti } from '@/hooks/use-punti';
import { useSessione } from '@/hooks/use-sessione';

export default function MappaScreen() {
  const [selezionato, setSelezionato] = useState<string | null>(null);
  const [posizione, setPosizione] = useState<{ lat: number; lon: number } | null>(null);
  const [messaggio, setMessaggio] = useState<string | null>(null);
  const [formAperto, setFormAperto] = useState(false);
  const [sceltaAttiva, setSceltaAttiva] = useState(false);
  const [posizioneScelta, setPosizioneScelta] = useState<{ lat: number; lon: number } | null>(null);
  const { punti, errore, ricarica } = usePunti();
  const { sessione } = useSessione();
  const punto = punti?.find((p) => p.id === selezionato);

  // Si attiva solo quando l'utente tocca "Dove sono": la posizione non viene mai chiesta prima.
  async function trovaPosizione() {
    setMessaggio(null);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      // Permesso negato: l'app continua a funzionare, senza il pallino blu.
      setMessaggio('Permesso di posizione negato. Puoi comunque usare la mappa.');
      return;
    }
    try {
      const { coords } = await Location.getCurrentPositionAsync({});
      // Resta solo in memoria: non viene salvata né inviata a nessun server.
      setPosizione({ lat: coords.latitude, lon: coords.longitude });
    } catch {
      setMessaggio('Non riesco a leggere la posizione. Riprova.');
    }
  }

  // Aggiungere un punto richiede l'accesso: se non sei collegato ti rimandiamo al Profilo.
  function apriForm() {
    if (!sessione) {
      setMessaggio('Per aggiungere un punto accedi dalla scheda Profilo.');
      return;
    }
    setMessaggio(null);
    setSelezionato(null);
    setSceltaAttiva(true);
  }

  // Il punto è stato toccato sulla mappa: si apre il modulo con quelle coordinate.
  function dopoScelta(p: { lat: number; lon: number }) {
    setPosizioneScelta(p);
    setSceltaAttiva(false);
    setFormAperto(true);
  }

  async function dopoSalvataggio() {
    setFormAperto(false);
    await ricarica();
  }

  return (
    <View style={styles.container}>
      {punti ? (
        <Mappa punti={punti} posizione={posizione} onSelect={setSelezionato} sceltaAttiva={sceltaAttiva} onScelta={dopoScelta} />
      ) : (
        <Text style={styles.caricamento}>
          {errore ? `Errore nel caricare i punti: ${errore}` : 'Carico i punti...'}
        </Text>
      )}

      <MenuVentaglio
        azioni={[
          { chiave: 'posizione', etichetta: 'Dove sono', simbolo: '◎', onPress: trovaPosizione },
          { chiave: 'aggiungi', etichetta: 'Aggiungi', simbolo: '+', onPress: apriForm },
        ]}
      />
      {sceltaAttiva ? (
        <View style={styles.banner}>
          <Text style={styles.testoBanner}>Tocca la mappa dove si trova il punto</Text>
          <Pressable onPress={() => setSceltaAttiva(false)}>
            <Text style={styles.annulla}>Annulla</Text>
          </Pressable>
        </View>
      ) : null}
      {messaggio ? <Text style={styles.messaggio}>{messaggio}</Text> : null}
      <FormPunto posizione={posizioneScelta} visibile={formAperto} onChiudi={() => setFormAperto(false)} onSalvato={dopoSalvataggio} />

      {punto && <SchedaPunto key={punto.id} punto={punto} ricarica={ricarica} bottom={BottomTabInset + Spacing.four} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  caricamento: { flex: 1, textAlign: 'center', textAlignVertical: 'center', padding: Spacing.four, fontSize: 16, color: '#18395a' },
  banner: {
    position: 'absolute',
    top: 60,
    left: Spacing.three,
    right: Spacing.three,
    backgroundColor: '#18395a',
    borderRadius: 14,
    borderTopLeftRadius: 3,
    padding: Spacing.three,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  testoBanner: { color: '#ffffff', fontSize: 15, fontWeight: '600', flex: 1 },
  annulla: { color: '#7dd3fc', fontSize: 15, fontWeight: '700' },
  messaggio: {
    position: 'absolute',
    top: 60,
    left: Spacing.three,
    right: Spacing.three,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: Spacing.two,
    color: '#5c4400',
  },
});
