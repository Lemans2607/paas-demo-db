
import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Wand2, Download, Upload, Layers, Loader2, Sparkles, AlertCircle, Eraser, Palette, ScanLine, Film } from 'lucide-react';
import { generateMarketingAsset, editImage, generateVideoFromImage } from '../services/geminiService';

const StudioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'GENERATE' | 'EDIT' | 'VIDEO'>('GENERATE');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Inputs
  const [genPrompt, setGenPrompt] = useState('');
  const [imgSize, setImgSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [editPrompt, setEditPrompt] = useState('');
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [videoPrompt, setVideoPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetResult = () => {
      setGeneratedImage(null);
      setGeneratedVideo(null);
      setError(null);
  };

  const handleAction = async () => {
      setLoading(true);
      resetResult();
      setError(null);

      try {
          if (activeTab === 'GENERATE') {
              if (!genPrompt) return;
              const res = await generateMarketingAsset(genPrompt, imgSize);
              setGeneratedImage(res);
          } else if (activeTab === 'EDIT') {
              if (!sourceImage || !editPrompt) return;
              const res = await editImage(sourceImage, editPrompt);
              setGeneratedImage(res);
          } else if (activeTab === 'VIDEO') {
              if (!sourceImage) return;
              const res = await generateVideoFromImage(sourceImage, videoPrompt, aspectRatio);
              setGeneratedVideo(res);
          }
      } catch (e) {
          // Note: Le service gère déjà la plupart des erreurs via fallback, ceci est une sécurité supplémentaire
          setError("Une erreur inattendue est survenue. Le mode démo a été activé.");
      } finally {
          setLoading(false);
      }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setSourceImage(reader.result as string);
              resetResult();
          };
          reader.readAsDataURL(file);
      }
  };

  return (
    <div className="pt-10 pb-20 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-10 animate-slide-up">
         <div className="inline-block p-3 bg-royalGold/10 rounded-full mb-4 border border-royalGold/30">
            <Palette className="text-royalGold" size={32} />
         </div>
         <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-2">Studio Numérique</h2>
         <p className="text-gray-400">Création Visuelle <span className="text-green-400 font-bold">Gratuite & Illimitée</span> (Mode Hybride)</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-10">
        <div className="bg-black/40 p-1 rounded-2xl flex flex-wrap justify-center gap-2 border border-white/10 backdrop-blur-md">
          <button onClick={() => { setActiveTab('GENERATE'); resetResult(); }} className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'GENERATE' ? 'bg-royalGold text-royalBlue shadow-lg' : 'text-gray-400 hover:text-white'}`}><Sparkles size={16}/> Générateur</button>
          <button onClick={() => { setActiveTab('EDIT'); resetResult(); }} className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'EDIT' ? 'bg-royalGold text-royalBlue shadow-lg' : 'text-gray-400 hover:text-white'}`}><Layers size={16}/> Retouche</button>
          <button onClick={() => { setActiveTab('VIDEO'); resetResult(); }} className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'VIDEO' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}><Film size={16}/> Veo (Vidéo)</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* CONTROLS */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 animate-slide-up flex flex-col justify-between">
           <div>
               <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                   <Wand2 className="text-royalGold"/> 
                   {activeTab === 'GENERATE' ? 'Paramètres' : activeTab === 'EDIT' ? 'Retouche' : 'Animation'}
               </h3>

               {(activeTab === 'EDIT' || activeTab === 'VIDEO') && (
                   <div className="mb-6">
                       <label className="text-xs text-gray-400 uppercase font-bold mb-2 block">Image Source</label>
                       <div onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors relative overflow-hidden ${sourceImage ? 'border-royalGold/50' : 'border-white/10 hover:border-royalGold/30 bg-black/20'}`}>
                           <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                           {sourceImage ? (
                               <img src={sourceImage} alt="Source" className="w-full h-48 object-contain rounded-lg" />
                           ) : (
                               <div className="flex flex-col items-center gap-2 py-8"><Upload size={32} className="text-gray-500"/><span className="text-xs text-gray-400">Uploader une image</span></div>
                           )}
                       </div>
                   </div>
               )}

               <div className="mb-6">
                   <label className="text-xs text-gray-400 uppercase font-bold mb-2 block">
                       {activeTab === 'GENERATE' ? 'Description (Prompt)' : activeTab === 'EDIT' ? 'Instructions de retouche' : 'Prompt Vidéo (Optionnel)'}
                   </label>
                   <textarea 
                       value={activeTab === 'GENERATE' ? genPrompt : activeTab === 'EDIT' ? editPrompt : videoPrompt}
                       onChange={(e) => activeTab === 'GENERATE' ? setGenPrompt(e.target.value) : activeTab === 'EDIT' ? setEditPrompt(e.target.value) : setVideoPrompt(e.target.value)}
                       className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white h-32 focus:border-royalGold/50 outline-none resize-none placeholder-gray-600 text-sm"
                       placeholder={activeTab === 'GENERATE' ? "Un lion futuriste marchant dans Douala..." : "Ajoute de la pluie et un style néon..."}
                   />
               </div>

               {activeTab === 'GENERATE' && (
                   <div className="mb-6">
                       <label className="text-xs text-gray-400 uppercase font-bold mb-2 block">Qualité</label>
                       <div className="flex gap-2">
                           {['1K', '2K', '4K'].map((s) => (
                               <button key={s} onClick={() => setImgSize(s as any)} className={`flex-1 py-3 rounded-lg border text-xs font-bold transition-all ${imgSize === s ? 'bg-white/10 border-royalGold text-royalGold' : 'bg-black/20 border-white/10 text-gray-500'}`}>{s}</button>
                           ))}
                       </div>
                   </div>
               )}

               {activeTab === 'VIDEO' && (
                   <div className="mb-6">
                       <label className="text-xs text-gray-400 uppercase font-bold mb-2 block">Format</label>
                       <div className="flex gap-4">
                           <button onClick={() => setAspectRatio('16:9')} className={`flex-1 py-3 rounded-lg border text-xs font-bold transition-all ${aspectRatio === '16:9' ? 'bg-white/10 border-royalGold text-royalGold' : 'bg-black/20 border-white/10 text-gray-500'}`}>Paysage 16:9</button>
                           <button onClick={() => setAspectRatio('9:16')} className={`flex-1 py-3 rounded-lg border text-xs font-bold transition-all ${aspectRatio === '9:16' ? 'bg-white/10 border-royalGold text-royalGold' : 'bg-black/20 border-white/10 text-gray-500'}`}>Portrait 9:16</button>
                       </div>
                   </div>
               )}
           </div>

           <button 
                onClick={handleAction}
                disabled={loading || (activeTab === 'GENERATE' && !genPrompt) || ((activeTab === 'EDIT' || activeTab === 'VIDEO') && !sourceImage)}
                className={`w-full font-bold py-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${activeTab === 'VIDEO' ? 'bg-purple-600 text-white' : 'bg-royalGold text-royalBlue'}`}
           >
               {loading ? <Loader2 className="animate-spin"/> : activeTab === 'VIDEO' ? 'Générer Vidéo' : 'Créer Maintenant'}
           </button>
        </div>

        {/* PREVIEW */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 h-full min-h-[400px] flex flex-col relative bg-[#000a14] animate-slide-up" style={{animationDelay: '0.2s'}}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-white flex items-center gap-2">
                    {activeTab === 'VIDEO' ? <Film size={20}/> : <ImageIcon size={20}/>} Résultat
                </h3>
                {(generatedImage || generatedVideo) && (
                    <a href={generatedImage || generatedVideo!} download="creation_yanns.png" className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                        <Download size={14}/> Télécharger
                    </a>
                )}
            </div>

            <div className="flex-grow flex items-center justify-center bg-black/40 rounded-2xl border border-white/5 overflow-hidden relative">
                {loading ? (
                    <div className="text-center">
                        <Loader2 size={48} className="text-royalGold animate-spin mx-auto mb-4"/>
                        <p className="text-gray-400 text-sm animate-pulse">
                            {activeTab === 'VIDEO' ? 'Veo compile la vidéo...' : 'Création en cours...'}
                        </p>
                    </div>
                ) : generatedVideo ? (
                    <video src={generatedVideo} controls autoPlay loop className="w-full h-full object-contain rounded-lg"/>
                ) : generatedImage ? (
                    <img src={generatedImage} alt="Result" className="w-full h-full object-contain animate-in zoom-in"/>
                ) : error ? (
                    <div className="text-center p-8 text-red-400 flex flex-col items-center">
                        <AlertCircle size={32} className="mb-2"/> {error}
                    </div>
                ) : (
                    <div className="text-center opacity-30">
                        <ScanLine size={64} className="mx-auto mb-4"/>
                        <p>L'oeuvre apparaîtra ici</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default StudioPage;
