export type DocumentCategory = 
  | 'Policy' 
  | 'Circular' 
  | 'Form' 
  | 'SOP' 
  | 'Handbook' 
  | 'Guidelines' 
  | 'Regulation';

export type ApprovalStatus = 'Approved' | 'Under Review' | 'Draft' | 'Changes Requested' | 'Impact Review';

export interface DocumentRule {
  id: string;
  name: string;
  statement: string;
  parameterValue?: string; // e.g. "75%", "12 months", "15 days"
  consequenceIfViolated?: string;
  affectedRole: string; // e.g. "Undergraduate Students", "Faculty Members"
}

export interface UniversityDocument {
  id: string;
  code: string; // e.g. "POL-ACAD-2024-01"
  title: string;
  category: DocumentCategory;
  department: string; // e.g. "Office of Academic Affairs", "Examination Cell"
  version: string; // e.g. "v2.4"
  effectiveDate: string;
  lastUpdated: string;
  summary: string;
  fullText: string;
  status: ApprovalStatus;
  healthScore: number; // 0 to 100
  healthBreakdown: {
    metadataCompleteness: number; // 0-100
    ocrConfidence: number; // 0-100
    approvalStatusScore: number; // 0-100
    dependencyConsistency: number; // 0-100
    staleReferenceAlerts: number; // 0-100
  };
  rules: DocumentRule[];
  dependencies: string[]; // document IDs that this document references (upstream)
  dependents: string[]; // document IDs that reference this document (downstream)
  tags: string[];
  author: string;
  approverRole: string;
}

export interface DocumentRelationshipEdge {
  id: string;
  source: string;
  target: string;
  label: string; // e.g. "Mandates", "Extends", "Referenced By", "Operational Form For"
  strength: 'high' | 'medium' | 'low';
}

export interface ProposedChange {
  id: string;
  documentId: string;
  documentTitle: string;
  changeTitle: string;
  description: string;
  beforeValue: string; // e.g. "75% minimum attendance required"
  afterValue: string; // e.g. "80% minimum attendance required"
  reason: string;
  proposedBy: string;
  proposedDate: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'In Review';
  affectedDocumentsCount: number;
  conflictsCount: number;
  impactSeverity: 'Critical' | 'High' | 'Moderate' | 'Low';
  affectedDocuments: {
    documentId: string;
    documentTitle: string;
    category: DocumentCategory;
    department: string;
    impactDescription: string;
    conflictType?: 'Direct Contradiction' | 'Outdated Threshold' | 'Procedural Mismatch' | 'Form Field Invalidation';
    recommendedAction: string;
  }[];
  aiExplanation: string;
  studentFacultyImpact: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  documentId: string;
  documentTitle: string;
  action: 'Created' | 'Modified' | 'Approved' | 'Rejected' | 'Change Requested' | 'Impact Review Started' | 'Conflict Resolved';
  performedBy: string;
  role: string;
  details: string;
  badgeColor?: string;
}

export interface ConflictAlert {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  documentA: { id: string; title: string; code: string; department: string; snippet: string };
  documentB: { id: string; title: string; code: string; department: string; snippet: string };
  conflictDescription: string;
  recommendation: string;
  detectedDate: string;
  resolved: boolean;
}

export interface StaleDocumentAlert {
  id: string;
  documentId: string;
  documentTitle: string;
  documentCode: string;
  department: string;
  lastReviewDate: string;
  reason: string;
  outdatedReferences: string[];
  suggestedAction: string;
}

export interface PolicyDriftItem {
  id: string;
  policyName: string;
  academicYearSpan: string;
  changesSummary: string;
  evolutionSteps: {
    version: string;
    year: string;
    changeText: string;
    approver: string;
  }[];
  driftRisk: 'High Drift' | 'Moderate Drift' | 'Consistent';
  insight: string;
}

export type UserRole = 
  | 'University Registrar'
  | 'Dean of Academic Affairs'
  | 'Controller of Examinations'
  | 'Department Chairperson'
  | 'Faculty Member'
  | 'Student Representative'
  | 'Compliance Officer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  employeeId?: string;
  avatarInitials: string;
  avatarColor: string;
  twoFactorEnabled: boolean;
  twoFactorSecret: string; // Base32 TOTP secret
  backupCodes: string[];
  lastLogin: string;
  joinedDate: string;
}

