import { z } from 'zod';

export const SpokeOrganizationSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  created_at: z.string().datetime(),
});

export const SubcontractorStatusEnum = z.enum([
  'ACTIVE',
  'SUSPENDED',
  'NON_COMPLIANT',
  'UNDER_AUDIT',
]);

export const SubcontractorSchema = z.object({
  id: z.string().uuid(),
  spoke_org_id: z.string().uuid(),
  company_name: z.string(),
  vat_number: z.string(),
  legal_representative: z.string(),
  risk_score: z.number().min(0).max(100),
  status: SubcontractorStatusEnum,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const SubcontractContractSchema = z.object({
  id: z.string().uuid(),
  spoke_org_id: z.string().uuid(),
  subcontractor_id: z.string().uuid(),
  contract_code: z.string(),
  joint_liability_clause: z.boolean(),
  contract_value: z.number().positive(),
  start_date: z.string().date(),
  expiration_date: z.string().date(),
  created_at: z.string().datetime(),
});

export const DocumentTypeEnum = z.enum([
  'DURC',
  'VISURA_CAMERALE',
  'ISO_CERTIFICATION',
  'SAFETY_PLAN',
  'ID_DOCUMENT',
]);

export const VerificationStatusEnum = z.enum([
  'PENDING',
  'VALID',
  'EXPIRED',
  'REJECTED',
]);

export const ComplianceAuditSchema = z.object({
  id: z.string().uuid(),
  spoke_org_id: z.string().uuid(),
  subcontractor_id: z.string().uuid(),
  document_type: DocumentTypeEnum,
  issue_date: z.string().date(),
  expiry_date: z.string().date(),
  verification_status: VerificationStatusEnum,
  ai_haiku_analysis: z.record(z.any()).default({}),
  created_at: z.string().datetime(),
});

export const CreateSubcontractorSchema = SubcontractorSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const CreateSubcontractContractSchema = SubcontractContractSchema.omit({
  id: true,
  created_at: true,
});

export const CreateComplianceAuditSchema = ComplianceAuditSchema.omit({
  id: true,
  created_at: true,
});

export type SpokeOrganization = z.infer<typeof SpokeOrganizationSchema>;
export type Subcontractor = z.infer<typeof SubcontractorSchema>;
export type SubcontractContract = z.infer<typeof SubcontractContractSchema>;
export type ComplianceAudit = z.infer<typeof ComplianceAuditSchema>;

export type CreateSubcontractorInput = z.infer<typeof CreateSubcontractorSchema>;
export type CreateSubcontractContractInput = z.infer<typeof CreateSubcontractContractSchema>;
export type CreateComplianceAuditInput = z.infer<typeof CreateComplianceAuditSchema>;
