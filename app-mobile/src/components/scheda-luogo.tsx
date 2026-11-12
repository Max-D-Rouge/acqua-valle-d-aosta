import { useState } from 'react';
import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { cercaInfo, type InfoLuogo } from '@/lib/info-luogo';
import { apriMezzi } from '@/lib/mappe-esterne';
import type { Mezzo } from '@/lib/percorso';

export type LuogoMappa = { nome: string; classe?: string; sottoclasse?: string; lat: number; lon: number };

type Props = {
  luogo: LuogoMappa;
  bottom: number;
  onPercorso: (luogo: LuogoMappa, mezzo: Mezzo) => void;
  onChiudi: () => void;
};

// Nomi italiani delle categorie più comuni dei luoghi di OpenStreetMap (sottoclasse o classe).
const CATEGORIE: Record<string, string> = {
  restaurant: 'Ristorante', cafe: 'Bar / caffè', bar: 'Bar', pub: 'Pub', fast_food: 'Fast food', ice_cream: 'Gelateria', bakery: 'Panetteria',
  supermarket: 'Supermercato', convenience: 'Minimarket', grocery: 'Alimentari', butcher: 'Macelleria', clothes: 'Abbigliamento', shoes: 'Calzature',
  sports: 'Articoli sportivi', outdoor: 'Articoli outdoor', hairdresser: 'Parrucchiere', florist: 'Fiorista', kiosk: 'Edicola', shop: 'Negozio',
  hotel: 'Hotel', hostel: 'Ostello', guest_house: 'Affittacamere', motel: 'Motel', camp_site: 'Campeggio', alpine_hut: 'Rifugio', chalet: 'Chalet', lodging: 'Alloggio',
  pharmacy: 'Farmacia', hospital: 'Ospedale', doctors: 'Medico', dentist: 'Dentista', clinic: 'Ambulatorio', bank: 'Banca', atm: 'Bancomat', post: 'Posta', post_office: 'Ufficio postale',
  information: 'Informazioni turistiche', museum: 'Museo', castle: 'Castello', attraction: 'Attrazione', viewpoint: 'Punto panoramico', monument: 'Monumento', place_of_worship: 'Luogo di culto',
  school: 'Scuola', kindergarten: 'Asilo', library: 'Biblioteca', townhall: 'Municipio', police: 'Polizia', fire_station: 'Vigili del fuoco',
  parking: 'Parcheggio', fuel: 'Distributore', charging_station: 'Ricarica elettrica', bus: 'Fermata autobus', bus_stop: 'Fermata autobus', railway: 'Stazione', station: 'Stazione',
  playground: 'Parco giochi', park: 'Parco', pitch: 'Campo sportivo', swimming_pool: 'Piscina', ski: 'Sci', cable_car: 'Impianto di risalita', picnic_site: 'Area picnic', toilets: 'Servizi igienici',
};

function categoria(l: LuogoMappa): string {
  const chiave = (l.sottoclasse && CATEGORIE[l.sottoclasse] ? l.sottoclasse : undefined) ?? (l.classe && CATEGORIE[l.classe] ? l.classe : undefined);
  if (chiave) return CATEGORIE[chiave];
  const grezzo = l.sottoclasse || l.classe || 'Luogo';
  return grezzo.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
}

// Scheda di un luogo toccato sulla mappa (negozio, ristorante, rifugio...): come nelle app di mappe.
export function SchedaLuogo({ luogo, bottom, onPercorso, onChiudi }: Props) {
  const [info, setInfo] = useState<InfoLuogo | null | undefined>(undefined);
  const [cerco, setCerco] = useState(false);

  async function piuInfo() {
    setCerco(true);
    setInfo(await cercaInfo(luogo.nome, luogo.lat, luogo.lon));
    setCerco(false);
  }

  const vuota = info && !info.indirizzo && !info.orari && !info.telefono && !info.sito;

  return (
    <View style={[styles.scheda, { bottom }]}>
      <Text style={styles.nome}>{luogo.nome}</Text>
      <Text style={styles.categoria}>{categoria(luogo)}</Text>

      <View style={styles.riga}>
        <Pressable style={[styles.pulsante, styles.blu]} onPress={() => onPercorso(luogo, 'piedi')}>
          <Text style={styles.testo}>🚶 A piedi</Text>
        </Pressable>
        <Pressable style={[styles.pulsante, styles.blu]} onPress={() => onPercorso(luogo, 'auto')}>
          <Text style={styles.testo}>🚗 In auto</Text>
        </Pressable>
        <Pressable style={[styles.pulsante, styles.verde]} onPress={() => apriMezzi(luogo.lat, luogo.lon)}>
          <Text style={styles.testo}>🚌 Mezzi</Text>
        </Pressable>
      </View>

      {info === undefined ? (
        <Pressable style={styles.scuro} onPress={piuInfo} disabled={cerco}>
          <Text style={styles.testo}>{cerco ? 'Cerco...' : 'Più informazioni'}</Text>
        </Pressable>
      ) : null}
      {cerco ? <ActivityIndicator /> : null}
      {info === null ? <Text style={styles.nota}>Non riesco a leggere altre informazioni ora. Riprova più tardi.</Text> : null}
      {vuota ? <Text style={styles.nota}>Su OpenStreetMap non ci sono altre informazioni su questo luogo.</Text> : null}
      {info?.indirizzo ? <Text style={styles.dato}>📍 {info.indirizzo}</Text> : null}
      {info?.orari ? <Text style={styles.dato}>🕒 {info.orari}</Text> : null}
      {info?.telefono ? (
        <Text style={[styles.dato, styles.link]} onPress={() => Linking.openURL(`tel:${info.telefono}`)}>
          📞 {info.telefono}
        </Text>
      ) : null}
      {info?.sito ? (
        <Text style={[styles.dato, styles.link]} onPress={() => Linking.openURL(info.sito as string)} numberOfLines={1}>
          🌐 {info.sito}
        </Text>
      ) : null}
      {info ? <Text style={styles.nota}>Informazioni scritte dagli utenti di OpenStreetMap: possono essere incomplete o non aggiornate.</Text> : null}

      <Pressable onPress={onChiudi}>
        <Text style={styles.chiudi}>Chiudi</Text>
      </Pressable>
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
    borderLeftColor: '#f59e0b',
    padding: Spacing.three,
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  nome: { fontSize: 18, fontWeight: '700', color: '#18395a' },
  categoria: { fontSize: 14, color: '#4a5560' },
  riga: { flexDirection: 'row', gap: 8, marginTop: 4 },
  pulsante: { flex: 1, borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  blu: { backgroundColor: '#2563eb' },
  verde: { backgroundColor: '#1f9d55' },
  scuro: { backgroundColor: '#18395a', borderRadius: 12, paddingVertical: 10, alignItems: 'center', marginTop: 4 },
  testo: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  dato: { fontSize: 14, color: '#18395a' },
  link: { color: '#2563eb', textDecorationLine: 'underline' },
  nota: { fontSize: 12, color: '#6b7680' },
  chiudi: { color: '#d64545', textAlign: 'center', fontSize: 14, textDecorationLine: 'underline', marginTop: 4 },
});
