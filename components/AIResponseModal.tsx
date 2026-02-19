import React from 'react';
import { X, Sparkles, Bot } from 'lucide-react';

interface AIResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const AIResponseModal: React.FC<AIResponseModalProps> = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl p-0 overflow-hidden relative animate-in fade-in zoom-in duration-300 border border-slate-200">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 flex justify-between items-start">
           <div className="flex items-center gap-3">
              <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-lg">
                 <Bot className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-white">{title}</h2>
           </div>
           <button 
             onClick={onClose}
             className="text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
           >
             <X className="w-5 h-5" />
           </button>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto">
           <div className="prose prose-slate prose-sm max-w-none">
              <div className="text-slate-700 text-base leading-relaxed whitespace-pre-wrap font-medium">
                {content}
              </div>
           </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
           <button
             onClick={onClose}
             className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2"
           >
             <Sparkles className="w-4 h-4 text-emerald-400" />
             Got it
           </button>
        </div>
      </div>
    </div>
  );
};

export default AIResponseModal;