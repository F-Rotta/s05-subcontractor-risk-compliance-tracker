'use client';

import React, { useState } from 'react';
import { z } from 'zod';

// Define enums or import them if available elsewhere in your codebase
const DocumentTypeEnum = z.enum(['DURC', 'ID_CARD', 'CONTRACT', 'OTHER']);
const VerificationStatusEnum = z.enum(['PENDING', 'APPROVED', 'REJECTED']);

export default function AuditsPage() {
  const [formData, setFormData] = useState({
    subcontractor_id: 'd3b07384-d113-4ec6-a57f-d1e028b030c1',
    document_type: 'DURC' as z.infer<typeof DocumentTypeEnum>,
    issue_date: '2025-02-01',
    expiry_date: '2025-06-01',
    verification_status: 'PENDING' as z.infer<typeof VerificationStatusEnum>,
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Audits Management</h1>
      <div className="bg-white shadow rounded-lg p-4">
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </div>
    </div>
  );
}
