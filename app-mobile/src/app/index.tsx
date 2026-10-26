import * as Location from 'expo-location';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Mappa } from '@/components/mappa';
import { BottomTabInset, Spacing } from '@/constants/theme';
import type { Potabilita } from '@/data/punti';
import { usePunti } from '@/hooks/use-punti';

const ETICHETTE: Record<Potabilita, string> = {
  potabile: 'Acqua potabile',
  non_potabile: 'Acqua NON potabile',
  non_verificato: 'Potabilità non verificata',
};

export default function MappaScreen() {
  const [selezionato, setSelezionato] = useState<string | null>(null);
  const [posizione, setPosizione] = useState<{ lat: number; lon: number } | null>(null);
  const [messaggio, setMessaggio] = useState<string | null>(null);
  const { punti, errore } = usePunti();
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

  return (
    <View style={styles.container}>
      {punti ? (
        <Mappa punti={punti} posizione={posizione} onSelect={setSelezionato} />
      ) : (
        <Text style={styles.caricamento}>
          {errore ? `Errore nel caricare i punti: ${errore}` : 'Carico i punti...'}
        </Text>
      )}

      <Pressable style={styles.pulsante} onPress={trovaPosizione}>
        <Text style={styles.testoPulsante}>Dove sono</Text>
      </Pressable>
      {messaggio ? <Text style={styles.messaggio}>{messaggio}</Text> : null}

      {punto && (
        <View style={[styles.scheda, { bottom: BottomTabInset + Spacing.three }]}>
          <Text style={styles.nome}>{punto.nome}</Text>
          <Text style={styles.comune}>
            {punto.comune} · {punto.tipo}
          </Text>
          <Text style={styles.stato}>{ETICHETTE[punto.potabile]}</Text>
          {punto.descrizione ? <Text style={styles.descrizione}>{punto.descrizione}</Text> : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  caricamento: { flex: 1, textAlign: 'center', textAlignVertical: 'center', padding: Spacing.four, fontSize: 16, color: '#18395a' },
  pulsante: {
    position: 'absolute',
    top: 60,
    left: Spacing.three,
    backgroundColor: '#18395a',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  testoPulsante: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  messaggio: {
    position: 'absolute',
    top: 110,
    left: Spacing.three,
    right: Spacing.three,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: Spacing.two,
    color: '#5c4400',
  },
  scheda: {
    position: 'absolute',
    left: Spacing.three,
    right: Spacing.three,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: Spacing.three,
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  nome: { fontSize: 18, fontWeight: '700', color: '#18395a' },
  comune: { fontSize: 14, color: '#4a5560' },
  stato: { fontSize: 14, fontWeight: '600', color: '#18395a' },
  descrizione: { fontSize: 14, color: '#4a5560' },
});
