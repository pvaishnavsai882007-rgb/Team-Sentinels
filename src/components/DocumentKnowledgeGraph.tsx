import React, { useState } from 'react';
import { 
  Network, 
  Layers, 
  Info, 
  Flame, 
  ArrowRight, 
  Filter, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Building,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { UniversityDocument, DocumentCategory } from '../types';

interface DocumentKnowledgeGraphProps {
  documents: UniversityDocument[];
  selectedDocId: string;
  onSelectDocument: (docId: string) => void;
  onTriggerChange: (doc: UniversityDocument) => void;
}

export const DocumentKnowledgeGraph: React.FC<DocumentKnowledgeGraphProps> = ({
  documents,
  selectedDocId,
  onSelectDocument,
  onTriggerChange,
}) => {
  const [filterDepartment, setFilterDepartment] = useState<string>('ALL');
  const [highlightedCategory, setHighlightedCategory] = useState<string>('ALL');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const selectedDoc = documents.find(d => d.id === selectedDocId) || documents[0];

  const departments = Array.from(new Set(documents.map(d => d.department)));
  const categories: DocumentCategory[] = ['Policy', 'Regulation', 'Handbook', 'SOP', 'Form', 'Circular', 'Guidelines'];

  // Category Color Map
  const categoryColors: Record<DocumentCategory, { bg: string; border: string; text: string; dot: string }> = {
    Policy: { bg: 'bg-rose-500/10', border: 'border-rose-500/50', text: 'text-rose-400', dot: 'bg-rose-500' },
    Regulation: { bg: 'bg-orange-500/10', border: 'border-orange-500/50', text: 'text-orange-400', dot: 'bg-orange-500' },
    Handbook: { bg: 'bg-amber-500/10', border: 'border-amber-500/50', text: 'text-amber-400', dot: 'bg-amber-500' },
    SOP: { bg: 'bg-blue-500/10', border: 'border-blue-500/50', text: 'text-blue-400', dot: 'bg-blue-500' },
    Form: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/50', text: 'text-emerald-400', dot: 'bg-emerald-500' },
    Circular: { bg: 'bg-purple-500/10', border: 'border-purple-500/50', text: 'text-purple-400', dot: 'bg-purple-500' },
    Guidelines: { bg: 'bg-teal-500/10', border: 'border-teal-500/50', text: 'text-teal-400', dot: 'bg-teal-500' },
  };

  // Node position calculation for radial/tree layout
  const getNodePosition = (index: number, total: number) => {
    // Layout in hierarchical layers or organized grid
    const cols = 3;
    const row = Math.floor(index / cols);
    const col = index % cols;
    const x = 120 + col * 260;
    const y = 80 + row * 170;
    return { x, y };
  };

  const isConnectedToSelected = (docId: string) => {
    if (!selectedDoc) return false;
    if (docId === selectedDoc.id) return true;
    return (
      selectedDoc.dependencies.includes(docId) ||
      selectedDoc.dependents.includes(docId) ||
      documents.find(d => d.id === docId)?.dependencies.includes(selectedDoc.id)
    );
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xl">
        <div className="max-w-4xl space-y-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              STAGE 03 OF 05
            </span>
            <span className="text-xs text-slate-400 font-medium tracking-wide">DOCUMENT RELATIONSHIP GRAPH</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Space_Grotesk'] leading-tight">
            Interactive Knowledge & Dependency Graph
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Universities run on deeply interconnected documents. Click any document node below to illuminate its upstream prerequisites and downstream ripple pathways across departments.
          </p>
        </div>
      </div>

      {/* Controls & Filters with relaxed padding */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 font-medium">
            <Filter className="w-4 h-4 text-slate-400" />
            <span>Filter Department:</span>
          </div>

          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="ALL">All Departments ({documents.length})</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          {/* Category Quick Chips */}
          <div className="hidden sm:flex items-center gap-2 ml-2">
            <button
              onClick={() => setHighlightedCategory('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                highlightedCategory === 'ALL' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All Types
            </button>
            {categories.slice(0, 5).map(cat => (
              <button
                key={cat}
                onClick={() => setHighlightedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  highlightedCategory === cat ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${categoryColors[cat].dot}`} />
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.1))}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-slate-400 px-2">{Math.round(zoomLevel * 100)}%</span>
          <button
            onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Reset Zoom"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas & Details Sidebar with generous gap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Graph Canvas */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-3xl p-6 overflow-auto min-h-[620px] relative shadow-2xl">
          {/* Background Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#4f46e5 1px, transparent 1px)`,
              backgroundSize: '28px 28px',
            }}
          />

          <div 
            className="relative min-w-[800px] min-h-[580px] transition-transform duration-200 origin-top-left"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* SVG Connecting Links */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <marker
                  id="arrow-active"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#f97316" />
                </marker>
                <marker
                  id="arrow-muted"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 2 L 8 5 L 0 8 z" fill="#334155" />
                </marker>
              </defs>

              {/* Render lines for all connections */}
              {documents.map((sourceDoc, sIdx) => {
                const sourcePos = getNodePosition(sIdx, documents.length);
                return sourceDoc.dependents.map((targetId) => {
                  const tIdx = documents.findIndex(d => d.id === targetId);
                  if (tIdx === -1) return null;
                  const targetPos = getNodePosition(tIdx, documents.length);

                  const isSourceSelected = selectedDoc?.id === sourceDoc.id;
                  const isTargetSelected = selectedDoc?.id === targetId;
                  const isActive = isSourceSelected || isTargetSelected;

                  return (
                    <g key={`${sourceDoc.id}->${targetId}`}>
                      <line
                        x1={sourcePos.x + 115}
                        y1={sourcePos.y + 48}
                        x2={targetPos.x + 115}
                        y2={targetPos.y + 48}
                        stroke={isActive ? '#f97316' : '#334155'}
                        strokeWidth={isActive ? '2.5' : '1.2'}
                        strokeDasharray={isActive ? 'none' : '4 3'}
                        markerEnd={isActive ? 'url(#arrow-active)' : 'url(#arrow-muted)'}
                        className="transition-all duration-300"
                      />
                    </g>
                  );
                });
              })}
            </svg>

            {/* Document Interactive Nodes */}
            {documents.map((doc, idx) => {
              const pos = getNodePosition(idx, documents.length);
              const isSelected = selectedDoc?.id === doc.id;
              const isConnected = isConnectedToSelected(doc.id);
              const colorInfo = categoryColors[doc.category] || categoryColors.Policy;
              
              const matchesDept = filterDepartment === 'ALL' || doc.department === filterDepartment;
              const matchesCat = highlightedCategory === 'ALL' || doc.category === highlightedCategory;
              const isMuted = !matchesDept || !matchesCat;

              return (
                <div
                  key={doc.id}
                  onClick={() => onSelectDocument(doc.id)}
                  style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
                  className={`absolute w-[230px] p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 shadow-lg ${
                    isSelected
                      ? 'bg-slate-900 border-orange-500 ring-2 ring-orange-500/40 shadow-orange-500/20 z-20 scale-105'
                      : isConnected && selectedDoc
                      ? 'bg-slate-900/95 border-blue-500/70 ring-1 ring-blue-500/30 z-10'
                      : isMuted
                      ? 'bg-slate-950/40 border-slate-900 opacity-40 hover:opacity-80'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:scale-[1.02]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-xs font-mono font-bold text-blue-400">
                      {doc.code}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${colorInfo.bg} ${colorInfo.text} border ${colorInfo.border}`}>
                      {doc.category}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-white leading-tight line-clamp-2">
                    {doc.title}
                  </h4>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                    <span className="truncate max-w-[130px]">{doc.department.split(' ')[0]}</span>
                    <span className="font-semibold text-orange-400">Health: {doc.healthScore}/100</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Node Inspector & Ripple Simulator Trigger */}
        <div className="lg:col-span-4 space-y-6">
          {selectedDoc ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-sm font-mono font-bold text-orange-400">
                  {selectedDoc.code}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {selectedDoc.category}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white leading-snug">{selectedDoc.title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{selectedDoc.summary}</p>
              </div>

              {/* Connected Network Summary */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Upstream Dependencies:</span>
                  <span className="font-bold text-white">{selectedDoc.dependencies.length} Documents</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Downstream Ripple Dependents:</span>
                  <span className="font-bold text-orange-400">{selectedDoc.dependents.length} Documents</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Extracted Parameter Rules:</span>
                  <span className="font-bold text-emerald-400">{selectedDoc.rules.length} Rules</span>
                </div>
              </div>

              {/* Direct Simulation CTA */}
              <button
                type="button"
                onClick={() => onTriggerChange(selectedDoc)}
                className="w-full py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <Flame className="w-4 h-4 text-white" />
                <span>Simulate Change on {selectedDoc.code}</span>
              </button>

              {/* Downstream Connected List */}
              {selectedDoc.dependents.length > 0 && (
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Direct Ripple Impact Chain:
                  </span>
                  <div className="space-y-2">
                    {selectedDoc.dependents.map((depId) => {
                      const dep = documents.find(d => d.id === depId);
                      if (!dep) return null;
                      return (
                        <div
                          key={depId}
                          onClick={() => onSelectDocument(depId)}
                          className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 hover:border-orange-500/50 cursor-pointer text-xs transition-colors flex items-center justify-between"
                        >
                          <div>
                            <span className="text-orange-400 font-mono font-bold text-xs block">{dep.code}</span>
                            <span className="text-slate-200 font-semibold">{dep.title}</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-500" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
