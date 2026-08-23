import React, { useState, useEffect } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  WorkflowNav, 
  TabType 
} from './components/WorkflowNav';
import { 
  DocumentUploadSection 
} from './components/DocumentUploadSection';
import { 
  DocumentInspector 
} from './components/DocumentInspector';
import { 
  DocumentKnowledgeGraph 
} from './components/DocumentKnowledgeGraph';
import { 
  ChangeImpactEngine 
} from './components/ChangeImpactEngine';
import { 
  SmartApprovalHealthScore 
} from './components/SmartApprovalHealthScore';
import { 
  UniversityIntelligence 
} from './components/UniversityIntelligence';
import { 
  AiCopilotModal 
} from './components/AiCopilotModal';
import {
  DocumentScannerModal
} from './components/DocumentScannerModal';
import {
  AuthPage
} from './components/AuthPage';
import {
  TwoFactorSetupModal
} from './components/TwoFactorSetupModal';

import {
  INITIAL_DOCUMENTS,
  INITIAL_PROPOSED_CHANGES,
  INITIAL_CONFLICT_ALERTS,
  INITIAL_STALE_ALERTS,
  INITIAL_POLICY_DRIFT,
  INITIAL_AUDIT_LOGS,
} from './data/mockDocuments';

import {
  INITIAL_USERS
} from './data/mockUsers';

import { 
  UniversityDocument, 
  ProposedChange, 
  ConflictAlert, 
  StaleDocumentAlert, 
  PolicyDriftItem, 
  AuditEvent,
  UserProfile
} from './types';

export default function App() {
  // Authentication & Users state
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('docvault_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('docvault_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('docvault_auth_status');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [isTwoFactorModalOpen, setIsTwoFactorModalOpen] = useState<boolean>(false);

  // Core Data State initialization with localStorage fallback
  const [documents, setDocuments] = useState<UniversityDocument[]>(() => {
    const saved = localStorage.getItem('docvault_docs');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [proposedChanges, setProposedChanges] = useState<ProposedChange[]>(() => {
    const saved = localStorage.getItem('docvault_changes');
    return saved ? JSON.parse(saved) : INITIAL_PROPOSED_CHANGES;
  });

  const [conflicts, setConflicts] = useState<ConflictAlert[]>(() => {
    const saved = localStorage.getItem('docvault_conflicts');
    return saved ? JSON.parse(saved) : INITIAL_CONFLICT_ALERTS;
  });

  const [staleAlerts, setStaleAlerts] = useState<StaleDocumentAlert[]>(() => {
    const saved = localStorage.getItem('docvault_stale');
    return saved ? JSON.parse(saved) : INITIAL_STALE_ALERTS;
  });

  const [policyDrifts, setPolicyDrifts] = useState<PolicyDriftItem[]>(() => {
    const saved = localStorage.getItem('docvault_drifts');
    return saved ? JSON.parse(saved) : INITIAL_POLICY_DRIFT;
  });

  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(() => {
    const saved = localStorage.getItem('docvault_audit');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [activeTab, setActiveTab] = useState<TabType>('impact'); // Default to Change Impact Engine for immediate wow-factor
  const [selectedDocId, setSelectedDocId] = useState<string>('doc-attendance-policy');
  const [activeChangeId, setActiveChangeId] = useState<string>('change-attendance-75-to-80');
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('docvault_users', JSON.stringify(users));
      localStorage.setItem('docvault_current_user', JSON.stringify(currentUser));
      localStorage.setItem('docvault_auth_status', JSON.stringify(isAuthenticated));
      localStorage.setItem('docvault_docs', JSON.stringify(documents));
      localStorage.setItem('docvault_changes', JSON.stringify(proposedChanges));
      localStorage.setItem('docvault_conflicts', JSON.stringify(conflicts));
      localStorage.setItem('docvault_stale', JSON.stringify(staleAlerts));
      localStorage.setItem('docvault_drifts', JSON.stringify(policyDrifts));
      localStorage.setItem('docvault_audit', JSON.stringify(auditLogs));
    } catch (e) {
      console.warn('Storage sync issue:', e);
    }
  }, [users, currentUser, isAuthenticated, documents, proposedChanges, conflicts, staleAlerts, policyDrifts, auditLogs]);

  // Auth Handlers
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    // Update user in users array if exists or add
    setUsers((prev) => {
      const idx = prev.findIndex((u) => u.id === user.id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = user;
        return updated;
      }
      return [user, ...prev];
    });
  };

  const handleRegisterUser = (newUser: UserProfile) => {
    setUsers((prev) => [newUser, ...prev]);
  };

  const handleUpdateCurrentUser = (updated: UserProfile) => {
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
  };


  // Handlers
  const handleDocumentAdded = (newDoc: UniversityDocument) => {
    setDocuments((prev) => [newDoc, ...prev]);
    setSelectedDocId(newDoc.id);

    // Add audit log
    const newAudit: AuditEvent = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      documentId: newDoc.id,
      documentTitle: newDoc.title,
      action: 'Created',
      performedBy: 'University Ingestion Pipeline',
      role: 'DocVault AI Engine',
      details: `Ingested ${newDoc.code} with ${newDoc.rules.length} extracted rules and health score ${newDoc.healthScore}/100.`,
      badgeColor: 'blue',
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  const handleApplyNewChange = (newChange: ProposedChange) => {
    setProposedChanges((prev) => [newChange, ...prev]);
    setActiveChangeId(newChange.id);

    // Add audit log
    const newAudit: AuditEvent = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      documentId: newChange.documentId,
      documentTitle: newChange.documentTitle,
      action: 'Modified',
      performedBy: newChange.proposedBy,
      role: 'Academic Department Head',
      details: `Simulated consequence ripple: ${newChange.changeTitle} (${newChange.affectedDocumentsCount} affected documents).`,
      badgeColor: 'orange',
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  const handleSelectScenario = (scenarioId: string) => {
    setActiveChangeId(scenarioId);
    setActiveTab('impact');
    const scen = proposedChanges.find(c => c.id === scenarioId);
    if (scen) {
      setSelectedDocId(scen.documentId);
    }
  };

  const handleTriggerChangeForDoc = (doc: UniversityDocument) => {
    setSelectedDocId(doc.id);
    setActiveTab('impact');
  };

  const handleApproveChange = (changeId: string, notes: string) => {
    setProposedChanges((prev) =>
      prev.map((c) => (c.id === changeId ? { ...c, status: 'Approved' } : c))
    );

    const change = proposedChanges.find((c) => c.id === changeId);
    if (change) {
      const newAudit: AuditEvent = {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
        documentId: change.documentId,
        documentTitle: change.documentTitle,
        action: 'Approved',
        performedBy: 'Academic Council & Senate',
        role: 'Approval Authority',
        details: `Approved proposal "${change.changeTitle}". ${notes}`,
        badgeColor: 'emerald',
      };
      setAuditLogs((prev) => [newAudit, ...prev]);
    }
  };

  const handleRejectChange = (changeId: string, reason: string) => {
    setProposedChanges((prev) =>
      prev.map((c) => (c.id === changeId ? { ...c, status: 'Rejected' } : c))
    );

    const change = proposedChanges.find((c) => c.id === changeId);
    if (change) {
      const newAudit: AuditEvent = {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
        documentId: change.documentId,
        documentTitle: change.documentTitle,
        action: 'Rejected',
        performedBy: 'Board of Governors',
        role: 'Review Committee',
        details: `Rejected change: "${change.changeTitle}". Reason: ${reason}`,
        badgeColor: 'rose',
      };
      setAuditLogs((prev) => [newAudit, ...prev]);
    }
  };

  const handleRequestFeedback = (changeId: string, feedback: string) => {
    setProposedChanges((prev) =>
      prev.map((c) => (c.id === changeId ? { ...c, status: 'In Review' } : c))
    );

    const change = proposedChanges.find((c) => c.id === changeId);
    if (change) {
      const newAudit: AuditEvent = {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
        documentId: change.documentId,
        documentTitle: change.documentTitle,
        action: 'Change Requested',
        performedBy: 'Dean of Academic Affairs',
        role: 'Reviewer',
        details: `Feedback issued: ${feedback}`,
        badgeColor: 'amber',
      };
      setAuditLogs((prev) => [newAudit, ...prev]);
    }
  };

  const handleStartImpactReview = (changeId: string) => {
    setProposedChanges((prev) =>
      prev.map((c) => (c.id === changeId ? { ...c, status: 'In Review' } : c))
    );

    const change = proposedChanges.find((c) => c.id === changeId);
    if (change) {
      const newAudit: AuditEvent = {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
        documentId: change.documentId,
        documentTitle: change.documentTitle,
        action: 'Impact Review Started',
        performedBy: 'Registrar Office',
        role: 'Governance Secretariat',
        details: `Routed for multi-departmental impact sign-off.`,
        badgeColor: 'blue',
      };
      setAuditLogs((prev) => [newAudit, ...prev]);
    }
  };

  const handleResolveConflict = (conflictId: string) => {
    setConflicts((prev) =>
      prev.map((c) => (c.id === conflictId ? { ...c, resolved: true } : c))
    );

    const conf = conflicts.find((c) => c.id === conflictId);
    if (conf) {
      const newAudit: AuditEvent = {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
        documentId: conf.documentA.id,
        documentTitle: conf.title,
        action: 'Conflict Resolved',
        performedBy: 'Academic Harmonization Officer',
        role: 'Governance Taskforce',
        details: `Harmonized contradiction between ${conf.documentA.code} and ${conf.documentB.code}.`,
        badgeColor: 'emerald',
      };
      setAuditLogs((prev) => [newAudit, ...prev]);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset sample documents and simulation history to original state?')) {
      setDocuments(INITIAL_DOCUMENTS);
      setProposedChanges(INITIAL_PROPOSED_CHANGES);
      setConflicts(INITIAL_CONFLICT_ALERTS);
      setStaleAlerts(INITIAL_STALE_ALERTS);
      setPolicyDrifts(INITIAL_POLICY_DRIFT);
      setAuditLogs(INITIAL_AUDIT_LOGS);
      setSelectedDocId('doc-attendance-policy');
      setActiveChangeId('change-attendance-75-to-80');
      setActiveTab('impact');
      localStorage.clear();
    }
  };

  const activeChange = proposedChanges.find((c) => c.id === activeChangeId);

  // If user is not authenticated, display full AuthPage (Login, Register & 2FA)
  if (!isAuthenticated || !currentUser) {
    return (
      <AuthPage
        allUsers={users}
        onLoginSuccess={handleLoginSuccess}
        onRegisterUser={handleRegisterUser}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col selection:bg-orange-500 selection:text-white">
      {/* 1. Header */}
      <Header
        onSelectScenario={handleSelectScenario}
        activeScenarioId={activeChangeId}
        conflicts={conflicts}
        pendingChanges={proposedChanges.filter((c) => c.status === 'Pending')}
        currentUser={currentUser}
        allUsers={users}
        onSelectUser={setCurrentUser}
        onOpenTwoFactorSetup={() => setIsTwoFactorModalOpen(true)}
        onSignOut={handleSignOut}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onOpenScanner={() => setIsScannerOpen(true)}
        onResetData={handleResetData}
      />

      {/* 2. 5-Stage Workflow Pipeline Nav */}
      <WorkflowNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        impactBadgeCount={proposedChanges.filter((c) => c.status === 'Pending').length}
        conflictsBadgeCount={conflicts.filter((c) => !c.resolved).length}
      />

      {/* 3. Main Stage Content Area with generous spacious padding */}
      <main className="flex-1 max-w-7xl xl:max-w-[1440px] w-full mx-auto px-5 sm:px-8 lg:px-12 py-10 lg:py-14 space-y-10">
        {activeTab === 'submit' && (
          <DocumentUploadSection
            onDocumentAdded={handleDocumentAdded}
            onNavigateToTab={setActiveTab}
            onSelectDocument={setSelectedDocId}
            onOpenScanner={() => setIsScannerOpen(true)}
          />
        )}

        {activeTab === 'understand' && (
          <DocumentInspector
            documents={documents}
            selectedDocId={selectedDocId}
            onSelectDocument={setSelectedDocId}
            onTriggerChangeForDoc={handleTriggerChangeForDoc}
          />
        )}

        {activeTab === 'explore' && (
          <DocumentKnowledgeGraph
            documents={documents}
            selectedDocId={selectedDocId}
            onSelectDocument={setSelectedDocId}
            onTriggerChange={handleTriggerChangeForDoc}
          />
        )}

        {activeTab === 'impact' && (
          <ChangeImpactEngine
            documents={documents}
            proposedChanges={proposedChanges}
            activeChangeId={activeChangeId}
            onApplyNewChange={handleApplyNewChange}
            onSelectChange={setActiveChangeId}
            onNavigateToApproval={(cId) => {
              setActiveChangeId(cId);
              setActiveTab('review');
            }}
          />
        )}

        {activeTab === 'review' && (
          <SmartApprovalHealthScore
            documents={documents}
            proposedChanges={proposedChanges}
            activeChangeId={activeChangeId}
            auditLogs={auditLogs}
            onApproveChange={handleApproveChange}
            onRejectChange={handleRejectChange}
            onRequestFeedback={handleRequestFeedback}
            onStartImpactReview={handleStartImpactReview}
          />
        )}

        {activeTab === 'intelligence' && (
          <UniversityIntelligence
            conflicts={conflicts}
            staleAlerts={staleAlerts}
            policyDrifts={policyDrifts}
            documents={documents}
            onResolveConflict={handleResolveConflict}
            onSelectDocument={setSelectedDocId}
            onNavigateToTab={setActiveTab}
          />
        )}
      </main>

      {/* 4. Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 px-6 sm:px-10 text-center text-xs text-slate-400">
        <div className="max-w-7xl xl:max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-slate-200">DocVault AI</span>
            <span>—</span>
            <span>The Consequence-Aware Document Management Platform for Universities</span>
          </div>
          <div className="flex items-center gap-5 text-slate-400">
            <span>Signed in as <strong>{currentUser.name}</strong> ({currentUser.role})</span>
            <span>•</span>
            <button
              onClick={() => setIsCopilotOpen(true)}
              className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
            >
              DocVault AI
            </button>
          </div>
        </div>
      </footer>

      {/* 5. AI Consequence Copilot Modal */}
      <AiCopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        documents={documents}
        currentProposedChange={activeChange}
      />

      {/* 6. Document Scanner Modal (Live Camera & OCR) */}
      <DocumentScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onDocumentAdded={handleDocumentAdded}
        onSelectDocument={setSelectedDocId}
        onNavigateToTab={setActiveTab}
      />

      {/* 7. Two-Factor Authentication Setup Modal */}
      <TwoFactorSetupModal
        isOpen={isTwoFactorModalOpen}
        onClose={() => setIsTwoFactorModalOpen(false)}
        currentUser={currentUser}
        onUpdateUser={handleUpdateCurrentUser}
      />
    </div>
  );
}
