import { Linking, Platform } from 'react-native';

// Apre l'app delle mappe del telefono in modalità trasporto pubblico (fermate, orari, linee).
// Noi non abbiamo dati sugli autobus e non vediamo né salviamo la tua posizione: se ne occupa l'app delle mappe.
export function apriMezzi(lat: number, lon: number) {
  const url = Platform.select({
    ios: `http://maps.apple.com/?daddr=${lat},${lon}&dirflg=r`,
    default: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=transit`,
  });
  Linking.openURL(url);
}
