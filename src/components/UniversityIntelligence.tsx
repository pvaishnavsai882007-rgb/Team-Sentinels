import React, { useState } from 'react';
import { 
  Compass, 
  GitCommit, 
  AlertTriangle, 
  Clock, 
  FileWarning, 
  CheckCircle, 
  TrendingUp, 
  Layers, 
  Sparkles, 
  BarChart3,
  ShieldCheck,
  Building,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { ConflictAlert, StaleDocumentAlert, PolicyDriftItem, UniversityDocument } from '../types';

interface UniversityIntelligenceProps {
  conflicts: ConflictAlert[];
  staleAlerts: StaleDocumentAlert[];
  policyDrifts: PolicyDriftItem[];
  documents: UniversityDocument[];
  onResolveConflict: (conflictId: string) => void;
  onSelectDocument: (docId: string) => void;
  onNavigateToTab: (tab: 'impact' | 'understand' | 'explore') => void;
}

export const UniversityIntelligence: React.FC<UniversityIntelligenceProps> = ({
  conflicts,
  staleAlerts,
  policyDrifts,
  documents,
  onResolveConflict,
  onSelectDocument,
  onNavigateToTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'conflicts' | 'drift' | 'stale' | 'delays' | 'purpose'>('conflicts');

  // Approval delay statistics (Slide 5: Approval delay analytics)
  const departmentDelays = [
    { department: 'Academic Council & Senate', avgDays: 14.2, status: 'Bottleneck', count: 6, color: 'bg-rose-500' },
    { department: 'Finance & Syndicate Board', avgDays: 9.5, status: 'Moderate', count: 4, color: 'bg-amber-500' },
    { department: 'Examination Cell', avgDays: 3.1, status: 'Fast', count: 12, color: 'bg-emerald-500' },
    { department: 'Dean of Student Affairs', avgDays: 4.8, status: 'Good', count: 8, color: 'bg-blue-500' },
    { department: 'HR & Faculty Welfare', avgDays: 11.0, status: 'Bottleneck', count: 5, color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-4xl space-y-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
              UNIVERSITY GOVERNANCE SUITE
            </span>
            <span className="text-xs text-slate-400 font-medium tracking-wide">TAILORED FOR HIGHER EDUCATION</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Space_Grotesk'] leading-tight">
            Proactive University Intelligence
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Evolving university regulations create policy drift, conflicting circulars, and stale references across colleges. DocVault AI monitors campus health, bottlenecks, and compliance.
          </p>
        </div>
      </div>

      {/* Sub-Navigation Tabs matching Slide 5 Features with spacious pill bar */}
      <div className="flex flex-wrap gap-2.5 p-2 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <button
          onClick={() => setActiveSubTab('conflicts')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'conflicts'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
              : 'bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800/60'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Conflicting Circulars ({conflicts.filter(c => !c.resolved).length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('drift')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'drift'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800/60'
          }`}
        >
          <GitCommit className="w-4 h-4" />
          <span>Policy Drift Detection</span>
        </button>

        <button
          onClick={() => setActiveSubTab('stale')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'stale'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
              : 'bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800/60'
          }`}
        >
          <FileWarning className="w-4 h-4" />
          <span>Staleness & Expiry ({staleAlerts.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('delays')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'delays'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800/60'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Approval Delay Analytics</span>
        </button>

        <button
          onClick={() => setActiveSubTab('purpose')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'purpose'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
              : 'bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Purpose Cards ({documents.length})</span>
        </button>
      </div>

      {/* 1. Conflicting Circulars Tab */}
      {activeSubTab === 'conflicts' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">Cross-Department Contradiction Alerts</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Highlights contradictory communications issued across separate colleges and administrative cells.
              </p>
            </div>
            <span className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 self-start sm:self-center">
              {conflicts.filter(c => !c.resolved).length} Active Contradictions
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {conflicts.map((conf) => (
              <div
                key={conf.id}
                className={`bg-slate-900 border rounded-3xl p-7 sm:p-8 shadow-xl space-y-5 transition-all ${
                  conf.resolved
                    ? 'border-emerald-500/30 bg-slate-950/40 opacity-75'
                    : 'border-rose-500/40'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                        conf.resolved
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {conf.resolved ? 'RESOLVED & HARMONIZED' : `${conf.severity} SEVERITY CONFLICT`}
                      </span>
                      <span className="text-xs font-mono text-slate-400">Detected: {conf.detectedDate}</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-bold text-white pt-1">{conf.title}</h4>
                  </div>

                  {!conf.resolved && (
                    <button
                      type="button"
                      onClick={() => onResolveConflict(conf.id)}
                      className="px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all flex items-center gap-2 hover:scale-[1.02]"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Mark Harmonized</span>
                    </button>
                  )}
                </div>

                {/* Side by Side Contradicting Snippets */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-950/90 p-5 rounded-2xl border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-blue-400 block uppercase tracking-wider">
                      {conf.documentA.department} ({conf.documentA.code})
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 font-semibold">{conf.documentA.title}</p>
                    <p className="text-xs sm:text-sm font-mono bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">
                      {conf.documentA.snippet}
                    </p>
                  </div>

                  <div className="bg-slate-950/90 p-5 rounded-2xl border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-amber-400 block uppercase tracking-wider">
                      {conf.documentB.department} ({conf.documentB.code})
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 font-semibold">{conf.documentB.title}</p>
                    <p className="text-xs sm:text-sm font-mono bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">
                      {conf.documentB.snippet}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950/70 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-1.5">
                  <span className="text-xs sm:text-sm font-bold text-slate-300 block">Conflict Impact:</span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{conf.conflictDescription}</p>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl text-xs sm:text-sm text-emerald-300 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-emerald-200 font-bold">Recommended Fix: </strong>
                    <span className="leading-relaxed">{conf.recommendation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Policy Drift Detection Tab */}
      {activeSubTab === 'drift' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-lg">
            <h3 className="text-lg font-bold text-white">Policy Drift Timeline Monitor</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Tracks how core academic rules mutate over academic cycles and surfaces orphan documents that still cite older thresholds.
            </p>
          </div>

          <div className="space-y-6">
            {policyDrifts.map((drift) => (
              <div key={drift.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-7 sm:p-8 shadow-xl space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {drift.driftRisk}
                    </span>
                    <h4 className="text-lg sm:text-xl font-bold text-white mt-1.5">{drift.policyName}</h4>
                    <span className="text-xs font-mono text-slate-400">{drift.academicYearSpan}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/90 p-4 rounded-2xl border border-slate-800">
                  {drift.changesSummary}
                </p>

                {/* Timeline Steps */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Evolution Steps Across Academic Cycles:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {drift.evolutionSteps.map((step, idx) => (
                      <div key={idx} className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs sm:text-sm relative">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-orange-400">{step.version}</span>
                          <span className="font-mono text-xs text-slate-400">{step.year}</span>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed">{step.changeText}</p>
                        <span className="text-[11px] text-slate-500 block pt-1.5 border-t border-slate-900 truncate">
                          Auth: {step.approver}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Drift Insight */}
                <div className="bg-indigo-500/10 border border-indigo-500/30 p-4 rounded-2xl text-xs sm:text-sm text-indigo-300 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold text-indigo-200">Drift Risk Insight: </strong>
                    <span className="leading-relaxed">{drift.insight}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Staleness & Expiry Tab */}
      {activeSubTab === 'stale' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-lg">
            <h3 className="text-lg font-bold text-white">Staleness & Expiry Intelligence</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Flags university documents likely outdated based on usage, expired bylaws, or unreviewed tenure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {staleAlerts.map((stale) => (
              <div key={stale.id} className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400">{stale.documentCode}</span>
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300">
                      Outdated References
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-bold text-white">{stale.documentTitle}</h4>
                  <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-2">
                    <Building className="w-4 h-4 text-slate-500" />
                    <span>{stale.department}</span>
                    <span>•</span>
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>Last Reviewed: {stale.lastReviewDate}</span>
                  </p>

                  <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 space-y-1 text-xs sm:text-sm">
                    <span className="font-bold text-slate-300 block">Staleness Reason:</span>
                    <p className="text-slate-400 leading-relaxed">{stale.reason}</p>
                  </div>

                  <div className="space-y-1.5 text-xs sm:text-sm">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Outdated References Detected:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {stale.outdatedReferences.map((ref, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-950 text-rose-300 border border-slate-800 text-xs font-mono">
                          ✕ {ref}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSelectDocument(stale.documentId);
                    onNavigateToTab('understand');
                  }}
                  className="w-full py-3 rounded-2xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center justify-center gap-2 mt-4 hover:scale-[1.01]"
                >
                  <span>Open for Revision</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Approval Delay Analytics Tab */}
      {activeSubTab === 'delays' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-lg">
            <h3 className="text-lg font-bold text-white">Approval Bottleneck & Delay Analytics</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Tracks turnaround times across senate committees, deans, and financial controllers to accelerate workflow routing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-7 sm:p-8 shadow-xl space-y-5">
              <h4 className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider">
                Average Approval Latency by Approving Authority
              </h4>

              <div className="space-y-5 pt-2">
                {departmentDelays.map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-bold text-white">{item.department}</span>
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-slate-400">{item.avgDays} Days Avg</span>
                        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                          item.status === 'Bottleneck' ? 'bg-rose-500/20 text-rose-300' :
                          item.status === 'Moderate' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min(100, (item.avgDays / 16) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
                <h4 className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider">
                  Governance Optimization Insights
                </h4>
                <div className="bg-slate-950/90 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-2.5 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold">
                    <TrendingUp className="w-4 h-4" />
                    <span>Academic Senate Review Delay</span>
                  </div>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Policies requiring full Academic Senate ratification take 14.2 days on average. Enabling fast-track interim approval for minor SOP threshold amendments will cut latency by 65%.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Purpose Cards Tab */}
      {activeSubTab === 'purpose' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-lg">
            <h3 className="text-lg font-bold text-white">University Document Purpose Cards</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Clear 1-page cards displaying every document&apos;s role, dependencies, and approval path at a glance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 sm:p-7 shadow-lg space-y-4 flex flex-col justify-between transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-blue-400">{doc.code}</span>
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-300">
                      {doc.category}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-bold text-white leading-snug">{doc.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed">{doc.summary}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-800 text-xs sm:text-sm">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Dependencies: <strong>{doc.dependencies.length} upstream</strong></span>
                    <span>Dependents: <strong>{doc.dependents.length} downstream</strong></span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectDocument(doc.id);
                      onNavigateToTab('understand');
                    }}
                    className="w-full py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View Complete Purpose Card</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
