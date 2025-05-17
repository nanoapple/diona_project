
import { UserRole } from "../contexts/AuthContext";

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
}

// Timeline item types
export interface TimelineItem {
  id: string;
  title: string;
  date: string;
  type: 'note' | 'document' | 'assessment' | 'report' | 'meeting' | 'call' | 'email';
  content?: string;
  author?: string;
}
