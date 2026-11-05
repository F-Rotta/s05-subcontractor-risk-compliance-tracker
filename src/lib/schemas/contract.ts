import { z } from 'zod';

// ==========================================
// SHARED DOMAIN ENUMS & LITERALS
// ==========================================

export const LegalPracticeTypeEnum = z.enum([
  'studio_legale',
  'studio_notarile',
  'corporate_legal_dept',
  'trust_company'
]);
export type LegalPracticeType = z.infer<typeof LegalPracticeTypeEnum>;

export const RiskExposureLevelEnum = z.enum(['low', 'medium', 'high', 'critical']);
export type RiskExposureLevel = z.infer<typeof RiskExposureLevelEnum>;

export const SubcontractorStatusEnum = z.enum([
  'verified',
  'under_review',
  'suspended',
  'blacklisted'
]);
export type SubcontractorStatus = z.infer<typeof SubcontractorStatusEnum>;

export const SubcontractStatusEnum = z.enum([
  'draft',
  'active',
  'suspended',
  'completed',
  'terminated'
]);
export type SubcontractStatus = z.infer<typeof SubcontractStatusEnum>;

export const ComplianceDocumentTypeEnum = z.enum([
  'durc_online',
  'durf_fiscale',
  'f24_quittance',
  'lul_libro_unico',
  'uniemens_denuncia',
  'congruita_manodopera',
  'polizza_rct_rco',
  'visura_camerale',
  'autocertificazione_art_26'
]);
export type ComplianceDocumentType = z.infer<typeof ComplianceDocumentTypeEnum>;

export const DocumentVerificationStatusEnum = z.enum([
  'pending',
  'valid',
  'expired',
  'irregular',
  'rejected'
]);
export type DocumentVerificationStatus = z.infer<typeof DocumentVerificationStatusEnum>;

export const AuditOutcomeEnum = z.enum([
  'cleared',
  'cautionary_withholding',
  'breach_detected',
  'in_progress'
]);
export type AuditOutcome = z.infer<typeof AuditOutcomeEnum>;

export const AlertTypeEnum = z.enum([
  'durc_expiring_soon',
  'durc_expired',
  'durf_missing',
  'f24_unreconciled',
  'joint_liability_deadline_24m',
  'labor_rate_mismatch',
  'anac_irregularity'
]);
export type AlertType = z.infer<typeof AlertTypeEnum>;

export const AlertSeverityEnum = z.enum(['info', 'warning', 'critical']);
export type AlertSeverity = z.infer<typeof AlertSeverityEnum>;

// Regex patterns for Italian statutory identifiers
export const ITALIAN_VAT_REGEX = /^[0-9]{11}$/;
export const ITALIAN_FISCAL_CODE_REGEX = /^[A-Z0-9]{16}$|^[0-9]{11}$/;

// ==========================================
// 1. SPOKE ORGANIZATIONS (TENANT)
// ==========================================

export const SpokeOrganizationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  vat_number: z.string().min(11).max(32),
  fiscal_code: z.string().min(11).max(16),
  legal_practice_type: LegalPracticeTypeEnum,
  pec_email: z.string().email().max(255),
  primary_contact_name: z.string().min(1).max(255),
  primary_contact_email: z.string().email().max(255),
  settings: z.record(z.unknown()).default({}),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});

export const InsertSpokeOrganizationSchema = SpokeOrganizationSchema.omit({
  id: true,
  created_at: true,
  updated_at: true
});

export type SpokeOrganization = z.infer<typeof SpokeOrganizationSchema>;
export type InsertSpokeOrganization = z.infer<typeof InsertSpokeOrganizationSchema>;

// ==========================================
// 2. MAIN CONTRACTORS (COMMITTENTI)
// ==========================================

export const MainContractorSchema = z.object({
  id: z.string().uuid(),
  spoke_org_id: z.string().uuid(),
  company_name: z.string().min(1).max(255),
  vat_number: z.string().min(11).max(32),
  fiscal_code: z.string().min(11).max(16),
  legal_seat_address: z.string().min(1),
  legal_representative: z.string().min(1).max(255),
  pec_email: z.string().email().max(255),
  risk_exposure_level: RiskExposureLevelEnum.default('low'),
  is_active: z.boolean().default(true),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});

export const InsertMainContractorSchema = MainContractorSchema.omit({
  id: true,
  created_at: true,
  updated_at: true
});

export type MainContractor = z.infer<typeof MainContractorSchema>;
export type InsertMainContractor = z.infer<typeof InsertMainContractorSchema>;

// ==========================================
// 3. SUBCONTRACTORS (SUBAPPALTATORI)
// ==========================================

export const SubcontractorSchema = z.object({
  id: z.string().uuid(),
  spoke_org_id: z.string().uuid(),
  company_name: z.string().min(1).max(255),
  vat_number: z.string().min(11).max(32),
  fiscal_code: z.string().min(11).max(16),
  inps_position_code: z.string().max(64).nullable().optional(),
  inail_position_code: z.string().max(64).nullable().optional(),
  cassa_edile_code: z.string().max(64).nullable().optional(),
  applied_ccnl: z.string().min(1).max(128),
  legal_representative: z.string().min(1).max(255),
  pec_email: z.string().email().max(255),
  compliance_rating: z.number().min(0.0).max(1.0).default(1.0),
  status: SubcontractorStatusEnum.default('under_review'),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});

export const InsertSubcontractorSchema = SubcontractorSchema.omit({
  id: true,
  created_at: true,
  updated_at: true
});

export type Subcontractor = z.infer<typeof SubcontractorSchema>;
export type InsertSubcontractor = z.infer<typeof InsertSubcontractorSchema>;

// ==========================================
// 4. SUBCONTRACTS (APPALTI E SUBAPPALTI)
// ==========================================

export const SubcontractSchema = z.object({
  id: z.string().uuid(),
  spoke_org_id: z.string().uuid(),
  main_contractor_id: z.string().uuid(),
  subcontractor_id: z.string().uuid(),
  contract_code: z.string().min(1).max(128),
  cig_code: z.string().max(10).nullable().optional(),
  cup_code: z.string().max(15).nullable().optional(),
  description: z.string().min(1),
  worksite_location: z.string().min(1),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD required'),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD required'),
  total_amount: z.number().nonnegative(),
  labor_cost_declared: z.number().nonnegative(),
  joint_liability_expiry_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD required'),
  requires_durf: z.boolean().default(true),
  is_solidary_liability_active: z.boolean().default(true),
  status: SubcontractStatusEnum.default('active'),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});

export const InsertSubcontractSchema = SubcontractSchema.omit({
  id: true,
  created_at: true,
  updated_at: true
});

export type Subcontract = z.infer<typeof SubcontractSchema>;
export type InsertSubcontract = z.infer<typeof InsertSubcontractSchema>;

// ==========================================
// 5. COMPLIANCE DOCUMENTS
// ==========================================

export const ComplianceDocumentSchema = z.object({
  id: z.string().uuid(),
  spoke_org_id: z.string().uuid(),
  subcontract_id: z.string().uuid(),
  subcontractor_id: z.string().uuid(),
  document_type: ComplianceDocumentTypeEnum,
  protocol_number: z.string().min(1).max(128),
  file_storage_path: z.string().min(1),
  file_hash_sha256: z.string().length(64),
  valid_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD required'),
  valid_until: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD required'),
  reference_period_start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  reference_period_end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  declared_f24_tributary_amount: z.number().nonnegative().default(0),
  declared_inps_inail_amount: z.number().nonnegative().default(0),
  verification_status: DocumentVerificationStatusEnum.default('pending'),
  verified_by_user_id: z.string().uuid().nullable().optional(),
  verification_timestamp: z.string().datetime().nullable().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});

export const InsertComplianceDocumentSchema = ComplianceDocumentSchema.omit({
  id: true,
  created_at: true,
  updated_at: true
});

export type ComplianceDocument = z.infer<typeof ComplianceDocumentSchema>;
export type InsertComplianceDocument = z.infer<typeof InsertComplianceDocumentSchema>;

// ==========================================
// 6. JOINT LIABILITY AUDITS (ART. 29 AUDIT)
// ==========================================

export const JointLiabilityAuditSchema = z.object({
  id: z.string().uuid(),
  spoke_org_id: z.string().uuid(),
  subcontract_id: z.string().uuid(),
  audit_reference_month: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD required'),
  sal_reference_number: z.string().max(64).nullable().optional(),
  withholding_payment_advised: z.boolean().default(false),
  withholding_amount: z.number().nonnegative().default(0),
  solidary_risk_score: z.number().min(0.0).max(100.0),
  audit_outcome: AuditOutcomeEnum.default('in_progress'),
  auditor_legal_notes: z.string().nullable().optional(),
  approved_at: z.string().datetime().nullable().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});

export const InsertJointLiabilityAuditSchema = JointLiabilityAuditSchema.omit({
  id: true,
  created_at: true,
  updated_at: true
});

export type JointLiabilityAudit = z.infer<typeof JointLiabilityAuditSchema>;
export type InsertJointLiabilityAudit = z.infer<typeof InsertJointLiabilityAuditSchema>;

// ==========================================
// 7. AI COMPLIANCE ANALYSES (CLAUDE HAIKU 4.5)
// ==========================================

export const AnomalyReportSchema = z.object({
  field: z.string(),
  expected: z.union([z.string(), z.number()]),
  extracted: z.union([z.string(), z.number()]),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  notes: z.string()
});
export type AnomalyReport = z.infer<typeof AnomalyReportSchema>;

export const AiComplianceAnalysisSchema = z.object({
  id: z.string().uuid(),
  spoke_org_id: z.string().uuid(),
  document_id: z.string().uuid(),
  ai_model: z.string().default('claude-3-5-haiku-20241022'),
  extracted_tax_id: z.string().max(16).nullable().optional(),
  extracted_durc_expiry: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  extracted_f24_cf_section: z.string().max(16).nullable().optional(),
  extracted_f24_total_paid: z.number().nullable().optional(),
  congruence_match: z.boolean().default(false),
  detected_anomalies: z.array(AnomalyReportSchema).default([]),
  raw_haiku_response: z.record(z.unknown()).default({}),
  confidence_score: z.number().min(0.0).max(1.0),
  requires_manual_lawyer_review: z.boolean().default(false),
  created_at: z.string().datetime()
});

export const InsertAiComplianceAnalysisSchema = AiComplianceAnalysisSchema.omit({
  id: true,
  created_at: true
});

export type AiComplianceAnalysis = z.infer<typeof AiComplianceAnalysisSchema>;
export type InsertAiComplianceAnalysis = z.infer<typeof InsertAiComplianceAnalysisSchema>;

// ==========================================
// 8. COMPLIANCE ALERTS
// ==========================================

export const ComplianceAlertSchema = z.object({
  id: z.string().uuid(),
  spoke_org_id: z.string().uuid(),
  subcontract_id: z.string().uuid(),
  document_id: z.string().uuid().nullable().optional(),
  alert_type: AlertTypeEnum,
  severity: AlertSeverityEnum,
  deadline_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD required'),
  description: z.string().min(1),
  is_acknowledged: z.boolean().default(false),
  acknowledged_by: z.string().uuid().nullable().optional(),
  acknowledged_at: z.string().datetime().nullable().optional(),
  created_at: z.string().datetime()
});

export const InsertComplianceAlertSchema = ComplianceAlertSchema.omit({
  id: true,
  created_at: true
});

export type ComplianceAlert = z.infer<typeof ComplianceAlertSchema>;
export type InsertComplianceAlert = z.infer<typeof InsertComplianceAlertSchema>;
