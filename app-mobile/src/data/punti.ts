// Punti d'acqua di ESEMPIO (coordinate approssimate, da verificare sul posto).
// Presi dal prototipo web. In futuro verranno letti dal database.

export type Potabilita = 'potabile' | 'non_potabile' | 'non_verificato';
export type TipoPunto = 'fontana' | 'fontanella' | 'sorgente' | 'punto_struttura';

export type PuntoAcqua = {
  id: string;
  nome: string;
  comune: string;
  tipo: TipoPunto;
  lat: number;
  lon: number;
  potabile: Potabilita;
  descrizione?: string;
};

export const PUNTI_ESEMPIO: PuntoAcqua[] = [
  { id: 'e1', nome: 'Fontana Piazza Chanoux', comune: 'Aosta', tipo: 'fontana', lat: 45.737, lon: 7.32, potabile: 'potabile', descrizione: 'Nella piazza centrale, vicino al municipio.' },
  { id: 'e2', nome: "Fontana Arco d'Augusto", comune: 'Aosta', tipo: 'fontana', lat: 45.7355, lon: 7.3225, potabile: 'potabile' },
  { id: 'e3', nome: 'Fontana del centro', comune: 'Courmayeur', tipo: 'fontana', lat: 45.7969, lon: 6.9689, potabile: 'potabile' },
  { id: 'e4', nome: 'Fontana del paese', comune: 'Cogne', tipo: 'fontana', lat: 45.6086, lon: 7.356, potabile: 'potabile' },
  { id: 'e5', nome: 'Fontanella Cervinia', comune: 'Valtournenche', tipo: 'fontanella', lat: 45.937, lon: 7.631, potabile: 'potabile', descrizione: 'Vicino agli impianti di risalita.' },
  { id: 'e6', nome: 'Sorgente sul sentiero', comune: 'Gressoney-Saint-Jean', tipo: 'sorgente', lat: 45.775, lon: 7.824, potabile: 'non_verificato', descrizione: 'Acqua di sorgente: non indicata come potabile.' },
  { id: 'e7', nome: 'Fontana del centro', comune: 'Saint-Vincent', tipo: 'fontana', lat: 45.75, lon: 7.65, potabile: 'potabile' },
  { id: 'e8', nome: 'Fontana lungo la strada', comune: 'Pont-Saint-Martin', tipo: 'fontana', lat: 45.597, lon: 7.796, potabile: 'non_potabile', descrizione: 'Cartello "acqua non potabile".' },
  { id: 'e9', nome: 'Fontanella del rifugio', comune: 'Valsavarenche', tipo: 'punto_struttura', lat: 45.5977, lon: 7.233, potabile: 'potabile' },
  { id: 'e10', nome: 'Fontana vicino al castello', comune: 'Bard', tipo: 'fontana', lat: 45.6035, lon: 7.7458, potabile: 'potabile' },
  { id: 'e11', nome: 'Fontana in piazza', comune: 'Morgex', tipo: 'fontana', lat: 45.7573, lon: 7.0383, potabile: 'potabile' },
  { id: 'e12', nome: 'Sorgente (esempio)', comune: 'La Thuile', tipo: 'sorgente', lat: 45.7131, lon: 6.9505, potabile: 'non_verificato' },
  { id: 'e13', nome: 'Fontana del paese', comune: 'Etroubles', tipo: 'fontana', lat: 45.8197, lon: 7.2158, potabile: 'potabile' },
  { id: 'e14', nome: 'Fontana Châtillon', comune: 'Châtillon', tipo: 'fontana', lat: 45.7468, lon: 7.615, potabile: 'non_verificato' },
];
