// User types
export type UserRole = 'victim' | 'lawyer' | 'psychologist';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Assessment types
export type AssessmentStatus = 'pending' | 'in_progress' | 'completed';

export interface AssessmentQuestion {
  id: string;
  text: string;
  type: 'multiple_choice' | 'scale' | 'text';
  options?: string[];
  answer?: string | number;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  status: AssessmentStatus;
  completionPercentage: number;
  date: string;
  assignedTo: string;
  questions?: AssessmentQuestion[];
}

// Report status and type enums
export type ReportStatus = 'draft' | 'for_review' | 'completed';
export type ReportType = 'workers_comp' | 'medico_legal' | 'vocational' | 'capacity';

// Report interface
export interface Report {
  id: string;
  title: string;
  patientName: string;
  date: string;
  type: ReportType;
  status: ReportStatus;
  content: {
    overview: string;
    findings: string[];
    recommendations: string;
  };
  lastEdited: string;
}

// Case Silo types
export type CaseSiloStatus = 'active' | 'expiring_soon' | 'expired';
export type CaseType = 'Workplace Injury' | 'Car Accident' | 'Public Liability' | 'Medical Negligence';
export type ClaimStage = 'Intake & Triage' | 'Legal Review' | 'Assessment' | 'Report' | 'Lodgement' | 'Outcome';

export interface CaseSilo {
  id: string;
  claimantName: string;
  caseType: CaseType;
  claimNumber?: string;
  referralSource?: string;
  injuryDate?: string;
  currentStage: ClaimStage;
  status: CaseSiloStatus;
  createdDate: string;
  expiryDate: string;
  participants: {
    claimantId: string;
    lawyerId: string;
    psychologistId: string;
  };
  documents: CaseDocument[];
  assessments: Assessment[];
  reports: Report[];
  notes: CaseNote[];
  externalUploads: CaseDocument[];
  infoRequests: InfoRequest[];
  completedStages: ClaimStage[];
}

export interface InfoRequest {
  id: string;
  title: string;
  questions: string[];
  answers?: string[];
  requestedBy: string;
  requestedAt: string;
  completedAt?: string;
  status: 'pending' | 'completed';
}

export interface CaseDocument {
  id: string;
  name: string;
  type: string;
  uploadedBy: string;
  uploadRole?: 'lawyer' | 'claimant' | 'psychologist' | 'external';
  uploadDate: string;
  url: string;
  size: string;
  isExternal?: boolean;
}

export interface CaseNote {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
  isPrivate?: boolean;
  isExternal?: boolean;
  visibleTo?: ('lawyer' | 'claimant' | 'psychologist')[];
}
