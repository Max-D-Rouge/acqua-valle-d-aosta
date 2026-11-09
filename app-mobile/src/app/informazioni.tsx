import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';

export default function InformazioniScreen() {
  return (
    <ScrollView style={styles.sfondo} contentContainerStyle={styles.container}>
      <Text style={styles.titolo}>Informazioni</Text>

      <View style={styles.avviso}>
        <Text style={styles.avvisoTesto}>
          Informazione inserita dagli utenti: non garantisce che l'acqua sia sicura. In caso di dubbio non bere.
        </Text>
      </View>

      <Text style={styles.sezione}>La tua posizione</Text>
      <Text style={styles.testo}>
        La posizione GPS serve solo sul tuo telefono per orientarti sulla mappa: non viene salvata né inviata.
        Diventa pubblica solo se crei un nuovo punto e lo confermi in modo esplicito.
      </Text>

      <Text style={styles.sezione}>Crediti</Text>
      <Text style={styles.testo}>Dati della mappa: © OpenStreetMap contributors.</Text>
      <Text style={styles.testo}>Mappa di base: OpenFreeMap.</Text>
      <Text style={styles.testo}>Visualizzazione della mappa: MapLibre.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sfondo: { flex: 1, backgroundColor: '#f7f5f2' },
  container: { padding: Spacing.four, paddingTop: Spacing.six, gap: Spacing.three },
  titolo: { fontSize: 28, fontWeight: '700', color: '#18395a' },
  sezione: { fontSize: 20, fontWeight: '600', color: '#18395a', marginTop: Spacing.three },
  testo: { fontSize: 16, color: '#4a5560', lineHeight: 22 },
  avviso: { backgroundColor: '#fff3cd', borderRadius: 8, padding: Spacing.three },
  avvisoTesto: { color: '#5c4400', fontSize: 16, lineHeight: 22 },
});