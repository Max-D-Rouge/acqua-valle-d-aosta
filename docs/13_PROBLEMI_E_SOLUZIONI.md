# 13 - Problemi e soluzioni

Qui si registrano gli errori importanti: cosa è successo, cosa significa, causa, correzione, perché funziona e se il test è stato ripetuto. Non si inventano soluzioni: un problema senza prova resta "APERTO".

---

## PS-001 - `npm install` fallisce sul PC di Mayo (ECONNRESET ed EPERM)

- **Stato**: APERTO (2026-10-28). Soluzione proposta, non ancora provata da Mayo.
- **Chi / dove**: Studente B (Mayo), Windows 11, Prompt dei comandi, Node 24.21.0, npm 11.19.0, progetto in `C:\Users\maelc\Desktop\acqua-valle-d-aosta\app-mobile`.
- **Cosa è successo** (riferito da B): due tentativi di `npm install` il 26/10 (circa 13:43 e 14:07 UTC) sono falliti con `npm error code ECONNRESET`, con molti avvisi `EPERM ... rmdir` dentro `node_modules` (per esempio `expo-image`, `react-native-screens`, `@expo/ui`). Poi `npx expo start` dà `ConfigError: Cannot determine the project's Expo SDK version because the module expo is not installed`.
- **Cosa significa**:
  - `ECONNRESET`: la connessione con il server dei pacchetti (registro npm) si è interrotta durante il download.
  - `EPERM ... rmdir`: Windows non permette a npm di cancellare una cartella, di solito perché un altro programma la sta usando.
  - `ConfigError ... expo is not installed`: non è un errore del codice. Il comando non trova la libreria `expo` perché l'installazione è rimasta a metà.
- **Verificato sul repository (2026-10-28)**: `package-lock.json` è su GitHub, elenca 577 pacchetti e tutti vengono da `registry.npmjs.org`; non c'è nessun `.npmrc`. Il progetto quindi non è la causa.
- **Cause possibili (NON verificate)**: rete instabile o filtrata (Wi-Fi, VPN, proxy); antivirus o Windows Defender che blocca o analizza i file appena scritti; indicizzazione di Windows; programmi che tengono aperta `node_modules` (editor, terminale, `node.exe`); percorso troppo lungo.
- **Correzione proposta**: pulire `node_modules` con tutti i programmi chiusi, riprovare con `npm ci` e più tentativi di rete, eventualmente da un'altra rete e da una cartella con percorso corto. Nel Prompt dei comandi, in `app-mobile`:
  1. chiudere editor, altri terminali e `npx expo start`; poi `taskkill /F /IM node.exe`;
  2. `rmdir /s /q node_modules` (se dà ancora EPERM: riavviare il PC e ripetere);
  3. `npm config get registry` deve dare `https://registry.npmjs.org/`; `npm config get proxy` e `npm config get https-proxy` devono essere vuoti (`null`);
  4. `npm cache verify`;
  5. `npm ci --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000`;
  6. `npx expo start`.
- **Perché dovrebbe funzionare**: toglie l'installazione rimasta a metà, usa le versioni esatte del lockfile e riprova i download che cadono. Non risolve però una rete che blocca il registro.
- **Test da ripetere**: `npm ci` finisce senza errori; poi `npx expo start` mostra il QR code.
- **Esito**: da compilare.
