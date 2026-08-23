import React, { useState } from 'react';
import { 
  Flame, 
  ArrowRight, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Users, 
  Building2, 
  ShieldAlert, 
  FileEdit,
  Cpu,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { UniversityDocument, ProposedChange } from '../types';

interface ChangeImpactEngineProps {
  documents: UniversityDocument[];
  proposedChanges: ProposedChange[];
  activeChangeId?: string;
  onApplyNewChange: (newChange: ProposedChange) => void;
  onSelectChange: (changeId: string) => void;
  onNavigateToApproval: (changeId: string) => void;
}

export const ChangeImpactEngine: React.FC<ChangeImpactEngineProps> = ({
  documents,
  proposedChanges,
  activeChangeId,
  onApplyNewChange,
  onSelectChange,
  onNavigateToApproval,
}) => {
  const activeChange = proposedChanges.find(c => c.id === activeChangeId) || proposedChanges[0];

  // Form states for creating or custom simulating a change
  const [selectedDocId, setSelectedDocId] = useState<string>(activeChange?.documentId || documents[0]?.id || '');
  const [changeTitle, setChangeTitle] = useState<string>(activeChange?.changeTitle || 'Revise Policy Threshold');
  const [beforeValue, setBeforeValue] = useState<string>(activeChange?.beforeValue || '75% minimum attendance');
  const [afterValue, setAfterValue] = useState<string>(activeChange?.afterValue || '80% minimum attendance');
  const [reason, setReason] = useState<string>(activeChange?.reason || 'Accreditation board mandate');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<string>('');

  const targetDoc = documents.find(d => d.id === selectedDocId) || documents[0];

  // Preset fast change scenarios
  const presetScenarios = [
    {
      title: '75% → 80% Attendance Threshold',
      docId: 'doc-attendance-policy',
      before: '75% minimum course attendance (5% medical floor to 70%)',
      after: '80% minimum course attendance (5% medical floor to 75%)',
      reason: 'National Higher Education Accreditation Board recommendations.',
    },
    {
      title: '12 → 18 Month Sabbatical Duration',
      docId: 'doc-faculty-sabbatical',
      before: '12 continuous months maximum sabbatical leave',
      after: '18 continuous months maximum sabbatical leave',
      reason: 'Support international research grant residency requirements.',
    },
    {
      title: '10:00 PM → 11:00 PM Hostel Gate Curfew',
      docId: 'doc-hostel-circular',
      before: 'Turnstiles lock at 10:00 PM every night',
      after: 'Turnstiles lock at 11:00 PM for upper-division students',
      reason: 'Facilitate late-night campus lab and central library research.',
    },
    {
      title: '15 → 30 Day Fee Refund Window',
      docId: 'doc-fee-refund',
      before: '100% refund up to 15 days before semester start',
      after: '100% refund up to 30 days before semester start',
      reason: 'Student Government Association welfare petition.',
    },
  ];

  const handleSelectPreset = (preset: typeof presetScenarios[0]) => {
    setSelectedDocId(preset.docId);
    setChangeTitle(preset.title);
    setBeforeValue(preset.before);
    setAfterValue(preset.after);
    setReason(preset.reason);
  };

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    setSimulationStep('Traversing university document relationship graph...');
    await new Promise(r => setTimeout(r, 400));

    setSimulationStep('Querying Gemini AI for policy drift & conflict cascading...');

    try {
      const response = await fetch('/api/simulate-impact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentTitle: targetDoc.title,
          documentCode: targetDoc.code,
          beforeValue,
          afterValue,
          reason,
          existingDocuments: documents,
        }),
      });

      const data = await response.json();
      const impact = data.impact || {};

      const newChange: ProposedChange = {
        id: `change-${Date.now()}`,
        documentId: targetDoc.id,
        documentTitle: `${targetDoc.title} (${targetDoc.code})`,
        changeTitle: changeTitle || `Proposed revision to ${targetDoc.code}`,
        description: `Proposing to update ${targetDoc.title} baseline parameters from "${beforeValue}" to "${afterValue}".`,
        beforeValue,
        afterValue,
        reason,
        proposedBy: 'Dean / Department Chair',
        proposedDate: new Date().toISOString().split('T')[0],
        status: 'Pending',
        affectedDocumentsCount: impact.affectedDocumentsCount || impact.affectedDocuments?.length || 3,
        conflictsCount: impact.conflictsCount || 2,
        impactSeverity: impact.impactSeverity || 'High',
        affectedDocuments: impact.affectedDocuments || [],
        aiExplanation: impact.aiExplanation || `Simulated consequence cascade for ${targetDoc.title}.`,
        studentFacultyImpact: impact.studentFacultyImpact || 'Estimated ~1,500 students and faculty affected.',
      };

      onApplyNewChange(newChange);
      onSelectChange(newChange.id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
      setSimulationStep('');
    }
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-4xl space-y-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
              STAGE 04 OF 05
            </span>
            <span className="text-xs text-slate-400 font-medium tracking-wide">CHANGE IMPACT & CONSEQUENCE ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Space_Grotesk'] leading-tight">
            When One Document Changes, What Happens Next?
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Traditional document systems store versions; <strong>DocVault AI manages their consequences</strong>. Propose or test a change to predict ripple effects, detect policy contradictions, and resolve conflicts before approval.
          </p>
        </div>
      </div>

      {/* Main Grid: Simulation Config on Left, Ripple Cascade Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left: Change Proposer & Presets */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Scenario Picker */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-4">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              1-Click Consequence Test Scenarios:
            </span>
            <div className="grid grid-cols-1 gap-3">
              {presetScenarios.map((scen, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(scen)}
                  className={`p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all ${
                    beforeValue === scen.before
                      ? 'bg-orange-500/20 border-orange-500/60 ring-1 ring-orange-500/30 shadow-md'
                      : 'bg-slate-950/70 border-slate-800 hover:bg-slate-800/40 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs sm:text-sm">{scen.title}</span>
                    <span className="text-xs font-mono text-orange-400 font-semibold">Run Test</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {scen.reason}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Change Parameters Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 shadow-lg space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileEdit className="w-4 h-4 text-orange-400" />
              Configure Proposed Policy Modification
            </h3>

            {/* Target Document */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Target Master Document
              </label>
              <select
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
              >
                {documents.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.code} — {d.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Change Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Proposal Title
              </label>
              <input
                type="text"
                value={changeTitle}
                onChange={(e) => setChangeTitle(e.target.value)}
                placeholder="e.g. Increase minimum attendance from 75% to 80%"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            {/* Before vs After (Exact Visual Representation of Slide 4 & 6) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-xs font-bold uppercase text-slate-400 block mb-1">
                  Current (Before)
                </span>
                <textarea
                  rows={2}
                  value={beforeValue}
                  onChange={(e) => setBeforeValue(e.target.value)}
                  placeholder="e.g. 75% attendance threshold"
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-200 focus:outline-none font-mono resize-none leading-relaxed"
                />
              </div>

              <div className="bg-slate-950/90 p-4 rounded-2xl border border-orange-500/40 ring-1 ring-orange-500/20 space-y-1">
                <span className="text-xs font-bold uppercase text-orange-400 block mb-1">
                  Proposed (After)
                </span>
                <textarea
                  rows={2}
                  value={afterValue}
                  onChange={(e) => setAfterValue(e.target.value)}
                  placeholder="e.g. 80% attendance threshold"
                  className="w-full bg-transparent text-xs sm:text-sm text-orange-200 focus:outline-none font-mono resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Justification */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Reason / Academic Council Justification
              </label>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Why is this change being proposed?"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500 transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Submit Simulation */}
            <button
              id="run-consequence-simulation-btn"
              type="button"
              disabled={isSimulating}
              onClick={handleRunSimulation}
              className={`w-full py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] ${
                isSimulating
                  ? 'bg-slate-800 text-slate-500'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/30'
              }`}
            >
              {isSimulating ? (
                <>
                  <Cpu className="w-4 h-4 animate-spin" />
                  <span>{simulationStep || 'Simulating Ripple Effects...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Run Consequence Impact Simulation</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Consequence Analysis & Ripple Effect Visualizer */}
        <div className="lg:col-span-7 space-y-6">
          {activeChange ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 sm:p-8 shadow-xl space-y-6 animate-fadeIn">
              {/* Header Box with Before -> After pill (Direct visual match to Slide 4 & 6) */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      {activeChange.impactSeverity} Severity Ripple
                    </span>
                    <span className="text-xs font-mono text-slate-400">{activeChange.proposedDate}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">{activeChange.changeTitle}</h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">{activeChange.documentTitle}</p>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateToApproval(activeChange.id)}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <span>Proceed to Smart Approval</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Big Metric Strip (from Slide 4 & 6: 75% -> 80%, Affected Documents, Conflicts Identified) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Change Detected Visual Pill */}
                <div className="bg-slate-950/90 p-5 rounded-2xl border border-orange-500/30 space-y-1.5">
                  <span className="text-xs font-semibold text-slate-400 block">Change Detected:</span>
                  <div className="flex items-center gap-2 text-lg font-extrabold text-white">
                    <span className="text-slate-300 line-through truncate max-w-[100px]">{activeChange.beforeValue.split(' ')[0]}</span>
                    <ArrowRight className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span className="text-orange-400 truncate max-w-[100px]">{activeChange.afterValue.split(' ')[0]}</span>
                  </div>
                  <span className="text-xs text-slate-400 block truncate">{activeChange.afterValue}</span>
                </div>

                {/* Affected Documents Counter */}
                <div className="bg-slate-950/90 p-5 rounded-2xl border border-slate-800 space-y-1.5">
                  <span className="text-xs font-semibold text-slate-400 block">Affected Documents:</span>
                  <div className="text-3xl font-black text-rose-400 font-['Space_Grotesk']">
                    {activeChange.affectedDocumentsCount}
                  </div>
                  <span className="text-xs text-slate-400 block">Connected university files</span>
                </div>

                {/* Conflicts Identified Counter */}
                <div className="bg-slate-950/90 p-5 rounded-2xl border border-slate-800 space-y-1.5">
                  <span className="text-xs font-semibold text-slate-400 block">Conflicts Identified:</span>
                  <div className="text-3xl font-black text-amber-400 font-['Space_Grotesk']">
                    {activeChange.conflictsCount}
                  </div>
                  <span className="text-xs text-slate-400 block">Immediate contradictions</span>
                </div>
              </div>

              {/* AI Plain English Impact Explanation */}
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-200">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span>Executive Consequence Summary (AI Engine)</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {activeChange.aiExplanation}
                </p>
                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-400">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>{activeChange.studentFacultyImpact}</span>
                </div>
              </div>

              {/* Detailed Breakdown for each Affected Document */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider">
                    Downstream Cascade Breakdown ({activeChange.affectedDocuments.length} Documents)
                  </h4>
                  <span className="text-xs text-orange-400 font-semibold">Automatic Ripple Mapping</span>
                </div>

                <div className="space-y-3">
                  {activeChange.affectedDocuments.map((aff, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950/90 p-5 rounded-2xl border border-slate-800 space-y-2.5 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-white">{aff.documentTitle}</span>
                        </div>
                        {aff.conflictType && (
                          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            {aff.conflictType}
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-8">
                        {aff.impactDescription}
                      </p>

                      <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5 ml-8">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-emerald-400 font-semibold">Recommended Fix: </strong>
                          <span>{aff.recommendedAction}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Flame className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">No Simulation Selected</h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                Pick a 1-click test scenario on the left or customize your own before/after thresholds to view the live consequence ripple analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
