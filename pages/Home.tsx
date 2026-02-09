import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Database, FileCheck, WifiOff, Sparkles, Brain, ShieldCheck, Mic, LayoutTemplate, HelpCircle } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden pt-20">
        
        {/* Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-royalBlue rounded-full blur-[150px] opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-10 left-10 text-royalGold/5 animate-float"><Brain size={300} /></div>
        <div className="absolute bottom-10 right-10 text-royalGold/5 animate-float" style={{animationDelay: '2s'}}><Database size={300} /></div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-royalGold/30 bg-royalGold/5 backdrop-blur-md animate-slide-up">
            <Sparkles size={14} className="text-royalGold" />
            <span className="text-royalGold text-xs font-bold tracking-widest uppercase">Consultant en Clarté • IA Google NotebookLM</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-black text-white mb-8 leading-tight animate-slide-up" style={{animationDelay: '0.1s'}}>
            Le <span className="text-transparent bg-clip-text bg-gradient-to-r from-royalGold to-orange-500 text-glow">Lion de la Clarté</span> <br/>
            domine le Chaos.
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
             <strong>Yann's Note</strong> structure l'information pour le Cameroun.
             <br/>
             <span className="text-royalGold">0% Hallucination.</span> Nos IA sont ancrées sur vos documents pour une vérité absolue.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up" style={{animationDelay: '0.3s'}}>
            <Link to="/education" className="group relative px-8 py-5 bg-gradient-to-r from-royalGold to-yellow-500 text-royalBlue font-bold text-lg rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(240,185,11,0.4)]">
              <span className="relative z-10 flex items-center gap-2">Étudiants & Répétiteurs <ArrowRight className="group-hover:translate-x-1 transition-transform"/></span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </Link>
            
            <Link to="/business" className="group px-8 py-5 bg-white/5 border border-white/20 text-white font-bold text-lg rounded-xl hover:bg-white/10 hover:border-white/50 transition-all flex items-center justify-center">
              PME & Marchés Publics
            </Link>
          </div>
        </div>
      </section>

      {/* Flagship Services Grid */}
      <section className="relative z-20 -mt-20 px-4 pb-32">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-center text-3xl font-serif font-bold text-white mb-12 animate-slide-up">Nos 5 Services Phares</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ServiceCard 
                    icon={<ShieldCheck size={32} />}
                    title="Décodeur DAO Express"
                    desc="Analyse instantanée des Appels d'Offres. Détectez les pièges de conformité et les risques financiers."
                    delay="0s"
                    link="/business"
                />
                <ServiceCard 
                    icon={<Mic size={32} />}
                    title="Podcast Express"
                    desc="Transformez vos rapports, sermons ou cours en podcasts audio dynamiques de 15min."
                    delay="0.1s"
                    link="/education"
                />
                <ServiceCard 
                    icon={<LayoutTemplate size={32} />}
                    title="Pitch Deck Pro Flash"
                    desc="Obtenez une structure de présentation investisseur (10 slides) en moins de 24h."
                    delay="0.2s"
                    link="/business"
                />
                 <ServiceCard 
                    icon={<WifiOff size={32} />}
                    title="Pack Zéro Data"
                    desc="Résumés PDF de vidéos YouTube de formation. Apprenez sans brûler votre forfait."
                    delay="0.3s"
                    link="/education"
                />
                 <ServiceCard 
                    icon={<HelpCircle size={32} />}
                    title="FAQ Business IA"
                    desc="Automatisez votre service client WhatsApp avec des réponses intelligentes et scripts de vente."
                    delay="0.4s"
                    link="/business"
                />
                 <ServiceCard 
                    icon={<FileCheck size={32} />}
                    title="Ancrage Certifié"
                    desc="La technologie 'Source Grounding' garantit que chaque mot est vérifiable dans vos fichiers."
                    delay="0.5s"
                    link="/"
                    highlight
                />
            </div>
        </div>
      </section>
    </div>
  );
};

const ServiceCard: React.FC<{icon: React.ReactNode, title: string, desc: string, delay: string, link: string, highlight?: boolean}> = ({icon, title, desc, delay, link, highlight}) => (
    <Link to={link}>
        <div 
            className={`glass-panel p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-500 animate-slide-up h-full flex flex-col ${highlight ? 'border-royalGold/50 bg-royalGold/5' : ''}`}
            style={{animationDelay: delay}}
        >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-royalGold transition-transform duration-300 border border-white/10 ${highlight ? 'bg-royalGold text-royalBlue' : 'bg-white/5'}`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3 font-serif">{title}</h3>
            <p className="text-gray-400 leading-relaxed text-sm flex-grow">
                {desc}
            </p>
            <div className="mt-4 flex items-center text-royalGold text-xs font-bold uppercase tracking-widest gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Découvrir <ArrowRight size={12} />
            </div>
        </div>
    </Link>
);

export default Home;
