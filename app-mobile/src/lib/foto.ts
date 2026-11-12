// Foto dei punti d'acqua: scelta/scatto, riduzione, caricamento su Supabase Storage, eliminazione.
// Prima di caricare ogni foto viene ridotta e ricodificata in JPEG (immagine max 1280 px + miniatura max 400 px):
// così pesa poco (il piano gratuito ha 1 GB di spazio e 5 GB di traffico) e non porta con sé dati inutili.
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import { distanzaM } from '@/lib/geo';
import { supabase } from '@/lib/supabase';

const BUCKET = 'foto-punti';
export const MAX_FOTO_PER_PUNTO = 5;
// La foto si può scattare solo se sei entro questo raggio dal punto. Il GPS sbaglia di qualche metro (e anche la posizione
// del punto è stata scelta toccando la mappa): per questo l'area è larga e non pretende una distanza al metro.
export const RAGGIO_AREA_M = 50;
// Se il telefono dichiara una precisione peggiore di così, la posizione non è abbastanza affidabile.
const PRECISIONE_MAX_M = 50;

export type Foto = { id: string; percorso: string; autore: string | null };
export type FotoScelta = { uri: string; width: number; height: number };

// Indirizzo pubblico del file (o della sua miniatura).
export function urlFoto(percorso: string, miniatura = false): string {
  const file = miniatura ? percorso.replace(/\.jpg$/, '_mini.jpg') : percorso;
  return supabase.storage.from(BUCKET).getPublicUrl(file).data.publicUrl;
}

// Controlla che l'utente sia nell'area del punto. Restituisce null se va bene, altrimenti il messaggio da mostrare.
// La posizione viene letta una sola volta, solo per questo calcolo: non viene salvata né inviata a nessuno.
export async function controllaArea(lat: number, lon: number): Promise<string | null> {
  try {
    const permesso = await Location.requestForegroundPermissionsAsync();
    if (permesso.status !== 'granted') return 'Per aggiungere una foto devo verificare che tu sia vicino al punto: serve il permesso di posizione.';
    const posizione = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    if ((posizione.coords.accuracy ?? 999) > PRECISIONE_MAX_M) return "La posizione non è abbastanza precisa. Vai all'aperto e riprova tra qualche secondo.";
    const distanza = distanzaM([posizione.coords.longitude, posizione.coords.latitude], [lon, lat]);
    if (distanza > RAGGIO_AREA_M) return `Puoi aggiungere una foto solo vicino al punto (entro ${RAGGIO_AREA_M} m). Ora sei a circa ${Math.round(distanza / 10) * 10} m.`;
    return null;
  } catch {
    return 'Non riesco a leggere la posizione. Riprova.';
  }
}

// Apre la fotocamera (niente galleria: la foto deve essere scattata ora). Restituisce la foto, null se l'utente annulla, o un errore.
export async function scattaFoto(): Promise<FotoScelta | null | { errore: string }> {
  try {
    const permesso = await ImagePicker.requestCameraPermissionsAsync();
    if (!permesso.granted) return { errore: 'Senza il permesso della fotocamera non posso scattare la foto.' };
    const risultato = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 1, exif: false });
    if (risultato.canceled || !risultato.assets?.[0]) return null;
    const a = risultato.assets[0];
    return { uri: a.uri, width: a.width, height: a.height };
  } catch {
    return { errore: 'Non riesco ad aprire la fotocamera. Riprova.' };
  }
}

// Riduce la foto (lato lungo = "lato" pixel) e la salva come JPEG.
async function riduci(foto: FotoScelta, lato: number, qualita: number): Promise<string> {
  const contesto = ImageManipulator.ImageManipulator.manipulate(foto.uri);
  if (Math.max(foto.width, foto.height) > lato) {
    contesto.resize(foto.width >= foto.height ? { width: lato } : { height: lato });
  }
  const immagine = await contesto.renderAsync();
  const salvata = await immagine.saveAsync({ format: ImageManipulator.SaveFormat.JPEG, compress: qualita });
  return salvata.uri;
}

async function leggiByte(uri: string): Promise<ArrayBuffer> {
  const risposta = await fetch(uri);
  return risposta.arrayBuffer();
}

export type FileCaricati = { percorso: string; percorsoMini: string };

// Fase 1: riduce la foto e carica i due file (immagine + miniatura) nella cartella dell'utente.
// Serve prima di salvare un punto nuovo, che non ha ancora un identificativo.
export async function caricaFile(foto: FotoScelta): Promise<FileCaricati | { errore: string }> {
  const { data: sessione } = await supabase.auth.getSession();
  const utente = sessione.session?.user.id;
  if (!utente) return { errore: 'Per aggiungere una foto devi accedere dalla scheda Profilo.' };

  const nome = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  const percorso = `${utente}/${nome}.jpg`;
  const percorsoMini = `${utente}/${nome}_mini.jpg`;
  const opzioni = { contentType: 'image/jpeg', upsert: false };

  try {
    const grande = await leggiByte(await riduci(foto, 1280, 0.7));
    const piccola = await leggiByte(await riduci(foto, 400, 0.6));
    const a = await supabase.storage.from(BUCKET).upload(percorso, grande, opzioni);
    if (a.error) throw a.error;
    const b = await supabase.storage.from(BUCKET).upload(percorsoMini, piccola, opzioni);
    if (b.error) {
      await supabase.storage.from(BUCKET).remove([percorso]);
      throw b.error;
    }
    return { percorso, percorsoMini };
  } catch {
    return { errore: 'Non sono riuscito a caricare la foto. Controlla la connessione e riprova.' };
  }
}

// Toglie dal bucket i file caricati (se il salvataggio non è andato a buon fine).
export async function scartaFile(f: FileCaricati): Promise<void> {
  await supabase.storage.from(BUCKET).remove([f.percorso, f.percorsoMini]);
}

// Fase 2: collega i file già caricati a un punto. Restituisce null se ok, altrimenti un messaggio.
export async function collegaFoto(puntoId: string, f: FileCaricati): Promise<string | null> {
  const { error } = await supabase.from('foto_punti').insert({ punto_id: puntoId, percorso: f.percorso });
  if (error) return error.code === '42501' ? 'Limite raggiunto: massimo 5 foto per punto e 10 al giorno.' : 'Non sono riuscito a salvare la foto. Riprova.';
  return null;
}

// Carica la foto per un punto che esiste già (dalla scheda del punto). Restituisce null se ok, altrimenti un messaggio.
export async function caricaFoto(puntoId: string, foto: FotoScelta): Promise<string | null> {
  const file = await caricaFile(foto);
  if ('errore' in file) return file.errore;
  const errore = await collegaFoto(puntoId, file);
  if (errore) await scartaFile(file);
  return errore;
}

// Elimina una foto (solo l'autore può farlo: lo garantisce il database).
export async function eliminaFoto(foto: Foto): Promise<string | null> {
  const { error } = await supabase.from('foto_punti').delete().eq('id', foto.id);
  if (error) return 'Non sono riuscito a eliminare la foto.';
  await supabase.storage.from(BUCKET).remove([foto.percorso, foto.percorso.replace(/\.jpg$/, '_mini.jpg')]);
  return null;
}
