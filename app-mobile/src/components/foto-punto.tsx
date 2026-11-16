import { Image } from 'expo-image';
import { useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useFoto } from '@/hooks/use-foto';
import { useSessione } from '@/hooks/use-sessione';
import { supabase } from '@/lib/supabase';
import { caricaFoto, controllaArea, eliminaFoto, MAX_FOTO_PER_PUNTO, RAGGIO_AREA_M, scattaFoto, urlFoto, type Foto } from '@/lib/foto';

const MOTIVI_FOTO = [
  { valore: 'non_e_il_punto', etichetta: 'Non è questo punto' },
  { valore: 'persone_riconoscibili', etichetta: 'Persone riconoscibili' },
  { valore: 'inappropriata', etichetta: 'Inappropriata' },
];

// Foto del punto: miniature in fila, tocco per ingrandire, pulsanti per aggiungerne (solo se collegato).
export function FotoPunto({ puntoId, lat, lon }: { puntoId: string; lat: number; lon: number }) {
  const { sessione } = useSessione();
  const { foto, ricarica } = useFoto(puntoId, true);
  const [inCorso, setInCorso] = useState(false);
  const [messaggio, setMessaggio] = useState<string | null>(null);
  const [aperta, setAperta] = useState<Foto | null>(null);
  const [segnalando, setSegnalando] = useState(false);
  const [esitoSegnalazione, setEsitoSegnalazione] = useState<string | null>(null);

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

  // Segnalazione di una foto: si sceglie il motivo e la riga va nella tabella segnalazioni_foto (database/13).
  async function segnala(f: Foto, motivo: string) {
    setSegnalando(false);
    const { error } = await supabase.from('segnalazioni_foto').insert({ foto_id: f.id, motivo });
    if (!error) setEsitoSegnalazione('Segnalazione inviata agli amministratori. Grazie.');
    else if (error.code === '23505') setEsitoSegnalazione('Hai già segnalato questa foto.');
    else setEsitoSegnalazione(`Non inviata: ${error.message}`);
  }

  return (
    <View style={styles.contenitore}>
      <Text style={styles.titolo}>Foto</Text>
      {foto.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} nestedScrollEnabled contentContainerStyle={styles.fila}>
          {foto.map((f) => (
            <Pressable key={f.id} onPress={() => { setSegnalando(false); setEsitoSegnalazione(null); setAperta(f); }}>
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
          {aperta && sessione?.user.id && aperta.autore !== sessione.user.id ? (
            <View style={styles.segnala}>
              {segnalando ? (
                <View style={styles.motivi}>
                  {MOTIVI_FOTO.map((m) => (
                    <Pressable key={m.valore} style={styles.motivo} onPress={() => segnala(aperta, m.valore)}>
                      <Text style={styles.testoMotivo}>{m.etichetta}</Text>
                    </Pressable>
                  ))}
                </View>
              ) : (
                <Pressable onPress={() => setSegnalando(true)}>
                  <Text style={styles.linkSegnala}>Segnala questa foto</Text>
                </Pressable>
              )}
              {esitoSegnalazione ? <Text style={styles.esitoSegnalazione}>{esitoSegnalazione}</Text> : null}
            </View>
          ) : null}
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
  segnala: { gap: 8, alignItems: 'center' },
  motivi: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  motivo: { borderWidth: 1, borderColor: '#ffffff', borderRadius: 16, paddingVertical: 6, paddingHorizontal: 12 },
  testoMotivo: { color: '#ffffff', fontSize: 13 },
  linkSegnala: { color: '#ffffff', fontSize: 14, textDecorationLine: 'underline' },
  esitoSegnalazione: { color: '#ffffff', fontSize: 13 },
});
