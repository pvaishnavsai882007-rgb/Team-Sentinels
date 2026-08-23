import React from 'react';
import { 
  FileText, 
  GitPullRequest, 
  Layers, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  RefreshCw,
  Building2,
  HelpCircle,
  Clock,
  Camera,
  ShieldCheck,
  ShieldAlert,
  Key
} from 'lucide-react';
import { ProposedChange, ConflictAlert, UserProfile } from '../types';
import { UserProfileMenu } from './UserProfileMenu';

interface HeaderProps {
  onSelectScenario: (scenarioId: string) => void;
  activeScenarioId?: string;
  conflicts: ConflictAlert[];
  pendingChanges: ProposedChange[];
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  onOpenTwoFactorSetup: () => void;
  onSignOut: () => void;
  onOpenCopilot: () => void;
  onOpenScanner?: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectScenario,
  activeScenarioId,
  conflicts,
  pendingChanges,
  currentUser,
  allUsers,
  onSelectUser,
  onOpenTwoFactorSetup,
  onSignOut,
  onOpenCopilot,
  onOpenScanner,
  onResetData,
}) => {
  const unresolvedConflicts = conflicts.filter(c => !c.resolved).length;


  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & University Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-coral-500 via-rose-500 to-amber-500 bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 ring-2 ring-orange-400/30">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white font-['Space_Grotesk']">
                DocVault <span className="text-orange-400">AI</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-orange-300" />
                Consequence-Aware
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              University Document Intelligence & Ripple Effect Governance
            </p>
          </div>
        </div>

        {/* Quick Scenario Buttons & AI Copilot CTA */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 mr-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Try Live Scenarios:</span>
          </div>

          <button
            id="scenario-attendance-btn"
            onClick={() => onSelectScenario('change-attendance-75-to-80')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border ${
              activeScenarioId === 'change-attendance-75-to-80'
                ? 'bg-orange-500 text-white border-orange-400 shadow-md shadow-orange-500/30 ring-1 ring-orange-300'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
            75% → 80% Attendance
          </button>

          <button
            id="scenario-sabbatical-btn"
            onClick={() => onSelectScenario('change-leave-12-to-18')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border ${
              activeScenarioId === 'change-leave-12-to-18'
                ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/30'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            12 → 18 Mo. Sabbatical
          </button>

          {/* Scan Document Button */}
          {onOpenScanner && (
            <button
              id="header-scan-doc-btn"
              onClick={onOpenScanner}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/40 transition-all flex items-center gap-1.5 shadow-sm"
              title="Scan physical university document with camera or photo"
            >
              <Camera className="w-3.5 h-3.5 text-orange-400" />
              <span>Scan Document</span>
            </button>
          )}

          {/* DocVault AI Assistant Button */}
          <button
            id="open-ai-copilot-btn"
            onClick={onOpenCopilot}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>DocVault AI</span>
          </button>

          <button
            onClick={onResetData}
            title="Reset sample data"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* User Profile & 2FA Security Menu */}
          <div className="h-6 w-px bg-slate-800 mx-1 hidden sm:block" />
          <UserProfileMenu
            currentUser={currentUser}
            allUsers={allUsers}
            onSelectUser={onSelectUser}
            onOpenTwoFactorSetup={onOpenTwoFactorSetup}
            onSignOut={onSignOut}
          />
        </div>
      </div>

      {/* Metric Highlights Strip */}
      <div className="bg-slate-950/80 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <strong className="text-slate-200 font-semibold">Campus Node:</strong> Central University Academic Network
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>10 Connected Policies & SOPs</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {unresolvedConflicts > 0 && (
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                {unresolvedConflicts} Policy Conflict{unresolvedConflicts > 1 ? 's' : ''} Detected
              </span>
            )}
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium flex items-center gap-1">
              <GitPullRequest className="w-3 h-3 text-amber-400" />
              {pendingChanges.length} Active Change Proposal
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
