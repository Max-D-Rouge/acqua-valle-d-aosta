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
 *
 * Sicurezza: chi conosce l'indirizzo completo (con la chiave) può far partire le email, quindi va tenuto segreto.
 * Limite: l'invio da un account Gmail gratuito è di circa 100 destinatari al giorno.
 */
function doPost(e) {
  const proprieta = PropertiesService.getScriptProperties();
  if (!e.parameter || e.parameter.chiave !== proprieta.getProperty('CHIAVE')) {
    return ContentService.createTextOutput('non autorizzato');
  }
  const d = JSON.parse(e.postData.contents);
  const righe = [
    'Un utente è stato segnalato su AcquaVDA.',
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
  MailApp.sendEmail({
    to: proprieta.getProperty('DESTINATARI'),
    subject: 'AcquaVDA: utente segnalato (' + (d.segnalato_nome || 'senza nome') + ')',
    body: righe.join('\n'),
  });
  return ContentService.createTextOutput('ok');
}
