import * as Location from 'expo-location';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FormPunto } from '@/components/form-punto';
import { Mappa } from '@/components/mappa';
import { MenuVentaglio } from '@/components/menu-ventaglio';
import { BottomTabInset, Spacing } from '@/constants/theme';
import type { Potabilita, PuntoAcqua } from '@/data/punti';
import { usePunti } from '@/hooks/use-punti';
import { useSessione } from '@/hooks/use-sessione';

const ETICHETTE: Record<Potabilita, string> = {
  potabile: 'Acqua potabile',
  non_potabile: 'Acqua NON potabile',
  non_verificato: 'Potabilità non verificata',
};

// Righe di dettaglio della scheda: si mostrano solo i valori conosciuti (non "non so").
function dettagli(p: PuntoAcqua): string[] {
  const righe: string[] = [];
  if (p.stato === 'funzionante') righe.push('Funziona');
  if (p.stato === 'non_funzionante') righe.push('Non funziona');
  if (p.bottiglia === 'si') righe.push('Si può riempire una bottiglia');
  if (p.bottiglia === 'no') righe.push('Non adatta a riempire bottiglie');
  if (p.accesso === 'strada') righe.push('Raggiungibile su strada');
  if (p.accesso === 'sentiero') righe.push('Raggiungibile su sentiero');
  if (p.carrozzina === 'si') righe.push('Accessibile in carrozzina');
  if (p.carrozzina === 'no') righe.push('Non accessibile in carrozzina');
  if (p.stagionalita === 'tutto_anno') righe.push("Disponibile tutto l'anno");
  if (p.stagionalita === 'stagionale') righe.push(p.stagionalita_nota ? `Stagionale: ${p.stagionalita_nota}` : 'Stagionale');
  return righe;
}

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

      {punto && (
        <View style={[styles.scheda, { bottom: BottomTabInset + Spacing.three }]}>
          <Text style={styles.nome}>{punto.nome}</Text>
          <Text style={styles.comune}>
            {punto.comune} · {punto.tipo}
          </Text>
          <Text style={styles.stato}>{ETICHETTE[punto.potabile]}</Text>
          {dettagli(punto).map((riga) => (
            <Text key={riga} style={styles.dettaglio}>
              • {riga}
            </Text>
          ))}
          {punto.descrizione ? <Text style={styles.descrizione}>{punto.descrizione}</Text> : null}
        </View>
      )}
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
  dettaglio: { fontSize: 14, color: '#18395a' },
  descrizione: { fontSize: 14, color: '#4a5560' },
});
