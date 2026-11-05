import { z } from 'zod';

export const CreateComplianceAuditSchema = z.object({
  subcontractId: z.string(),
  auditType: z.string().min(1, { message: 'Audit type is required' }),
  dueDate: z.string().datetime({ message: 'Due date must be a valid date' }),
  findings: z.string().optional(),
  status: z.enum(['Pending', 'Completed', 'Failed']),
});

export const createComplianceDocumentSchema = z.object({
  subcontractId: z.string(),
  documentType: z.string().min(1, { message: 'Document type is required' }),
  fileUrl: z.string().url({ message: 'Valid file URL is required' }),
  expirationDate: z
    .string()
    .datetime({ message: 'Expiration date must be a valid date' }),
  status: z.enum(['Compliant', 'Non-Compliant', 'Expired', 'Pending']),
});
