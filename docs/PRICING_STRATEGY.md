# Pricing & Monetization Strategy: Subcontractor Risk Compliance Tracker

## Executive Summary
This document outlines the psychology-anchored, pay-per-use credit model for the **Subcontractor Risk Compliance Tracker**, tailored specifically for Italian law firms (*Studi Legali*) and notaries (*Notai*). 

Targeting the high-value legal compliance market—where missing a legal deadline or failing joint-liability (*responsabilità in solido*) checks carries severe financial and professional risks—this micro-SaaS uses a Stripe-powered credit system rather than standard monthly subscriptions. This aligns directly with how legal professionals bill and consume specialized technological resources: per practice, per audit, or per client dossier.

---

## Target Audience & Tier Breakdown

### 1. Audit Singolo (Single Pass)
- **Price:** 29.00 EUR (2900 cents)
- **Credits:** 5 Audit Credits
- **Target Persona:** Solo practitioners or small law firms handling occasional subappalto compliance checks.
- **Psychological Rationale:** Low-friction entry barrier. At 29 EUR, the purchase decision requires no bureaucratic sign-off or partner meeting. It acts as an impulse buy for an immediate pain point (e.g., verifying a sudden contract deadline).

### 2. Pacchetto Studio Legale (Standard Pass)
- **Price:** 79.00 EUR (7900 cents)
- **Credits:** 20 Audit Credits (Best Value Anchor)
- **Target Persona:** Boutique law firms with multiple active civil/commercial lawyers managing regular subcontractor portfolios.
- **Psychological Rationale:** This serves as the **decoy/anchor tier**. By pricing 20 credits at 79 EUR (effectively ~3.95 EUR per credit vs. 5.80 EUR on the starter tier), the user perceives massive savings. It captures the vast majority of mid-market legal studios seeking predictable per-case budgeting without monthly commitment.

### 3. Pacchetto Notarile & Enterprise (Power Pass)
- **Price:** 199.00 EUR (19900 cents)
- **Credits:** 60 Audit Credits
- **Target Persona:** Established notary offices and mid-to-large legal practices managing high-frequency corporate restructuring, large construction subcontracts, and continuous joint-liability tracking.
- **Psychological Rationale:** Positioned for high-volume power users. It satisfies procurement requirements for bulk discounts while locking in higher upfront cash flow per transaction.

---

## Path to Target MRR ($1250 - $2000 / ~1150 EUR - 1850 EUR)

Because this asset utilizes a **Pay-Per-Use Credit Model** (Stripe One-Time Payments), "MRR" is calculated as a *run-rate* based on average monthly credit consumption and repeat purchases. Assuming an average client re-loads credits or new clients enter the funnel monthly:

- **Average Order Value (AOV) Blend:** Estimated at ~95 EUR per transaction (weighted heavily toward the *Pacchetto Studio Legale*).
- **Target Monthly Transactions:** To hit the target range of **1,250 EUR to 2,000 EUR MRR equivalent**, the platform requires:
  - **~14 to 21 transactions per month** across the three tiers.
  - *Example mix:* 4 Single Passes (116 EUR) + 10 Standard Passes (790 EUR) + 4 Power Passes (796 EUR) = **1,702 EUR/month**.

### Conversion & Retention Playbook
1. **Low-Risk Trial:** Allow new signups 1 free audit credit to experience the real-time deadline monitoring and risk alert engine.
2. **Automated Replenishment Nudges:** Trigger automated Stripe billing emails when a firm drops below 2 remaining credits, highlighting their exposure to *responsabilità in solido* risks if monitoring stops.
3. **B2B Trust Signals:** Display Italian compliance standard references directly in the checkout flow to eliminate legal sector hesitation.
