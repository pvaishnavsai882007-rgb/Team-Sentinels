import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  FileSearch, 
  Activity, 
  Sparkles, 
  History, 
  ArrowRight, 
  Clock, 
  Send,
  AlertOctagon,
  Building,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UniversityDocument, ProposedChange, AuditEvent } from '../types';

interface SmartApprovalHealthScoreProps {
  documents: UniversityDocument[];
  proposedChanges: ProposedChange[];
  activeChangeId?: string;
  auditLogs: AuditEvent[];
  onApproveChange: (changeId: string, reviewerNotes: string) => void;
  onRejectChange: (changeId: string, reason: string) => void;
  onRequestFeedback: (changeId: string, feedback: string) => void;
  onStartImpactReview: (changeId: string) => void;
}

export const SmartApprovalHealthScore: React.FC<SmartApprovalHealthScoreProps> = ({
  documents,
  proposedChanges,
  activeChangeId,
  auditLogs,
  onApproveChange,
  onRejectChange,
  onRequestFeedback,
  onStartImpactReview,
}) => {
  const activeChange = proposedChanges.find(c => c.id === activeChangeId) || proposedChanges[0];
  const targetDoc = documents.find(d => d.id === activeChange?.documentId) || documents[0];

  const [activeModal, setActiveModal] = useState<'reject' | 'request' | null>(null);
  const [modalText, setModalText] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Health breakdown values from targetDoc or default
  const health = targetDoc?.healthBreakdown || {
    metadataCompleteness: 85,
    ocrConfidence: 94,
    approvalStatusScore: 78,
    dependencyConsistency: 70,
    staleReferenceAlerts: 55,
  };

  const overallHealth = targetDoc?.healthScore || 68;

  const handleApprove = () => {
    if (!activeChange) return;
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    onApproveChange(activeChange.id, 'Ratified with synchronized downstream notifications.');
    setSuccessToast(`Policy change "${activeChange.changeTitle}" successfully approved and recorded.`);
    setTimeout(() => setSuccessToast(null), 4500);
  };

  const handleRejectConfirm = () => {
    if (!activeChange) return;
    onRejectChange(activeChange.id, modalText || 'Rejected due to excessive cross-department conflicts.');
    setActiveModal(null);
    setModalText('');
    setSuccessToast(`Proposal marked as Rejected.`);
    setTimeout(() => setSuccessToast(null), 4500);
  };

  const handleRequestConfirm = () => {
    if (!activeChange) return;
    onRequestFeedback(activeChange.id, modalText || 'Please harmonize with Examination Cell regulations.');
    setActiveModal(null);
    setModalText('');
    setSuccessToast(`Revision request sent to document author.`);
    setTimeout(() => setSuccessToast(null), 4500);
  };

  const handleStartReview = () => {
    if (!activeChange) return;
    onStartImpactReview(activeChange.id);
    setSuccessToast(`Comprehensive cross-department impact review initiated.`);
    setTimeout(() => setSuccessToast(null), 4500);
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-4xl space-y-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              STAGE 05 OF 05
            </span>
            <span className="text-xs text-slate-400 font-medium tracking-wide">SMART APPROVAL & HEALTH GOVERNANCE</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Space_Grotesk'] leading-tight">
            Smart Approval & Document Health Score
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Make confident, evidence-backed decisions with change intelligence and proactive monitoring. Evaluate the 5-point document health score and execute synchronized university actions.
          </p>
        </div>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 p-5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-3 animate-fadeIn shadow-lg">
          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main Grid matching Slide 6 layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left: Change Intelligence & 4 Decision Actions (Slide 6 Left Column) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 sm:p-8 shadow-xl space-y-6">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Evidence-Backed Approval Panel
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1.5 leading-snug">
                {activeChange?.changeTitle || 'Review Proposed Policy Modification'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">{activeChange?.documentTitle}</p>
            </div>

            {/* Change Detected Box (Direct match to Slide 6) */}
            <div className="bg-slate-950/90 p-5 rounded-2xl border border-slate-800 space-y-3.5">
              <span className="text-xs sm:text-sm font-bold text-slate-300">Change detected</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-slate-400 block mb-1.5">Before:</span>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm font-mono font-bold text-slate-300 truncate">
                    {activeChange?.beforeValue || '75% attendance / 12 months'}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-orange-400 font-semibold block mb-1.5">After:</span>
                  <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/40 text-xs sm:text-sm font-mono font-bold text-orange-300 truncate">
                    {activeChange?.afterValue || '80% attendance / 18 months'}
                  </div>
                </div>
              </div>
            </div>

            {/* Affected Documents & Conflicts Identified (Slide 6 Counters) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950/90 p-5 rounded-2xl border border-slate-800 space-y-1.5">
                <span className="text-xs sm:text-sm text-slate-400 font-medium">Affected documents</span>
                <div className="text-4xl font-black text-rose-400 font-['Space_Grotesk']">
                  {activeChange?.affectedDocumentsCount || 5}
                </div>
              </div>
              <div className="bg-slate-950/90 p-5 rounded-2xl border border-slate-800 space-y-1.5">
                <span className="text-xs sm:text-sm text-slate-400 font-medium">Conflicts identified</span>
                <div className="text-4xl font-black text-amber-400 font-['Space_Grotesk']">
                  {activeChange?.conflictsCount || 3}
                </div>
              </div>
            </div>

            {/* Recommended Action (from Slide 6) */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-1.5">
              <span className="text-xs sm:text-sm font-bold text-slate-300 block">Recommended action:</span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Review impact, resolve conflicts with Examination Cell and Student Affairs, and confirm alignment before final seal.
              </p>
            </div>

            {/* 4 Decision Action Buttons (Approve, Reject, Request Changes, Start Impact Review from Slide 6) */}
            <div className="pt-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                Executive Action:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* 1. Approve */}
                <button
                  id="approval-btn-approve"
                  type="button"
                  onClick={handleApprove}
                  className="py-3.5 px-3 rounded-2xl text-xs sm:text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 transition-all flex flex-col items-center justify-center gap-1.5 text-center hover:scale-[1.02]"
                >
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span>Approve</span>
                </button>

                {/* 2. Reject */}
                <button
                  id="approval-btn-reject"
                  type="button"
                  onClick={() => setActiveModal('reject')}
                  className="py-3.5 px-3 rounded-2xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 text-slate-300 border border-slate-700 hover:border-rose-500/40 transition-all flex flex-col items-center justify-center gap-1.5 text-center hover:scale-[1.02]"
                >
                  <XCircle className="w-5 h-5 text-slate-400" />
                  <span>Reject</span>
                </button>

                {/* 3. Request Changes */}
                <button
                  id="approval-btn-request-changes"
                  type="button"
                  onClick={() => setActiveModal('request')}
                  className="py-3.5 px-3 rounded-2xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-amber-500/20 hover:text-amber-300 text-slate-300 border border-slate-700 hover:border-amber-500/40 transition-all flex flex-col items-center justify-center gap-1.5 text-center hover:scale-[1.02]"
                >
                  <RotateCcw className="w-5 h-5 text-slate-400" />
                  <span>Request Changes</span>
                </button>

                {/* 4. Start Impact Review */}
                <button
                  id="approval-btn-impact-review"
                  type="button"
                  onClick={handleStartReview}
                  className="py-3.5 px-3 rounded-2xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-blue-500/20 hover:text-blue-300 text-slate-300 border border-slate-700 hover:border-blue-500/40 transition-all flex flex-col items-center justify-center gap-1.5 text-center hover:scale-[1.02]"
                >
                  <FileSearch className="w-5 h-5 text-slate-400" />
                  <span>Start Impact Review</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Document Health Score 68/100 with 5 Progress Bars (Slide 6 Right Column) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 sm:p-8 shadow-xl space-y-7">
            {/* Big Health Score Badge */}
            <div className="text-center pb-5 border-b border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                Document Health Score
              </span>
              <div className="text-6xl font-black text-orange-400 font-['Space_Grotesk'] tracking-tight">
                {overallHealth}<span className="text-3xl text-slate-500 font-normal">/100</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">
                Evaluated for metadata, dependencies, OCR quality, and policy drift
              </p>
            </div>

            {/* The 5 Gauges from Slide 6 */}
            <div className="space-y-4">
              {/* 1. Metadata completeness */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-300 font-medium">Metadata completeness</span>
                  <span className="font-mono text-slate-400 font-bold">{health.metadataCompleteness}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-orange-500 rounded-full transition-all duration-500" 
                    style={{ width: `${health.metadataCompleteness}%` }}
                  />
                </div>
              </div>

              {/* 2. OCR confidence */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-300 font-medium">OCR confidence</span>
                  <span className="font-mono text-slate-400 font-bold">{health.ocrConfidence}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-orange-500 rounded-full transition-all duration-500" 
                    style={{ width: `${health.ocrConfidence}%` }}
                  />
                </div>
              </div>

              {/* 3. Approval status */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-300 font-medium">Approval status</span>
                  <span className="font-mono text-slate-400 font-bold">{health.approvalStatusScore}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-orange-500 rounded-full transition-all duration-500" 
                    style={{ width: `${health.approvalStatusScore}%` }}
                  />
                </div>
              </div>

              {/* 4. Dependency consistency */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-300 font-medium">Dependency consistency</span>
                  <span className="font-mono text-slate-400 font-bold">{health.dependencyConsistency}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-orange-500 rounded-full transition-all duration-500" 
                    style={{ width: `${health.dependencyConsistency}%` }}
                  />
                </div>
              </div>

              {/* 5. Stale reference alerts */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-300 font-medium">Stale reference alerts</span>
                  <span className="font-mono text-slate-400 font-bold">{health.staleReferenceAlerts}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-orange-500 rounded-full transition-all duration-500" 
                    style={{ width: `${health.staleReferenceAlerts}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Footer Tagline from Slide 6 */}
            <div className="pt-4 border-t border-slate-800 text-center">
              <span className="text-xs sm:text-sm font-semibold text-orange-400/90 tracking-wide">
                Proactive governance. Operational reliability.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Audit Trail & History with spacious padding */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 sm:p-8 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
              Governance Audit Trail & Workflow Logs
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">{auditLogs.length} Verified Events</span>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-white text-xs sm:text-sm">{log.documentTitle}</span>
                  <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                    log.action === 'Approved' ? 'bg-emerald-500/20 text-emerald-300' :
                    log.action === 'Modified' ? 'bg-blue-500/20 text-blue-300' :
                    log.action === 'Rejected' ? 'bg-rose-500/20 text-rose-300' :
                    'bg-amber-500/20 text-amber-300'
                  }`}>
                    {log.action}
                  </span>
                </div>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{log.details}</p>
              </div>

              <div className="text-left sm:text-right text-xs text-slate-400 flex-shrink-0">
                <span className="font-medium text-slate-300 block">{log.performedBy}</span>
                <span>{log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reject Modal */}
      {activeModal === 'reject' && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-400" />
              Reject Policy Modification
            </h3>
            <p className="text-xs text-slate-300">
              Provide formal rationale to the proposing department chair:
            </p>
            <textarea
              rows={3}
              value={modalText}
              onChange={(e) => setModalText(e.target.value)}
              placeholder="e.g. Unmitigated conflict with Examination Regulations and insufficient student consultation."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectConfirm}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Changes Modal */}
      {activeModal === 'request' && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-amber-400" />
              Request Policy Harmonization Changes
            </h3>
            <p className="text-xs text-slate-300">
              Specify the amendments needed before ratification:
            </p>
            <textarea
              rows={3}
              value={modalText}
              onChange={(e) => setModalText(e.target.value)}
              placeholder="e.g. Please coordinate with Examination Cell to adjust hall ticket cutoff scripts."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRequestConfirm}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white"
              >
                Send Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
