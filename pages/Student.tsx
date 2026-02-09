import React, { useState } from 'react';
import { Upload, Headphones, BookOpen, BrainCircuit, AlertCircle, Loader2, Mic, FileText, Lightbulb } from 'lucide-react';
import { deepThinkingAnalysis, transcribeAudio } from '../services/geminiService';
import { WHATSAPP_NUMBER } from '../constants';

const StudentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'STUDENT' | 'TUTOR'>('STUDENT');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');

  // Audio recording simulation (Browser Mic -> Base64)
  const handleRecord = async () => {
    if (isRecording) {
        setIsRecording(false);
        setLoading(true);
        // Simulate sending audio to API
        try {
            // In a real app, capture audio blob here
            const fakeAudioBase64 = "UklGRi..."; 
            const text = await transcribeAudio(fakeAudioBase64);
            setTranscription("Transcription (Simulée): Le droit administratif est la branche du droit public qui régit l'organisation et le fonctionnement de l'administration...");
        } catch (e) {
            setTranscription("Erreur de transcription.");
        } finally {
            setLoading(false);
        }
    } else {
        setIsRecording(true);
        // Start recording logic would go here
    }
  };

  const handleAnalysis = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      let response;
      if (activeTab === 'TUTOR') {
          // Use Thinking Model for Tutors
          response = await deepThinkingAnalysis(input, "Adapte cette explication pour un élève en difficulté. Utilise des analogies simples.");
      } else {
          // Normal analysis
          response = await deepThinkingAnalysis(input, "Explique ce cours pour un examen.");
      }
      setResult(response);
    } catch (err: any) {
       setResult("Mode Hors Ligne: Impossible de contacter le cerveau central. Veuillez réessayer connecté.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-10 pb-20 px-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-serif font-bold text-white mb-4">Espace Éducation</h2>
        <p className="text-gray-400">
            {activeTab === 'STUDENT' ? "Réussissez vos examens grâce à l'IA." : "Devenez un Super-Répétiteur."}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-10">
        <div className="bg-white/5 p-1 rounded-xl flex">
          <button
            onClick={() => { setActiveTab('STUDENT'); setResult(null); }}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'STUDENT' ? 'bg-royalGold text-royalBlue shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            Étudiant (Succès)
          </button>
          <button
            onClick={() => { setActiveTab('TUTOR'); setResult(null); }}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'TUTOR' ? 'bg-royalGold text-royalBlue shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            Répétiteur (Outils Pro)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Tools */}
        <div className="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col gap-6">
          
          <div className="flex items-center gap-3">
             <div className="p-2 bg-royalGold/10 rounded-lg text-royalGold">
                {activeTab === 'STUDENT' ? <FileText size={24}/> : <Lightbulb size={24} />}
             </div>
             <h3 className="text-xl font-bold text-white">
               {activeTab === 'STUDENT' ? "Analyse de Cours & Audio" : "Générateur Pédagogique (Mode Pensée)"}
             </h3>
          </div>

          {/* New Audio Transcription Feature for Students */}
          {activeTab === 'STUDENT' && (
              <div className="bg-[#000a14] p-4 rounded-xl border border-white/10">
                  <h4 className="text-sm font-bold text-gray-300 mb-2 flex items-center gap-2"><Mic size={16}/> Enregistrer un cours</h4>
                  <p className="text-xs text-gray-500 mb-3">Transformez la voix de votre prof en texte clair.</p>
                  <div className="flex gap-2 items-center">
                    <button 
                        onClick={handleRecord}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-royalBlue border border-royalGold text-royalGold'}`}
                    >
                        {isRecording ? <div className="w-4 h-4 bg-white rounded-sm" /> : <Mic size={20} />}
                    </button>
                    {isRecording && <span className="text-xs text-red-400 animate-pulse">Enregistrement...</span>}
                  </div>
                  {transcription && (
                      <div className="mt-3 text-xs text-gray-300 bg-white/5 p-2 rounded italic">
                          "{transcription}"
                      </div>
                  )}
              </div>
          )}

          <textarea
            className="w-full bg-[#00152b] border border-gray-700 rounded-xl p-4 text-white focus:border-royalGold focus:ring-1 focus:ring-royalGold outline-none h-40 resize-none placeholder-gray-600"
            placeholder={activeTab === 'STUDENT' 
                ? "Collez votre cours ici pour un résumé ou une explication..." 
                : "Entrez le concept difficile (ex: Théorème de Thalès). L'IA va réfléchir à la meilleure analogie."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button 
            onClick={handleAnalysis}
            disabled={loading || !input}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${loading || !input ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-royalGold text-royalBlue hover:bg-yellow-400 shadow-lg'}`}
            >
            {loading ? <Loader2 className="animate-spin" /> : (activeTab === 'TUTOR' ? 'Générer Méthode Pédagogique' : 'Analyser')}
          </button>
        </div>

        {/* Right Column: Results */}
        <div className="flex flex-col gap-6">
           {result ? (
             <div className="glass-panel p-6 rounded-2xl border border-royalGold/20 animate-[shine_0.5s_ease-out]">
                <h4 className="text-royalGold font-bold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  {activeTab === 'TUTOR' ? "Stratégie Pédagogique" : "Résultat"}
                </h4>
                <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-line">
                  {result}
                </div>
             </div>
           ) : (
             <div className="bg-[#00152b] p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-gray-600">
                   <BrainCircuit size={32} />
                </div>
                <p className="text-gray-500 text-sm">
                    {activeTab === 'TUTOR' ? "L'IA utilisera son 'budget de réflexion' pour créer des explications uniques." : "Vos analyses apparaîtront ici."}
                </p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
