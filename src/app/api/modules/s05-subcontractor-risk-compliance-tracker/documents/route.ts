import { NextRequest, NextResponse } from 'next/server';

interface ComplianceDocument {
  id: string;
  subcontractorId: string;
  subcontractorName?: string;
  name: string;
  type: 'Insurance' | 'License' | 'W9' | 'Safety' | 'Other';
  status: 'valid' | 'expired' | 'pending' | 'expiring_soon';
  expiryDate: string;
  uploadedAt: string;
  fileUrl?: string;
  notes?: string;
}

const mockDocuments: ComplianceDocument[] = [
  {
    id: 'doc-001',
    subcontractorId: 'sub-001',
    subcontractorName: 'Apex Structural Steel Inc.',
    name: 'Certificate of General Liability Insurance',
    type: 'Insurance',
    status: 'valid',
    expiryDate: '2025-12-31',
    uploadedAt: '2024-01-15T10:30:00Z',
    fileUrl: '/uploads/apex-coi-2025.pdf',
    notes: 'Coverage meets $2M umbrella requirement.'
  },
  {
    id: 'doc-002',
    subcontractorId: 'sub-001',
    subcontractorName: 'Apex Structural Steel Inc.',
    name: 'State Contractor Master License',
    type: 'License',
    status: 'valid',
    expiryDate: '2026-06-30',
    uploadedAt: '2024-02-01T08:00:00Z',
    fileUrl: '/uploads/apex-license.pdf'
  },
  {
    id: 'doc-003',
    subcontractorId: 'sub-002',
    subcontractorName: 'BlueLine Electrical Services',
    name: 'Workers Compensation Policy',
    type: 'Insurance',
    status: 'expiring_soon',
    expiryDate: '2025-04-15',
    uploadedAt: '2024-04-15T14:20:00Z',
    fileUrl: '/uploads/blueline-workers-comp.pdf',
    notes: 'Renewal requested via automated dispatch.'
  },
  {
    id: 'doc-004',
    subcontractorId: 'sub-003',
    subcontractorName: 'Vanguard HVAC Solutions',
    name: 'OSHA Safety Certification',
    type: 'Safety',
    status: 'expired',
    expiryDate: '2024-11-30',
    uploadedAt: '2023-11-30T11:00:00Z',
    fileUrl: '/uploads/vanguard-osha.pdf',
    notes: 'Urgent: Site access restricted until renewal provided.'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subcontractorId = searchParams.get('subcontractorId');
    const status = searchParams.get('status');

    let results = [...mockDocuments];

    if (subcontractorId) {
      results = results.filter((doc) => doc.subcontractorId === subcontractorId);
    }

    if (status) {
      results = results.filter((doc) => doc.status === status);
    }

    return NextResponse.json({ success: true, count: results.length, data: results });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve documents', error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newDoc: ComplianceDocument = {
      id: `doc-${Date.now()}`,
      subcontractorId: body.subcontractorId || 'unknown',
      subcontractorName: body.subcontractorName || '',
      name: body.name || 'Untitled Document',
      type: body.type || 'Other',
      status: body.status || 'pending',
      expiryDate: body.expiryDate || new Date().toISOString(),
      uploadedAt: new Date().toISOString(),
      fileUrl: body.fileUrl || '',
      notes: body.notes || ''
    };

    mockDocuments.unshift(newDoc);

    return NextResponse.json({ success: true, data: newDoc }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to upload document', error: String(error) },
      { status: 400 }
    );
  }
}
