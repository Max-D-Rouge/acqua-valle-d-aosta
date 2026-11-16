import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Palette } from '@/constants/theme';

type Props = {
  satellite: boolean;
  rilievo: boolean;
  onSatellite: () => void;
  onRilievo: () => void;
};

// Due pulsanti sotto i tasti dello zoom: foto satellitari e rilievo 3D (montagne e edifici in prospettiva).
export function PulsantiMappa({ satellite, rilievo, onSatellite, onRilievo }: Props) {
  return (
    <View style={styles.colonna} pointerEvents="box-none">
      <Pressable style={[styles.tasto, satellite && styles.attivo]} onPress={onSatellite} accessibilityLabel="Satellite">
        <Text style={styles.simbolo}>🛰</Text>
      </Pressable>
      <Pressable style={[styles.tasto, rilievo && styles.attivo]} onPress={onRilievo} accessibilityLabel="Rilievo 3D">
        <Text style={[styles.testo, rilievo && styles.testoAttivo]}>3D</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  colonna: { position: 'absolute', top: 128, right: 10, gap: 8 },
  tasto: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Palette.superficie,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 4,
  },
  attivo: { backgroundColor: Palette.secondario },
  simbolo: { fontSize: 20 },
  testo: { fontSize: 15, fontWeight: '800', color: Palette.secondario },
  testoAttivo: { color: Palette.superficie },
});
