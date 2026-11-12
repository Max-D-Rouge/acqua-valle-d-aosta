# Account di prova (prototipo)

Account **finti**, validi solo in questo prototipo locale (nessun server). Servono per provare i due ruoli.

| Email | Password |
| ----- | -------- |
| prova1@acquavda.test | 3n5s7nttkv |
| prova2@acquavda.test | waqpd4u94j |

- **Senza accedere** (visitatore): si vedono mappa, elenco e dettagli. Non si può aggiungere, modificare, verificare né segnalare.
- **prova1**: possiede 2 punti già inseriti ("di prova1"): può modificarli (anche la posizione) ed eliminarli.
- **prova2**: può aggiungere punti e verificare/segnalare, ma **non** modificare né eliminare i punti di prova1 (RF-036).
- Le password sono scritte in chiaro in `data.js`: va bene solo per un prototipo, nell'app vera ci pensa il servizio di autenticazione.
