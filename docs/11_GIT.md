# 11 - Git e lavoro in due (Expo)

Stato del documento: FASE 4 (Git/GitHub), prima versione, 2026-10-26. **I comandi di questa guida non sono ancora stati provati da entrambi gli studenti**: la sezione "Verifica" in fondo va compilata dopo la prova.

Collegamenti: D14 (rami) e D15 (ruoli) in `DECISIONI_TECNICHE.md`.

---

## 1. Cos'è

- **Git**: programma che registra la storia dei file di un progetto. Ogni "foto" dello stato dei file si chiama **commit**.
- **GitHub**: sito che conserva una copia del repository (la cartella del progetto con la sua storia) in internet, così due persone possono scambiarsi il lavoro.
- **Expo**: strumento per costruire app con React Native. Un progetto Expo è una normale cartella di file di codice (`app-mobile/`): non c'è niente di speciale da "condividere", basta condividere i file con Git.

## 2. Perché serve

Max (Mac) e Mayo (Windows) hanno due computer diversi. Senza Git dovrebbero scambiarsi i file a mano e sovrascriverebbero a vicenda il lavoro. Con Git ognuno lavora sul proprio ramo, e il lavoro si unisce in modo controllato.

## 3. Come funziona (parole da conoscere)

| Termine | Significato semplice | Comando |
| --- | --- | --- |
| clone | scarica per la prima volta il repository da GitHub | `git clone <indirizzo>` |
| branch (ramo) | una linea di lavoro separata | `git switch <nome>` |
| commit | salva una "foto" delle modifiche, con un messaggio | `git add ...` poi `git commit -m "..."` |
| push | invia i tuoi commit a GitHub | `git push` |
| pull | scarica da GitHub i commit nuovi e li unisce al ramo corrente | `git pull` |
| fetch | scarica da GitHub i commit nuovi senza unirli | `git fetch` |
| merge | unisce un ramo in un altro | `git merge <ramo>` |
| pull request (PR) | richiesta, su GitHub, di unire un ramo in un altro, con possibilità di controllo | si crea sul sito |
| conflitto | Git non sa quale versione tenere perché entrambi hanno cambiato la stessa riga | si risolve a mano (§8) |

## 4. Nel nostro progetto

- Repository: `https://github.com/Max-D-Rouge/acqua-valle-d-aosta.git` (visibilità da confermare, vedi README).
- Rami (D14): `main` (stabile, non ci si lavora direttamente), `dev-studente-A` (Max), `dev-studente-B` (Mayo).
- Il progetto Expo sta in `app-mobile/`. Il file con i segreti è `app-mobile/.env` e **non è su GitHub** (è ignorato dal `.gitignore`). Il modello da copiare è `app-mobile/.env.example`, che invece va su GitHub perché non contiene segreti.
- Il telefono carica l'app tramite **Expo Go**: ognuno prova sul proprio telefono, le due prove non si disturbano.

### Stato al 2026-10-26 (verificato leggendo la cartella di Max)
- `app-mobile/` esiste **solo sul Mac di Max** e non ha ancora nessun commit: Mayo non può ancora averlo.
- Anche altre cartelle e modifiche (`prototipo-web/`, `database/`, `design/`, `presentazioni/`, documenti modificati) non sono ancora committate.
- La decisione di usare Expo al posto di Flutter non è stata confermata da Mayo né dal docente (vedi diario del 2026-10-23).

---

## 5. Passo 1 - Max: pubblicare `app-mobile` (una sola volta)

Prima di tutto, Max è sul ramo `dev-studente-A`? Controlla:

```
git status
```

La prima riga deve dire `On branch dev-studente-A`.

1. Aggiungi **solo** la cartella dell'app (così gli altri file in sospeso non finiscono per caso nello stesso commit):
   ```
   git add app-mobile
   ```
2. **Controllo di sicurezza**: il file con i segreti NON deve comparire. Questo comando deve mostrare `.env.example` ma **non** `.env`:
   ```
   git diff --cached --name-only | grep -i "\.env"
   ```
   Se compare `app-mobile/.env`, fermati: `git restore --staged app-mobile/.env` e avvisa.
3. Salva la foto:
   ```
   git commit -m "Fase 5: creato il progetto Expo in app-mobile con la mappa di prova"
   ```
4. Invia a GitHub:
   ```
   git push
   ```
5. Su GitHub: **Pull request** da `dev-studente-A` verso `main`. Se Mayo è d'accordo con Expo, uniscila ("Merge"). Se Mayo non ha ancora confermato, può leggere `dev-studente-A` anche senza unirla (§6, variante).

I file di documentazione modificati si committano a parte, in un secondo commit.

## 6. Passo 2 - Mayo: primo avvio (Windows)

Prerequisiti già dichiarati da Mayo: Git, Node.js, npm. Controllo: `git --version`, `node --version`, `npm --version`.

1. Aggiorna il repository e il tuo ramo:
   ```
   git fetch
   git switch dev-studente-B
   git pull
   ```
2. Porta dentro il lavoro di Max (dopo che la PR è stata unita in `main`):
   ```
   git merge origin/main
   ```
   *Variante se la PR non è stata unita:* `git merge origin/dev-studente-A` (prende direttamente il ramo di Max).
3. Installa le librerie (la prima volta può richiedere molti minuti):
   ```
   cd app-mobile
   npm install
   ```
4. Crea il tuo file segreto: in PowerShell `Copy-Item .env.example .env`, poi apri `.env` e scrivi i due valori che Max ti passa in privato.
5. Avvia:
   ```
   npx expo start
   ```
6. Sul telefono: apri **Expo Go**, entra con il tuo account Expo (gratuito, serve per Expo Go e per la CLI, come annotato nel diario del 23/10) e inquadra il QR code.

Possibili problemi su Windows (da provare, non ancora verificati):
- Telefono e PC devono essere sulla **stessa rete Wi-Fi**. Alcune reti (scuola, ospiti) bloccano la connessione; in quel caso si può provare `npx expo start --tunnel` (può chiedere di installare un pacchetto in più).
- Il firewall di Windows può chiedere il permesso per Node.js: consenti sulle reti private.
- A capo dei file: se Git avvisa di "LF will be replaced by CRLF", è normale su Windows. Controllo: `git config core.autocrlf` (su Windows di solito `true`).

## 7. Lavoro di tutti i giorni (per entrambi)

1. Inizio sessione: `git switch <tuo ramo>` poi `git pull`, poi `git merge origin/main` per prendere il lavoro nuovo dell'altro.
2. Lavora e prova con `npx expo start`.
3. Salva spesso piccoli commit:
   ```
   git status
   git add <file o cartella>
   git commit -m "messaggio chiaro su cosa è cambiato"
   ```
4. Fine sessione: `git push`.
5. Quando una funzione è finita **e provata**: Pull request verso `main`; l'altro studente la guarda prima di unirla.

Regola del progetto: nessun commit o push se non c'è la richiesta esplicita dello studente interessato (vedi `CLAUDE.md`).

## 8. Conflitti e file a rischio

Un conflitto nasce quando i due cambiano la stessa riga dello stesso file. Git lo segnala con righe `<<<<<<<`, `=======`, `>>>>>>>` dentro il file. Per risolverlo: apri il file, scegli (o combina) le due versioni, cancella le righe con i simboli, poi `git add <file>` e `git commit`. Se non sei sicuro, **non improvvisare**: chiedi.

File dove i conflitti sono più probabili:
- `app-mobile/package.json` e `app-mobile/package-lock.json`: cambiano quando si installa una libreria. **Avvisa l'altro prima di installare** e committa sempre `package-lock.json` insieme a `package.json`, così entrambi hanno le stesse versioni.
- `app-mobile/app.json`: configurazione dell'app.
- `DIARIO_SVILUPPO.md`, `CHANGELOG.md`, `DECISIONI_TECNICHE.md`: scrivete in fondo al file e ognuno nella propria voce, e fate `git pull` prima di modificarli.
- Non si usa `npm audit fix --force` alla cieca (vedi diario del 23/10).

## 9. Segreti: il file `.env`

- **Cos'è**: un file con valori che non devono diventare pubblici (indirizzo e chiavi del database).
- **Perché non va su GitHub**: chi vede il repository vedrebbe le chiavi; una volta pubblicate è difficile ritirarle, anche se si cancellano dopo, perché restano nella storia di Git.
- **Come lo condividiamo**: i valori si passano in privato; su GitHub c'è solo `.env.example`, senza valori.
- **Nome delle variabili**: quelle che iniziano con `EXPO_PUBLIC_` finiscono dentro l'app e sono quindi leggibili da chi la scarica. Per questo ci va solo la chiave "anon" di Supabase, mai la "service_role". La sicurezza dei dati si basa poi sulle regole del database (RLS), che vanno ancora impostate (Fase 6-7).
- Se il `.env` viene committato per sbaglio: avvisa subito, perché le chiavi vanno rigenerate.

## 10. Telefono e account Expo

- Expo Go non richiede lo stesso account per i due studenti: ognuno può avere il suo.
- Un account condiviso o un'organizzazione Expo serve solo per i servizi cloud (EAS Build, per creare l'app installabile). Non è ancora un nostro problema.
- Attenzione (da diario e D03, non risolto): Expo Go include solo certo codice nativo; una libreria che non lo è richiede una "development build", che per iPhone ha bisogno di un account Apple Developer a pagamento. Prima di installare nuove librerie native va verificato.

---

## Cosa dobbiamo saper spiegare

- La differenza tra Git e GitHub.
- Cosa sono commit, branch, push, pull, merge, pull request.
- Perché non si lavora su `main` e perché esistono due rami di sviluppo.
- Perché `.env` non va su GitHub e cos'è `.env.example`.
- Perché si committa `package-lock.json`.
- Come si prova la stessa app su due computer e due telefoni.

## Domande possibili

1. Che differenza c'è tra `git fetch` e `git pull`?
2. Cosa succede se Max e Mayo modificano la stessa riga?
3. Perché la chiave nel `.env` non basta come protezione dei dati?
4. Cosa è Expo Go e quali limiti ha?
5. Perché si usa una pull request invece di scrivere direttamente su `main`?

---

## Verifica (da compilare)

| Prova | Chi | Data | Esito |
| --- | --- | --- | --- |
| Commit e push di `app-mobile` | Max | | |
| Clone/merge e `npm install` su Windows | Mayo | | |
| `npx expo start` e mappa su iPhone di Mayo | Mayo | | |
| Prova con stessa rete Wi-Fi / tunnel | Mayo | | |
| Pull request A → main unita | entrambi | | |
