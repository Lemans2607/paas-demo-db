import React, { useState, useEffect } from 'react';
import { FileText, Loader, Users, Search, MapPin, Image as ImageIcon, ShieldCheck, LayoutTemplate, HelpCircle, X, Globe, DollarSign } from 'lucide-react';
import { analyzeTender, generatePitchDeck, analyzeChaos, generateMarketingAsset, marketResearch, findLocalResources } from '../services/geminiService';

const TutorialTip: React.FC<{targetId: string, text: string, step: number, total: number, onNext: () => void, onClose: () => void}> = ({ targetId, text, step, total, onNext, onClose }) => {
    return (
        <div className="absolute z-50 w-64 glass-panel p-4 rounded-xl border-royalGold border shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-slide-up"
             style={{
                 top: document.getElementById(targetId)?.offsetTop ? document.getElementById(targetId)!.offsetTop + 60 : '20%',
                 left: document.getElementById(targetId)?.offsetLeft ? document.getElementById(targetId)!.offsetLeft : '50%',
             }}
        >
            <div className="flex justify-between items-start mb-2">
                <span className="text-royalGold text-xs font-bold uppercase">Guide PME {step}/{total}</span>
                <button onClick={onClose}><X size={14} className="text-gray-400 hover:text-white"/></button>
            </div>
            <p className="text-sm text-white mb-4">{text}</p>
            <button onClick={onNext} className="w-full bg-royalGold text-royalBlue font-bold text-xs py-2 rounded hover:bg-white transition-colors">
                Suivant
            </button>
        </div>
    );
}

const SMEPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'DAO' | 'PITCH' | 'MARKETING'>('DAO');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null); 
  const [imgSize, setImgSize] = useState<'1K' | '2K' | '4K'>('1K');

  // Tutorial State
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem('seenSMETutorial');
    if (hasSeen) setShowTutorial(false);
  }, []);

  const handleNextTutorial = () => {
      if (tutorialStep >= 2) {
          setShowTutorial(false);
          sessionStorage.setItem('seenSMETutorial', 'true');
      } else {
          setTutorialStep(prev => prev + 1);
      }
  };

  const handleAction = async () => {
      setLoading(true);
      setResult(null);
      try {
          if (activeTab === 'DAO') {
              const res = await analyzeTender(input);
              setResult({ type: 'text', content: res });
          } else if (activeTab === 'PITCH') {
              const res = await generatePitchDeck(input);
              setResult({ type: 'text', content: res });
          } else if (activeTab === 'MARKETING') {
              if (input.startsWith("SEARCH:")) {
                  const res = await marketResearch(input.replace("SEARCH:", ""));
                  setResult({ type: 'grounding', content: res.text, sources: res.sources });
              } else if (input.startsWith("FAQ:")) {
                  const res = await analyzeChaos(input, "Génère une FAQ commerciale et un script de vente pour ce produit.");
                  setResult({ type: 'text', content: res });
              } else {
                  const res = await generateMarketingAsset(input, imgSize);
                  setResult({ type: 'image', content: res });
              }
          }
      } catch (e) {
          setResult({ type: 'text', content: "Mode Hors Ligne : Bascule sur le modèle local (Archives)... [Simulation de réponse locale]" });
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="pt-10 pb-20 px-4 max-w-6xl mx-auto relative min-h-screen">
       
       {/* Tutorial Overlay */}
      {showTutorial && <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setShowTutorial(false)}></div>}
      {showTutorial && tutorialStep === 0 && (
          <TutorialTip 
            targetId="sme-tabs" 
            text="Accédez aux services phares : DAO Express, Pitch Deck Pro et Marketing/FAQ." 
            step={1} total={3} onNext={handleNextTutorial} onClose={() => setShowTutorial(false)}
          />
      )}
      {showTutorial && tutorialStep === 1 && (
          <TutorialTip 
            targetId="sme-input" 
            text="Pour le DAO, collez le texte de l'appel d'offre. Pour le Pitch, vos notes en vrac." 
            step={2} total={3} onNext={handleNextTutorial} onClose={() => setShowTutorial(false)}
          />
      )}
      {showTutorial && tutorialStep === 2 && (
          <TutorialTip 
            targetId="sme-btn" 
            text="L'IA 'Lion de la Clarté' va structurer l'information pour minimiser vos risques." 
            step={3} total={3} onNext={handleNextTutorial} onClose={() => setShowTutorial(false)}
          />
      )}

       <div className="text-center mb-10 animate-slide-up">
            <h2 className="text-4xl font-serif font-bold text-white mb-2">Espace PME & Marchés</h2>
            <p className="text-gray-400">Services de clarté pour entrepreneurs exigeants.</p>
       </div>

       {/* Tabs */}
       <div id="sme-tabs" className="flex flex-wrap justify-center gap-4 mb-12 animate-slide-up" style={{animationDelay: '0.1s'}}>
            {['DAO', 'PITCH', 'MARKETING'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => { setActiveTab(tab as any); setResult(null); }}
                    className={`px-6 py-3 rounded-xl text-sm font-bold border transition-all duration-300 ${
                        activeTab === tab 
                        ? 'bg-royalGold text-royalBlue border-royalGold shadow-lg scale-105' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/30'
                    }`}
                >
                    {tab === 'DAO' && <span className="flex items-center gap-2"><ShieldCheck size={16}/> DAO Express</span>}
                    {tab === 'PITCH' && <span className="flex items-center gap-2"><LayoutTemplate size={16}/> Pitch Deck Pro</span>}
                    {tab === 'MARKETING' && <span className="flex items-center gap-2"><HelpCircle size={16}/> Marketing & FAQ</span>}
                </button>
            ))}
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Panel: Inputs */}
            <div className="glass-panel p-8 rounded-3xl border border-white/10 animate-slide-up" style={{animationDelay: '0.2s'}}>
                
                <h3 className="text-xl font-bold text-white mb-4">
                    {activeTab === 'DAO' && 'Analyseur d\'Appels d\'Offres'}
                    {activeTab === 'PITCH' && 'Générateur de Présentation'}
                    {activeTab === 'MARKETING' && 'Studio Marketing & Vente'}
                </h3>
                
                <p className="text-sm text-gray-400 mb-6">
                    {activeTab === 'DAO' && "Détectez instantanément les risques et pièces manquantes. Conformité BTP garantie."}
                    {activeTab === 'PITCH' && "Transformez vos notes en vrac en une structure de 10 slides convaincantes pour la banque."}
                    {activeTab === 'MARKETING' && "Créez des FAQs, scripts de vente WhatsApp ou visuels publicitaires."}
                </p>

                {activeTab === 'MARKETING' && (
                    <div className="flex gap-3 mb-4 p-3 bg-white/5 rounded-xl">
                         <div className="text-[10px] text-gray-400 flex items-center leading-tight">
                            Commandes: "SEARCH:" (Recherche), "FAQ:" (Script Vente), ou Description Image.
                        </div>
                    </div>
                )}

                <div id="sme-input">
                    <textarea 
                        className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-white h-48 mb-6 focus:border-royalGold/50 outline-none resize-none placeholder-gray-600 transition-colors"
                        placeholder={activeTab === 'DAO' 
                            ? "Collez le texte du DAO ou du cahier des charges..." 
                            : activeTab === 'PITCH' 
                            ? "Décrivez votre projet: Problème, Solution, Marché, Équipe..."
                            : "Ex: 'FAQ: Crème éclaircissante bio' ou 'Affiche savon noir'"}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>
                
                <button 
                    id="sme-btn"
                    onClick={handleAction}
                    disabled={loading || !input}
                    className="w-full bg-gradient-to-r from-royalGold to-yellow-600 text-royalBlue font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-royalGold/20 transition-all flex items-center justify-center gap-2"
                >
                    {loading ? <Loader className="animate-spin" /> : 'Lancer le Lion de la Clarté'}
                </button>
            </div>

            {/* Right Panel: Results */}
            <div className="flex flex-col gap-4 animate-slide-up" style={{animationDelay: '0.3s'}}>
                {result ? (
                    <div className="glass-panel p-6 rounded-3xl border border-royalGold/30">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-royalGold font-bold font-serif">Résultat Structuré</h4>
                            <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-gray-400">Gemini 3 Pro</span>
                        </div>
                        
                        {result.type === 'image' && (
                            <div className="rounded-2xl overflow-hidden border border-white/20 relative group">
                                <img src={result.content} alt="Generated Asset" className="w-full h-auto" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <a href={result.content} download="marketing_asset.png" className="bg-white text-black px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform">Télécharger</a>
                                </div>
                            </div>
                        )}

                        {(result.type === 'text' || result.type === 'grounding') && (
                            <div className="prose prose-invert prose-sm text-gray-300 whitespace-pre-line leading-relaxed">
                                {result.content}
                            </div>
                        )}

                        {result.type === 'grounding' && result.sources && (
                            <div className="mt-6 pt-4 border-t border-white/10">
                                <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Sources Vérifiées</h5>
                                <div className="space-y-2">
                                    {result.sources.map((s: any, idx: number) => (
                                        <div key={idx} className="flex items-center gap-2 text-xs text-blue-400 bg-blue-900/10 p-2 rounded-lg border border-blue-500/10">
                                            <Globe size={12}/>
                                            {s.web?.uri ? <a href={s.web.uri} target="_blank" rel="noreferrer" className="hover:underline truncate">{s.web.title || s.web.uri}</a> : 'Google Maps'}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-full min-h-[300px] bg-white/5 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-8">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 text-gray-600 animate-float">
                             <FileText size={32}/>
                        </div>
                        <p className="text-gray-500 text-sm max-w-xs">
                            Vos rapports de conformité, présentations et scripts de vente apparaîtront ici.
                        </p>
                    </div>
                )}
            </div>
       </div>
    </div>
  );
};

export default SMEPage;
