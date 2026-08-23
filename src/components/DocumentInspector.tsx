import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Tag, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  Flame, 
  ShieldCheck, 
  Layers,
  Sparkles,
  UserCheck,
  GitFork
} from 'lucide-react';
import { UniversityDocument, DocumentCategory } from '../types';

interface DocumentInspectorProps {
  documents: UniversityDocument[];
  selectedDocId: string;
  onSelectDocument: (docId: string) => void;
  onTriggerChangeForDoc: (doc: UniversityDocument) => void;
}

export const DocumentInspector: React.FC<DocumentInspectorProps> = ({
  documents,
  selectedDocId,
  onSelectDocument,
  onTriggerChangeForDoc,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const selectedDoc = documents.find(d => d.id === selectedDocId) || documents[0];

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || doc.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories: DocumentCategory[] = ['Policy', 'Regulation', 'Circular', 'Handbook', 'SOP', 'Form', 'Guidelines'];

  // Resolve upstream and downstream doc references
  const upstreamDocs = documents.filter(d => selectedDoc?.dependencies.includes(d.id));
  const downstreamDocs = documents.filter(d => selectedDoc?.dependents.includes(d.id));

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xl">
        <div className="max-w-4xl space-y-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              STAGE 02 OF 05
            </span>
            <span className="text-xs text-slate-400 font-medium tracking-wide">UNDERSTAND & EXTRACT</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Space_Grotesk'] leading-tight">
            Document Intelligence & Extracted Rules
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            DocVault AI unpacks policies and notices into atomic numerical rules, stakeholder roles, and compliance thresholds. Review purpose cards and cross-department dependencies in plain English.
          </p>
        </div>
      </div>

      {/* Main Grid: Document List on Left, Deep Inspection Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Document Selector Sidebar */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-lg">
            {/* Search & Filter */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search policies, codes, or depts..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedCategory === 'ALL'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({documents.length})
              </button>
              {categories.map((cat) => {
                const count = documents.filter(d => d.category === cat).length;
                if (count === 0) return null;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>

            {/* Document List with spacious cards */}
            <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
              {filteredDocs.map((doc) => {
                const isSelected = doc.id === selectedDoc?.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => onSelectDocument(doc.id)}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-800/90 border-blue-500/60 ring-1 ring-blue-500/20 shadow-lg'
                        : 'bg-slate-950/70 border-slate-800/90 hover:bg-slate-800/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-mono font-bold text-blue-400">
                        {doc.code}
                      </span>
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {doc.category}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white leading-snug">
                      {doc.title}
                    </h4>

                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {doc.summary}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1.5 truncate max-w-[180px]">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        {doc.department}
                      </span>
                      <span className="font-semibold text-orange-400">
                        Health: {doc.healthScore}/100
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Document Deep Inspection & Purpose Card */}
        {selectedDoc ? (
          <div className="lg:col-span-7 space-y-6">
            {/* Purpose Card Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 sm:p-8 shadow-xl space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {selectedDoc.code}
                    </span>
                    <span className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {selectedDoc.category}
                    </span>
                    <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {selectedDoc.version}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">{selectedDoc.title}</h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      {selectedDoc.department}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      Effective: {selectedDoc.effectiveDate}
                    </span>
                  </p>
                </div>

                {/* Primary Action Button: Propose Change / Simulate */}
                <button
                  type="button"
                  onClick={() => onTriggerChangeForDoc(selectedDoc)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Flame className="w-4 h-4 text-white" />
                  <span>Test Change / Simulate Ripple</span>
                </button>
              </div>

              {/* Plain English Purpose Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Purpose & Role in University Governance
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                  {selectedDoc.summary}
                </p>
              </div>

              {/* Extracted Core Rules */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Extracted Rules & Thresholds ({selectedDoc.rules.length})</span>
                  <span className="text-xs text-blue-400 font-medium">AI Grounded Extraction</span>
                </h4>

                <div className="space-y-3">
                  {selectedDoc.rules.map((rule) => (
                    <div key={rule.id} className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-bold text-white">{rule.name}</span>
                        {rule.parameterValue && (
                          <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                            {rule.parameterValue}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{rule.statement}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs pt-1.5 text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                          <span>Affected: <strong>{rule.affectedRole}</strong></span>
                        </span>
                        {rule.consequenceIfViolated && (
                          <span className="flex items-center gap-1.5 text-rose-400">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                            <span>Penalty: {rule.consequenceIfViolated}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upstream & Downstream Dependencies (Purpose Cards feature from Slide 5) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Upstream Dependencies */}
                <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                    <GitFork className="w-4 h-4 text-indigo-400 rotate-180" />
                    <span>Upstream Dependencies ({upstreamDocs.length})</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Documents that this policy references or relies upon:
                  </p>
                  {upstreamDocs.length > 0 ? (
                    <div className="space-y-2">
                      {upstreamDocs.map((up) => (
                        <div
                          key={up.id}
                          onClick={() => onSelectDocument(up.id)}
                          className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 cursor-pointer text-xs transition-colors flex items-center justify-between"
                        >
                          <div>
                            <span className="font-mono font-bold text-blue-400 text-xs block">{up.code}</span>
                            <span className="text-slate-200 font-semibold truncate block max-w-[180px]">{up.title}</span>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-slate-500" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic block py-1.5">
                      Root Master Policy (No upstream prerequisites)
                    </span>
                  )}
                </div>

                {/* Downstream Dependents */}
                <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                    <GitFork className="w-4 h-4 text-orange-400" />
                    <span>Downstream Dependents ({downstreamDocs.length})</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Connected SOPs, forms, and handbooks that depend on this:
                  </p>
                  {downstreamDocs.length > 0 ? (
                    <div className="space-y-2">
                      {downstreamDocs.map((down) => (
                        <div
                          key={down.id}
                          onClick={() => onSelectDocument(down.id)}
                          className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 cursor-pointer text-xs transition-colors flex items-center justify-between"
                        >
                          <div>
                            <span className="font-mono font-bold text-orange-400 text-xs block">{down.code}</span>
                            <span className="text-slate-200 font-semibold truncate block max-w-[180px]">{down.title}</span>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-slate-500" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic block py-1.5">
                      Terminal Operational Document (No downstream dependents)
                    </span>
                  )}
                </div>
              </div>

              {/* Approval Authority & Governance Path */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between text-xs sm:text-sm text-slate-300 gap-3">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Author: <strong>{selectedDoc.author}</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-purple-400" />
                  <span>Approval Authority: <strong>{selectedDoc.approverRole}</strong></span>
                </div>
              </div>

              {/* Full Text Collapse */}
              <details className="group bg-slate-950/90 p-4 rounded-2xl border border-slate-800 text-xs sm:text-sm">
                <summary className="cursor-pointer font-bold text-slate-300 hover:text-white flex items-center justify-between">
                  <span>View Raw Policy Text / OCR Transcript</span>
                  <span className="text-xs text-blue-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-3 pt-3 border-t border-slate-800/80 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                  {selectedDoc.fullText}
                </div>
              </details>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
