/**
 * Avviso via email quando un utente viene segnalato (Google Apps Script, gratuito).
 *
 * COME SI CONFIGURA (una volta sola, lo fa Max con il suo account Google):
 * 1. Vai su script.google.com > Nuovo progetto e incolla questo file.
 * 2. Impostazioni progetto (ingranaggio) > Proprietà dello script, aggiungi:
 *      DESTINATARI = indirizzi email separati da virgola (Max e Mayo)
 *      CHIAVE      = una stringa lunga e casuale, inventata da te (almeno 30 caratteri)
 *    NON scrivere indirizzi email o la chiave in questo file né su GitHub.
 * 3. Distribuisci > Nuova distribuzione > Tipo "App web": esegui come "Me", accesso "Chiunque".
 *    Autorizza i permessi richiesti. Copia l'URL che termina con /exec.
 * 4. Nel SQL Editor di Supabase salva l'indirizzo completo nel Vault (sostituisci i due valori):
 *      select vault.create_secret('URL_EXEC?chiave=LA_TUA_CHIAVE', 'avviso_segnalazioni_url');
 * 5. Prova: invia una segnalazione dall'app e controlla la posta (anche lo spam).
 * 6. Se NON arriva: Esecuzioni > clic sull'ultima esecuzione di doPost > Log. Le righe dicono cosa è andato storto.
 *    Se modifichi questo file: Distribuisci > Gestisci distribuzioni > matita > Versione: "Nuova versione" > Distribuisci
 *    (senza una nuova versione il servizio continua a usare il codice VECCHIO). L'indirizzo /exec resta lo stesso.
 *
 * Sicurezza: chi conosce l'indirizzo completo (con la chiave) può far partire le email, quindi va tenuto segreto.
 * Limite: l'invio da un account Gmail gratuito è di circa 100 destinatari al giorno.
 */
function doPost(e) {
  const proprieta = PropertiesService.getScriptProperties();
  // Il registro (Esecuzioni > clic sull'esecuzione > "Log") dice quale strada ha preso lo script.
  console.log('doPost ricevuta. Parametri presenti: ' + Object.keys(e.parameter || {}).join(','));
  if (!e.parameter || e.parameter.chiave !== proprieta.getProperty('CHIAVE')) {
    console.log('RIFIUTATA: la chiave nell\'indirizzo non coincide con la proprietà CHIAVE.');
    return ContentService.createTextOutput('non autorizzato');
  }
  const destinatari = proprieta.getProperty('DESTINATARI');
  if (!destinatari) {
    console.log('ERRORE: la proprietà DESTINATARI è vuota o manca.');
    return ContentService.createTextOutput('destinatari mancanti');
  }
  const d = JSON.parse(e.postData.contents);
  const tipo = d.tipo || 'utente';
  let oggetto;
  let righe;
  if (tipo === 'foto') {
    oggetto = 'AcquaVDA: foto segnalata (' + (d.punto || 'punto senza nome') + ')';
    righe = [
      'Una foto è stata segnalata su AcquaVDA.',
      '',
      'Punto: ' + (d.punto || '-'),
      'Motivo: ' + d.motivo,
      'Segnalata da: ' + (d.segnalante_nome || '(senza nome utente)'),
      'Quando: ' + d.quando,
      '',
      'Per i dettagli apri la tabella segnalazioni_foto nel pannello di Supabase.',
    ];
  } else if (tipo === 'blocco') {
    oggetto = 'AcquaVDA: utente bloccato (' + (d.utente_nome || 'senza nome') + ')';
    righe = [
      'Un utente è stato bloccato in automatico.',
      '',
      'Utente: ' + (d.utente_nome || '(senza nome utente)') + ' [' + d.utente_id + ']',
      'Motivo: ' + d.motivo,
      'Bloccato fino al: ' + d.fino_a,
      'Quando: ' + d.quando,
      '',
      'Per togliere il blocco elimina la riga nella tabella blocchi nel pannello di Supabase.',
    ];
  } else {
    oggetto = 'AcquaVDA: utente segnalato (' + (d.segnalato_nome || 'senza nome') + ')';
    righe = [
      'Un utente è stato segnalato su AcquaVDA. Da valutare: cambia la colonna "stato" in "confermata" o "respinta".',
      '',
      'Utente segnalato: ' + (d.segnalato_nome || '(senza nome utente)') + ' [' + d.segnalato_id + ']',
      'Segnalato da: ' + (d.segnalante_nome || '(senza nome utente)'),
      'Motivo: ' + d.motivo,
      'Punto collegato: ' + (d.punto || '-'),
      'Messaggio: ' + (d.messaggio || '-'),
      'Quando: ' + d.quando,
      '',
      'Per i dettagli apri la tabella segnalazioni_utenti nel pannello di Supabase.',
    ];
  }
  try {
    MailApp.sendEmail({ to: destinatari, subject: oggetto, body: righe.join('\n') });
    console.log('Email inviata (' + tipo + ') a ' + destinatari.split(',').length + ' destinatari.');
    return ContentService.createTextOutput('ok');
  } catch (errore) {
    console.log('ERRORE invio email: ' + errore);
    return ContentService.createTextOutput('errore invio');
  }
}
