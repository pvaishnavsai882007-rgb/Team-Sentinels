import { UniversityDocument, ProposedChange, ConflictAlert, StaleDocumentAlert, PolicyDriftItem, AuditEvent } from '../types';

export const INITIAL_DOCUMENTS: UniversityDocument[] = [
  {
    id: 'doc-attendance-policy',
    code: 'POL-ACAD-2024-01',
    title: 'University Attendance & Leave Policy',
    category: 'Policy',
    department: 'Office of Academic Affairs',
    version: 'v2.4',
    effectiveDate: '2024-08-01',
    lastUpdated: '2025-01-15',
    summary: 'Establishes mandatory attendance criteria for all undergraduate and postgraduate students. Mandates a minimum of 75% overall attendance per course.',
    fullText: `UNIVERSITY ATTENDANCE & LEAVE POLICY (POL-ACAD-2024-01)
1. PURPOSE & SCOPE
This policy sets the minimum attendance standards across all undergraduate and postgraduate academic programs.

2. MINIMUM ATTENDANCE THRESHOLD
2.1 All enrolled students must maintain a minimum of 75% attendance in each registered theory, lab, and tutorial course during the semester.
2.2 Students falling below 75% attendance shall be classified as 'Attendance Defaulters' and are debarred from appearing in the End-Semester Examination.

3. MEDICAL & SPECIAL CONDONATION
3.1 A maximum condonation of 5% attendance may be granted on approved medical grounds upon submission of Form FRM-MED-2024-02 within 7 working days of absence.
3.2 Under no circumstances will any student with less than 70% physical attendance be granted permission to take final exams.

4. RESPONSIBILITIES
Faculty members must upload weekly attendance by Saturday 5:00 PM. Academic advisors must notify parents of students falling below 75% at mid-semester review.`,
    status: 'Approved',
    healthScore: 88,
    healthBreakdown: {
      metadataCompleteness: 95,
      ocrConfidence: 98,
      approvalStatusScore: 100,
      dependencyConsistency: 85,
      staleReferenceAlerts: 62,
    },
    rules: [
      {
        id: 'rule-att-1',
        name: 'Minimum Course Attendance',
        statement: 'Students must maintain at least 75% attendance across all courses.',
        parameterValue: '75%',
        consequenceIfViolated: 'Debarred from taking End-Semester Examinations.',
        affectedRole: 'All Enrolled Students',
      },
      {
        id: 'rule-att-2',
        name: 'Medical Condonation Limit',
        statement: 'Maximum 5% attendance condonation permitted for certified medical illness.',
        parameterValue: '5% (floor 70%)',
        consequenceIfViolated: 'Medical claim rejected if overall attendance falls below 70%.',
        affectedRole: 'Students & Medical Officer',
      },
    ],
    dependencies: [],
    dependents: [
      'doc-exam-regulations',
      'doc-student-handbook',
      'doc-faculty-sop',
      'doc-medical-form',
      'doc-sports-circular',
    ],
    tags: ['Academics', 'Attendance', 'Eligibility', 'Students'],
    author: 'Dean of Academic Affairs',
    approverRole: 'Academic Council & Vice-Chancellor',
  },
  {
    id: 'doc-exam-regulations',
    code: 'REG-EXAM-2026-03',
    title: 'End-Semester Examination Regulations 2026',
    category: 'Regulation',
    department: 'Examination Cell',
    version: 'v4.1',
    effectiveDate: '2026-01-10',
    lastUpdated: '2026-02-01',
    summary: 'Specifies criteria for hall ticket generation, exam hall conduct, passing grades, and debarment rules due to low attendance.',
    fullText: `EXAMINATION REGULATIONS 2026 (REG-EXAM-2026-03)
SECTION 6: HALL TICKET & EXAM ELIGIBILITY
6.1 The Controller of Examinations shall issue Hall Tickets only to students who have secured at least 75% attendance as mandated by POL-ACAD-2024-01.
6.2 Students with less than 75% attendance in any individual subject will receive a 'Debarred' mark sheet code for that subject.
6.3 The cutoff date for attendance calculation is exactly 10 days prior to the commencement of practical examinations.`,
    status: 'Approved',
    healthScore: 78,
    healthBreakdown: {
      metadataCompleteness: 90,
      ocrConfidence: 96,
      approvalStatusScore: 90,
      dependencyConsistency: 70,
      staleReferenceAlerts: 44,
    },
    rules: [
      {
        id: 'rule-exam-1',
        name: 'Hall Ticket Attendance Threshold',
        statement: 'Hall tickets require verified 75% attendance from Academic Portal.',
        parameterValue: '75%',
        consequenceIfViolated: 'Hall ticket withheld; student cannot enter exam hall.',
        affectedRole: 'Controller of Examinations & Students',
      },
    ],
    dependencies: ['doc-attendance-policy'],
    dependents: ['doc-student-handbook'],
    tags: ['Exams', 'Evaluation', 'Hall Ticket', 'Debarment'],
    author: 'Controller of Examinations',
    approverRole: 'Board of Examinations & Registrar',
  },
  {
    id: 'doc-student-handbook',
    code: 'HB-STU-2025-01',
    title: 'Undergraduate Student Handbook & Code',
    category: 'Handbook',
    department: 'Dean of Student Affairs',
    version: 'v5.0',
    effectiveDate: '2025-07-01',
    lastUpdated: '2025-07-20',
    summary: 'Comprehensive guide for student rights, campus resources, attendance obligations, disciplinary actions, and club participation.',
    fullText: `STUDENT HANDBOOK (HB-STU-2025-01)
CHAPTER 4: ACADEMIC STANDARDS & CONDUCT
4.2 Attendance Rule: Students must attend at least 75% of classes. An initial advisory notice is issued at 78%, and formal disciplinary warning is sent to parents if attendance drops below 75%.
4.3 Campus Curfew & Hostel Access: Hostel main gates close at 10:00 PM sharp (refer to CIR-HST-2026-02). Late entry requires warden pre-approval.`,
    status: 'Approved',
    healthScore: 84,
    healthBreakdown: {
      metadataCompleteness: 88,
      ocrConfidence: 94,
      approvalStatusScore: 100,
      dependencyConsistency: 80,
      staleReferenceAlerts: 60,
    },
    rules: [
      {
        id: 'rule-hb-1',
        name: 'Disciplinary Warning on Attendance',
        statement: 'Formal warning triggered if attendance drops below 75%.',
        parameterValue: '75%',
        consequenceIfViolated: 'Parents notified; student placed on academic probation.',
        affectedRole: 'Student Affairs & Mentors',
      },
    ],
    dependencies: ['doc-attendance-policy', 'doc-hostel-circular'],
    dependents: [],
    tags: ['Students', 'Handbook', 'Discipline', 'Hostel'],
    author: 'Dean of Student Affairs',
    approverRole: 'Student Affairs Committee',
  },
  {
    id: 'doc-faculty-sop',
    code: 'SOP-FAC-2024-05',
    title: 'Standard Operating Procedure for Faculty Workload & Attendance',
    category: 'SOP',
    department: 'Human Resources & Academic Office',
    version: 'v3.2',
    effectiveDate: '2024-09-01',
    lastUpdated: '2024-11-12',
    summary: 'Guidelines for professors and lecturers regarding lecture hour logging, attendance recording, syllabus coverage, and granting student grace attendance.',
    fullText: `FACULTY SOP (SOP-FAC-2024-05)
ARTICLE 3: ATTENDANCE ENTRY & CONDONATION RECOMMENDATION
3.1 Faculty must log attendance within 24 hours of each lecture via the Faculty ERP portal.
3.2 When calculating semester eligibility against the 75% standard in POL-ACAD-2024-01, faculty may recommend condonation up to 5% for students between 70% and 74.9%.
3.3 Any faculty member who overrides the 75% threshold without Dean approval will be audited by the Academic Quality Committee.`,
    status: 'Approved',
    healthScore: 72,
    healthBreakdown: {
      metadataCompleteness: 85,
      ocrConfidence: 92,
      approvalStatusScore: 80,
      dependencyConsistency: 65,
      staleReferenceAlerts: 38,
    },
    rules: [
      {
        id: 'rule-sop-1',
        name: 'Faculty Condonation Processing',
        statement: 'Faculty may evaluate 5% condonation claims against the 75% standard.',
        parameterValue: '75% baseline (5% leeway)',
        consequenceIfViolated: 'Audit flags invalid grade submission.',
        affectedRole: 'All Teaching Faculty',
      },
    ],
    dependencies: ['doc-attendance-policy'],
    dependents: [],
    tags: ['Faculty', 'SOP', 'ERP', 'Quality Audit'],
    author: 'HR Academic Coordinator',
    approverRole: 'Dean of Faculty Affairs',
  },
  {
    id: 'doc-medical-form',
    code: 'FRM-MED-2024-02',
    title: 'Medical Leave & Attendance Exemption Form',
    category: 'Form',
    department: 'University Health Center',
    version: 'v1.8',
    effectiveDate: '2024-06-01',
    lastUpdated: '2024-06-01',
    summary: 'Application form submitted by hospitalized or recovering students to request waiver against the 75% mandatory attendance threshold.',
    fullText: `MEDICAL EXEMPTION FORM (FRM-MED-2024-02)
Applicant Section:
- Student Name, Roll No, Department, Semester
- Current Attendance Percentage (Must be >= 70% to be eligible for the 5% medical concession towards the 75% requirement)
- Doctor Certificate Attachment
Verification Section:
- Chief Medical Officer Seal
- Dean of Academic Affairs endorsement according to POL-ACAD-2024-01 Section 3.1.`,
    status: 'Approved',
    healthScore: 68,
    healthBreakdown: {
      metadataCompleteness: 75,
      ocrConfidence: 90,
      approvalStatusScore: 70,
      dependencyConsistency: 60,
      staleReferenceAlerts: 45,
    },
    rules: [
      {
        id: 'rule-med-1',
        name: 'Medical Exemption Baseline Check',
        statement: 'Validates that student attendance is at least 70% before granting up to 5% waiver.',
        parameterValue: '70% floor / 75% target',
        consequenceIfViolated: 'Form automatically rejected by portal.',
        affectedRole: 'Health Officer & Registrar',
      },
    ],
    dependencies: ['doc-attendance-policy'],
    dependents: [],
    tags: ['Health', 'Forms', 'Exemption', 'Medical'],
    author: 'Chief Medical Officer',
    approverRole: 'Dean of Academic Affairs',
  },
  {
    id: 'doc-sports-circular',
    code: 'CIR-SPO-2025-11',
    title: 'Sports & Cultural National Representation Concession Circular',
    category: 'Circular',
    department: 'Department of Physical Education',
    version: 'v1.2',
    effectiveDate: '2025-10-15',
    lastUpdated: '2025-10-15',
    summary: 'Grants up to 10% on-duty attendance credit for student-athletes representing the university in state or national collegiate tournaments.',
    fullText: `CIRCULAR: SPORTS ATTENDANCE CONCESSIONS (CIR-SPO-2025-11)
To ensure our athletes can compete without academic penalty:
1. Students participating in approved University Sports Tournaments may claim up to 10% On-Duty (OD) attendance credit.
2. In accordance with POL-ACAD-2024-01, effective attendance including OD must reach 75% to sit for exams.`,
    status: 'Approved',
    healthScore: 92,
    healthBreakdown: {
      metadataCompleteness: 95,
      ocrConfidence: 98,
      approvalStatusScore: 95,
      dependencyConsistency: 90,
      staleReferenceAlerts: 82,
    },
    rules: [
      {
        id: 'rule-spo-1',
        name: 'Sports On-Duty Credit',
        statement: 'Grants 10% OD credit to reach 75% minimum.',
        parameterValue: '10% OD / 75% baseline',
        consequenceIfViolated: 'OD credit revoked if unverified.',
        affectedRole: 'Sports Director & Coaches',
      },
    ],
    dependencies: ['doc-attendance-policy'],
    dependents: [],
    tags: ['Sports', 'Athletics', 'Circular', 'On-Duty'],
    author: 'Director of Physical Education',
    approverRole: 'Dean of Student Affairs',
  },
  {
    id: 'doc-faculty-sabbatical',
    code: 'POL-HR-2024-08',
    title: 'Faculty Sabbatical & Research Leave Policy',
    category: 'Policy',
    department: 'Human Resources & Research Office',
    version: 'v2.0',
    effectiveDate: '2024-04-01',
    lastUpdated: '2024-12-05',
    summary: 'Defines eligibility, duration (currently 12 months), stipend rules, and publication deliverables for faculty taking research sabbaticals.',
    fullText: `FACULTY SABBATICAL POLICY (POL-HR-2024-08)
SECTION 2: DURATION & TENURE
2.1 Tenured faculty members with at least 6 years of continuous service are eligible for a research sabbatical leave of up to 12 months with full base salary.
2.2 Extensions beyond 12 months require approval from the Board of Governors.
2.3 Cross-references Research Fellowship Guidelines GDL-RES-2025-04 for external funding offsets.`,
    status: 'Approved',
    healthScore: 82,
    healthBreakdown: {
      metadataCompleteness: 90,
      ocrConfidence: 95,
      approvalStatusScore: 90,
      dependencyConsistency: 75,
      staleReferenceAlerts: 60,
    },
    rules: [
      {
        id: 'rule-sab-1',
        name: 'Maximum Sabbatical Tenure',
        statement: 'Faculty sabbatical leave capped at 12 continuous months.',
        parameterValue: '12 months',
        consequenceIfViolated: 'Payroll automatically adjusted to unpaid leave past 12 months.',
        affectedRole: 'Tenured Faculty & HR Director',
      },
    ],
    dependencies: [],
    dependents: ['doc-research-fellowship'],
    tags: ['Faculty', 'HR', 'Sabbatical', 'Research'],
    author: 'Director of Human Resources',
    approverRole: 'Board of Governors',
  },
  {
    id: 'doc-research-fellowship',
    code: 'GDL-RES-2025-04',
    title: 'Sponsored Research Fellowship & Grant Tenure Guidelines',
    category: 'Guidelines',
    department: 'Sponsored Research & Industrial Consultancy',
    version: 'v1.5',
    effectiveDate: '2025-02-01',
    lastUpdated: '2025-02-01',
    summary: 'Guidelines for faculty principal investigators managing grant funding and concurrent sabbatical leaves (pegged to the 12-month limit in POL-HR-2024-08).',
    fullText: `SPONSORED RESEARCH GUIDELINES (GDL-RES-2025-04)
Section 5.3: Faculty Sabbatical Grant Alignment
Principal Investigators receiving international research fellowships may align their grant tenure with the 12-month sabbatical provision under POL-HR-2024-08. Any variance in sabbatical length directly alters grant co-funding ratios.`,
    status: 'Approved',
    healthScore: 76,
    healthBreakdown: {
      metadataCompleteness: 85,
      ocrConfidence: 94,
      approvalStatusScore: 80,
      dependencyConsistency: 70,
      staleReferenceAlerts: 50,
    },
    rules: [
      {
        id: 'rule-res-1',
        name: 'Grant Co-funding Period',
        statement: 'Co-funding aligned with 12-month university sabbatical.',
        parameterValue: '12 months',
        consequenceIfViolated: 'Sponsor agency clawback if faculty leaves university early.',
        affectedRole: 'Principal Investigators & Research Dean',
      },
    ],
    dependencies: ['doc-faculty-sabbatical'],
    dependents: [],
    tags: ['Research', 'Grants', 'Fellowship', 'Sabbatical'],
    author: 'Dean of Sponsored Research',
    approverRole: 'Research Advisory Board',
  },
  {
    id: 'doc-hostel-circular',
    code: 'CIR-HST-2026-02',
    title: 'Hostel Entry Curfew & Night Movement Notice',
    category: 'Circular',
    department: 'Hostel Management & Security',
    version: 'v2.1',
    effectiveDate: '2026-01-05',
    lastUpdated: '2026-01-05',
    summary: 'Establishes campus curfew at 10:00 PM for all residential students, biometric check-in procedures, and penalty fines for late entry.',
    fullText: `HOSTEL CURFEW NOTICE (CIR-HST-2026-02)
1. All undergraduate hostels will lock their turnstiles at 10:00 PM every night.
2. Students returning after 10:00 PM without written warden permission will receive a strike under Student Handbook HB-STU-2025-01 Section 4.3.
3. Three strikes result in cancellation of campus housing privileges.`,
    status: 'Approved',
    healthScore: 90,
    healthBreakdown: {
      metadataCompleteness: 92,
      ocrConfidence: 97,
      approvalStatusScore: 95,
      dependencyConsistency: 85,
      staleReferenceAlerts: 80,
    },
    rules: [
      {
        id: 'rule-hst-1',
        name: 'Night Gate Curfew',
        statement: 'Hostel gates lock at 10:00 PM.',
        parameterValue: '10:00 PM',
        consequenceIfViolated: 'Formal disciplinary strike & parent SMS notification.',
        affectedRole: 'Residential Students & Wardens',
      },
    ],
    dependencies: [],
    dependents: ['doc-student-handbook'],
    tags: ['Hostel', 'Security', 'Curfew', 'Residence'],
    author: 'Chief Warden',
    approverRole: 'Dean of Student Affairs',
  },
  {
    id: 'doc-fee-refund',
    code: 'REG-FIN-2025-09',
    title: 'Tuition Fee Refund & Semester Withdrawal Regulations',
    category: 'Regulation',
    department: 'Finance & Accounts Division',
    version: 'v3.0',
    effectiveDate: '2025-05-15',
    lastUpdated: '2025-05-15',
    summary: 'Outlines refund percentages for students withdrawing before or after semester commencement. 100% refund up to 15 days before classes.',
    fullText: `FEE REFUND REGULATIONS (REG-FIN-2025-09)
1. Notice of withdrawal received 15 days before semester start: 100% refund minus $100 processing fee.
2. Notice received within 15 days after semester start: 80% refund.
3. Notice received between 16 and 30 days after semester start: 50% refund.
4. After 30 days: No refund applicable.`,
    status: 'Approved',
    healthScore: 95,
    healthBreakdown: {
      metadataCompleteness: 98,
      ocrConfidence: 99,
      approvalStatusScore: 100,
      dependencyConsistency: 92,
      staleReferenceAlerts: 86,
    },
    rules: [
      {
        id: 'rule-fin-1',
        name: 'Initial Refund Window',
        statement: '100% refund allowed if withdrawal filed >= 15 days prior to start.',
        parameterValue: '15 days / 100%',
        consequenceIfViolated: 'Forfeiture of tuition deposit.',
        affectedRole: 'Finance Officer & Admitted Students',
      },
    ],
    dependencies: [],
    dependents: [],
    tags: ['Finance', 'Tuition', 'Refund', 'Admissions'],
    author: 'Chief Financial Officer',
    approverRole: 'Finance Committee & Syndicate',
  },
];

export const INITIAL_PROPOSED_CHANGES: ProposedChange[] = [
  {
    id: 'change-attendance-75-to-80',
    documentId: 'doc-attendance-policy',
    documentTitle: 'University Attendance & Leave Policy (POL-ACAD-2024-01)',
    changeTitle: 'Increase Minimum Attendance Threshold from 75% to 80%',
    description: 'Proposal from Academic Council to raise overall course attendance requirement from 75% to 80% to align with national accreditation benchmarks and reduce chronic absenteeism.',
    beforeValue: '75% minimum course attendance required for examination eligibility (5% medical condonation to 70%)',
    afterValue: '80% minimum course attendance required for examination eligibility (5% medical condonation to 75%)',
    reason: 'National Higher Education Accreditation Board has revised guidelines recommending stricter classroom participation standards.',
    proposedBy: 'Prof. Dr. Elizabeth Warren (Dean of Academic Affairs)',
    proposedDate: '2026-08-20',
    status: 'Pending',
    affectedDocumentsCount: 5,
    conflictsCount: 3,
    impactSeverity: 'Critical',
    affectedDocuments: [
      {
        documentId: 'doc-exam-regulations',
        documentTitle: 'End-Semester Examination Regulations 2026 (REG-EXAM-2026-03)',
        category: 'Regulation',
        department: 'Examination Cell',
        impactDescription: 'Hall Ticket issuance rule in Section 6.1 hardcodes 75%. If Attendance Policy moves to 80%, Examination Cell will issue hall tickets to ineligible students unless updated.',
        conflictType: 'Direct Contradiction',
        recommendedAction: 'Update Section 6.1 from 75% to 80% and adjust ERP hall ticket cutoff script.',
      },
      {
        documentId: 'doc-student-handbook',
        documentTitle: 'Undergraduate Student Handbook & Code (HB-STU-2025-01)',
        category: 'Handbook',
        department: 'Dean of Student Affairs',
        impactDescription: 'Section 4.2 warns parents when student drops below 78% (assuming 75% baseline). With an 80% baseline, warning threshold must be raised to 83%.',
        conflictType: 'Outdated Threshold',
        recommendedAction: 'Issue addendum to 2025-2026 Student Handbook adjusting parent notification thresholds to 83%.',
      },
      {
        documentId: 'doc-faculty-sop',
        documentTitle: 'Faculty Workload & Attendance SOP (SOP-FAC-2024-05)',
        category: 'SOP',
        department: 'HR & Academic Office',
        impactDescription: 'Article 3 instructs professors that 70% is the absolute floor for condonation. If base is 80%, the floor shifts to 75%.',
        conflictType: 'Procedural Mismatch',
        recommendedAction: 'Revise Faculty Portal grading parameters and send circular to all 420 faculty members.',
      },
      {
        documentId: 'doc-medical-form',
        documentTitle: 'Medical Leave Exemption Form (FRM-MED-2024-02)',
        category: 'Form',
        department: 'Health Center',
        impactDescription: 'Printed and digital form fields prompt students for "Current Attendance >= 70%". Forms will be invalid on submission.',
        conflictType: 'Form Field Invalidation',
        recommendedAction: 'Deprecate Form v1.8, release v2.0 with 75% minimum eligibility field.',
      },
      {
        documentId: 'doc-sports-circular',
        documentTitle: 'Sports & Cultural Concession Circular (CIR-SPO-2025-11)',
        category: 'Circular',
        department: 'Physical Education',
        impactDescription: 'Athletes relying on 10% OD credit to reach 75% will fall short of the new 80% requirement.',
        conflictType: 'Outdated Threshold',
        recommendedAction: 'Evaluate whether Sports OD allowance should be expanded from 10% to 15% or kept at 10%.',
      },
    ],
    aiExplanation: 'Raising attendance to 80% triggers a high-severity cascade across 5 university documents. Examination eligibility rules, automated portal triggers, student handbook warnings, faculty grading guidelines, and health exemption forms will immediately become contradictory if passed without synchronized amendments.',
    studentFacultyImpact: 'Estimated ~1,850 undergraduate students and 420 teaching faculty directly impacted across 8 academic departments.',
  },
  {
    id: 'change-leave-12-to-18',
    documentId: 'doc-faculty-sabbatical',
    documentTitle: 'Faculty Sabbatical Policy (POL-HR-2024-08)',
    changeTitle: 'Extend Faculty Research Sabbatical Duration from 12 Months to 18 Months',
    description: 'HR proposal to allow extended international research fellowships by expanding maximum sabbatical duration from 12 to 18 months.',
    beforeValue: 'Maximum sabbatical leave duration: 12 continuous months',
    afterValue: 'Maximum sabbatical leave duration: 18 continuous months',
    reason: 'Attract high-profile international research grants that require a full 1.5 year residency.',
    proposedBy: 'Dr. Arthur Jenkins (Director of HR)',
    proposedDate: '2026-08-18',
    status: 'In Review',
    affectedDocumentsCount: 2,
    conflictsCount: 1,
    impactSeverity: 'Moderate',
    affectedDocuments: [
      {
        documentId: 'doc-research-fellowship',
        documentTitle: 'Sponsored Research Fellowship Guidelines (GDL-RES-2025-04)',
        category: 'Guidelines',
        department: 'Sponsored Research Office',
        impactDescription: 'Section 5.3 caps university grant co-funding to 12 months. Extended 6 months may lack institutional salary coverage without policy amendment.',
        conflictType: 'Outdated Threshold',
        recommendedAction: 'Amend Section 5.3 to explicitly cover the optional 18-month tenure with prorated sponsor matching.',
      },
    ],
    aiExplanation: 'Extending sabbatical to 18 months impacts research grant salary matching and teaching substitution rosters. Low risk of student disruption, but requires HR-Research synchronization.',
    studentFacultyImpact: 'Directly impacts ~35 eligible tenured professors and departmental teaching load allocations.',
  },
];

export const INITIAL_CONFLICT_ALERTS: ConflictAlert[] = [
  {
    id: 'conflict-exam-vs-attendance',
    title: 'Attendance Debarment Cutoff Mismatch',
    severity: 'High',
    documentA: {
      id: 'doc-attendance-policy',
      title: 'University Attendance & Leave Policy',
      code: 'POL-ACAD-2024-01',
      department: 'Academic Affairs',
      snippet: 'Section 4: Faculty must upload final attendance 3 days before exam week.',
    },
    documentB: {
      id: 'doc-exam-regulations',
      title: 'End-Semester Examination Regulations 2026',
      code: 'REG-EXAM-2026-03',
      department: 'Examination Cell',
      snippet: 'Section 6.3: Attendance cutoff for hall ticket generation is exactly 10 days prior to exams.',
    },
    conflictDescription: 'Academic Affairs gives professors until 3 days before exams to enter attendance, but Examination Cell locks hall ticket calculations 10 days prior. Students attending late remedial classes are improperly debarred.',
    recommendation: 'Align both policies to a single harmonized deadline: 7 days prior to practical examinations.',
    detectedDate: '2026-08-15',
    resolved: false,
  },
  {
    id: 'conflict-hostel-vs-library',
    title: 'Hostel Gate Curfew vs 24/7 Central Library Notice',
    severity: 'Medium',
    documentA: {
      id: 'doc-hostel-circular',
      title: 'Hostel Entry Curfew Notice',
      code: 'CIR-HST-2026-02',
      department: 'Hostel Security',
      snippet: 'Clause 1: All turnstiles lock at 10:00 PM sharp without exception.',
    },
    documentB: {
      id: 'doc-student-handbook',
      title: 'Student Handbook (Library Access)',
      code: 'HB-STU-2025-01',
      department: 'Student Affairs',
      snippet: 'Chapter 2.4: Central Library Study Wing remains open 24 hours during mid-term and finals.',
    },
    conflictDescription: 'Students studying in the 24/7 Library past 10:00 PM are penalized with late-entry strikes at hostel turnstiles.',
    recommendation: 'Add an automated digital pass integration between Library RFID turnstiles and Hostel security gates.',
    detectedDate: '2026-08-10',
    resolved: false,
  },
];

export const INITIAL_STALE_ALERTS: StaleDocumentAlert[] = [
  {
    id: 'stale-medical-form',
    documentId: 'doc-medical-form',
    documentTitle: 'Medical Leave Exemption Form (FRM-MED-2024-02)',
    documentCode: 'FRM-MED-2024-02',
    department: 'Health Center',
    lastReviewDate: '2024-06-01 (14 months ago)',
    reason: 'Form references repealed 2022 Medical Council bylaws and does not support modern digital prescription verification.',
    outdatedReferences: ['MCI Bylaws 2022 (Superceded by NMC 2024)', 'Manual Physical Stamp requirement'],
    suggestedAction: 'Issue revision v2.0 with digital certificate QR validation.',
  },
  {
    id: 'stale-faculty-sop',
    documentId: 'doc-faculty-sop',
    documentTitle: 'Faculty Workload SOP (SOP-FAC-2024-05)',
    documentCode: 'SOP-FAC-2024-05',
    department: 'HR & Academic Office',
    lastReviewDate: '2024-09-01 (11 months ago)',
    reason: 'Contains legacy manual Excel attendance spreadsheet instructions alongside new ERP portal rules.',
    outdatedReferences: ['ERP Module v1.2 (Deprecated)', 'Paper Attendance Register Log'],
    suggestedAction: 'Deprecate Section 2 paper workflows and archive outdated appendices.',
  },
];

export const INITIAL_POLICY_DRIFT: PolicyDriftItem[] = [
  {
    id: 'drift-attendance',
    policyName: 'Undergraduate Attendance Standards',
    academicYearSpan: '2021 — 2026 (5 Academic Cycles)',
    changesSummary: 'Attendance has progressively shifted from 65% (COVID-19 hybrid) -> 75% (Post-pandemic) -> Proposed 80% (Accreditation). Connected circulars lagged behind.',
    evolutionSteps: [
      { version: 'v1.0', year: '2021-2022', changeText: 'COVID-19 Hybrid Policy: 65% minimum with online lecture logs accepted.', approver: 'Emergency Academic Senate' },
      { version: 'v2.0', year: '2023-2024', changeText: 'Return to in-person: Restored 75% minimum with 5% medical condonation.', approver: 'Academic Council' },
      { version: 'v2.4', year: '2024-2025', changeText: 'Clarified sports and cultural OD credit rules.', approver: 'Dean of Academic Affairs' },
      { version: 'v3.0 (Proposed)', year: '2026-2027', changeText: 'Proposed 80% standard to meet Higher Ed Accreditation norms.', approver: 'Pending Council Review' },
    ],
    driftRisk: 'High Drift',
    insight: 'Over 5 years, the baseline percentage increased by 15 points, creating 4 orphan forms that still quote outdated 65% and 70% threshold language.',
  },
  {
    id: 'drift-eval',
    policyName: 'Continuous Internal Assessment (CIA) Weightage',
    academicYearSpan: '2022 — 2026',
    changesSummary: 'Internal exam weightage increased from 30% -> 40% -> 50% relative to End-Semesters.',
    evolutionSteps: [
      { version: 'v1.1', year: '2022-2023', changeText: '30% CIA / 70% End-Sem Exam split.', approver: 'Examination Board' },
      { version: 'v2.0', year: '2024-2025', changeText: '40% CIA / 60% End-Sem Exam split with project assignments.', approver: 'Academic Council' },
      { version: 'v2.3', year: '2025-2026', changeText: '50% CIA / 50% End-Sem with continuous quizzes.', approver: 'Board of Studies' },
    ],
    driftRisk: 'Moderate Drift',
    insight: 'Department syllabi have successfully transitioned, but Grade Improvement guidelines in the Student Handbook still reference the old 30/70 formula.',
  },
];

export const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'audit-1',
    timestamp: '2026-08-20 14:30',
    documentId: 'doc-attendance-policy',
    documentTitle: 'University Attendance & Leave Policy',
    action: 'Modified',
    performedBy: 'Prof. Dr. Elizabeth Warren',
    role: 'Dean of Academic Affairs',
    details: 'Initiated Change Impact Review: Proposing increase of minimum attendance threshold from 75% to 80%.',
    badgeColor: 'blue',
  },
  {
    id: 'audit-2',
    timestamp: '2026-08-18 11:15',
    documentId: 'doc-faculty-sabbatical',
    documentTitle: 'Faculty Sabbatical Policy',
    action: 'Impact Review Started',
    performedBy: 'Dr. Arthur Jenkins',
    role: 'Director of HR',
    details: 'Triggered DocVault AI consequence simulation for 12 -> 18 month research sabbatical extension.',
    badgeColor: 'amber',
  },
  {
    id: 'audit-3',
    timestamp: '2026-08-15 09:40',
    documentId: 'doc-exam-regulations',
    documentTitle: 'End-Semester Examination Regulations 2026',
    action: 'Approved',
    performedBy: 'Dr. Rajesh Nair',
    role: 'Controller of Examinations',
    details: 'Ratified Spring 2026 exam schedule and hall ticket protocol version v4.1.',
    badgeColor: 'emerald',
  },
  {
    id: 'audit-4',
    timestamp: '2026-08-10 16:20',
    documentId: 'doc-hostel-circular',
    documentTitle: 'Hostel Curfew Notice',
    action: 'Created',
    performedBy: 'Col. Vikram Rathore (Retd.)',
    role: 'Chief Warden',
    details: 'Published circular CIR-HST-2026-02 establishing 10:00 PM turnstile curfew rules.',
    badgeColor: 'purple',
  },
];
