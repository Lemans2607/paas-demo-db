
import React, { useState, useEffect } from 'react';
import { Rocket, Landmark, Users, TrendingUp, CloudUpload, History, FileOutput, Tag, X, Loader2, FileText, CheckCircle, ShieldCheck, Zap, FolderKanban, Eye, EyeOff, BrainCircuit } from 'lucide-react';
import { analyzeTender, generatePitchDeck, saveToHistory, getHistory } from '../services/geminiService';
import MarkdownText from '../components/MarkdownText';

const SMEPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'STARTUP' | 'INSTITUTION' | 'TONTINE'>('STARTUP');
  
  // State for General Inputs
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [showHistory, setShowHistory] = useState(true);

  // --- INSTITUTION STATE ---
  const [daoMode, setDaoMode] = useState<'EXPRESS' | 'PROJECT'>('EXPRESS'); // Toggle between Text Analysis and Project flow
  const [daoStep, setDaoStep] = useState<'CREATE' | 'UPLOAD' | 'ANALYZE' | 'RESULTS'>('CREATE');
  const [daoDetails, setDaoDetails] = useState({ title: '', budget: '', deadline: '' });
  const [smeFiles, setSmeFiles] = useState<File[]>([]);
  const [daoAnalysisResult, setDaoAnalysisResult] = useState<any>(null);

  // --- TONTINE STATE ---
  const [tontineMembers] = useState([
      { id: 1, name: "Moussa Ent.", contribution: 100, status: "PAID", amount: 250000, lastDate: "12/10/2025" },
      { id: 2, name: "Sophie BTP", contribution: 100, status: "PAID", amount: 250000, lastDate: "12/10/2025" },
      { id: 3, name: "Jean Tech", contribution: 60, status: "PARTIAL", amount: 150000, lastDate: "10/09/2025" },
      { id: 4, name: "Marie Co.", contribution: 0, status: "LATE", amount: 0, lastDate: "-" },
  ]);
  const totalPot = tontineMembers.reduce((acc, curr) => acc + curr.amount, 0);

  useEffect(() => {
    setHistory(getHistory('sme_history'));
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'INSTITUTION') setActiveTab('INSTITUTION');
    if (tabParam === 'TONTINE') setActiveTab('TONTINE');
  }, []);

  const handleAction = async () => {
    if (!input && activeTab === 'STARTUP') return;
    setLoading(true);
    setResult(null);
    try {
      let res;
      if (activeTab === 'STARTUP') res = await generatePitchDeck(input);
      else if (activeTab === 'INSTITUTION') {
           // Deep Analysis Logic
           res = await analyzeTender(input || "Analyse Approfondie DAO"); 
      }
      
      const entry = saveToHistory('sme_history', { 
        type: activeTab, 
        input: input.substring(0, 50), 
        text: res.text,
        tags: tags 
      });
      setResult(entry);
      setHistory(getHistory('sme_history'));
      setTags([]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = (item: any) => {
      setActiveTab(item.type as any);
      setResult(item);
      if (item.type === 'INSTITUTION') {
          setDaoMode('EXPRESS'); // Ensure we are in the correct mode to see the text result
      }
  };

  const runDaoProjectAnalysis = () => {
      setLoading(true);
      setTimeout(() => {
          setDaoAnalysisResult({
              compliant: 3,
              total: smeFiles.length || 5,
              details: [
                  { name: "Sogetra Sarl", status: "OK", score: 95 },
                  { name: "Batimex", status: "OK", score: 88 },
                  { name: "Alpha Construct", status: "FAIL", score: 45, reason: "Manque CNPS" }
              ]
          });
          setDaoStep('RESULTS');
          setLoading(false);
      }, 3000);
  };

  const addTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag('');
    }
  };

  return (
    <div className="pt-10 pb-20 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-12 animate-slide-up">
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-2">PME & Institutions</h2>
        <p className="text-gray-400">Hub Business : Marchés Publics, Financement & Tontine 2.0</p>
      </div>

      <div className={`grid grid-cols-1 ${showHistory ? 'lg:grid-cols-4' : 'lg:grid-cols-1'} gap-12`}>
        {/* MAIN PANEL */}
        <div className={`${showHistory ? 'lg:col-span-3' : 'lg:col-span-1'} space-y-8 animate-slide-up`}>
          {/* TABS & CONTROLS */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex flex-wrap gap-2 bg-white/5 p-1 rounded-2xl border border-white/10 w-fit mx-auto lg:mx-0">
                <button 
                  onClick={() => { setActiveTab('STARTUP'); setResult(null); }}
                  className={`px-4 py-3 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'STARTUP' ? 'bg-royalGold text-royalBlue shadow-lg' : 'text-gray-500 hover:text-white'}`}
                >
                  <Rocket size={16} /> STARTUP
                </button>
                <button 
                  onClick={() => { setActiveTab('INSTITUTION'); setResult(null); }}
                  className={`px-4 py-3 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'INSTITUTION' ? 'bg-royalGold text-royalBlue shadow-lg' : 'text-gray-500 hover:text-white'}`}
                >
                  <Landmark size={16} /> DAO / MARCHÉS
                </button>
                <button 
                  onClick={() => { setActiveTab('TONTINE'); setResult(null); }}
                  className={`px-4 py-3 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'TONTINE' ? 'bg-royalGold text-royalBlue shadow-lg' : 'text-gray-500 hover:text-white'}`}
                >
                  <Users size={16} /> TONTINE
                </button>
              </div>

              <button 
                onClick={() => setShowHistory(!showHistory)}
                className="hidden lg:flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white bg-white/5 px-3 py-2 rounded-lg transition-colors border border-white/5 hover:border-white/20"
              >
                 {showHistory ? <EyeOff size={16}/> : <Eye size={16}/>}
                 {showHistory ? 'Masquer Historique' : 'Afficher Historique'}
              </button>
          </div>

          {activeTab === 'TONTINE' ? (
              /* --- TONTINE DASHBOARD --- */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in">
                   <div className="glass-panel p-8 rounded-3xl border border-white/10">
                       <div className="flex justify-between items-center mb-6">
                           <h3 className="text-xl font-bold text-white flex items-center gap-2">
                               <TrendingUp className="text-royalGold" /> État du Pot
                           </h3>
                           <div className="text-right">
                               <p className="text-xs text-gray-500 uppercase">Cycle Octobre</p>
                               <p className="text-2xl font-mono font-bold text-white">{totalPot.toLocaleString()} XAF</p>
                           </div>
                       </div>
                       
                       {/* Visual Graph Bar */}
                       <div className="flex items-end gap-4 h-48 mb-8 px-4 border-b border-white/10 pb-4">
                           {tontineMembers.map((m, i) => (
                               <div key={i} className="flex-1 flex flex-col justify-end group relative items-center">
                                   <div className="text-xs text-center text-white mb-2 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 w-full bg-black/80 rounded py-1 border border-white/10">{m.amount.toLocaleString()}</div>
                                   <div 
                                        className={`w-full max-w-[40px] rounded-t-lg transition-all duration-1000 ${m.status === 'PAID' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : m.status === 'LATE' ? 'bg-red-500' : 'bg-yellow-500'}`}
                                        style={{height: `${Math.max(10, m.contribution)}%`}}
                                   ></div>
                                   <div className="text-[10px] text-gray-400 text-center mt-3 truncate w-full">{m.name.split(' ')[0]}</div>
                               </div>
                           ))}
                       </div>
                   </div>

                   <div className="glass-panel p-0 rounded-3xl border border-white/10 overflow-hidden flex flex-col">
                       <div className="p-6 bg-white/5 border-b border-white/5 flex justify-between items-center">
                           <h3 className="text-lg font-bold text-white flex items-center gap-2">
                               <Users className="text-blue-400" size={18} /> Membres
                           </h3>
                           <button className="text-xs bg-royalGold/10 text-royalGold px-3 py-1 rounded-full border border-royalGold/20 hover:bg-royalGold hover:text-royalBlue transition-colors">+ Ajouter</button>
                       </div>
                       <div className="flex-grow overflow-y-auto">
                           <table className="w-full text-left text-sm text-gray-400">
                               <thead className="bg-black/20 text-xs uppercase text-gray-500">
                                   <tr>
                                       <th className="px-6 py-3">Nom</th>
                                       <th className="px-6 py-3">Statut</th>
                                       <th className="px-6 py-3 text-right">Montant</th>
                                   </tr>
                               </thead>
                               <tbody className="divide-y divide-white/5">
                                   {tontineMembers.map((m, i) => (
                                       <tr key={i} className="hover:bg-white/5 transition-colors">
                                           <td className="px-6 py-4 font-bold text-white">{m.name}</td>
                                           <td className="px-6 py-4">
                                               <span className={`px-2 py-1 rounded text-[10px] font-bold ${m.status === 'PAID' ? 'bg-green-500/20 text-green-400' : m.status === 'LATE' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                   {m.status}
                                               </span>
                                           </td>
                                           <td className="px-6 py-4 text-right font-mono text-gray-300">{m.amount.toLocaleString()}</td>
                                       </tr>
                                   ))}
                               </tbody>
                           </table>
                       </div>
                   </div>
              </div>
          ) : activeTab === 'INSTITUTION' ? (
              /* --- INSTITUTION PARENT CONTAINER --- */
              <div className="animate-in fade-in">
                  
                  {/* SUB-TABS (Toggle Express vs Project) */}
                  <div className="flex justify-center mb-8">
                       <div className="bg-black/40 border border-white/10 p-1 rounded-xl flex gap-2">
                           <button 
                               onClick={() => setDaoMode('EXPRESS')}
                               className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${daoMode === 'EXPRESS' ? 'bg-royalGold text-royalBlue shadow' : 'text-gray-500 hover:text-white'}`}
                           >
                               <BrainCircuit size={14} /> Analyse Express (Texte/PDF)
                           </button>
                           <button 
                               onClick={() => setDaoMode('PROJECT')}
                               className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${daoMode === 'PROJECT' ? 'bg-blue-500 text-white shadow' : 'text-gray-500 hover:text-white'}`}
                           >
                               <FolderKanban size={14} /> Mode Projet (Workflow)
                           </button>
                       </div>
                  </div>

                  {daoMode === 'EXPRESS' ? (
                      /* --- EXPRESS/DEEP ANALYSIS MODE (RESTORED) --- */
                      <div className="glass-panel p-8 rounded-3xl border border-white/10">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-royalGold/10 rounded-xl text-royalGold">
                                <BrainCircuit />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Analyseur DAO Profond</h3>
                                <p className="text-xs text-gray-500">Copiez le texte du DAO pour un audit immédiat de conformité.</p>
                            </div>
                          </div>

                          <textarea
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white h-64 focus:border-royalGold outline-none mb-6 placeholder-gray-600 resize-none"
                            placeholder="Collez ici l'intégralité du texte de l'Appel d'Offres (Copier-Coller depuis PDF)..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                          />

                          <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <button 
                                onClick={handleAction}
                                disabled={loading || !input}
                                className="w-full bg-royalGold text-royalBlue font-black py-4 px-12 rounded-xl hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : 'LANCER L\'AUDIT EXPERT'}
                            </button>
                          </div>
                      </div>
                  ) : (
                      /* --- PROJECT WORKFLOW MODE --- */
                      <div className="glass-panel p-8 rounded-3xl border border-white/10 animate-in fade-in">
                          {/* PROGRESS BAR */}
                          <div className="flex justify-between items-center mb-10 relative">
                              <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 -z-0"></div>
                              {['CREATE', 'UPLOAD', 'ANALYZE', 'RESULTS'].map((step, i) => {
                                  const isActive = ['CREATE', 'UPLOAD', 'ANALYZE', 'RESULTS'].indexOf(daoStep) >= i;
                                  return (
                                      <div key={step} className={`relative z-10 flex flex-col items-center gap-2 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isActive ? 'bg-royalGold text-royalBlue' : 'bg-black border border-white/20'}`}>
                                              {i + 1}
                                          </div>
                                          <span className="text-[10px] font-bold tracking-widest">{step}</span>
                                      </div>
                                  )
                              })}
                          </div>

                          {daoStep === 'CREATE' && (
                              <div className="space-y-6 max-w-lg mx-auto">
                                  <h3 className="text-2xl font-bold text-white text-center mb-6">Nouveau Marché Public</h3>
                                  <div className="space-y-4">
                                      <div>
                                          <label className="text-xs text-gray-500 uppercase font-bold block mb-2">Intitulé du DAO</label>
                                          <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-royalGold outline-none" placeholder="Ex: Construction Route Douala-Est" value={daoDetails.title} onChange={e => setDaoDetails({...daoDetails, title: e.target.value})} />
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <label className="text-xs text-gray-500 uppercase font-bold block mb-2">Budget (FCFA)</label>
                                            <input type="number" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-royalGold outline-none" placeholder="50 000 000" value={daoDetails.budget} onChange={e => setDaoDetails({...daoDetails, budget: e.target.value})} />
                                          </div>
                                          <div>
                                            <label className="text-xs text-gray-500 uppercase font-bold block mb-2">Date Limite</label>
                                            <input type="date" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-royalGold outline-none" value={daoDetails.deadline} onChange={e => setDaoDetails({...daoDetails, deadline: e.target.value})} />
                                          </div>
                                      </div>
                                      <button onClick={() => setDaoStep('UPLOAD')} className="w-full bg-royalGold text-royalBlue font-bold py-4 rounded-xl mt-4 hover:shadow-lg transition-all">CRÉER L'APPEL D'OFFRES</button>
                                  </div>
                              </div>
                          )}

                          {daoStep === 'UPLOAD' && (
                              <div className="text-center py-10">
                                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-white/20">
                                      <CloudUpload size={40} className="text-gray-400" />
                                  </div>
                                  <h3 className="text-xl font-bold text-white mb-2">Téléversement Dossiers PME</h3>
                                  <p className="text-gray-400 text-sm mb-8">Glissez les dossiers PDF reçus des soumissionnaires.</p>
                                  <button onClick={() => { setSmeFiles([new File([""], "dummy.pdf")]); setDaoStep('ANALYZE'); }} className="bg-white/10 border border-white/20 text-white px-8 py-3 rounded-xl hover:bg-white/20 transition-all font-bold">
                                      SIMULER UPLOAD (5 DOSSIERS)
                                  </button>
                              </div>
                          )}

                          {daoStep === 'ANALYZE' && (
                              <div className="text-center py-10">
                                  {loading ? (
                                      <div className="flex flex-col items-center">
                                          <Loader2 size={64} className="text-royalGold animate-spin mb-6" />
                                          <h3 className="text-xl font-bold text-white mb-2">Analyse IA en cours...</h3>
                                          <p className="text-gray-400 text-sm">Vérification CNPS, Fisc, Technique.</p>
                                      </div>
                                  ) : (
                                      <div className="flex flex-col items-center">
                                          <ShieldCheck size={64} className="text-green-500 mb-6" />
                                          <h3 className="text-xl font-bold text-white mb-6">Dossiers Prêts pour Analyse</h3>
                                          <button onClick={runDaoProjectAnalysis} className="bg-royalGold text-royalBlue px-10 py-4 rounded-xl font-black hover:scale-105 transition-transform shadow-[0_0_30px_rgba(240,185,11,0.3)]">
                                              LANCER L'AUDIT AUTOMATIQUE
                                          </button>
                                      </div>
                                  )}
                              </div>
                          )}

                          {daoStep === 'RESULTS' && daoAnalysisResult && (
                              <div className="animate-in slide-in-from-bottom-4">
                                  <div className="flex justify-between items-end mb-6 border-b border-white/10 pb-6">
                                      <div>
                                          <h3 className="text-2xl font-bold text-white mb-1">Résultats de Conformité</h3>
                                          <p className="text-sm text-gray-400">Marché : {daoDetails.title || "Route Douala-Est"}</p>
                                      </div>
                                      <div className="text-right">
                                          <p className="text-xs text-gray-500 uppercase font-bold">Taux de Conformité</p>
                                          <p className="text-3xl font-mono text-green-400 font-bold">{(daoAnalysisResult.compliant / daoAnalysisResult.total * 100).toFixed(0)}%</p>
                                      </div>
                                  </div>

                                  <div className="space-y-3">
                                      {daoAnalysisResult.details.map((res: any, i: number) => (
                                          <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-royalGold/30 transition-colors">
                                              <div className="flex items-center gap-4">
                                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${res.status === 'OK' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                                      {res.score}
                                                  </div>
                                                  <div>
                                                      <p className="font-bold text-white">{res.name}</p>
                                                      <p className="text-xs text-gray-500">{res.reason || "Dossier Complet"}</p>
                                                  </div>
                                              </div>
                                              <div className="flex gap-2">
                                                  <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400"><FileText size={16}/></button>
                                                  <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400"><CheckCircle size={16}/></button>
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                                  
                                  <div className="mt-8 flex gap-4">
                                      <button onClick={() => window.print()} className="flex-1 bg-white/5 border border-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/10 flex items-center justify-center gap-2">
                                          <FileOutput size={18}/> EXPORTER PDF
                                      </button>
                                      <button onClick={() => setDaoStep('CREATE')} className="flex-1 bg-royalGold/10 text-royalGold font-bold py-3 rounded-xl hover:bg-royalGold hover:text-royalBlue transition-colors">
                                          NOUVELLE ANALYSE
                                      </button>
                                  </div>
                              </div>
                          )}
                      </div>
                  )}
              </div>
          ) : (
            /* --- STARTUP PITCH GENERATOR --- */
            <div className="glass-panel p-8 rounded-3xl border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-royalGold/10 rounded-xl text-royalGold">
                    <Rocket />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">Générateur de Pitch Deck</h3>
                    <p className="text-xs text-gray-500">Prêt en 24h pour vos investisseurs.</p>
                </div>
                </div>

                <textarea
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white h-64 focus:border-royalGold outline-none mb-6 placeholder-gray-600 resize-none"
                placeholder="Décrivez votre projet, votre marché et vos besoins financiers..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                />

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-grow flex gap-2">
                    <input 
                    type="text" 
                    placeholder="Tag (ex: Agro, BTP, Lancement...)"
                    className="flex-grow bg-black/20 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-royalGold outline-none"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTag()}
                    />
                    <button onClick={addTag} className="bg-white/10 p-3 rounded-xl hover:bg-white/20"><Tag size={18} /></button>
                </div>
                <button 
                    onClick={handleAction}
                    disabled={loading || !input}
                    className="bg-royalGold text-royalBlue font-black py-4 px-12 rounded-xl hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" /> : 'GÉNÉRER MON PITCH'}
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
          )}

          {result && activeTab !== 'TONTINE' && (activeTab !== 'INSTITUTION' || daoMode === 'EXPRESS') && (
            <div className="glass-panel p-8 rounded-3xl border border-royalGold/30 animate-slide-up">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-royalGold">RÉSULTAT GÉNÉRÉ</h3>
                <button onClick={() => window.print()} className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all">
                  <FileOutput size={16} /> EXPORTER PDF
                </button>
              </div>
              <div className="prose prose-invert max-w-none">
                <MarkdownText content={result.text} />
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR HISTORY */}
        {showHistory && (
          <div className="lg:col-span-1 space-y-6 animate-slide-up">
            <div className="glass-panel p-6 rounded-3xl border border-white/10 h-[600px] flex flex-col">
              <h3 className="font-bold text-white mb-6 flex items-center gap-2 uppercase text-xs tracking-widest">
                <History size={18} className="text-royalGold" /> Archive Business
              </h3>
              <div className="flex-grow overflow-y-auto space-y-4 custom-scrollbar pr-2">
                {history.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => handleHistoryClick(item)}
                    className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-royalGold/30 transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[9px] font-bold text-royalGold uppercase">{item.type}</span>
                      <span className="text-[8px] text-gray-600">{new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-gray-300 truncate">{item.input}</p>
                  </div>
                ))}
                {history.length === 0 && <p className="text-center text-gray-600 mt-10 text-sm">Aucun historique.</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SMEPage;
