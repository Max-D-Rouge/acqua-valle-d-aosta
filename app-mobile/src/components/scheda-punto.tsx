import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { SegnalaPunto } from '@/components/segnala-punto';
import { Spacing } from '@/constants/theme';
import type { Potabilita, PuntoAcqua, TipoPunto } from '@/data/punti';

type Props = {
  punto: PuntoAcqua;
  ricarica: () => void;
  // Distanza dal bordo basso dello schermo (per stare sopra la barra delle schede).
  bottom: number;
};

// Stesso verde / rosso / grigio dei pallini sulla mappa (mappa.tsx).
const POTABILITA: Record<Potabilita, { colore: string; chiaro: string; etichetta: string }> = {
  potabile: { colore: '#1f9d55', chiaro: '#e3f4ea', etichetta: 'Indicata come potabile' },
  non_potabile: { colore: '#d64545', chiaro: '#fbe7e7', etichetta: 'Indicata come NON potabile' },
  non_verificato: { colore: '#8a94a0', chiaro: '#eceff2', etichetta: 'Potabilità non verificata' },
};

const TIPI: Record<TipoPunto, string> = {
  fontana: 'Fontana',
  fontanella: 'Fontanella',
  sorgente: 'Sorgente',
  punto_struttura: 'In una struttura',
  altro: 'Altro',
};

// Avviso fisso (requisito RQ-01): i dati li inseriscono gli utenti.
const AVVISO_ACQUA = "Informazione inserita dagli utenti: non garantisce che l'acqua sia sicura. In caso di dubbio non bere.";

type Dettaglio = { testo: string; tono: 'ok' | 'no' };

// Dettagli mostrati in "Maggiori informazioni": solo i valori conosciuti (non "non so").
function dettagli(p: PuntoAcqua): Dettaglio[] {
  const righe: Dettaglio[] = [];
  if (p.stato === 'funzionante') righe.push({ testo: 'Funziona', tono: 'ok' });
  if (p.stato === 'non_funzionante') righe.push({ testo: 'Non funziona', tono: 'no' });
  if (p.bottiglia === 'si') righe.push({ testo: 'Si può riempire una bottiglia', tono: 'ok' });
  if (p.bottiglia === 'no') righe.push({ testo: 'Non adatta a riempire bottiglie', tono: 'no' });
  if (p.accesso === 'strada') righe.push({ testo: 'Raggiungibile su strada', tono: 'ok' });
  if (p.accesso === 'sentiero') righe.push({ testo: 'Raggiungibile su sentiero', tono: 'ok' });
  if (p.carrozzina === 'si') righe.push({ testo: 'Accessibile in carrozzina', tono: 'ok' });
  if (p.carrozzina === 'no') righe.push({ testo: 'Non accessibile in carrozzina', tono: 'no' });
  if (p.stagionalita === 'tutto_anno') righe.push({ testo: "Disponibile tutto l'anno", tono: 'ok' });
  if (p.stagionalita === 'stagionale') righe.push({ testo: p.stagionalita_nota ? `Stagionale: ${p.stagionalita_nota}` : 'Stagionale', tono: 'no' });
  return righe;
}

// Scheda del punto: compatta (nome, tipo, potabilità) con un pulsante per le maggiori informazioni.
export function SchedaPunto({ punto, ricarica, bottom }: Props) {
  const [aperta, setAperta] = useState(false);
  const pot = POTABILITA[punto.potabile];
  const righe = dettagli(punto);
  const sottotitolo = [punto.frazione, punto.comune, TIPI[punto.tipo]].filter(Boolean).join(' · ');

  return (
    <View style={[styles.scheda, { bottom, borderLeftColor: pot.colore }]}>
      <Text style={styles.nome}>{punto.nome}</Text>
      <Text style={styles.sottotitolo}>{sottotitolo}</Text>
      <View style={[styles.badge, { backgroundColor: pot.chiaro }]}>
        <View style={[styles.pallino, { backgroundColor: pot.colore }]} />
        <Text style={[styles.testoBadge, { color: pot.colore }]}>{pot.etichetta}</Text>
      </View>

      <Pressable style={styles.pulsante} onPress={() => setAperta(!aperta)}>
        <Text style={styles.testoPulsante}>{aperta ? 'Meno informazioni ▴' : 'Maggiori informazioni ▾'}</Text>
      </Pressable>

      {aperta ? (
        <ScrollView style={styles.dettagli} nestedScrollEnabled>
          {righe.length > 0 ? (
            <View style={styles.chips}>
              {righe.map((r) => (
                <View key={r.testo} style={[styles.chip, r.tono === 'ok' ? styles.chipOk : styles.chipNo]}>
                  <Text style={[styles.testoChip, r.tono === 'ok' ? styles.testoChipOk : styles.testoChipNo]}>{r.testo}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.vuoto}>Nessun dettaglio inserito per questo punto.</Text>
          )}
          {punto.descrizione ? <Text style={styles.descrizione}>{punto.descrizione}</Text> : null}
          <Text style={styles.titolo}>Aiutaci a tenerla aggiornata</Text>
          <SegnalaPunto puntoId={punto.id} onFatto={ricarica} />
          <Text style={styles.avviso}>{AVVISO_ACQUA}</Text>
        </ScrollView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  scheda: {
    position: 'absolute',
    left: Spacing.three,
    right: Spacing.three,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderLeftWidth: 6,
    padding: Spacing.three,
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  nome: { fontSize: 18, fontWeight: '700', color: '#18395a' },
  sottotitolo: { fontSize: 14, color: '#4a5560' },
  badge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 6, borderRadius: 14, paddingVertical: 4, paddingHorizontal: 10 },
  pallino: { width: 10, height: 10, borderRadius: 5 },
  testoBadge: { fontSize: 13, fontWeight: '700' },
  pulsante: { backgroundColor: '#18395a', borderRadius: 12, paddingVertical: 10, alignItems: 'center', marginTop: 4 },
  testoPulsante: { color: '#ffffff', fontSize: 15, fontWeight: '600' },
  dettagli: { maxHeight: 340, marginTop: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { borderRadius: 14, paddingVertical: 4, paddingHorizontal: 10 },
  chipOk: { backgroundColor: '#e3f4ea' },
  chipNo: { backgroundColor: '#fff3cd' },
  testoChip: { fontSize: 13, fontWeight: '600' },
  testoChipOk: { color: '#17703f' },
  testoChipNo: { color: '#7a5a00' },
  vuoto: { fontSize: 14, color: '#4a5560' },
  descrizione: { fontSize: 14, color: '#4a5560', marginTop: 8 },
  titolo: { fontSize: 14, fontWeight: '700', color: '#18395a', marginTop: 12 },
  avviso: { fontSize: 12, color: '#7a5a00', backgroundColor: '#fff3cd', borderRadius: 8, padding: 8, marginTop: 10 },
});
