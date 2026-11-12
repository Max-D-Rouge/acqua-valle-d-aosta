import { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { BottomTabInset } from '@/constants/theme';

export type Azione = {
  chiave: string;
  etichetta: string;
  simbolo: string;
  onPress: () => void;
};

// Colori provvisori dell'app (il logo è ancora in modifica): si cambiano solo qui.
const NAVY = '#18395a';
const CIELO = '#7dd3fc';
const GHIACCIO = '#e0f7ff';

const RAGGIO = 160; // distanza delle azioni dal pallino principale (grande abbastanza perché le etichette non si sovrappongano)
const DIM_PRINCIPALE = 60;
const DIM_AZIONE = 48;

// Pallino a forma di goccia in basso a sinistra: toccato apre le azioni "a ventaglio" (da su a destra).
// Il quadrato con tre angoli molto arrotondati e uno acuto, ruotato di 45°, diventa una goccia con la punta in alto.
export function MenuVentaglio({ azioni }: { azioni: Azione[] }) {
  const [aperto, setAperto] = useState(false);
  const progresso = useRef(new Animated.Value(0)).current;

  function imposta(apri: boolean) {
    setAperto(apri);
    Animated.spring(progresso, {
      toValue: apri ? 1 : 0,
      useNativeDriver: true,
      friction: 7,
      tension: 80,
    }).start();
  }

  const n = azioni.length;

  return (
    <>
      {aperto && (
        <Pressable style={StyleSheet.absoluteFill} onPress={() => imposta(false)}>
          <Animated.View style={[styles.velo, { opacity: progresso }]} />
        </Pressable>
      )}

      <View style={styles.ancora} pointerEvents="box-none">
        {azioni.map((a, i) => {
          // Angolo: da 90° (in alto) a 0° (a destra), distribuiti in modo uniforme.
          const gradi = n === 1 ? 45 : 90 - (i * 90) / (n - 1);
          const rad = (gradi * Math.PI) / 180;
          const dx = RAGGIO * Math.cos(rad);
          const dy = -RAGGIO * Math.sin(rad);
          return (
            <Animated.View
              key={a.chiave}
              pointerEvents={aperto ? 'auto' : 'none'}
              style={[
                styles.azione,
                {
                  opacity: progresso,
                  transform: [
                    { translateX: progresso.interpolate({ inputRange: [0, 1], outputRange: [0, dx] }) },
                    { translateY: progresso.interpolate({ inputRange: [0, 1], outputRange: [0, dy] }) },
                    { scale: progresso },
                  ],
                },
              ]}>
              <Pressable
                onPress={() => {
                  imposta(false);
                  a.onPress();
                }}
                style={styles.gocciaAzione}>
                <Text style={styles.simboloAzione}>{a.simbolo}</Text>
              </Pressable>
              <Text style={styles.etichetta}>{a.etichetta}</Text>
            </Animated.View>
          );
        })}

        <Pressable onPress={() => imposta(!aperto)} style={styles.goccia}>
          <Text style={styles.simbolo}>{aperto ? '×' : '···'}</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  velo: { flex: 1, backgroundColor: 'rgba(11,31,51,0.35)' },
  // Punto di riferimento: il centro del pallino principale.
  ancora: {
    position: 'absolute',
    left: 24,
    bottom: BottomTabInset + 64,
    width: DIM_PRINCIPALE,
    height: DIM_PRINCIPALE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goccia: {
    width: DIM_PRINCIPALE,
    height: DIM_PRINCIPALE,
    backgroundColor: NAVY,
    borderTopLeftRadius: 6,
    borderTopRightRadius: DIM_PRINCIPALE / 2,
    borderBottomLeftRadius: DIM_PRINCIPALE / 2,
    borderBottomRightRadius: DIM_PRINCIPALE / 2,
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: CIELO,
    shadowColor: '#0b1f33',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 8,
  },
  // Il testo va controruotato, altrimenti seguirebbe la rotazione della goccia.
  simbolo: { color: '#ffffff', fontSize: 24, fontWeight: '700', transform: [{ rotate: '-45deg' }] },
  azione: { position: 'absolute', width: 96, alignItems: 'center', gap: 6 },
  gocciaAzione: {
    width: DIM_AZIONE,
    height: DIM_AZIONE,
    backgroundColor: GHIACCIO,
    borderTopLeftRadius: 5,
    borderTopRightRadius: DIM_AZIONE / 2,
    borderBottomLeftRadius: DIM_AZIONE / 2,
    borderBottomRightRadius: DIM_AZIONE / 2,
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: NAVY,
  },
  simboloAzione: { color: NAVY, fontSize: 22, fontWeight: '700', transform: [{ rotate: '-45deg' }] },
  etichetta: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: NAVY,
    borderRadius: 8,
    borderTopLeftRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 3,
    overflow: 'hidden',
  },
});
