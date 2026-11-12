export type TipoAvviso = 'sentiero_chiuso' | 'fontana_manutenzione' | 'acqua_torbida' | 'pericolo' | 'altro';

export type Avviso = {
  id: string;
  tipo: TipoAvviso;
  nota: string | null;
  lat: number;
  lon: number;
  autore: string | null;
  creato_il: string;
  scade_il: string;
};

export const TIPI_AVVISO: { valore: TipoAvviso; etichetta: string }[] = [
  { valore: 'sentiero_chiuso', etichetta: 'Sentiero chiuso' },
  { valore: 'fontana_manutenzione', etichetta: 'Fontana in manutenzione' },
  { valore: 'acqua_torbida', etichetta: 'Acqua torbida' },
  { valore: 'pericolo', etichetta: 'Pericolo' },
  { valore: 'altro', etichetta: 'Altro' },
];
