# 07 - Autenticazione

Stato: codice scritto il 2026-11-06; provato su iPhone (Expo Go) il 2026-11-06 e il 2026-11-09 (vedi sezione Test).

## Cos'è
Autenticazione = capire chi sta usando l'app. Registrazione = creare un account; login = entrare; logout = uscire.

## Perché serve
Per sapere chi aggiunge o verifica un punto e per impedire a chiunque di scrivere nel database.

## Come funziona
- L'app usa **Supabase Auth**: le password non passano dal nostro codice e Supabase le conserva cifrate (mai in chiaro).
- `signUp` crea l'account, `signInWithPassword` fa il login, `signOut` esce.
- Dopo il login Supabase restituisce una **sessione** (un token). L'app la salva sul telefono con AsyncStorage, così non serve rifare il login a ogni apertura.
- La chiave `EXPO_PUBLIC_SUPABASE_ANON_KEY` è pubblica per progetto; la sicurezza vera sta nelle regole RLS del database, non nel nascondere la chiave. La chiave `service_role` non va MAI nell'app.

## Nel nostro progetto
- `app-mobile/src/lib/supabase.ts`: client con sessione salvata.
- `app-mobile/src/hooks/use-sessione.ts`: hook che dice chi è collegato.
- `app-mobile/src/app/profilo.tsx`: schermata di accesso/registrazione/uscita.

## Cosa dobbiamo sapere spiegare
- Differenza tra autenticazione (chi sei) e autorizzazione (cosa puoi fare: RLS).
- Cos'è una sessione/token e dove viene salvata.
- Perché non salviamo password.

## Domande possibili
- Dove finiscono le password? (a Supabase, cifrate)
- Cosa succede se chiudo l'app? (la sessione salvata mantiene il login)
- Perché la chiave anon può stare nell'app? (è limitata dalle regole RLS)

## Da fare
Nome utente pubblico e tabella profili (D29), regole RLS di scrittura sui punti, prova su Android.

## Test (riferiti da Max)
- 2026-11-06, iPhone con Expo Go: registrazione e login funzionano; l'app ricorda l'accesso dopo la chiusura.
- 2026-11-09, iPhone con Expo Go: logout funzionante; schermata Profilo leggibile con l'iPhone in modo scuro (era il problema del 06/11); un utente collegato ha aggiunto un punto, ritrovato nella tabella `punti` su Supabase.
- NON verificato: se "Confirm email" è attivo su Supabase (Authentication > Providers > Email); comportamento con password errata; registrazione di un'email già usata; funzionamento nel browser (la mappa non funziona sul web, limite noto).
- Nota: dopo aver cambiato le variabili `EXPO_PUBLIC_*` del `.env` bisogna riavviare con `npx expo start --clear`.

## Ancora da fare
- Nome utente pubblico e tabella profili (D29).
- Decidere se tenere o no la conferma email.
