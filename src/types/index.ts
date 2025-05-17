
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
export type ClaimStage = 'intake' | 'legal_review' | 'assessment' | 'report' | 'lodgement' | 'outcome';

// CaseSilo types
export interface CaseSilo {
  id: string;
  title: string;
  client: string;
  status: CaseSiloStatus;
  dateCreated: string;
  lastUpdated: string;
  assignedTo: string[];
  stage: ClaimStage;
  description?: string;
}

export type CaseSiloStatus = 'active' | 'on_hold' | 'closed' | 'pending';

// Info Request type
export interface InfoRequest {
  id: string;
  title: string;
  dateRequested: string;
  requestedBy: string;
  status: 'pending' | 'completed';
  dueDate: string;
  assignedTo?: UserRole[];
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
  patientName: string;
  status: 'not_started' | 'in_progress' | 'completed';
  assignedDate: string;
  dueDate?: string;
  completionDate?: string;
  score?: number;
  type?: string;
  description?: string;
  completionPercentage?: number;
  date?: string;
}

// Report types
export interface Report {
  id: string;
  title: string;
  patientName: string;
  date: string;
  lastEdited: string;
  status: 'draft' | 'completed';
  authorName?: string;
  content?: string;
  type?: ReportType;
}

// Report status and type
export type ReportStatus = 'draft' | 'completed' | 'submitted' | 'reviewed';
export type ReportType = 'clinical' | 'assessment' | 'progress' | 'discharge';

// Timeline item types
export interface TimelineItem {
  id: string;
  title: string;
  date: string;
  type: 'note' | 'document' | 'assessment' | 'report' | 'meeting' | 'call' | 'email';
  content?: string;
  author?: string;
}
