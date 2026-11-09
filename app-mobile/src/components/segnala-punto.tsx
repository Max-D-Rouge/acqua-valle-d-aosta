import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useSessione } from '@/hooks/use-sessione';
import { supabase } from '@/lib/supabase';

type Props = {
  puntoId: string;
  // Chiamata dopo l'invio, per rileggere i punti (un dato può essere cambiato).
  onFatto: () => void;
};

type Risposta = { valore: string; etichetta: string };

// Le domande della segnalazione e le risposte possibili (valori come nel database).
const DOMANDE: { campo: string; domanda: string; risposte: Risposta[] }[] = [
  { campo: 'stato', domanda: "L'acqua scorre?", risposte: [{ valore: 'funzionante', etichetta: 'Funziona' }, { valore: 'non_funzionante', etichetta: 'Non funziona' }] },
  { campo: 'potabile', domanda: 'È potabile?', risposte: [{ valore: 'potabile', etichetta: 'Sì' }, { valore: 'non_potabile', etichetta: 'No' }] },
  { campo: 'bottiglia', domanda: 'Si può riempire una bottiglia?', risposte: [{ valore: 'si', etichetta: 'Sì' }, { valore: 'no', etichetta: 'No' }] },
  { campo: 'accesso', domanda: 'Come ci si arriva?', risposte: [{ valore: 'strada', etichetta: 'Su strada' }, { valore: 'sentiero', etichetta: 'Su sentiero' }] },
  { campo: 'carrozzina', domanda: 'Accessibile in carrozzina?', risposte: [{ valore: 'si', etichetta: 'Sì' }, { valore: 'no', etichetta: 'No' }] },
  { campo: 'stagionalita', domanda: 'Quando c\'è acqua?', risposte: [{ valore: 'tutto_anno', etichetta: "Tutto l'anno" }, { valore: 'stagionale', etichetta: 'Stagionale' }] },
];

type Voto = { campo: string; valore: string; autore: string };

// Segnalazione "alla Waze": si scelgono più risposte insieme e si invia UNA segnalazione.
// Sotto ogni domanda si vede come hanno votato gli altri, così si capisce se sono tutti d'accordo.
// Quando 3 voti sono uguali il database aggiorna da solo il punto (database/04 e 05).
export function SegnalaPunto({ puntoId, onFatto }: Props) {
  const { sessione } = useSessione();
  const [voti, setVoti] = useState<Voto[]>([]);
  const [scelte, setScelte] = useState<Record<string, string>>({});
  const [messaggio, setMessaggio] = useState<string | null>(null);
  const [occupato, setOccupato] = useState(false);
  const utente = sessione?.user.id ?? null;

  // Legge i voti già dati su questo punto e preseleziona i voti dell'utente.
  const caricaVoti = useCallback(async () => {
    const { data, error } = await supabase.from('segnalazioni').select('campo, valore, autore').eq('punto_id', puntoId);
    if (error) {
      setMessaggio(`Non riesco a leggere le segnalazioni: ${error.message}`);
      return;
    }
    const lista = data as Voto[];
    setVoti(lista);
    const miei: Record<string, string> = {};
    lista.filter((v) => v.autore === utente).forEach((v) => (miei[v.campo] = v.valore));
    setScelte(miei);
  }, [puntoId, utente]);

  useEffect(() => {
    caricaVoti();
  }, [caricaVoti]);

  function tocca(campo: string, valore: string) {
    setMessaggio(null);
    // Toccando di nuovo la risposta scelta la si toglie dalla selezione.
    setScelte((prima) => {
      const nuove = { ...prima };
      if (nuove[campo] === valore) delete nuove[campo];
      else nuove[campo] = valore;
      return nuove;
    });
  }

  async function invia() {
    if (!utente) return;
    const righe = Object.entries(scelte).map(([campo, valore]) => ({ punto_id: puntoId, autore: utente, campo, valore }));
    if (righe.length === 0) return;
    setOccupato(true);
    setMessaggio(null);
    // Una sola richiesta con tutte le risposte. upsert = un voto già dato sulla stessa domanda viene sostituito.
    const { error } = await supabase.from('segnalazioni').upsert(righe, { onConflict: 'punto_id,autore,campo' });
    setOccupato(false);
    if (error) {
      setMessaggio(`Segnalazione non inviata: ${error.message}`);
      return;
    }
    setMessaggio(`Grazie! Segnalazione inviata (${righe.length} ${righe.length === 1 ? 'risposta' : 'risposte'}).`);
    await caricaVoti();
    onFatto();
  }

  // Riassunto dei voti di una domanda, per vedere se gli utenti sono d'accordo.
  function riassunto(campo: string, risposte: Risposta[]) {
    const dellaDomanda = voti.filter((v) => v.campo === campo);
    if (dellaDomanda.length === 0) return { testo: 'Nessun voto ancora', accordo: null as boolean | null };
    const conteggi = risposte.map((r) => ({ etichetta: r.etichetta, n: dellaDomanda.filter((v) => v.valore === r.valore).length }));
    const diversi = conteggi.filter((c) => c.n > 0).length;
    const dettaglio = conteggi.map((c) => `${c.etichetta} ${c.n}`).join(' · ');
    const accordo = diversi === 1;
    return { testo: `${dettaglio} — ${accordo ? 'tutti d\'accordo' : 'pareri diversi'}`, accordo };
  }

  return (
    <View style={styles.box}>
      {DOMANDE.map((d) => {
        const r = riassunto(d.campo, d.risposte);
        return (
          <View key={d.campo} style={styles.domandaBox}>
            <Text style={styles.domanda}>{d.domanda}</Text>
            {utente ? (
              <View style={styles.riga}>
                {d.risposte.map((o) => {
                  const attiva = scelte[d.campo] === o.valore;
                  return (
                    <Pressable key={o.valore} style={[styles.bottone, attiva && styles.bottoneAttivo]} disabled={occupato} onPress={() => tocca(d.campo, o.valore)}>
                      <Text style={[styles.testo, attiva && styles.testoAttivo]}>{o.etichetta}</Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : null}
            <Text style={[styles.voti, r.accordo === true && styles.votiOk, r.accordo === false && styles.votiDiversi]}>{r.testo}</Text>
          </View>
        );
      })}
      {utente ? (
        <Pressable style={[styles.invia, (occupato || Object.keys(scelte).length === 0) && styles.inviaSpento]} disabled={occupato || Object.keys(scelte).length === 0} onPress={invia}>
          <Text style={styles.testoInvia}>{occupato ? 'Invio...' : `Invia segnalazione (${Object.keys(scelte).length})`}</Text>
        </Pressable>
      ) : (
        <Text style={styles.accedi}>Per segnalare accedi dalla scheda Profilo.</Text>
      )}
      {messaggio ? <Text style={styles.messaggio}>{messaggio}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { marginTop: Spacing.two, gap: 12 },
  domandaBox: { gap: 6 },
  riga: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  domanda: { fontSize: 14, fontWeight: '600', color: '#18395a' },
  bottone: { borderWidth: 1, borderColor: '#18395a', borderRadius: 18, paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#ffffff' },
  bottoneAttivo: { backgroundColor: '#18395a' },
  testo: { fontSize: 14, color: '#18395a' },
  testoAttivo: { color: '#ffffff', fontWeight: '600' },
  voti: { fontSize: 12, color: '#6b7680' },
  votiOk: { color: '#17703f' },
  votiDiversi: { color: '#b45309' },
  invia: { backgroundColor: '#1f9d55', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  inviaSpento: { backgroundColor: '#a9b3bc' },
  testoInvia: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  messaggio: { fontSize: 13, color: '#4a5560' },
  accedi: { fontSize: 13, color: '#4a5560' },
});
