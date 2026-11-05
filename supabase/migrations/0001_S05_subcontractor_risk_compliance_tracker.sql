```sql
-- ============================================================
-- IMMUTABLE DATA CONTRACT
-- Spoke: Subcontractor Risk Compliance Tracker (S05)
-- Schema: S05_subcontractor_risk_compliance_tracker
-- Target: Studi Legali e Notai
-- ============================================================

-- ----------------------------------------------------------------
-- 0. SCHEMA CREATION
-- ----------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS "S05_subcontractor_risk_compliance_tracker";

-- ----------------------------------------------------------------
-- 1. HELPER FUNCTION: current_spoke_org_id()
--    Reads the JWT claim 'spoke_org_id' set by the auth layer.
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION "S05_subcontractor_risk_compliance_tracker".current_spoke_org_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = "S05_subcontractor_risk_compliance_tracker"
AS $$
  SELECT COALESCE(
    (current_setting('request.jwt.claims', true)::jsonb ->> 'spoke_org_id')::uuid,
    (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'spoke_org_id')::uuid
  );
$$;

-- ----------------------------------------------------------------
-- 2. ENUM TYPES
-- ----------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE "S05_subcontractor_risk_compliance_tracker"."contract_status" AS ENUM (
    'draft',
    'active',
    'suspended',
    'terminated',
    'expired'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "S05_subcontractor_risk_compliance_tracker"."risk_level" AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "S05_subcontractor_risk_compliance_tracker"."deadline_type" AS ENUM (
    'regulatory_filing',
    'insurance_renewal',
    'license_renewal',
    'tax_compliance',
    'audit_submission',
    'contract_milestone',
    'joint_liability_notice',
    'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "S05_subcontractor_risk_compliance_tracker"."deadline_status" AS ENUM (
    'upcoming',
    'overdue',
    'completed',
    'waived',
    'at_risk'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "S05_subcontractor_risk_compliance_tracker"."liability_type" AS ENUM (
    'joint_and_several',
    'proportional',
    'subsidiary',
    'unlimited',
    'capped'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "S05_subcontractor_risk_compliance_tracker"."audit_event_type" AS ENUM (
    'contract_created',
    'contract_updated',
    'deadline_added',
    'deadline_completed',
    'deadline_overdue',
    'risk_score_changed',
    'liability_registered',
    'ai_analysis_run',
    'compliance_alert_sent',
    'document_attached',
    'status_changed'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "S05_subcontractor_risk_compliance_tracker"."document_type" AS ENUM (
    'contract',
    'insurance_certificate',
    'license',
    'tax_clearance',
    'audit_report',
    'liability_waiver',
    'amendment',
    'correspondence',
    'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "S05_subcontractor_risk_compliance_tracker"."alert_channel" AS ENUM (
    'email',
    'in_app',
    'webhook',
    'sms'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "S05_subcontractor_risk_compliance_tracker"."ai_analysis_status" AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ----------------------------------------------------------------
-- 3. TENANT TABLE: spoke_organizations (local legacy tenant)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "S05_subcontractor_risk_compliance_tracker"."spoke_organizations" (
  "id"                  uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  "name"                text          NOT NULL,
  "legal_entity_name"   text,
  "vat_number"          text          UNIQUE,
  "tax_code"            text,
  "bar_registration_id" text,
  "jurisdiction"        text          NOT NULL DEFAULT 'IT',
  "address"             jsonb,
  "contact_email"       text          NOT NULL,
  "contact_phone"       text,
  "subscription_tier"   text          NOT NULL DEFAULT 'standard',
  "is_active"           boolean       NOT NULL DEFAULT true,
  "settings"            jsonb         NOT NULL DEFAULT '{}',
  "created_at"          timestamptz   NOT NULL DEFAULT now(),
  "updated_at"          timestamptz   NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------
-- 4. SUBCONTRACTORS TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "S05_subcontractor_risk_compliance_tracker"."subcontractors" (
  "id"                    uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  "org_id"                uuid          NOT NULL
                          REFERENCES "S05_subcontractor_risk_compliance_tracker"."spoke_organizations"("id")
                          ON DELETE CASCADE,
  "legal_name"            text          NOT NULL,
  "trade_name"            text,
  "vat_number"            text,
  "tax_code"              text,
  "registration_number"   text,
  "jurisdiction"          text          NOT NULL DEFAULT 'IT',
  "address"               jsonb,
  "primary_contact_name"  text,
  "primary_contact_email" text,
  "primary_contact_phone" text,
  "industry_codes"        text[]        NOT NULL DEFAULT '{}',
  "risk_level"            "S05_subcontractor_risk_compliance_tracker"."risk_level"
                          NOT NULL DEFAULT 'medium',
  "risk_score"            numeric(5,2)  CHECK ("risk_score" >= 0 AND "risk_score" <= 100),
  "is_active"             boolean       NOT NULL DEFAULT true,
  "metadata"              jsonb         NOT NULL DEFAULT '{}',
  "created_at"            timestamptz   NOT NULL DEFAULT now(),
  "updated_at"            timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_subcontractors_org_id"
  ON "S05_subcontractor_risk_compliance_tracker"."subcontractors" ("org_id");

CREATE INDEX IF NOT EXISTS "idx_subcontractors_risk_level"
  ON "S05_subcontractor_risk_compliance_tracker"."subcontractors" ("org_id", "risk_level");

CREATE INDEX IF NOT EXISTS "idx_subcontractors_vat"
  ON "S05_subcontractor_risk_compliance_tracker"."subcontractors" ("vat_number")
  WHERE "vat_number" IS NOT NULL;

-- ----------------------------------------------------------------
-- 5. SUBCONTRACT AGREEMENTS TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "S05_subcontractor_risk_compliance_tracker"."subcontract_agreements" (
  "id"                      uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  "org_id"                  uuid          NOT NULL
                            REFERENCES "S05_subcontractor_risk_compliance_tracker"."spoke_organizations"("id")
                            ON DELETE CASCADE,
  "subcontractor_id"        uuid          NOT NULL
                            REFERENCES "S05_subcontractor_risk_compliance_tracker"."subcontractors"("id")
                            ON DELETE RESTRICT,
  "reference_number"        text          NOT NULL,
  "title"                   text          NOT NULL,
  "description"             text,
  "status"                  "S05_subcontractor_risk_compliance_tracker"."contract_status"
                            NOT NULL DEFAULT 'draft',
  "contract_value"          numeric(18,2),
  "currency"                char(3)       NOT NULL DEFAULT 'EUR',
  "start_date"              date          NOT NULL,
  "end_date"                date,
  "signed_date"             date,
  "governing_law"           text          NOT NULL DEFAULT 'IT',
  "applicable_regulations"  text[]        NOT NULL DEFAULT '{}',
  "has_joint_liability"     boolean       NOT NULL DEFAULT false,
  "joint_liability_details" text,
  "risk_level"              "S05_subcontractor_risk_compliance_tracker"."risk_level"
                            NOT NULL DEFAULT 'medium',
  "ai_risk_summary"         text,
  "ai_analysis_status"      "S05_subcontractor_risk_compliance_tracker"."ai_analysis_status"
                            NOT NULL DEFAULT 'pending',
  "last_ai_analysis_at"     timestamptz,
  "tags"                    text[]        NOT NULL DEFAULT '{}',
  "metadata"                jsonb         NOT NULL DEFAULT '{}',
  "created_by_user_id"      uuid,
  "created_at"              timestamptz   NOT NULL DEFAULT now(),
  "updated_at"              timestamptz   NOT NULL DEFAULT now(),
  CONSTRAINT "uq_agreement_ref_per_org"
    UNIQUE ("org_id", "reference_number"),
  CONSTRAINT "chk_dates_order"
    CHECK ("end_date" IS NULL OR "end_date" > "start_date")
);

CREATE INDEX IF NOT EXISTS "idx_agreements_org_id"
  ON "S05_subcontractor_risk_compliance_tracker"."subcontract_agreements" ("org_id");

CREATE INDEX IF NOT EXISTS "idx_agreements_subcontractor_id"
  ON "S05_subcontractor_risk_compliance_tracker"."subcontract_agreements" ("subcontractor_id");

CREATE INDEX IF NOT EXISTS "idx_agreements_status"
  ON "S05_subcontractor_risk_compliance_tracker"."subcontract_agreements" ("org_id", "status");

CREATE INDEX IF NOT EXISTS "idx_agreements_dates"
  ON "S05_subcontractor_risk_compliance_tracker"."subcontract_agreements" ("org_id", "start_date", "end_date");

CREATE INDEX IF NOT EXISTS "idx_agreements_risk"
  ON "S05_subcontractor_risk_compliance_tracker"."subcontract_agreements" ("org_id", "risk_level");

-- ----------------------------------------------------------------
-- 6. COMPLIANCE DEADLINES TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "S05_subcontractor_risk_compliance_tracker"."compliance_deadlines" (
  "id"                  uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  "org_id"              uuid          NOT NULL
                        REFERENCES "S05_subcontractor_risk_compliance_tracker"."spoke_organizations"("id")
                        ON DELETE CASCADE,
  "agreement_id"        uuid
                        REFERENCES "S05_subcontractor_risk_compliance_tracker"."subcontract_agreements"("id")
                        ON DELETE CASCADE,
  "subcontractor_id"    uuid
                        REFERENCES "S05_subcontractor_risk_compliance_tracker"."subcontractors"("id")
                        ON DELETE CASCADE,
  "title"               text          NOT NULL,
  "description"         text,
  "deadline_type"       "S05_subcontractor_risk_compliance_tracker"."deadline_type"
                        NOT NULL,
  "status"              "S05_subcontractor_risk_compliance_tracker"."deadline_status"
                        NOT NULL DEFAULT 'upcoming',
  "due_date"            date          NOT NULL,
  "reminder_days"       integer[]     NOT NULL DEFAULT '{30,14,7,1}',
  "completed_at"        timestamptz,
  "completed_by_user_id" uuid,
  "completion_notes"    text,
  "regulatory_reference" text,
  "responsible_party"   text,
  "risk_level"          "S05_subcontractor_risk_compliance_tracker"."risk_level"
                        NOT NULL DEFAULT 'medium',
  "is_recurring"        boolean       NOT NULL DEFAULT false,
  "recurrence_interval_days" integer  CHECK ("recurrence_interval_days" > 0),
  "parent_deadline_id"  uuid
                        REFERENCES "S05_subcontractor_risk_compliance_tracker"."compliance_deadlines"("id")
                        ON DELETE SET NULL,
  "ai_suggested"        boolean       NOT NULL DEFAULT false,
  "metadata"            jsonb         NOT NULL DEFAULT '{}',
  "created_at"          timestamptz   NOT NULL DEFAULT now(),
  "updated_at"          timestamptz   NOT NULL DEFAULT now(),
  CONSTRAINT "chk_deadline_entity"
    CHECK ("agreement_id" IS NOT NULL OR "subcontractor_id" IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS "idx_deadlines_org_id"
  ON "S05_subcontractor_risk_compliance_tracker"."compliance_deadlines" ("org_id");

CREATE INDEX IF NOT EXISTS "idx_deadlines_agreement_id"
  ON "S05_subcontractor_risk_compliance_tracker"."compliance_deadlines" ("agreement_id")
  WHERE "agreement_id" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "idx_deadlines_subcontractor_id"
  ON "S05_subcontractor_risk_compliance_tracker"."compliance_deadlines" ("subcontractor_id")
  WHERE "subcontractor_id" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "idx_deadlines_due_date"
  ON "S05_subcontractor_risk_compliance_tracker"."compliance_deadlines" ("org_id", "due_date", "status");

CREATE INDEX IF NOT EXISTS "idx_deadlines_status"
  ON "S05_subcontractor_risk_compliance_tracker"."compliance_deadlines" ("org_id", "status");

-- ----------------------------------------------------------------
-- 7. LIABILITY REGISTERS TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "S05_subcontractor_risk_compliance_tracker"."liability_registers" (
  "id"                    uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  "org_id"                uuid          NOT NULL
                          REFERENCES "S05_subcontractor_risk_compliance_tracker"."spoke_organizations"("id")
                          ON DELETE CASCADE,
  "agreement_id"          uuid          NOT NULL
                          REFERENCES "S05_subcontractor_risk_compliance_tracker"."subcontract_agreements"("id")
                          ON DELETE CASCADE,
  "subcontractor_id"      uuid          NOT NULL
                          REFERENCES "S05_subcontractor_risk_compliance_tracker"."subcontractors"("id")
                          ON DELETE RESTRICT,
  "liability_type"        "S05_subcontractor_risk_compliance_tracker"."liability_type"
                          NOT NULL,
  "description"           text          NOT NULL,
  "legal_basis"           text,
  "statutory_reference"   text,
  "exposure_amount"       numeric(18,2),
  "currency"              char(3)       NOT NULL DEFAULT 'EUR',
  "cap_amount"            numeric(18,2),
  "effective_date"        date          NOT NULL,
  "expiry_date"           date,
  "is_insured"            boolean       NOT NULL DEFAULT false,
  "insurance_policy_ref"  text,
  "risk_level"            "S05_subcontractor_risk_compliance_tracker"."risk_level"
                          NOT NULL DEFAULT 'medium',
  "ai_assessment"         text,
  "mitigation_measures"   text,
  "is_active"             boolean       NOT NULL DEFAULT true,
  "metadata"              jsonb         NOT NULL DEFAULT '{}',
  "created_at"            timestamptz   NOT NULL DEFAULT now(),
  "updated_at"            timestamptz   NOT NULL DEFAULT now(),
  CONSTRAINT "chk_liability_dates"
    CHECK ("expiry_date" IS NULL OR "expiry_date" > "effective_date"),
  CONSTRAINT "chk_cap_vs_exposure"
    CHECK ("cap_amount" IS NULL OR "exposure_amount" IS NULL OR "cap_amount" <= "exposure_amount")
);

CREATE INDEX IF NOT EXISTS "idx_liability_org_id"
  ON "S05_subcontractor_risk_compliance_tracker"."liability_registers" ("org_id");

CREATE INDEX IF NOT EXISTS "idx_liability_agreement_id"
  ON "S05_subcontractor_risk_compliance_tracker"."liability_registers" ("agreement_id");

CREATE INDEX IF NOT EXISTS "idx_liability_subcontractor_id"
  ON "S05_subcontractor_risk_compliance_tracker"."liability_registers" ("subcontractor_id");

CREATE INDEX IF NOT EXISTS "idx_liability_risk"
  ON "S05_subcontractor_risk_compliance_tracker"."liability_registers" ("org_id", "risk_level", "is_active");

-- ----------------------------------------------------------------
-- 8. DOCUMENTS TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "S05_subcontractor_risk_compliance_tracker"."documents" (
  "id"                  uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  "org_id"              uuid          NOT NULL
                        REFERENCES "S05_subcontractor_risk_compliance_tracker"."spoke_organizations"("id")
                        ON DELETE CASCADE,
  "agreement_id"        uuid
                        REFERENCES "S05_subcontractor_risk_compliance_tracker"."subcontract_agreements"("id")
                        ON DELETE CASCADE,
  "subcontractor_id"    uuid
                        REFERENCES "S05_subcontractor_risk_compliance_tracker"."subcontractors"("id")
                        ON DELETE CASCADE,
  "deadline_id"         uuid
                        REFERENCES "S05_subcontractor_risk_compliance_tracker"."compliance_deadlines"("id")
                        ON DELETE SET NULL,
  "document_type"       "S05_subcontractor_risk_compliance_tracker"."document_type"
                        NOT NULL,
  "title"               text          NOT NULL,
  "file_name"           text          NOT NULL,
  "file_path"           text          NOT NULL,
  "file_size_bytes"     bigint,
  "mime_type"           text,
  "checksum_sha256"     text,
  "version"             integer       NOT NULL DEFAULT 1,
  "is_latest_version"   boolean       NOT NULL DEFAULT true,
  "previous_version_id" uuid
                        REFERENCES "S05_subcontractor_risk_compliance_tracker"."documents"("id")
                        ON DELETE SET NULL,
  "expiry_date"         date,
  "issued_date"         date,
  "issuing_authority"   text,
  "ai_extracted_data"   jsonb,
  "ai_analysis_status"  "S05_subcontractor_risk_compliance_tracker"."ai_analysis_status"
                        NOT NULL DEFAULT 'pending',
  "uploaded_by_user_id" uuid,
  "metadata"            jsonb         NOT NULL DEFAULT '{}',
  "created_at"          timestamptz   NOT NULL DEFAULT now(),
  "updated_at"          timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_documents_org_id"
  ON "S05_subcontractor_risk_compliance_tracker"."documents" ("org_id");

CREATE INDEX IF NOT EXISTS "idx_documents_agreement_id"
  ON "S05_subcontractor_risk_compliance_tracker"."documents" ("agreement_id")
  WHERE "agreement_id" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "idx_documents_subcontractor_id"
  ON "S05_subcontractor_risk_compliance_tracker"."documents" ("subcontractor_id")
  WHERE "subcontractor_id" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "idx_documents_expiry"
  ON "S05_subcontractor_risk_compliance_tracker"."documents" ("org_id", "expiry_date")
  WHERE "expiry_date" IS NOT NULL;

-- ----------------------------------------------------------------
-- 9. AI ANALYSIS RUNS TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "S05_subcontractor_risk_compliance_tracker"."ai_analysis_runs" (
  "id"                    uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  "org_id"                uuid          NOT NULL
                          REFERENCES "S05_subcontractor_risk_compliance_tracker"."spoke_organizations"("id")
                          ON DELETE CASCADE,
  "agreement_id"          uuid
                          REFERENCES "S05_subcontractor_risk_compliance_tracker"."subcontract_agreements"("id")
                          ON DELETE CASCADE,
  "subcontractor_id"      uuid
                          REFERENCES "S05_subcontractor_risk_compliance_tracker"."subcontractors"("id")
                          ON DELETE CASCADE,
  "document_id"           uuid
                          REFERENCES "S05_subcontractor_risk_compliance_tracker"."documents"("id")
                          ON DELETE CASCADE,
  "analysis_type"         text          NOT NULL,
  "status"                "S05_subcontractor_risk_compliance_tracker"."ai_analysis_status"
                          NOT NULL DEFAULT 'pending',
  "model_name"            text          NOT NULL DEFAULT 'claude-haiku-4-5',
  "prompt_tokens"         integer,
  "completion_tokens"     integer,
  "total_tokens"          integer,
  "latency_ms"            integer,
  "input_data"            jsonb         NOT NULL DEFAULT '{}',
  "output_data"           jsonb,
  "risk_scores"           jsonb,
  "detected_deadlines"    jsonb,
  "detected_liabilities"  jsonb,
  "recommendations"       jsonb,
  "error_message"         text,
  "triggered_by_user_id"  uuid,
  "is_hybrid_mode"        boolean       NOT NULL DEFAULT true,
  "created_at"            timestamptz   NOT NULL DEFAULT now(),
  "completed_at"          timestamptz
);

CREATE INDEX IF NOT EXISTS "idx_ai_runs_org_id"
  ON "S05_subcontractor_risk_compliance_tracker"."ai_analysis_runs" ("org_id");

CREATE INDEX IF NOT EXISTS "idx_ai_runs_agreement_id"
  ON "S05_subcontractor_risk_compliance_tracker"."ai_analysis_runs" ("agreement_id")
  WHERE "agreement_id" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "idx_ai_runs_status"
  ON "S05_subcontractor_risk_compliance_tracker"."ai_analysis_runs" ("org_id", "status");

CREATE INDEX IF NOT EXISTS "idx_ai_runs_created_at"
  ON "S05_subcontractor_risk_compliance_tracker"."ai_analysis_runs" ("org_id", "created_at" DESC);

-- ----------------------------------------------------------------
-- 10. ALERT RULES TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "S05_subcontractor_risk_compliance_tracker"."alert_rules" (
  "id"                  uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  "org_id"              uuid          NOT NULL
                        REFERENCES "S05_subcontractor_risk_compliance_tracker"."spoke_organizations"("id")
                        ON DELETE CASCADE,
  "name"                text          NOT NULL,
  "description"         text,
  "is_active"           boolean       NOT NULL DEFAULT true,
  "trigger_days_before" integer[]     NOT NULL DEFAULT '{30,14,7,1}',
  "deadline_types"      "S05_subcontractor_risk_compliance_tracker"."deadline_type"[],
  "risk_levels"         "S05_subcontractor_risk_compliance_tracker"."risk_level"[],
  "channels"            "S05_subcontractor_risk_compliance_tracker"."alert_channel"[]
                        NOT NULL DEFAULT '{email,in_app}',
  "recipient_emails"    text[]        NOT NULL DEFAULT '{}',
  "webhook_url"         text,
  "template_subject"    text,
  "template_body"       text,
  "metadata"            jsonb         NOT NULL DEFAULT '{}',
  "created_at"          timestamptz   NOT NULL DEFAULT now(),
  "updated_at"          timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_alert_rules_org_id"
  ON "S05_subcontractor_risk_compliance_tracker"."alert_rules" ("org_id");

CREATE INDEX IF NOT EXISTS "idx_alert_rules_active"
  ON "S05_subcontractor_risk_compliance_tracker"."alert_rules" ("org_id", "is_active");

-- ----------------------------------------------------------------
-- 11. ALERT NOTIFICATIONS TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "S05_subcontractor_risk_compliance_tracker"."alert_notifications" (
  "id"                  uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  "org_id"              uuid          NOT NULL
                        REFERENCES "S05_subcontractor_risk_compliance_tracker"."spoke_organizations"("id")
                        ON DELETE CASCADE,
  "alert_rule_id"       uuid
                        REFERENCES "S05_subcontractor_risk_compliance_tracker"."alert_rules"("id")
                        ON DELETE SET NULL,
  "deadline_id"         uuid
                        REFERENCES "S05_subcontractor_risk_compliance_tracker"."compliance_deadlines"("id")
                        ON DELETE CASCADE,
  "channel"             "S05_subcontractor_risk_compliance_tracker"."alert_channel"
                        NOT NULL,
  "recipient"           text          NOT NULL,
  "subject"             text,
  "body"                text          NOT NULL,
  "sent_at"             timestamptz,
  "is_sent"             boolean       NOT NULL DEFAULT false,
  "error_message"       text,
  "retry_count"         integer       NOT NULL DEFAULT 0,
  "metadata"            jsonb         NOT NULL DEFAULT '{}',
  "created_at"          timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_notifications_org_id"
  ON "S05_subcontractor_risk_compliance_tracker"."alert_notifications" ("org_id");

CREATE INDEX IF NOT EXISTS "idx_notifications_deadline_id"
  ON "S05_subcontractor_risk_compliance_tracker"."alert_notifications" ("deadline_id");

CREATE INDEX IF NOT EXISTS "idx_notifications_pending"
  ON "S05_subcontractor_risk_compliance_tracker"."alert_notifications" ("is_sent", "created_at")
  WHERE NOT "is_sent";

-- ----------------------------------------------------------------
-- 12. AUDIT LOG TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "S05_subcontractor_risk_compliance_tracker"."audit_logs" (
  "id"                  uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  "org_id"              uuid          NOT NULL
                        REFERENCES "S05_subcontractor_risk_compliance_tracker"."spoke_organizations"("id")
                        ON DELETE CASCADE,
  "event_type"          "S05_subcontractor_risk_compliance_tracker"."audit_event_type"
                        NOT NULL,
  "entity_type"         text          NOT NULL,
  "entity_id"           uuid          NOT NULL,
  "user_id"             uuid,
  "user_email"          text,
  "ip_address"          inet,
  "user_agent"          text,
  "old_values"          jsonb,
  "new_values"          jsonb,
  "diff"                jsonb,
  "description"         text,
  "metadata"            jsonb         NOT NULL DEFAULT '{}',
  "created_at"          timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_audit_org_id"
  ON "S05_subcontractor_risk_compliance_tracker"."audit_logs" ("org_id");

CREATE INDEX IF NOT EXISTS "idx_audit_entity"
  ON "S05_subcontractor_risk_compliance_tracker"."audit_logs" ("entity_type", "entity_id");

CREATE INDEX IF NOT EXISTS "idx_audit_event_type"
  ON "S05_subcontractor_risk_compliance_tracker"."audit_logs" ("org_id", "event_type");

CREATE INDEX IF NOT EXISTS "idx_audit_created_at"
  ON "S05_subcontractor_risk_compliance_tracker"."audit_logs" ("org_id", "created_at" DESC);

-- Audit logs are append-only, no updates/deletes
CREATE INDEX IF NOT EXISTS "idx_audit_user_id"
  ON "S05_subcontractor_risk_compliance_tracker"."audit_logs" ("user_id")
  WHERE "user_id" IS NOT NULL;

-- ----------------------------------------------------------------
-- 13. UPDATED_AT TRIGGER FUNCTION
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION "S05_subcontractor_risk_compliance_tracker".set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = "S05_subcontractor_risk_compliance_tracker"
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply updated_at triggers to all mutable tables
DO $$ DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'spoke_organizations',
    'subcontractors',
    'subcontract_agreements',
    'compliance_deadlines',
    'liability_registers',
    'documents',
    'alert_rules'
  ]
  LOOP
    EXECUTE format(
      'CREATE OR REPLACE TRIGGER trg_%s_updated_at
       BEFORE UPDATE ON "S05_subcontractor_risk_compliance_tracker"."%s"
       FOR EACH ROW EXECUTE FUNCTION
       "S05_subcontractor_risk_compliance_tracker".set_updated_at()',
      t, t
    );
  END LOOP;
END $$;

-- ----------------------------------------------------------------
-- 14. ROW LEVEL SECURITY (RLS)
-- ----------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE "S05_subcontractor_risk_compliance_tracker"."spoke_organizations"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "S05_subcontractor_risk_compliance_tracker"."subcontractors"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "S05_subcontractor_risk_compliance_tracker"."subcontract_agreements"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "S05_subcontractor_risk_compliance_tracker"."compliance_deadlines"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "S05_subcontractor_risk_compliance_tracker"."liability_registers"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "S05_subcontractor_risk_compliance_tracker"."documents"               ENABLE ROW LEVEL SECURITY;
ALTER TABLE "S05_subcontractor_risk_compliance_tracker"."ai_analysis_runs"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "S05_subcontractor_risk_compliance_tracker"."alert_rules"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE "S05_subcontractor_risk_compliance_tracker"."alert_notifications"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "S05_subcontractor_risk_compliance_tracker"."audit_logs"              ENABLE ROW LEVEL SECURITY;

-- Force RLS even for table owners
ALTER TABLE "S05_subcontractor_risk_compliance_tracker"."spoke_organizations"      FORCE ROW LEVEL SECURITY;
ALTER TABLE "S05_subcontractor_risk_compliance_tracker"."subcontractors"           FORCE ROW LEVEL SECURITY;
ALTER TABLE "S05_subcontractor_risk_compliance_tracker"."subcontract_agreements"   FORCE ROW LEVEL SECURITY;
ALTER TABLE "S05_subcontractor_risk_compliance_tracker"."compliance_deadlines"     FORCE ROW LEVEL SECURITY;
ALTER TABLE "S05_subcontractor_risk_compliance_tracker"."liability_registers"      FORCE ROW LEVEL SECURITY
