
// Case types
export interface Case {
  id: string;
  title: string;
  client: string;
  status: string;
  priority: 'low' | 'medium' | 'high';
  dateCreated: string;
  lastUpdated: string;
  assignedTo: string[];
  description?: string;
  stage?: string;
  dueDate?: string;
  category?: string;
  tags?: string[];
}

// User role type
export type UserRole = 'admin' | 'lawyer' | 'psychologist' | 'claimant';

// Define ClaimStage type for CaseSilo
export type ClaimStage = 
  'intake' | 'legal_review' | 'assessment' | 'report' | 'lodgement' | 'outcome' | 
  'Intake & Triage' | 'Legal Review' | 'Assessment' | 'Report' | 'Lodgement' | 'Outcome';

// Category tags for cases
export type CategoryTag = {
  id: string;
  name: string;
  abbreviation: string;
};

// CaseSilo types
export interface CaseSilo {
  id: string;
  claimantName: string;
  caseType: string;
  claimNumber?: string;
  externalCaseNumber?: string;
  referralSource?: string;
  injuryDate?: string;
  currentStage?: string;
  status: CaseSiloStatus;
  createdDate: string;
  expiryDate: string;
  participants?: {
    claimantId: string;
    lawyerId?: string;
    psychologistId?: string;
    caseManagerId?: string;
    supportCoordinatorId?: string;
    others?: Array<{id: string, role: string, email: string}>;
  };
  documents?: CaseDocument[];
  assessments?: Assessment[];
  reports?: Report[];
  notes?: CaseNote[];
  infoRequests?: InfoRequest[];
  externalUploads?: CaseDocument[];
  completedStages?: string[];
  categoryTags?: string[];
}

export type CaseSiloStatus = 'active' | 'on_hold' | 'closed' | 'pending' | 'expiring_soon' | 'expired';

// Info Request type
export interface InfoRequest {
  id: string;
  title: string;
  dateRequested: string;
  requestedBy: string;
  status: 'pending' | 'completed';
  dueDate: string;
  assignedTo?: UserRole[];
  questions?: string[];
  requestedAt?: string;
}

// Document types
export interface CaseDocument {
  id: string;
  name: string;
  uploadDate: string;
  uploadedBy: string;
  size: string;
  type?: string;
  tags?: string[];
  url?: string;
  uploadRole?: string;
  isExternal?: boolean;
}

// Note types
export interface CaseNote {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
  isPrivate?: boolean;
  visibleTo?: UserRole[];
  type?: 'Transcribed' | 'Written';
}

// Assessment types
export interface Assessment {
  id: string;
  title: string;
  patientName?: string;
  assignedTo?: string;
  status: 'not_started' | 'in_progress' | 'completed';
  assignedDate?: string;
  dueDate?: string;
  completionDate?: string;
  score?: number;
  type?: string;
  description?: string;
  completionPercentage?: number;
  date?: string;
  results?: AssessmentResults;
  isAssigned?: boolean;
  assignedEmail?: string;
}

// Assessment Results
export interface AssessmentResults {
  depression?: number;
  anxiety?: number;
  stress?: number;
  total?: number;
  interpretation?: string;
}

// Report types
export interface Report {
  id: string;
  title: string;
  patientName: string;
  date: string;
  lastEdited: string;
  status: ReportStatus;
  authorName?: string;
  content?: any;
  type?: ReportType;
}

// Report status and type
export type ReportStatus = 'draft' | 'completed' | 'submitted' | 'reviewed' | 'for_review';
export type ReportType = 'clinical' | 'assessment' | 'progress' | 'discharge' | 'workers_comp' | 'vocational' | 'medico_legal';

// Timeline item types
export interface TimelineItem {
  id: string;
  title: string;
  date: string;
  type: 'note' | 'document' | 'assessment' | 'report' | 'meeting' | 'call' | 'email';
  content?: string;
  author?: string;
}

// Assessment category and scale types
export interface AssessmentCategory {
  id: string;
  name: string;
  scales: AssessmentScale[];
}

export interface AssessmentScale {
  id: string;
  name: string;
  abbreviation: string;
  description?: string;
  available: boolean;
}

// DASS-21 Question type
export interface DASS21Question {
  id: number;
  text: string;
  category: 'depression' | 'anxiety' | 'stress';
  answer?: number;
}

// User  external contributor type
export interface ExternalContributor {
  id: string;
  name: string;
  role: 'Lawyer' | 'Case Manager' | 'Support Coordinator' | 'Other';
  email: string;
}
