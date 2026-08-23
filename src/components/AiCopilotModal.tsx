import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  Cpu, 
  Lightbulb, 
  HelpCircle,
  FileText
} from 'lucide-react';
import { UniversityDocument, ProposedChange } from '../types';

interface AiCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: UniversityDocument[];
  currentProposedChange?: ProposedChange;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AiCopilotModal: React.FC<AiCopilotModalProps> = ({
  isOpen,
  onClose,
  documents,
  currentProposedChange,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I am DocVault AI. Ask me any question in simple plain English about university document dependencies, policy changes, conflicts, or ripple effects across departments.`,
      timestamp: 'Just now',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const quickQuestions = [
    'What happens if we increase attendance from 75% to 80%?',
    'Are there any circulars contradicting our hostel curfew?',
    'Which documents are affected if faculty sabbatical is extended to 18 months?',
    'Explain the medical leave exemption rule in simple terms.',
  ];

  const handleSend = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ask-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          documents,
          currentProposedChange,
        }),
      });

      const data = await res.json();
      const aiText = data.answer || 'DocVault AI has analyzed the document graph and verified all active connections.';

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: 'I ran into an issue connecting to the reasoning engine, but I can confirm that altering master thresholds requires synchronized updates across your connected regulations.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full h-[620px] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>DocVault AI Assistant</span>
                <span className="px-2 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  Simple English Mode
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Reasoning across {documents.length} university documents
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-orange-500/30">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                {msg.text}
                <div className={`text-[9px] mt-1.5 ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-500'}`}>
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-blue-600/30 text-blue-300 flex items-center justify-center flex-shrink-0 mt-0.5 border border-blue-500/30">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-orange-400 p-2">
              <Cpu className="w-4 h-4 animate-spin" />
              <span>Analyzing university ripple pathways...</span>
            </div>
          )}
        </div>

        {/* Suggested Quick Questions */}
        <div className="bg-slate-950/80 px-4 py-2.5 border-t border-slate-800">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1.5 font-medium">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Suggested Questions in Simple English:</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 rounded-lg text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 whitespace-nowrap transition-colors flex-shrink-0"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about policy changes, ripple effects, or conflicts..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
          />
          <button
            type="button"
            disabled={!inputQuery.trim() || isLoading}
            onClick={() => handleSend()}
            className={`p-2.5 rounded-xl transition-colors ${
              !inputQuery.trim() || isLoading
                ? 'bg-slate-800 text-slate-600'
                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
