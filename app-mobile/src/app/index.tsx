import * as Location from 'expo-location';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FormAvviso } from '@/components/form-avviso';
import { FormPunto } from '@/components/form-punto';
import { Mappa } from '@/components/mappa';
import { MenuVentaglio } from '@/components/menu-ventaglio';
import { SchedaAvviso } from '@/components/scheda-avviso';
import { PulsantiMappa } from '@/components/pulsanti-mappa';
import { SchedaLuogo, type LuogoMappa } from '@/components/scheda-luogo';
import { SchedaNavigazione } from '@/components/scheda-navigazione';
import { SchedaPercorso } from '@/components/scheda-percorso';
import { SchedaPunto } from '@/components/scheda-punto';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useAvvisi } from '@/hooks/use-avvisi';
import { useNavigazione } from '@/hooks/use-navigazione';
import { usePunti } from '@/hooks/use-punti';
import type { PuntoAcqua } from '@/data/punti';
import { dentroValleDAosta } from '@/lib/confini';
import { calcolaPercorso, type Mezzo, type Percorso } from '@/lib/percorso';
import { useSessione } from '@/hooks/use-sessione';

export default function MappaScreen() {
  const [selezionato, setSelezionato] = useState<string | null>(null);
  const [posizione, setPosizione] = useState<{ lat: number; lon: number } | null>(null);
  const [messaggio, setMessaggio] = useState<string | null>(null);
  const [formAperto, setFormAperto] = useState(false);
  const [sceltaAttiva, setSceltaAttiva] = useState(false);
  const [posizioneScelta, setPosizioneScelta] = useState<{ lat: number; lon: number } | null>(null);
  const [avvisoScelto, setAvvisoScelto] = useState<string | null>(null);
  // Cosa si sta aggiungendo toccando la mappa: un punto d'acqua o un avviso.
  const [modoScelta, setModoScelta] = useState<'punto' | 'avviso'>('punto');
  const [formAvvisoAperto, setFormAvvisoAperto] = useState(false);
  // "arrivo" serve a ricalcolare il percorso se esci dalla strada durante la navigazione.
  const [percorso, setPercorso] = useState<{ destinazione: string; arrivo: { lat: number; lon: number }; dati: Percorso } | null>(null);
  const [navigazione, setNavigazione] = useState(false);
  const [satellite, setSatellite] = useState(false);
  const [rilievo, setRilievo] = useState(false);
  const [luogo, setLuogo] = useState<LuogoMappa | null>(null);
  const [ricalcolo, setRicalcolo] = useState(false);
  const { punti, errore, ricarica } = usePunti();
  const { avvisi, ricarica: ricaricaAvvisi } = useAvvisi();
  const { sessione } = useSessione();
  const punto = punti?.find((p) => p.id === selezionato);
  const avviso = avvisi.find((a) => a.id === avvisoScelto);

  // Fuori strada durante la navigazione: chiediamo un nuovo percorso dalla posizione attuale.
  async function ricalcolaDa(da: { lat: number; lon: number }) {
    if (!percorso) return;
    setRicalcolo(true);
    const risultato = await calcolaPercorso(da, percorso.arrivo, percorso.dati.mezzo);
    setRicalcolo(false);
    if ('errore' in risultato) {
      setMessaggio(risultato.errore);
      return;
    }
    setPercorso({ ...percorso, dati: risultato.percorso });
  }
  const { stato: statoNav, errore: erroreNav } = useNavigazione(navigazione, percorso?.dati ?? null, ricalcolaDa);

  function terminaNavigazione() {
    setNavigazione(false);
    setPercorso(null);
    setMessaggio(null);
  }

  // Tocco su un punto o su un avviso: si vede una sola scheda alla volta; tocco sulla mappa vuota = nessuna.
  function scegliLuogo(l: LuogoMappa) {
    setLuogo(l);
    setSelezionato(null);
    setAvvisoScelto(null);
  }
  function scegliPunto(id: string | null) {
    setLuogo(null);
    setSelezionato(id);
    setAvvisoScelto(null);
  }
  function scegliAvviso(id: string | null) {
    setLuogo(null);
    setAvvisoScelto(id);
    setSelezionato(null);
  }

  // Si attiva solo quando l'utente tocca "Dove sono": la posizione non viene mai chiesta prima.
  async function trovaPosizione() {
    setMessaggio(null);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      // Permesso negato: l'app continua a funzionare, senza il pallino blu.
      setMessaggio('Permesso di posizione negato. Puoi comunque usare la mappa.');
      return;
    }
    try {
      const { coords } = await Location.getCurrentPositionAsync({});
      // Resta solo in memoria: non viene salvata né inviata a nessun server.
      setPosizione({ lat: coords.latitude, lon: coords.longitude });
    } catch {
      setMessaggio('Non riesco a leggere la posizione. Riprova.');
    }
  }

  // Percorso a piedi verso un punto. La posizione si chiede solo quando si tocca "Percorso sentieri"
  // e viene mandata al servizio dei percorsi insieme alla destinazione; non viene salvata.
  async function percorsoVerso(p: { nome: string; lat: number; lon: number }, mezzo: Mezzo) {
    setMessaggio(null);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setMessaggio("Senza il permesso di posizione non posso calcolare il percorso. Puoi usare il pulsante 'Mezzi', che apre l'app delle mappe.");
      return;
    }
    setMessaggio('Calcolo il percorso...');
    let partenza: { lat: number; lon: number };
    try {
      const { coords } = await Location.getCurrentPositionAsync({});
      partenza = { lat: coords.latitude, lon: coords.longitude };
    } catch {
      setMessaggio('Non riesco a leggere la posizione. Riprova.');
      return;
    }
    setPosizione(partenza);
    const risultato = await calcolaPercorso(partenza, { lat: p.lat, lon: p.lon }, mezzo);
    if ('errore' in risultato) {
      setMessaggio(risultato.errore);
      return;
    }
    setMessaggio(null);
    setSelezionato(null);
    setPercorso({ destinazione: p.nome, arrivo: { lat: p.lat, lon: p.lon }, dati: risultato.percorso });
  }

  // Aggiungere un punto richiede l'accesso: se non sei collegato ti rimandiamo al Profilo.
  function apriForm() {
    if (!sessione) {
      setMessaggio('Per aggiungere un punto accedi dalla scheda Profilo.');
      return;
    }
    setMessaggio(null);
    setSelezionato(null);
    setAvvisoScelto(null);
    setModoScelta('punto');
    setSceltaAttiva(true);
  }

  // Stessa cosa per un avviso: serve l'accesso, poi si tocca la mappa.
  function apriAvviso() {
    if (!sessione) {
      setMessaggio('Per creare un avviso accedi dalla scheda Profilo.');
      return;
    }
    setMessaggio(null);
    setSelezionato(null);
    setAvvisoScelto(null);
    setModoScelta('avviso');
    setSceltaAttiva(true);
  }

  // Il punto è stato toccato sulla mappa: si apre il modulo con quelle coordinate.
  function dopoScelta(p: { lat: number; lon: number }) {
    // Fuori dalla Valle d'Aosta non si può aggiungere un punto: si torna alla mappa con un messaggio.
    if (!dentroValleDAosta(p.lat, p.lon)) {
      setSceltaAttiva(false);
      setMessaggio("Il punto è fuori dalla Valle d'Aosta: puoi usare solo punti della regione.");
      return;
    }
    setPosizioneScelta(p);
    setSceltaAttiva(false);
    if (modoScelta === 'avviso') setFormAvvisoAperto(true);
    else setFormAperto(true);
  }

  async function dopoAvviso() {
    setFormAvvisoAperto(false);
    await ricaricaAvvisi();
  }

  async function dopoSalvataggio(avviso?: string) {
    setFormAperto(false);
    setMessaggio(avviso ?? null);
    await ricarica();
  }

  return (
    <View style={styles.container}>
      {punti ? (
        <Mappa punti={punti} avvisi={avvisi} percorso={percorso?.dati.coordinate ?? null} posizione={navigazione ? statoNav.posizione ?? posizione : posizione} segui={navigazione} satellite={satellite} rilievo={rilievo} onSelectLuogo={scegliLuogo} onSelect={scegliPunto} onSelectAvviso={scegliAvviso} sceltaAttiva={sceltaAttiva} onScelta={dopoScelta} />
      ) : (
        <Text style={styles.caricamento}>
          {errore ? `Errore nel caricare i punti: ${errore}` : 'Carico i punti...'}
        </Text>
      )}

      {!navigazione && (
      <MenuVentaglio
        azioni={[
          { chiave: 'posizione', etichetta: 'Dove sono', simbolo: '◎', onPress: trovaPosizione },
          { chiave: 'aggiungi', etichetta: 'Aggiungi', simbolo: '+', onPress: apriForm },
          { chiave: 'avviso', etichetta: 'Avviso', simbolo: '!', onPress: apriAvviso },
        ]}
      />
      )}
      <PulsantiMappa satellite={satellite} rilievo={rilievo} onSatellite={() => setSatellite(!satellite)} onRilievo={() => setRilievo(!rilievo)} />
      {sceltaAttiva ? (
        <View style={styles.banner}>
          <Text style={styles.testoBanner}>{modoScelta === 'avviso' ? "Tocca la mappa dove vuoi mettere l'avviso" : 'Tocca la mappa dove si trova il punto'}</Text>
          <Pressable onPress={() => setSceltaAttiva(false)}>
            <Text style={styles.annulla}>Annulla</Text>
          </Pressable>
        </View>
      ) : null}
      {messaggio ? <Text style={[styles.messaggio, navigazione && { top: 190 }]}>{messaggio}</Text> : null}
      <FormPunto posizione={posizioneScelta} visibile={formAperto} onChiudi={() => setFormAperto(false)} onSalvato={dopoSalvataggio} />

      <FormAvviso posizione={posizioneScelta} visibile={formAvvisoAperto} onChiudi={() => setFormAvvisoAperto(false)} onSalvato={dopoAvviso} />

      {avviso && <SchedaAvviso key={avviso.id} avviso={avviso} bottom={BottomTabInset + Spacing.four} onRimosso={() => { setAvvisoScelto(null); ricaricaAvvisi(); }} />}
      {percorso && !navigazione && <SchedaPercorso destinazione={percorso.destinazione} percorso={percorso.dati} bottom={BottomTabInset + Spacing.four} onAvvia={() => setNavigazione(true)} onChiudi={() => setPercorso(null)} />}
      {percorso && navigazione && <SchedaNavigazione destinazione={percorso.destinazione} percorso={percorso.dati} stato={statoNav} ricalcolo={ricalcolo} errore={erroreNav} bottom={BottomTabInset + Spacing.four} onTermina={terminaNavigazione} />}
      {luogo && !percorso && !punto && <SchedaLuogo key={`${luogo.lat},${luogo.lon}`} luogo={luogo} bottom={BottomTabInset + Spacing.four} onPercorso={(l, m) => { setLuogo(null); percorsoVerso(l, m); }} onChiudi={() => setLuogo(null)} />}
      {punto && !percorso && <SchedaPunto key={punto.id} punto={punto} ricarica={ricarica} bottom={BottomTabInset + Spacing.four} onPercorso={percorsoVerso} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  caricamento: { flex: 1, textAlign: 'center', textAlignVertical: 'center', padding: Spacing.four, fontSize: 16, color: '#18395a' },
  banner: {
    position: 'absolute',
    top: 60,
    left: Spacing.three,
    right: Spacing.three,
    backgroundColor: '#18395a',
    borderRadius: 14,
    borderTopLeftRadius: 3,
    padding: Spacing.three,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  testoBanner: { color: '#ffffff', fontSize: 15, fontWeight: '600', flex: 1 },
  annulla: { color: '#7dd3fc', fontSize: 15, fontWeight: '700' },
  messaggio: {
    position: 'absolute',
    top: 60,
    left: Spacing.three,
    right: Spacing.three,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: Spacing.two,
    color: '#5c4400',
  },
});
