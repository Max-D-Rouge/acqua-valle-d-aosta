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

## PS-002 - L'email di avviso per gli utenti segnalati non arriva

- **Stato**: APERTO (2026-11-09). Max ha deciso di rimandare e andare avanti.
- **Chi / dove**: Studente A (Max), Supabase (progetto AcquaVdA) e Google Apps Script con l'account `maxderosso@gmail.com`.
- **Cosa è successo** (riferito da Max, con schermate): configurato il servizio di `servizi/avviso-email.gs` (proprietà `DESTINATARI` e `CHIAVE`, deployment "App web" come "Me", accesso "Chiunque") e salvato l'indirizzo nel Vault di Supabase (controllo: `pg_net` attivo, tabella `segnalazioni_utenti` presente, `segreto` = 1). Dopo una segnalazione di prova inserita dal SQL Editor, nessuna email è arrivata.
- **Cosa risulta dalle schermate**: nella pagina "Esecuzioni" di Apps Script compaiono 2 esecuzioni di `doPost`, "Completata" (9 nov 2026, 15:58:55 e 16:01:08, circa 0,8 secondi). Quindi la richiesta da Supabase arriva allo script. Non è stato controllato se la mail risulta in "Posta inviata" di Gmail.
- **Cosa significa**: "Completata" vuol dire solo che lo script non è andato in errore. Se la chiave nell'URL non coincide con la proprietà `CHIAVE`, lo script risponde "non autorizzato" ed esce senza spedire (comportamento scritto nel codice).
- **Cause possibili (NON verificate)**: chiave diversa tra URL del Vault e proprietà `CHIAVE`; destinatari scritti male; permesso di invio email non concesso; email finita nello spam.
- **Da fare**: controllare "Posta inviata" su Gmail; confrontare la chiave; aggiungere nello script una riga di log (`console.log`) per vedere quale ramo viene eseguito; ricreare il segreto con `delete from vault.secrets where name = 'avviso_segnalazioni_url'` e `vault.create_secret(...)`.
- **Nota**: `select ... from net._http_response` ha dato "relation does not exist" nel progetto di Max: l'esito delle richieste di `pg_net` va cercato in un altro modo (da verificare nella documentazione di `pg_net`).
- **Conseguenza**: finché non è risolto, le segnalazioni di utenti si salvano nella tabella `segnalazioni_utenti` ma Max e Mayo devono controllarla a mano nel pannello di Supabase.
- **Esito**: da compilare.

## PS-003 - Il percorso a piedi passa sulla statale (APERTO, da rifinire)
- **Sintomo**: il percorso a piedi di prova (circa 15,5 km) segue la SS26; Max (2026-11-10) segnala che a piedi non si può passare. L'avviso arancione non è stato visto nelle schermate fatte in navigazione.
- **Cause provate**: all'inizio avevo messo `preference: shortest`, che sceglie il tragitto più corto senza guardare il tipo di strada (poi tornato a `recommended`). Nome del campo del tipo di strada: la documentazione ORS scrive `waytype`, il codice leggeva `waytypes`: corretto, ora accetta entrambi.
- **Controllo sui dati**: un percorso senza statale tra Aosta e Verrès esiste in OSM ma è di circa 42,1 km.
- **Non ancora chiarito**: se ORS ha ricevuto e applicato le zone da evitare. Aggiunti messaggi `[percorso]` nel Terminale di Expo; vanno letti dopo una prova (il test con le righe stampate non è stato ancora fatto).
- **Esito**: da compilare. Decisione di prodotto in attesa di Max (vedi D33: limite di distanza + avviso).
