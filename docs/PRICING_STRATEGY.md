# Pricing Strategy & Monetization Blueprint: Subcontractor Risk Compliance Tracker

## Executive Summary
This document outlines the pricing architecture for the **Subcontractor Risk Compliance Tracker**, a micro-SaaS (Spoke) tailored for Italian law firms (*Studi Legali*) and notaries (*Notai*) struggling with real-time tracking of legal deadlines and joint liability (*responsabilità in solido*) in subcontracting agreements.

To align with user behavior in the legal vertical—where software is often evaluated per project or per compliance audit rather than as an ongoing monthly subscription—we utilize a **Stripe Credit / Pay-Per-Use model** using non-recurring credit passes.

---

## Psychological Pricing & Tier Architecture

Given the high stakes of legal non-compliance and joint liability in Italy (where penalties far outweigh software costs), pricing is anchored on risk mitigation and time saved. All prices are in EUR cents and leverage psychological thresholds ending in **9**.

1. **Audit Rapido (Single Pass) - 29.00 EUR (2900 cents)**
   * **Credits:** 5 Audits/Runs
   * **Target Persona:** Solo practitioners or small law firms handling occasional subcontractor verifications.
   * **Psychological Rationale:** Low-friction barrier to entry. Priced below the cost of a single billable hour, making it an impulse purchase for an urgent compliance check.

2. **Studio Legale (Standard Pass) - 79.00 EUR (7900 cents)**
   * **Credits:** 20 Audits/Runs
   * **Target Persona:** Established boutique law firms and notary offices with a steady flow of corporate clients and supply-chain contracts.
   * **Psychological Rationale:** The designated "Anchor / Best Value" tier. It offers a lower cost-per-audit than the Single Pass, incentivizing mid-tier commitment without triggering budget approval committees.

3. **Enterprise & Notary Power (Heavy Pass) - 149.00 EUR (14900 cents)**
   * **Credits:** 50 Audits/Runs
   * **Target Persona:** Large multi-partner law firms or corporate legal departments managing extensive subcontractor portfolios.
   * **Psychological Rationale:** Premium tier signaling enterprise-grade reliability and high-volume capacity.

---

## Path to Target MRR ($1250 - $2000 / ~1150 EUR - 1850 EUR)

Because this model relies on **one-time credit purchases (Pay-per-use)** rather than monthly recurring subscriptions, "Target MRR" translates to **Target Monthly Gross Volume (GMV)** derived from credit top-ups and repeat purchases.

Assuming an average customer value centered around the **Standard Pass (79.00 EUR)**:
* **Target Revenue Goal:** ~1,500.00 EUR/month.
* **Required Transactions per Month:** 
  * If relying entirely on the *Standard Pass (79.00 EUR)*: **~19 transactions/month**.
  * If blended across tiers (e.g., 5 Single Passes + 10 Standard Passes + 3 Heavy Passes): 
    * (5 × 29.00) + (10 × 79.00) + (3 × 14900/100) = 145 + 790 + 447 = **1,382.00 EUR**.

### Go-To-Market & Conversion Levers
* **Credit Expiration & Alerts:** Trigger automated Stripe/email reminders when a firm drops below 2 credits, encouraging seamless replenishment.
* **Risk Framing:** Position the cost of a 79.00 EUR pass against thousands of euros in potential joint-liability fines to dramatically accelerate conversion rates.
