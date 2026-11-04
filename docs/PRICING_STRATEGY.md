# Executive Summary: Pricing & Monetization Strategy

## Asset Overview
- **Entity Type:** Spoke (Micro-SaaS)
- **Name:** Subcontractor Risk Compliance Tracker
- **Market Niche:** Studi Legali e Notai (Automazione audit e conformità per subappalti)
- **Core Problem Addressed:** Mancanza di monitoraggio in tempo reale delle scadenze legali e mitigazione dei rischi di responsabilità in solido nei contratti di subappalto.
- **Target MRR Equivalent:** $1250 - $2000 (circa 1.150€ - 1.850€)

---

## Strategic Rationale: Why Pay-per-Use / Stripe Credits?
Il settore legale e notarile opera storicamente su base di parcella, consulenza mirata o "pratica per pratica". Imporre un abbonamento mensile fisso (SaaS tradizionale) a uno studio legale di medie dimensioni genera spesso frizione iniziale e cicli di approvazione lunghi. 

Adottare un modello a **Crediti Stripe / Pay-per-Use** trasforma il software in un *costo variabile direttamente imputabile alla pratica del cliente* (es. audit di conformità del subappaltatore ribaltato sul committente o sul subappaltatore stesso). La psicologia d'acquisto si sposta da "un altro abbonamento da giustificare" a "un investimento puntuale per azzerare un rischio legale catastrofico".

---

## Pricing Tiers Breakdown (Psychological Anchoring)

1. **Audit Singolo Pass (29,00 EUR - 5 Crediti)**
   - **Target:** Studi legali individuali o notai con volumi ridotti di subappalti.
   - **Psicologia:** Soglia d'impulso inferiore a 30€. Funziona come *low-friction entry barrier*, permettendo all'avvocato di testare l'efficacia del tracciamento del rischio in solido su una pratica specifica senza impegno ricorrente.

2. **Pacchetto Conformità Standard (69,00 EUR - 15 Crediti)**
   - **Target:** Studi associati e studi notarili strutturati.
   - **Psicologia:** Rappresenta il *sweet spot* e il "decoy" di valore. Con un costo per credito più vantaggioso rispetto al pass singolo, cattura la maggioranza delle transazioni ricorrenti spot. Il prezzo termina in 9 (soglia psicologica consolidata nel B2B).

3. **Power Audit Pass (129,00 EUR - 35 Crediti)**
   - **Target:** Studi legali d'affari, dipartimenti legali corporate o notarili con un alto portafoglio cantieri/subappalti.
   - **Psicologia:** Offerta ad alto rendimento per utenti intensivi. Il risparmio per singolo credito è evidente, spingendo i power-user a pre-acquistare volume riducendo l'abbandono e garantendo cassa immediata.

---

## Path to Target MRR (1.250€ - 2.000€)
Poiché il modello è basato su crediti one-time (non ricorrenti), l'equivalente MRR viene calcolato stimando il consumo e il tasso di riacquisto mensile (*re-order rate*) della base clienti attiva:

- **Ticket Medio Ponderato per Transazione:** ~75,00 EUR
- **Fatturato Obiettivo Mensile:** 1.500 EUR (al centro del target)
- **Transazioni Mensili Richieste:** 20 pacchetti venduti al mese (una combinazione di Standard e Power Pass).

### Strategia di Conversione:
- **Auto-rifornimento (Stripe Billing):** Opzione di ricarica automatica dei crediti quando il saldo scende sotto a 2 crediti, convertendo gradualmente gli utenti occasionali in una base di ricavi prevedibili simili a un abbonamento.
- **Upsell post-audit:** Ogni volta che un audit rileva un rischio critico di responsabilità in solido, il sistema suggerisce l'acquisto del pacchetto superiore per sbloccare monitoraggi illimitati sulla filiera.
