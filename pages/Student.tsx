
import React, { useState, useEffect, useRef } from 'react';
import { Headphones, WifiOff, FileText, BrainCircuit, Loader2, Download, History, Trash2, Tag, FileOutput, CheckCircle, X, Palette, Brain } from 'lucide-react';
import { generatePodcastScript, deepThinkingAnalysis, saveToHistory, getHistory } from '../services/geminiService';
import MarkdownText from '../components/MarkdownText';
import { Link } from 'react-router-dom';

const StudentPage: React.FC = () => {
  const [activeService, setActiveService] = useState<'PODCAST' | 'GENERAL'>('PODCAST');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHistory(getHistory('student_history'));
  }, []);

  const handleAction = async () => {
    if (!input) return;
    setLoading(true);
    setResult(null);
    try {
      let res;
      if (activeService === 'PODCAST') res = await generatePodcastScript(input, 'STUDENT');
      else res = await deepThinkingAnalysis(input, "Révision académique intensive");
      
      const entry = saveToHistory('student_history', { 
        type: activeService, 
        input: input.substring(0, 50), 
        text: res.text,
        tags: tags 
      });
      setResult(entry);
      setHistory(getHistory('student_history'));
      setTags([]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    window.print();
  };

  const addTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag('');
    }
  };

  return (
    <div className="pt-10 pb-20 px-4 max-w-6xl mx-auto min-h-screen">
      <div className="text-center mb-12 animate-slide-up">
        <h2 className="text-4xl font-serif font-bold text-white mb-4">Atelier de Réussite</h2>
        <p className="text-gray-400">Optimisez vos révisions avec l'IA.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* INPUT PANEL */}
        <div className="lg:col-span-2 space-y-8 animate-slide-up">
            
          {/* Quick Tools Access */}
          <div className="grid grid-cols-2 gap-4 mb-4">
              <Link to="/studio" className="bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/20 p-4 rounded-2xl flex items-center gap-3 hover:border-purple-500/50 transition-all group">
                  <div className="bg-purple-500/20 p-2 rounded-lg text-purple-400 group-hover:scale-110 transition-transform"><Palette size={20}/></div>
                  <div>
                      <h4 className="text-sm font-bold text-white">Studio Créatif</h4>
                      <p className="text-[10px] text-gray-400">Créer des schémas pour exposés</p>
                  </div>
              </Link>
              <Link to="/brain" className="bg-gradient-to-br from-blue-900/40 to-black border border-blue-500/20 p-4 rounded-2xl flex items-center gap-3 hover:border-blue-500/50 transition-all group">
                  <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400 group-hover:scale-110 transition-transform"><Brain size={20}/></div>
                  <div>
                      <h4 className="text-sm font-bold text-white">Cerveau Numérique</h4>
                      <p className="text-[10px] text-gray-400">Recherche approfondie (RAG)</p>
                  </div>
              </Link>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-white/10">
            <div className="flex gap-4 mb-8">
              <button 
                onClick={() => setActiveService('PODCAST')}
                className={`flex-1 py-3 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeService === 'PODCAST' ? 'bg-royalGold text-royalBlue border-royalGold' : 'bg-white/5 text-gray-500 border-white/10 hover:text-white'}`}
              >
                <Headphones size={18}/> Podcast
              </button>
              <button 
                onClick={() => setActiveService('GENERAL')}
                className={`flex-1 py-3 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeService === 'GENERAL' ? 'bg-royalGold text-royalBlue border-royalGold' : 'bg-white/5 text-gray-500 border-white/10 hover:text-white'}`}
              >
                <BrainCircuit size={18}/> Analyse Deep
              </button>
            </div>

            <textarea
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white h-48 focus:border-royalGold outline-none mb-6 placeholder-gray-600 resize-none"
              placeholder="Collez ici votre texte de cours ou vos notes..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-grow flex gap-2">
                <input 
                  type="text" 
                  placeholder="Ajouter un tag (ex: Maths, L3...)"
                  className="flex-grow bg-black/20 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-royalGold outline-none"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTag()}
                />
                <button onClick={addTag} className="bg-white/10 p-3 rounded-xl hover:bg-white/20 transition-colors"><Tag size={18} /></button>
              </div>
              <button 
                onClick={handleAction}
                disabled={loading || !input}
                className="bg-royalGold text-royalBlue font-black py-4 px-10 rounded-xl hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'LANCER'}
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((t, i) => (
                  <span key={i} className="bg-royalGold/10 text-royalGold text-[10px] font-bold px-3 py-1 rounded-full border border-royalGold/20 flex items-center gap-1">
                    #{t} <X size={10} className="cursor-pointer" onClick={() => setTags(tags.filter(tag => tag !== t))} />
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* RESULT AREA */}
          {result && (
            <div ref={printRef} className="glass-panel p-8 rounded-3xl border border-royalGold/30 animate-slide-up print:bg-white print:text-black">
              <div className="flex justify-between items-center mb-6 print:hidden">
                <h3 className="text-xl font-bold text-royalGold">Résultat Généré</h3>
                <button 
                  onClick={exportToPDF}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
                >
                  <FileOutput size={16} /> EXPORTER PDF
                </button>
              </div>
              <div className="prose prose-invert max-w-none print:prose-none">
                <MarkdownText content={result.text} />
              </div>
              {result.tags && result.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/5 flex gap-2 print:hidden">
                  {result.tags.map((t: string, i: number) => (
                    <span key={i} className="text-[10px] text-gray-500">#{t}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* SIDEBAR HISTORY */}
        <div className="lg:col-span-1 space-y-6 animate-slide-up">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 h-[600px] flex flex-col">
            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
              <History size={18} className="text-royalGold" /> Historique Local
            </h3>
            <div className="flex-grow overflow-y-auto space-y-4 custom-scrollbar pr-2">
              {history.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => setResult(item)}
                  className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-royalGold/30 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-royalGold uppercase">{item.type}</span>
                    <span className="text-[9px] text-gray-500">{new Date(item.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-300 truncate">{item.input}</p>
                  {item.tags && (
                    <div className="mt-2 flex gap-1">
                      {item.tags.map((t: string, ti: number) => (
                        <span key={ti} className="text-[8px] text-gray-600">#{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {history.length === 0 && <p className="text-center text-gray-600 py-10">Aucun historique.</p>}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; background: white !important; color: black !important; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .print:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default StudentPage;
