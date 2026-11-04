-- Spoke: Subcontractor Risk Compliance Tracker (S05)
-- Target: Studi Legali e Notai (Audit conformità e responsabilità in solido subappalto)
-- AI: Claude Haiku 4.5 (Hybrid processing)

CREATE SCHEMA IF NOT EXISTS "S05_subcontractor_risk_compliance_tracker";

-- Helper per recuperare il tenant corrente dal contesto di sessione
CREATE OR REPLACE FUNCTION "S05_subcontractor_risk_compliance_tracker".current_spoke_org_id()
RETURNS UUID AS $$
BEGIN
    RETURN NULLIF(current_setting('app.current_spoke_org_id', true), '')::UUID;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Tabella tenant locale legacy
CREATE TABLE IF NOT EXISTS "S05_subcontractor_risk_compliance_tracker"."spoke_organizations" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

ALTER TABLE "S05_subcontractor_risk_compliance_tracker"."spoke_organizations" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation_policy" ON "S05_subcontractor_risk_compliance_tracker"."spoke_organizations"
    AS RESTRICTIVE
    FOR ALL
    USING ("id" = "S05_subcontractor_risk_compliance_tracker".current_spoke_org_id())
    WITH CHECK ("id" = "S05_subcontractor_risk_compliance_tracker".current_spoke_org_id());

-- 2. Subappaltatori e Anagrafica Rischio
CREATE TABLE IF NOT EXISTS "S05_subcontractor_risk_compliance_tracker"."subcontractors" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "spoke_org_id" UUID NOT NULL REFERENCES "S05_subcontractor_risk_compliance_tracker"."spoke_organizations"("id") ON DELETE CASCADE,
    "company_name" TEXT NOT NULL,
    "vat_number" TEXT NOT NULL,
    "legal_representative" TEXT NOT NULL,
    "risk_score" NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    "status" TEXT NOT NULL CHECK ("status" IN ('ACTIVE', 'SUSPENDED', 'NON_COMPLIANT', 'UNDER_AUDIT')),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

ALTER TABLE "S05_subcontractor_risk_compliance_tracker"."subcontractors" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation_policy" ON "S05_subcontractor_risk_compliance_tracker"."subcontractors"
    AS RESTRICTIVE
    FOR ALL
    USING ("spoke_org_id" = "S05_subcontractor_risk_compliance_tracker".current_spoke_org_id())
    WITH CHECK ("spoke_org_id" = "S05_subcontractor_risk_compliance_tracker".current_spoke_org_id());

-- 3. Contratti di Subappalto e Responsabilità in Solido
CREATE TABLE IF NOT EXISTS "S05_subcontractor_risk_compliance_tracker"."subcontract_contracts" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "spoke_org_id" UUID NOT NULL REFERENCES "S05_subcontractor_risk_compliance_tracker"."spoke_organizations"("id") ON DELETE CASCADE,
    "subcontractor_id" UUID NOT NULL REFERENCES "S05_subcontractor_risk_compliance_tracker"."subcontractors"("id") ON DELETE CASCADE,
    "contract_code" TEXT NOT NULL,
    "joint_liability_clause" BOOLEAN NOT NULL DEFAULT TRUE,
    "contract_value" NUMERIC(12, 2) NOT NULL,
    "start_date" DATE NOT NULL,
    "expiration_date" DATE NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

ALTER TABLE "S05_subcontractor_risk_compliance_tracker"."subcontract_contracts" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation_policy" ON "S05_subcontractor_risk_compliance_tracker"."subcontract_contracts"
    AS RESTRICTIVE
    FOR ALL
    USING ("spoke_org_id" = "S05_subcontractor_risk_compliance_tracker".current_spoke_org_id())
    WITH CHECK ("spoke_org_id" = "S05_subcontractor_risk_compliance_tracker".current_spoke_org_id());

-- 4. Audit Documentali e Scadenze Legali (Durc, Visure, Certificazioni)
CREATE TABLE IF NOT EXISTS "S05_subcontractor_risk_compliance_tracker"."compliance_audits" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "spoke_org_id" UUID NOT NULL REFERENCES "S05_subcontractor_risk_compliance_tracker"."spoke_organizations"("id") ON DELETE CASCADE,
    "subcontractor_id" UUID NOT NULL REFERENCES "S05_subcontractor_risk_compliance_tracker"."subcontractors"("id") ON DELETE CASCADE,
    "document_type" TEXT NOT NULL CHECK ("document_type" IN ('DURC', 'VISURA_CAMERALE', 'ISO_CERTIFICATION', 'SAFETY_PLAN', 'ID_DOCUMENT')),
    "issue_date" DATE NOT NULL,
    "expiry_date" DATE NOT NULL,
    "verification_status" TEXT NOT NULL CHECK ("verification_status" IN ('PENDING', 'VALID', 'EXPIRED', 'REJECTED')),
    "ai_haiku_analysis" JSONB DEFAULT '{}'::jsonb,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

ALTER TABLE "S05_subcontractor_risk_compliance_tracker"."compliance_audits" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation_policy" ON "S05_subcontractor_risk_compliance_tracker"."compliance_audits"
    AS RESTRICTIVE
    FOR ALL
    USING ("spoke_org_id" = "S05_subcontractor_risk_compliance_tracker".current_spoke_org_id())
    WITH CHECK ("spoke_org_id" = "S05_subcontractor_risk_compliance_tracker".current_spoke_org_id());
