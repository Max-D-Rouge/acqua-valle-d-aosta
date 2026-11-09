import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

// Indirizzo e chiave PUBBLICA del progetto Supabase, letti dal file .env (che non va su GitHub).
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const chiave = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !chiave) {
  throw new Error(
    'Mancano EXPO_PUBLIC_SUPABASE_URL o EXPO_PUBLIC_SUPABASE_ANON_KEY nel file app-mobile/.env (poi riavvia con: npx expo start --clear)'
  );
}

// Quando Expo prepara la pagina web su Node (rendering sul server) "window" non esiste e AsyncStorage
// andrebbe in errore ("window is not defined"). In quel caso non c'è nessuna sessione da leggere o salvare.
const archivio = {
  getItem: (chiave: string) =>
    typeof window === 'undefined' ? Promise.resolve(null) : AsyncStorage.getItem(chiave),
  setItem: (chiave: string, valore: string) =>
    typeof window === 'undefined' ? Promise.resolve() : AsyncStorage.setItem(chiave, valore),
  removeItem: (chiave: string) =>
    typeof window === 'undefined' ? Promise.resolve() : AsyncStorage.removeItem(chiave),
};

// La sessione (chi ha fatto il login) viene salvata sul telefono con AsyncStorage,
// così l'utente resta collegato anche dopo aver chiuso l'app.
export const supabase = createClient(url, chiave, {
  auth: {
    storage: archivio,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

// Il rinnovo automatico del token si ferma quando l'app è in background e riparte quando torna in primo piano.
AppState.addEventListener('change', (stato) => {
  if (stato === 'active') supabase.auth.startAutoRefresh();
  else supabase.auth.stopAutoRefresh();
});
