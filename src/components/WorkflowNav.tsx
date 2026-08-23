import React from 'react';
import { 
  Upload, 
  FileSearch, 
  Network, 
  Flame, 
  ShieldCheck, 
  Compass,
  Sparkles
} from 'lucide-react';

export type TabType = 
  | 'submit' 
  | 'understand' 
  | 'explore' 
  | 'impact' 
  | 'review' 
  | 'intelligence';

interface WorkflowNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  impactBadgeCount?: number;
  conflictsBadgeCount?: number;
}

export const WorkflowNav: React.FC<WorkflowNavProps> = ({
  activeTab,
  onTabChange,
  impactBadgeCount = 0,
  conflictsBadgeCount = 0,
}) => {
  const steps: { id: TabType; stepNum: string; label: string; sublabel: string; icon: React.ComponentType<{ className?: string }> }[] = [
    {
      id: 'submit',
      stepNum: '01',
      label: 'Submit & Upload',
      sublabel: 'Policies, Circulars, SOPs',
      icon: Upload,
    },
    {
      id: 'understand',
      stepNum: '02',
      label: 'Understand & Extract',
      sublabel: 'OCR, Rules, Parameters',
      icon: FileSearch,
    },
    {
      id: 'explore',
      stepNum: '03',
      label: 'Explore Graph',
      sublabel: 'Document Dependencies',
      icon: Network,
    },
    {
      id: 'impact',
      stepNum: '04',
      label: 'Change Impact Engine',
      sublabel: 'Predict Ripple Effects',
      icon: Flame,
    },
    {
      id: 'review',
      stepNum: '05',
      label: 'Smart Approval & Health',
      sublabel: 'Health Score & Decisions',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-sm sticky top-[97px] z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between overflow-x-auto py-2.5 gap-2 scrollbar-none">
          {/* Main 5-Stage Pipeline */}
          <div className="flex items-center gap-1 sm:gap-2">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeTab === step.id;
              return (
                <React.Fragment key={step.id}>
                  <button
                    id={`nav-tab-${step.id}`}
                    onClick={() => onTabChange(step.id)}
                    className={`group relative flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all ${
                      isActive
                        ? 'bg-slate-800 text-white shadow-sm border border-orange-500/40 ring-1 ring-orange-500/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                          : 'bg-slate-800 text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-700'
                      }`}
                    >
                      {step.stepNum}
                    </div>

                    <div className="hidden md:block">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-bold leading-tight ${isActive ? 'text-white' : 'text-slate-300'}`}>
                          {step.label}
                        </span>
                        {step.id === 'impact' && impactBadgeCount > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-orange-500 text-white">
                            {impactBadgeCount}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block leading-tight">
                        {step.sublabel}
                      </span>
                    </div>

                    {/* Mobile only icon/label */}
                    <div className="md:hidden">
                      <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                        {step.label.split(' ')[0]}
                      </span>
                    </div>

                    {isActive && (
                      <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-orange-500 rounded-full" />
                    )}
                  </button>

                  {idx < steps.length - 1 && (
                    <div className="hidden lg:block w-3 h-0.5 bg-slate-800" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Secondary Intelligence Tab */}
          <div className="pl-2 border-l border-slate-800 flex items-center">
            <button
              id="nav-tab-intelligence"
              onClick={() => onTabChange('intelligence')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'intelligence'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 border border-blue-400/40'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-blue-300 hover:text-white border border-slate-700'
              }`}
            >
              <Compass className="w-4 h-4 text-blue-400" />
              <span>University Intelligence</span>
              {conflictsBadgeCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-extrabold">
                  {conflictsBadgeCount} Alerts
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
