import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import type { StatoNavigazione } from '@/hooks/use-navigazione';
import { formattaDistanza, formattaDurata, type Percorso } from '@/lib/percorso';

type Props = {
  destinazione: string;
  percorso: Percorso;
  stato: StatoNavigazione;
  ricalcolo: boolean;
  errore: string | null;
  bottom: number;
  onTermina: () => void;
};

// Navigazione stile "app del GPS": in alto la prossima indicazione, in basso quanto manca.
export function SchedaNavigazione({ destinazione, percorso, stato, ricalcolo, errore, bottom, onTermina }: Props) {
  const prossimo = percorso.passi[stato.passo + 1];
  // All'inizio mostriamo il primo passo ("Dirigiti verso..."); poi sempre la manovra che sta per arrivare.
  const alInizio = stato.passo === 0 && stato.fattiM < 30 && percorso.passi[0];

  let titolo: string;
  let dettaglio = '';
  if (errore) {
    titolo = errore;
  } else if (stato.arrivato) {
    titolo = `Sei arrivato: ${destinazione}`;
  } else if (!stato.posizione) {
    titolo = 'Cerco la tua posizione...';
  } else if (ricalcolo) {
    titolo = 'Ricalcolo il percorso...';
  } else if (alInizio) {
    titolo = percorso.passi[0].istruzione;
  } else if (prossimo) {
    titolo = prossimo.istruzione;
    dettaglio = `tra ${formattaDistanza(stato.distanzaProssimoM)}`;
  } else {
    titolo = `Prosegui fino a ${destinazione}`;
    dettaglio = `ancora ${formattaDistanza(stato.restanteM)}`;
  }

  return (
    <>
      <View style={styles.alto}>
        {dettaglio ? <Text style={styles.distanza}>{dettaglio}</Text> : null}
        <Text style={styles.istruzione}>{titolo}</Text>
        {stato.fuoriRotta && !ricalcolo ? <Text style={styles.nota}>Sei fuori dal percorso</Text> : null}
      </View>
      <View style={[styles.basso, { bottom }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.riepilogo}>
            {formattaDistanza(stato.restanteM || percorso.distanzaM)} · {formattaDurata(stato.restanteS || percorso.durataS)}
          </Text>
          <Text style={styles.notaBasso}>verso {destinazione}</Text>
        </View>
        <Pressable style={styles.termina} onPress={onTermina}>
          <Text style={styles.testoTermina}>Termina</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  alto: {
    position: 'absolute',
    top: 60,
    left: Spacing.three,
    right: Spacing.three,
    backgroundColor: '#18395a',
    borderRadius: 16,
    padding: Spacing.three,
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 8,
  },
  distanza: { color: '#9ec5ff', fontSize: 22, fontWeight: '700' },
  istruzione: { color: '#ffffff', fontSize: 20, fontWeight: '600' },
  basso: {
    position: 'absolute',
    left: Spacing.three,
    right: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: Spacing.three,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  riepilogo: { fontSize: 18, fontWeight: '700', color: '#18395a' },
  nota: { fontSize: 13, color: '#9ec5ff' },
  notaBasso: { fontSize: 13, color: '#6b7680' },
  termina: { backgroundColor: '#d64545', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20 },
  testoTermina: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});
