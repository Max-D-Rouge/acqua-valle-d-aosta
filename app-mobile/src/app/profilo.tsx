import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useSessione } from '@/hooks/use-sessione';
import { supabase } from '@/lib/supabase';

export default function ProfiloScreen() {
  const { sessione, caricamento } = useSessione();
  const [registrazione, setRegistrazione] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [messaggio, setMessaggio] = useState<string | null>(null);
  const [occupato, setOccupato] = useState(false);

  async function invia() {
    setMessaggio(null);
    if (!email.trim() || password.length < 6) {
      setMessaggio('Inserisci un\'email e una password di almeno 6 caratteri.');
      return;
    }
    setOccupato(true);
    if (registrazione) {
      const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
      if (error) setMessaggio(error.message);
      // Se Supabase richiede la conferma via email, non c'è ancora una sessione.
      else if (!data.session) setMessaggio('Registrazione fatta. Controlla la tua email e conferma l\'indirizzo, poi accedi.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) setMessaggio(error.message);
    }
    setOccupato(false);
  }

  async function esci() {
    await supabase.auth.signOut();
    setPassword('');
  }

  if (caricamento) {
    return (
      <View style={styles.container}>
        <Text style={styles.testo}>Carico...</Text>
      </View>
    );
  }

  if (sessione) {
    return (
      <View style={styles.container}>
        <Text style={styles.titolo}>Profilo</Text>
        <Text style={styles.testo}>Sei collegato come:</Text>
        <Text style={styles.email}>{sessione.user.email}</Text>
        <Pressable style={styles.pulsante} onPress={esci}>
          <Text style={styles.testoPulsante}>Esci</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titolo}>{registrazione ? 'Crea un account' : 'Accedi'}</Text>
      <TextInput
        style={styles.campo}
        placeholder="Email"
        placeholderTextColor="#7a8590"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.campo}
        placeholder="Password (almeno 6 caratteri)"
        placeholderTextColor="#7a8590"
        secureTextEntry
        autoCapitalize="none"
        value={password}
        onChangeText={setPassword}
      />
      {messaggio ? <Text style={styles.messaggio}>{messaggio}</Text> : null}
      <Pressable style={[styles.pulsante, occupato && styles.disattivo]} onPress={invia} disabled={occupato}>
        <Text style={styles.testoPulsante}>{registrazione ? 'Registrati' : 'Accedi'}</Text>
      </Pressable>
      <Pressable onPress={() => { setRegistrazione(!registrazione); setMessaggio(null); }}>
        <Text style={styles.link}>
          {registrazione ? 'Hai già un account? Accedi' : 'Non hai un account? Registrati'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#f7f5f2', padding: Spacing.four, gap: Spacing.three },
  titolo: { fontSize: 28, fontWeight: '700', color: '#18395a' },
  testo: { fontSize: 16, color: '#4a5560' },
  email: { fontSize: 18, fontWeight: '600', color: '#18395a' },
  campo: {
    borderWidth: 1,
    borderColor: '#c5ccd3',
    borderRadius: 10,
    padding: Spacing.three,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#18395a',
  },
  pulsante: { backgroundColor: '#18395a', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  disattivo: { opacity: 0.5 },
  testoPulsante: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  link: { color: '#18395a', textAlign: 'center', fontSize: 15, textDecorationLine: 'underline' },
  messaggio: { backgroundColor: '#fff3cd', borderRadius: 8, padding: Spacing.two, color: '#5c4400' },
});
