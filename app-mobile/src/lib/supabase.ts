import { createClient } from '@supabase/supabase-js';

// Indirizzo e chiave PUBBLICA del progetto Supabase, letti dal file .env (che non va su GitHub).
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const chiave = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !chiave) {
  throw new Error(
    'Mancano EXPO_PUBLIC_SUPABASE_URL o EXPO_PUBLIC_SUPABASE_ANON_KEY nel file app-mobile/.env (poi riavvia con: npx expo start --clear)'
  );
}

// Per ora nessun login: non salviamo sessioni. Lo cambieremo quando faremo l'autenticazione.
export const supabase = createClient(url, chiave, {
  auth: { persistSession: false, autoRefreshToken: false },
});
