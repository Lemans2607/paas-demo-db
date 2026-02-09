import React, { useState } from 'react';
import { Camera, FileBarChart, Loader, DollarSign, Users, Search, MapPin, Image as ImageIcon, CheckCircle, Globe } from 'lucide-react';
import { analyzeChaos, generateMarketingAsset, marketResearch, findLocalResources } from '../services/geminiService';

const SMEPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'COMPTA' | 'TONTINE' | 'MARKETING'>('COMPTA');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null); // text or image url
  const [imgSize, setImgSize] = useState<'1K' | '2K' | '4K'>('1K');

  // Mock Tontine Data
  const tontineMembers = [
      { name: 'Moussa', paid: true, amount: 50000 },
      { name: 'Sophie', paid: true, amount: 50000 },
      { name: 'Jean', paid: false, amount: 0 },
      { name: 'Marie', paid: true, amount: 50000 },
      { name: 'Paul', paid: false, amount: 0 },
  ];

  const handleAction = async () => {
      setLoading(true);
      setResult(null);
      try {
          if (activeTab === 'COMPTA') {
              const res = await analyzeChaos(input, 'SME');
              setResult({ type: 'text', content: res });
          } else if (activeTab === 'MARKETING') {
              if (input.startsWith("SEARCH:")) {
                  // Search Mode
                  const res = await marketResearch(input.replace("SEARCH:", ""));
                  setResult({ type: 'grounding', content: res.text, sources: res.sources });
              } else if (input.startsWith("MAPS:")) {
                  // Maps Mode
                  const res = await findLocalResources(input.replace("MAPS:", ""));
                  setResult({ type: 'grounding', content: res.text, sources: res.chunks });
              } else {
                  // Image Gen Mode
                  const res = await generateMarketingAsset(input, imgSize);
                  setResult({ type: 'image', content: res });
              }
          }
      } catch (e) {
          setResult({ type: 'text', content: "Erreur IA ou Hors Connexion." });
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="pt-10 pb-20 px-4 max-w-6xl mx-auto">
       <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-bold text-white mb-2">Espace PME & Tontines</h2>
            <p className="text-gray-400">Gérez vos finances, trouvez des ressources et créez votre marketing.</p>
       </div>

       {/* Tabs */}
       <div className="flex flex-wrap justify-center gap-2 mb-8">
            {['COMPTA', 'TONTINE', 'MARKETING'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => { setActiveTab(tab as any); setResult(null); }}
                    className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${activeTab === tab ? 'bg-royalGold text-royalBlue border-royalGold' : 'border-gray-600 text-gray-400 hover:text-white'}`}
                >
                    {tab === 'COMPTA' && 'Comptabilité & Chaos'}
                    {tab === 'TONTINE' && 'Tontine & Ressources'}
                    {tab === 'MARKETING' && 'Marketing & Recherche'}
                </button>
            ))}
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Panel: Inputs */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
                {activeTab === 'TONTINE' ? (
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Users className="text-royalGold"/> État de la Tontine
                        </h3>
                        <div className="space-y-4">
                            {tontineMembers.map((m, i) => (
                                <div key={i} className="flex items-center justify-between bg-[#000a14] p-3 rounded-lg border-l-4 border-royalGold">
                                    <span className="text-white font-bold">{m.name}</span>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs px-2 py-1 rounded ${m.paid ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                                            {m.paid ? 'PAYÉ' : 'EN ATTENTE'}
                                        </span>
                                        <span className="text-gray-400 text-sm">{m.amount} FCFA</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-white/10">
                            <div className="flex justify-between text-sm text-gray-400 mb-1">
                                <span>Progression du cycle</span>
                                <span>60%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div className="bg-royalGold h-2.5 rounded-full" style={{ width: '60%' }}></div>
                            </div>
                        </div>
                        
                        <div className="mt-8">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Globe className="text-royalGold"/> Global Ressources Technique
                            </h3>
                            <p className="text-sm text-gray-400 mb-4">Accès aux documents techniques partagés et appels d'offres groupés.</p>
                            <button className="w-full py-2 bg-white/5 border border-royalGold/30 text-royalGold rounded-lg hover:bg-royalGold hover:text-royalBlue transition-colors">
                                Accéder au Dossier Partagé
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <h3 className="text-xl font-bold text-white mb-4">
                            {activeTab === 'COMPTA' ? 'Analyseur de Reçus' : 'Studio Créatif & Recherche'}
                        </h3>
                        
                        {activeTab === 'MARKETING' && (
                            <div className="flex gap-2 mb-4">
                                <select 
                                    className="bg-[#000a14] text-white text-xs p-2 rounded border border-gray-700 outline-none"
                                    value={imgSize}
                                    onChange={(e: any) => setImgSize(e.target.value)}
                                >
                                    <option value="1K">Image 1K</option>
                                    <option value="2K">Image 2K (Pro)</option>
                                    <option value="4K">Image 4K (Ultra)</option>
                                </select>
                                <div className="text-xs text-gray-500 flex items-center">
                                    Utilisez "SEARCH:" pour Google ou "MAPS:" pour Lieux.
                                </div>
                            </div>
                        )}

                        <textarea 
                            className="w-full bg-[#00152b] border border-gray-700 rounded-xl p-3 text-white h-40 mb-4 focus:border-royalGold outline-none resize-none"
                            placeholder={activeTab === 'COMPTA' 
                                ? "Décrivez vos dépenses ou collez le texte d'un reçu..." 
                                : "Ex: 'Affiche publicitaire pour vente de chaussures à Douala' ou 'SEARCH: Prix du ciment Cameroun'"}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        
                        <button 
                            onClick={handleAction}
                            disabled={loading || !input}
                            className="w-full bg-royalGold text-royalBlue font-bold py-3 rounded-xl hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader className="animate-spin" /> : 'Exécuter'}
                        </button>
                    </>
                )}
            </div>

            {/* Right Panel: Results */}
            <div className="flex flex-col gap-4">
                {result ? (
                    <div className="glass-panel p-6 rounded-2xl border border-white/10 animate-[shine_0.5s_ease-out]">
                        <h4 className="text-royalGold font-bold mb-3">Résultat IA</h4>
                        
                        {result.type === 'image' && (
                            <div className="rounded-xl overflow-hidden border border-white/20">
                                <img src={result.content} alt="Generated Asset" className="w-full h-auto" />
                                <a href={result.content} download="marketing_asset.png" className="block text-center py-2 bg-white/10 text-xs hover:bg-white/20 text-white">Télécharger PNG</a>
                            </div>
                        )}

                        {(result.type === 'text' || result.type === 'grounding') && (
                            <div className="prose prose-invert prose-sm text-gray-300 whitespace-pre-line">
                                {result.content}
                            </div>
                        )}

                        {result.type === 'grounding' && result.sources && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                                <h5 className="text-xs font-bold text-gray-500 mb-2">Sources Vérifiées (Grounding)</h5>
                                <div className="space-y-1">
                                    {result.sources.map((s: any, idx: number) => (
                                        <div key={idx} className="text-xs truncate text-blue-400">
                                            {s.web?.uri ? <a href={s.web.uri} target="_blank" rel="noreferrer" className="hover:underline">{s.web.title || s.web.uri}</a> : 'Source Maps'}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-full min-h-[300px] bg-[#00152b] rounded-2xl border border-white/5 flex items-center justify-center text-center p-6">
                        {activeTab === 'TONTINE' ? (
                            <div className="text-gray-500 text-sm">Sélectionnez un membre pour voir les détails.</div>
                        ) : (
                            <div className="text-gray-500 text-sm">
                                {activeTab === 'MARKETING' ? "Les images 4K consomment plus de données." : "Analysez vos reçus pour générer un bilan."}
                            </div>
                        )}
                    </div>
                )}
            </div>
       </div>
    </div>
  );
};

export default SMEPage;
