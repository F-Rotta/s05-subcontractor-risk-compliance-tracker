# Pricing Strategy & Monetization Blueprint: Subcontractor Risk Compliance Tracker

## Executive Summary
This document outlines the pricing architecture for the **Subcontractor Risk Compliance Tracker**, a micro-SaaS Spoke targeting *Studi Legali e Notai* (Law firms and Notaries) in Italy. The core problem addressed is the inability to monitor real-time legal deadlines and joint-and-several liability (*responsabilità in solido*) in complex subcontractor agreements (*subappalto*).

Given the high-stakes, risk-averse nature of the legal sector, a credit-based, pay-per-use model via Stripe is deployed to lower initial adoption friction while capturing high-margin value during heavy audit cycles.

---

## Target MRR & Financial Modeling
- **Target MRR / Equivalent Monthly Run Rate:** $1,250 – $2,000 (Converted to EUR: ~1,200 EUR – 1,900 EUR).
- **Average Revenue Per User (ARPU) Assumption:** 79.00 EUR (Standard Pass).
- **Unit Economics to Hit Target:** 
  - To achieve ~1,500 EUR/month equivalent run-rate, the asset requires approximately **19 Standard Passes** or a healthy mix of Single and Power passes purchased monthly by recurring users.

---

## Tier Architecture & Psychological Anchoring

### 1. Audit Singolo Pass (`SINGLE`)
- **Price:** 29.00 EUR (`2900` cents)
- **Credits:** 5 Audit Credits
- **Target Persona:** Solo practitioners (*avvocati monoprofessionali*) needing on-demand verification for occasional subappalto files.
- **Psychological Rationale:** Positioned below the psychological 30.00 EUR threshold, representing less than the cost of a single billable hour. It acts as a low-risk trial mechanism without requiring a subscription commitment.

### 2. Studio Legale Standard Pass (`STANDARD`)
- **Price:** 79.00 EUR (`7900` cents)
- **Credits:** 20 Audit Credits
- **Target Persona:** Boutique law firms and notary offices (*studi associati*) with steady corporate and construction law caseloads.
- **Psychological Rationale:** The core anchor tier. At 79.00 EUR, it leverages the charm pricing of ending in 9 while offering a significantly lower cost-per-audit than the single pass (approx. 3.95 EUR per credit vs. 5.80 EUR). This will be the primary conversion target.

### 3. Notariato & Agency Power Pass (`POWER`)
- **Price:** 149.00 EUR (`14900` cents)
- **Credits:** 50 Audit Credits
- **Target Persona:** Larger legal practices, civil law notaries handling heavy real estate/public works portfolios, and enterprise legal departments.
- **Psychological Rationale:** Anchored just under 150.00 EUR, this tier targets power users seeking maximum cost efficiency (approx. 2.98 EUR per credit). It frames the lower tiers as economical while capturing maximum willingness-to-pay from high-volume corporate practices.

---

## Path to Target MRR Execution
1. **Frictionless Onboarding:** Lawyers buy credits instantly via Stripe with zero subscription anxiety.
2. **Usage Alerts:** Automated notifications trigger when credits fall below 20%, prompting re-ups.
3. **Retention Loop:** Compliance deadlines repeat quarterly/annually, naturally driving repeat credit purchases that stabilize monthly cash flow into the targeted 1,250 - 2,000 EUR bracket.
