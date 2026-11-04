# Executive Summary: Monetization Strategy for Subcontractor Risk Compliance Tracker

## 1. Context & Market Dynamics
The **Subcontractor Risk Compliance Tracker** targets *Studi Legali e Notai* (law firms and notaries) in Italy, addressing a critical operational pain point: the inability to monitor real-time legal deadlines and solidary liability (*responsabilità in solido*) in complex subcontractor agreements. 

Given the high stakes of professional liability and regulatory compliance in the legal sector, users possess strong purchasing power and low price sensitivity when solutions mitigate severe legal risks. However, as a micro-SaaS "Spoke" asset utilizing a Stripe Credit/Pay-per-use model, pricing must align with consumption habits (audit runs/checks) rather than rigid monthly subscriptions, eliminating friction for occasional users while rewarding heavy users.

## 2. Pricing Architecture & Psychological Anchoring
In accordance with the Spoke entity rules, we deploy a consumption-based, one-time credit pass model (`recurring = null`) structured around psychological pricing thresholds ending in `9` (expressed in EUR cents):

1. **Audit Singolo Pass (29,00 EUR / 2900 cents)**
   - **Credits:** 5 Audit Credits
   - **Target Audience:** Solo practitioners or boutique firms testing the tool on an urgent, single-case basis.
   - **Psychology:** Acts as an impulse buy below the critical psychological threshold of 30 EUR, framing risk mitigation as cheaper than a single billable hour.

2. **Compliance Standard Pack (79,00 EUR / 7900 cents)**
   - **Credits:** 20 Audit Credits (Best Value anchor)
   - **Target Audience:** Small-to-medium law firms managing a stable portfolio of construction or corporate subcontracts.
   - **Psychology:** The designated "sweet spot" or decoy-anchored option. At ~3.95 EUR per audit, it offers massive perceived value compared to the single pass (~5.80 EUR/audit), driving the majority of checkout conversions.

3. **Studio Legale Power Pass (149,00 EUR / 14900 cents)**
   - **Credits:** 50 Audit Credits
   - **Target Audience:** Mid-to-large notarized practices and legal departments handling high-volume corporate compliance tracking.
   - **Psychology:** Positioned as an institutional-grade investment under the 150 EUR psychological ceiling, dropping the per-audit unit economics to ~2.98 EUR.

## 3. Path to Target MRR ($1250 - $2000 / ~1150 EUR - 1850 EUR)
To achieve a steady-state equivalent monthly revenue of **1.500 EUR** (midpoint of target MRR), the monetization engine relies on credit replenishment velocity rather than monthly recurring billing:

- **Average Order Value (AOV) Blend:** Assuming a healthy distribution where 30% choose Single Pass, 50% choose Standard Pack, and 20% choose Power Pass, the blended AOV per transaction is roughly **75,00 EUR**.
- **Volume Required:** To clear 1.500 EUR/month, the platform requires approximately **20 credit pack purchases** per month across the user base.
- **Unit Economics & Retention:** Because these are consumable credits, revenue scales linearly with platform usage and regulatory deadlines (e.g., tax/compliance seasons). Re-engagement automated emails triggered at 20% remaining credits will drive the necessary repeat purchase loop to hit target capitalization sustainably.
