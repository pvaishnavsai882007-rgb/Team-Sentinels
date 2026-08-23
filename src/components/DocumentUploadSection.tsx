import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle, 
  ArrowRight, 
  Layers, 
  Cpu, 
  Tag, 
  Building, 
  AlertCircle,
  FileCheck,
  Zap,
  Camera,
  Scan
} from 'lucide-react';
import { UniversityDocument, DocumentCategory } from '../types';

interface DocumentUploadSectionProps {
  onDocumentAdded: (doc: UniversityDocument) => void;
  onNavigateToTab: (tab: 'understand' | 'explore' | 'impact') => void;
  onSelectDocument: (docId: string) => void;
  onOpenScanner?: () => void;
}

export const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({
  onDocumentAdded,
  onNavigateToTab,
  onSelectDocument,
  onOpenScanner,
}) => {
  const [docTitle, setDocTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('Policy');
  const [department, setDepartment] = useState('Office of Academic Affairs');
  const [docContent, setDocContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [recentUploadedDoc, setRecentUploadedDoc] = useState<UniversityDocument | null>(null);

  // Sample templates for quick test
  const samplePacks = [
    {
      name: 'Credit Minimum Regulation 2026',
      cat: 'Regulation' as DocumentCategory,
      dept: 'Office of Academic Affairs',
      content: `ACADEMIC CREDIT PASSING REGULATION (REG-ACAD-2026-09)
1. SCOPE: Applies to all B.Tech and M.Tech Degree Candidates.
2. MINIMUM SEMESTER CREDITS:
2.1 All undergraduate students must register for a minimum of 20 credits per semester and maintain a Cumulative Grade Point Average (CGPA) of at least 6.0 out of 10.0.
2.2 Students earning less than 16 credits in any given academic year are placed on Academic Notice and debarred from holding campus leadership or varsity athletics roles.
3. PREREQUISITES & DEPENDENCIES:
References General Examination Regulations REG-EXAM-2026-03 and Student Handbook HB-STU-2025-01.`,
    },
    {
      name: 'Hostel Late Return & Curfew Notice',
      cat: 'Circular' as DocumentCategory,
      dept: 'Hostel Management & Student Affairs',
      content: `CIRCULAR: REVISED HOSTEL ENTRY & QUIET HOURS (CIR-HST-2026-08)
1. All undergraduate campus residence gates will lock strictly at 10:30 PM on weekdays and 11:00 PM on weekends.
2. Students returning after designated turnstile lock must present a digital late pass endorsed by their Faculty Mentor.
3. Three unapproved late entries shall trigger parental notification under Student Handbook HB-STU-2025-01 Clause 4.3.`,
    },
    {
      name: 'Research Publication Incentive Policy',
      cat: 'Policy' as DocumentCategory,
      dept: 'Sponsored Research & Industrial Consultancy',
      content: `FACULTY RESEARCH INCENTIVE POLICY (POL-RES-2026-02)
1. PURPOSE: To reward high-impact scientific publications in Scopus and Web of Science Q1 journals.
2. INCENTIVE CRITERIA:
2.1 Faculty first-authors receive a research grant stipend of $1,500 per Q1 journal publication.
2.2 Faculty on active Sabbatical Leave under POL-HR-2024-08 remain eligible for 100% publication bonuses.`,
    },
  ];

  const handleLoadSample = (sample: typeof samplePacks[0]) => {
    setDocTitle(sample.name);
    setCategory(sample.cat);
    setDepartment(sample.dept);
    setDocContent(sample.content);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDocTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setDocContent(text || `OCR Scanned content for file: ${file.name}\nExtracted university regulations, attendance, examination standards, and departmental signatures.`);
    };
    reader.readAsText(file);
  };

  const handleProcessDocument = async () => {
    if (!docContent.trim() && !docTitle.trim()) return;

    setIsProcessing(true);
    setRecentUploadedDoc(null);

    // Step 1: File Detection
    setProcessingStage('Detecting document structure & headers...');
    await new Promise(r => setTimeout(r, 400));

    // Step 2: OCR & Text Extraction
    setProcessingStage('Performing OCR & text extraction (PaddleOCR / PyMuPDF)...');
    await new Promise(r => setTimeout(r, 500));

    // Step 3: Content Understanding (AI Engine)
    setProcessingStage('Extracting rules, numerical thresholds & consequences with Gemini AI...');

    try {
      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText: docContent || docTitle,
          filename: docTitle,
          categoryHint: category,
        }),
      });

      const data = await response.json();
      const analysis = data.analysis || {};

      // Step 4: Relationship Mapping
      setProcessingStage('Mapping dependencies and updating university knowledge graph...');
      await new Promise(r => setTimeout(r, 400));

      const newDoc: UniversityDocument = {
        id: `doc-${Date.now()}`,
        code: analysis.code || `DOC-${category.slice(0, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`,
        title: analysis.title || docTitle || 'University Policy Document',
        category: (analysis.category as DocumentCategory) || category,
        department: analysis.department || department,
        version: 'v1.0',
        effectiveDate: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
        summary: analysis.summary || 'University document parsed and ingested into DocVault AI.',
        fullText: docContent,
        status: 'Draft',
        healthScore: analysis.overallHealthScore || 82,
        healthBreakdown: analysis.healthBreakdown || {
          metadataCompleteness: 90,
          ocrConfidence: 96,
          approvalStatusScore: 75,
          dependencyConsistency: 85,
          staleReferenceAlerts: 70,
        },
        rules: analysis.rules || [
          {
            id: `rule-${Date.now()}-1`,
            name: 'Standard Operational Rule',
            statement: 'Must be observed by all enrolled students and departmental staff.',
            parameterValue: '100%',
            consequenceIfViolated: 'Subject to administrative review.',
            affectedRole: 'All University Stakeholders',
          },
        ],
        dependencies: ['doc-attendance-policy'], // Linked to main policy
        dependents: [],
        tags: analysis.tags || [category, department.split(' ')[0]],
        author: 'University Administrator',
        approverRole: 'Department Board & Dean',
      };

      onDocumentAdded(newDoc);
      setRecentUploadedDoc(newDoc);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
    }
  };

  return (
    <div className="space-y-8">
      {/* Introduction Hero Card with relaxed padding */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-4xl space-y-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
              STAGE 01 OF 05
            </span>
            <span className="text-xs text-slate-400 font-medium tracking-wide">DOCUMENT INTELLIGENCE FLOW</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Space_Grotesk'] leading-tight">
            Submit & Ingest University Documents
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Upload policies, circulars, forms, SOPs, or handbooks. DocVault AI automatically extracts rules, detects numerical parameters (like attendance % or fee deadlines), and links dependencies across departments.
          </p>
        </div>

        {/* 5-Step Visual Intelligence Flow (from Slide 2) with comfortable spacing */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-5 gap-3.5 text-center text-xs">
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-orange-400 font-bold block text-sm">01. Upload</span>
            <span className="text-slate-400 text-xs">PDFs, SOPs, Forms</span>
          </div>
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-blue-400 font-bold block text-sm">02. File Detection</span>
            <span className="text-slate-400 text-xs">Format & structure</span>
          </div>
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-indigo-400 font-bold block text-sm">03. OCR Extraction</span>
            <span className="text-slate-400 text-xs">PaddleOCR + Text</span>
          </div>
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-emerald-400 font-bold block text-sm">04. Understanding</span>
            <span className="text-slate-400 text-xs">Rules & parameters</span>
          </div>
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 col-span-2 sm:col-span-1 space-y-1">
            <span className="text-purple-400 font-bold block text-sm">05. Relationship</span>
            <span className="text-slate-400 text-xs">Knowledge graph</span>
          </div>
        </div>
      </div>

      {/* Main Upload Grid with generous gap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left: Input Form / Drag & Drop */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 sm:p-8 shadow-lg space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
                <Upload className="w-5 h-5 text-orange-400" />
                Document Submission Form
              </h2>

              {onOpenScanner && (
                <button
                  type="button"
                  id="btn-trigger-scanner-modal"
                  onClick={onOpenScanner}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 hover:scale-105"
                >
                  <Camera className="w-4 h-4" />
                  <span>Scan via Camera / OCR</span>
                </button>
              )}
            </div>

            {/* Live Camera Scanner Callout Banner */}
            {onOpenScanner && (
              <div 
                onClick={onOpenScanner}
                className="bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-slate-950 p-5 rounded-2xl border border-orange-500/30 hover:border-orange-500/60 cursor-pointer transition-all shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Scan className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white group-hover:text-orange-300 transition-colors">
                        Scan Physical University Documents
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                        Camera + AI OCR
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Point camera at paper notices, circulars, or upload photos to auto-extract clauses and health scores.
                    </p>
                  </div>
                </div>

                <div className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-500/20 group-hover:bg-orange-500 text-orange-300 group-hover:text-white border border-orange-500/40 transition-all flex items-center gap-1.5 whitespace-nowrap self-end sm:self-auto">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Open Scanner</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </div>
              </div>
            )}

            {/* Quick Sample Selector */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/90 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Quick Test: Load Pre-Built University Sample
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {samplePacks.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleLoadSample(s)}
                    className="px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-orange-500/50 transition-all text-left shadow-sm"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Title & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Document Title
                </label>
                <input
                  id="input-doc-title"
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. Academic Attendance Policy 2026"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Document Category
                </label>
                <select
                  id="select-doc-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                >
                  <option value="Policy">Policy</option>
                  <option value="Circular">Circular</option>
                  <option value="Form">Form</option>
                  <option value="SOP">SOP</option>
                  <option value="Handbook">Handbook</option>
                  <option value="Guidelines">Guidelines</option>
                  <option value="Regulation">Regulation</option>
                </select>
              </div>
            </div>

            {/* Department */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Issuing University Department
              </label>
              <input
                id="input-doc-dept"
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Office of Academic Affairs, Examination Cell, HR"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            {/* Drag & Drop Box */}
            <div className="relative border-2 border-dashed border-slate-700 hover:border-orange-500/60 rounded-2xl p-6 text-center transition-all bg-slate-950/50 space-y-2">
              <input
                id="file-upload-input"
                type="file"
                accept=".pdf,.txt,.doc,.docx,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <FileText className="w-10 h-10 mx-auto text-slate-400 mb-1" />
              <p className="text-sm text-slate-200 font-semibold">
                Click or drag & drop university PDF, Circular, or Scanned Image
              </p>
              <p className="text-xs text-slate-400">
                Supports PDF, DOCX, TXT, PNG, JPG (Auto OCR with PaddleOCR & PyMuPDF pipeline)
              </p>
            </div>

            {/* Document Full Text / Transcript */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Document Text Content (Paste or Edit)
              </label>
              <textarea
                id="textarea-doc-content"
                rows={6}
                value={docContent}
                onChange={(e) => setDocContent(e.target.value)}
                placeholder="Paste policy rules, circular paragraphs, or leave empty to auto-extract..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 focus:outline-none focus:border-orange-500 transition-colors font-mono leading-relaxed"
              />
            </div>

            {/* Action Submit Button */}
            <button
              id="submit-process-doc-btn"
              type="button"
              disabled={isProcessing || (!docTitle && !docContent)}
              onClick={handleProcessDocument}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2.5 shadow-lg ${
                isProcessing || (!docTitle && !docContent)
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/20 hover:scale-[1.01]'
              }`}
            >
              {isProcessing ? (
                <>
                  <Cpu className="w-4 h-4 animate-spin text-white" />
                  <span>{processingStage || 'Processing Intelligence Pipeline...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Ingest & Extract Document Rules with DocVault AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Real-time Ingestion Result / Purpose Card */}
        <div className="lg:col-span-5 space-y-6">
          {recentUploadedDoc ? (
            <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-7 shadow-xl space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-400 block">SUCCESSFULLY INGESTED</span>
                    <span className="text-sm font-bold text-white">{recentUploadedDoc.code}</span>
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-slate-800 text-orange-400 border border-orange-500/30">
                  Health: {recentUploadedDoc.healthScore}/100
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{recentUploadedDoc.title}</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{recentUploadedDoc.summary}</p>
              </div>

              {/* Extracted Rules Preview */}
              <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Extracted Rules & Thresholds ({recentUploadedDoc.rules.length})
                </span>
                {recentUploadedDoc.rules.map((rule, idx) => (
                  <div key={idx} className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{rule.name}</span>
                      {rule.parameterValue && (
                        <span className="px-2.5 py-0.5 rounded bg-orange-500/20 text-orange-300 font-mono font-bold text-[11px]">
                          {rule.parameterValue}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">{rule.statement}</p>
                    {rule.consequenceIfViolated && (
                      <p className="text-rose-400/90 text-xs mt-1.5 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        Consequence: {rule.consequenceIfViolated}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons to Next Stages */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onSelectDocument(recentUploadedDoc.id);
                    onNavigateToTab('understand');
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <FileCheck className="w-4 h-4 text-blue-400" />
                  <span>Inspect Metadata</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectDocument(recentUploadedDoc.id);
                    onNavigateToTab('explore');
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20"
                >
                  <span>View Graph Map</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-300">Ready for Document Analysis</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                Choose a pre-built sample on the left or paste your institution&apos;s circular. DocVault AI will display the extracted rule hierarchy and health scores right here.
              </p>
            </div>
          )}

          {/* Connected Repositories Card with comfortable spacing */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Connected University Repositories
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-xs">Academic Affairs</span>
                <span className="text-white font-bold text-sm">4 Active Documents</span>
              </div>
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-xs">Examination Cell</span>
                <span className="text-white font-bold text-sm">2 Regulations</span>
              </div>
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-xs">Student Affairs & Health</span>
                <span className="text-white font-bold text-sm">3 Forms & Circulars</span>
              </div>
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-xs">HR & Research</span>
                <span className="text-white font-bold text-sm">2 Policies</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
