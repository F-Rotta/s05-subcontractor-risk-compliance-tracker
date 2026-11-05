import { NextRequest, NextResponse } from 'next/server';

interface SubcontractorIntakePayload {
  subcontractorName?: string;
  companyName?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  trade?: string;
  licenseNumber?: string;
  insurancePolicyNumber?: string;
  insuranceExpiry?: string;
  generalLiabilityLimit?: number;
  workersCompCoverage?: boolean;
  emrRating?: number; // Experience Modification Rate
  oshaRecordables?: number;
  safetyManualProvided?: boolean;
  notes?: string;
}

function calculateRiskScore(data: SubcontractorIntakePayload): { score: number; tier: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' } {
  let score = 20; // baseline risk score

  // EMR Rating impact (1.0 is average; > 1.2 is high risk)
  if (data.emrRating) {
    if (data.emrRating > 1.3) score += 35;
    else if (data.emrRating > 1.0) score += 20;
    else if (data.emrRating < 0.8) score -= 10;
  } else {
    score += 15; // penalty for missing EMR
  }

  // OSHA Recordables
  if (data.oshaRecordables && data.oshaRecordables > 0) {
    score += Math.min(data.oshaRecordables * 10, 30);
  }

  // Insurance compliance
  if (!data.insuranceExpiry || new Date(data.insuranceExpiry) <= new Date()) {
    score += 25;
  }
  if (!data.workersCompCoverage) {
    score += 20;
  }

  // Safety manual
  if (!data.safetyManualProvided) {
    score += 10;
  }

  const normalizedScore = Math.max(0, Math.min(100, score));

  let tier: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (normalizedScore >= 75) tier = 'CRITICAL';
  else if (normalizedScore >= 50) tier = 'HIGH';
  else if (normalizedScore >= 30) tier = 'MEDIUM';

  return { score: normalizedScore, tier };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    return NextResponse.json({
      success: true,
      message: 'Subcontractor risk compliance intake service ready',
      data: id ? { id, status: 'active' } : [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: SubcontractorIntakePayload = await req.json();

    const name = body.subcontractorName || body.companyName;
    if (!name || !body.contactEmail) {
      return NextResponse.json(
        { success: false, error: 'Subcontractor name and contact email are required' },
        { status: 400 }
      );
    }

    const { score, tier } = calculateRiskScore(body);

    const submissionId = `intake_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const intakeRecord = {
      id: submissionId,
      subcontractorName: name,
      contactName: body.contactName || '',
      contactEmail: body.contactEmail,
      contactPhone: body.contactPhone || '',
      trade: body.trade || 'General Contracting',
      licenseNumber: body.licenseNumber || null,
      insuranceDetails: {
        policyNumber: body.insurancePolicyNumber || null,
        expiry: body.insuranceExpiry || null,
        liabilityLimit: body.generalLiabilityLimit || 1000000,
        workersCompActive: Boolean(body.workersCompCoverage)
      },
      safetyProfile: {
        emrRating: body.emrRating || 1.0,
        oshaRecordables: body.oshaRecordables || 0,
        safetyManualProvided: Boolean(body.safetyManualProvided)
      },
      complianceAssessment: {
        riskScore: score,
        riskTier: tier,
        requiresReview: tier === 'HIGH' || tier === 'CRITICAL',
        status: tier === 'CRITICAL' ? 'FLAGGED_FOR_AUDIT' : 'PENDING_APPROVAL'
      },
      submittedAt: new Date().toISOString()
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Subcontractor compliance intake successfully submitted',
        data: intakeRecord
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Invalid request payload' },
      { status: 500 }
    );
  }
}
