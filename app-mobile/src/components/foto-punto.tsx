import { Image } from 'expo-image';
import { useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useFoto } from '@/hooks/use-foto';
import { useSessione } from '@/hooks/use-sessione';
import { caricaFoto, controllaArea, eliminaFoto, MAX_FOTO_PER_PUNTO, RAGGIO_AREA_M, scattaFoto, urlFoto, type Foto } from '@/lib/foto';

// Foto del punto: miniature in fila, tocco per ingrandire, pulsanti per aggiungerne (solo se collegato).
export function FotoPunto({ puntoId, lat, lon }: { puntoId: string; lat: number; lon: number }) {
  const { sessione } = useSessione();
  const { foto, ricarica } = useFoto(puntoId, true);
  const [inCorso, setInCorso] = useState(false);
  const [messaggio, setMessaggio] = useState<string | null>(null);
  const [aperta, setAperta] = useState<Foto | null>(null);

  async function aggiungi() {
    setMessaggio(null);
    setInCorso(true);
    // Prima si controlla che l'utente sia nell'area del punto, poi si apre la fotocamera.
    const fuoriArea = await controllaArea(lat, lon);
    setInCorso(false);
    if (fuoriArea) {
      setMessaggio(fuoriArea);
      return;
    }
    const scelta = await scattaFoto();
    if (!scelta) return;
    if ('errore' in scelta) {
      setMessaggio(scelta.errore);
      return;
    }
    setInCorso(true);
    const errore = await caricaFoto(puntoId, scelta);
    setInCorso(false);
    if (errore) setMessaggio(errore);
    else await ricarica();
  }

  function conferma(f: Foto) {
    Alert.alert('Eliminare la foto?', 'Non si può annullare.', [
      { text: 'Annulla', style: 'cancel' },
      {
        text: 'Elimina',
        style: 'destructive',
        onPress: async () => {
          const errore = await eliminaFoto(f);
          setAperta(null);
          if (errore) setMessaggio(errore);
          else await ricarica();
        },
      },
    ]);
  }

  const piene = foto.length >= MAX_FOTO_PER_PUNTO;

  return (
    <View style={styles.contenitore}>
      <Text style={styles.titolo}>Foto</Text>
      {foto.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} nestedScrollEnabled contentContainerStyle={styles.fila}>
          {foto.map((f) => (
            <Pressable key={f.id} onPress={() => setAperta(f)}>
              <Image source={{ uri: urlFoto(f.percorso, true) }} style={styles.miniatura} contentFit="cover" />
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.vuoto}>Nessuna foto per ora.</Text>
      )}

      {sessione ? (
        piene ? (
          <Text style={styles.vuoto}>Questo punto ha già {MAX_FOTO_PER_PUNTO} foto.</Text>
        ) : (
          <Pressable style={styles.pulsante} onPress={aggiungi} disabled={inCorso}>
            <Text style={styles.testoPulsante}>📷 Scatta una foto</Text>
          </Pressable>
        )
      ) : (
        <Text style={styles.vuoto}>Accedi dal Profilo per aggiungere foto.</Text>
      )}
      {inCorso ? <ActivityIndicator /> : null}
      {messaggio ? <Text style={styles.errore}>{messaggio}</Text> : null}
      <Text style={styles.nota}>Si può scattare solo vicino al punto (entro {RAGGIO_AREA_M} m): la tua posizione serve solo a verificarlo e non viene salvata. Fotografa solo il punto d'acqua, senza persone riconoscibili.</Text>

      <Modal visible={!!aperta} transparent animationType="fade" onRequestClose={() => setAperta(null)}>
        <View style={styles.sfondo}>
          {aperta ? <Image source={{ uri: urlFoto(aperta.percorso) }} style={styles.grande} contentFit="contain" /> : null}
          <View style={styles.azioni}>
            <Pressable style={styles.pulsante} onPress={() => setAperta(null)}>
              <Text style={styles.testoPulsante}>Chiudi</Text>
            </Pressable>
            {aperta && sessione?.user.id && aperta.autore === sessione.user.id ? (
              <Pressable style={[styles.pulsante, styles.elimina]} onPress={() => conferma(aperta)}>
                <Text style={styles.testoPulsante}>Elimina</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  contenitore: { gap: 8, marginTop: 8 },
  titolo: { fontSize: 15, fontWeight: '700', color: '#18395a' },
  fila: { gap: 8 },
  miniatura: { width: 90, height: 90, borderRadius: 10, backgroundColor: '#e5edf3' },
  vuoto: { fontSize: 13, color: '#6b7680' },
  pulsante: { flex: 1, backgroundColor: '#18395a', borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  testoPulsante: { color: '#ffffff', fontSize: 15, fontWeight: '600' },
  elimina: { backgroundColor: '#d64545' },
  errore: { fontSize: 13, color: '#b42318' },
  nota: { fontSize: 12, color: '#6b7680' },
  sfondo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'center', padding: 16, gap: 16 },
  grande: { width: '100%', height: '75%' },
  azioni: { flexDirection: 'row', gap: 8 },
});
