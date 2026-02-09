import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Database, FileCheck, WifiOff } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-royalGold/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-royalGold/30 bg-royalGold/10 backdrop-blur-sm">
            <span className="text-royalGold text-xs font-bold tracking-widest uppercase">L'IA Ancrée sur la Réalité</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
            Transformez le <span className="text-transparent bg-clip-text bg-gradient-to-r from-royalGold to-yellow-200">Chaos</span> en <span className="text-white">Clarté Royale</span>.
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Étudiants, Répétiteurs, PME. Utilisez une Intelligence Artificielle qui ne ment jamais. 
            Générez des fiches, des audios et des rapports basés <span className="text-white font-bold underline decoration-royalGold decoration-2">uniquement</span> sur vos documents.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/education" className="px-8 py-4 bg-royalGold text-royalBlue font-bold rounded-lg hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(255,215,0,0.3)] flex items-center justify-center gap-2">
              Je suis Étudiant / Répétiteur <ArrowRight size={20} />
            </Link>
            <Link to="/business" className="px-8 py-4 bg-transparent border border-gray-500 text-white font-bold rounded-lg hover:border-white hover:bg-white/5 transition-all flex items-center justify-center">
              Je suis PME / Commerçant
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-[#00152b] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-royalBlue/50 border border-white/5 hover:border-royalGold/30 transition-all group">
              <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-6 text-royalGold group-hover:scale-110 transition-transform">
                <FileCheck size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">0% Hallucination</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Contrairement à ChatGPT, Yann's Note utilise NotebookLM pour s'ancrer strictement sur vos fichiers. Chaque affirmation contient une citation vérifiable.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-royalBlue/50 border border-white/5 hover:border-royalGold/30 transition-all group">
              <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-6 text-royalGold group-hover:scale-110 transition-transform">
                <Database size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Zéro Data & Offline</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Économisez votre forfait internet. Téléchargez des résumés audios ultra-légers. Si la connexion coupe, l'IA bascule en mode consultation d'archives locales.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-royalBlue/50 border border-white/5 hover:border-royalGold/30 transition-all group">
              <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-6 text-royalGold group-hover:scale-110 transition-transform">
                <WifiOff size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Extension Cerveau</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Votre requête génère automatiquement un "Notebook" dédié. Vous gardez le contrôle, Yann gère la complexité technique en arrière-plan.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
