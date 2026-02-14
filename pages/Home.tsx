
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, GraduationCap, Rocket, Landmark, CheckCircle, Smartphone, MessageCircle, X, Zap } from 'lucide-react';
import { WHATSAPP_NUMBER, APP_TAGLINE } from '../constants';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<'STUDENT' | 'STARTUP' | 'INSTITUTION' | null>(null);
  const [accessCode, setAccessCode] = useState('');

  const openAuth = (profile: 'STUDENT' | 'STARTUP' | 'INSTITUTION') => {
    setSelectedProfile(profile);
    setShowAuthModal(true);
  };

  const handleLogin = () => {
    if (accessCode.length > 4) {
      localStorage.setItem('user_profile', selectedProfile!);
      const paths = {
        STUDENT: '/education',
        STARTUP: '/business',
        INSTITUTION: '/business?tab=INSTITUTION'
      };
      navigate(paths[selectedProfile!]);
    }
  };

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-4 pt-20 pb-10 overflow-hidden">
        {/* Dynamic Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-royalGold rounded-full blur-[180px] opacity-10 animate-pulse-slow pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-10 animate-float pointer-events-none"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto text-center animate-slide-up">
          <div className="inline-flex items-center gap-2 mb-8 px-6 py-2 rounded-full border border-royalGold/30 bg-royalGold/10 hover:bg-royalGold/20 transition-colors cursor-default">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-royalGold text-xs font-bold tracking-widest uppercase">{APP_TAGLINE}</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-serif font-black text-white mb-8 leading-tight drop-shadow-2xl">
            Transformez le <span className="text-transparent bg-clip-text bg-gradient-to-r from-royalGold via-yellow-300 to-royalGold animate-shine bg-[length:200%_auto]">Chaos</span><br/>
            en <span className="text-white">Résultats</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            La première plateforme IA adaptée au contexte camerounais. <br/>
            <span className="text-royalGold font-bold">Sans carte bancaire. Sans connexion fibre. 100% Efficace.</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            <ProfileCard 
              icon={<GraduationCap size={40} />}
              title="Étudiants & Répétiteurs"
              desc="Transformez vos cours en podcasts. Boostez vos notes."
              price="OFFRE ÉTUDIANT"
              onClick={() => openAuth('STUDENT')}
              delay="0s"
            />
            <ProfileCard 
              icon={<Rocket size={40} />}
              title="PME & Startups"
              desc="Pitch Deck Pro, Tontine 2.0 et Financement."
              price="OFFRE BUSINESS"
              onClick={() => openAuth('STARTUP')}
              delay="0.1s"
            />
            <ProfileCard 
              icon={<Landmark size={40} />}
              title="Institutions (DAO)"
              desc="Analyse automatique des Marchés Publics."
              price="OFFRE PUBLIQUE"
              onClick={() => openAuth('INSTITUTION')}
              delay="0.2s"
            />
          </div>
        </div>
      </section>

      {/* ROI SECTION (RESTORED) */}
      <section className="py-20 relative border-t border-white/5 bg-[#000a14]">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">ROI GARANTI</h2>
          <p className="text-gray-400 mb-16 max-w-2xl mx-auto">Nous ne vendons pas du rêve. Nous vendons des résultats mesurables pour chaque profil.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <StatBox 
                label="Pour Étudiants" 
                val="+2.5 pts" 
                sub="De moyenne semestrielle" 
                detail="Ou remboursé intégralement"
                icon={<GraduationCap className="text-royalGold mb-4" size={32}/>}
            />
            <StatBox 
                label="Pour PME / Startups" 
                val="10M FCFA" 
                sub="Potentiel de levée de fonds" 
                detail="Avec un Pitch Deck structuré par IA"
                icon={<Rocket className="text-royalGold mb-4" size={32}/>}
            />
            <StatBox 
                label="Pour Institutions" 
                val="-90%" 
                sub="De temps de traitement" 
                detail="Sur l'analyse des dossiers d'Appels d'Offres"
                icon={<Zap className="text-royalGold mb-4" size={32}/>}
            />
          </div>
        </div>
      </section>

      {/* WHATSAPP AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="glass-panel w-full max-w-md rounded-3xl p-8 border border-royalGold/20 animate-slide-up relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-royalGold to-transparent"></div>
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Smartphone size={20} className="text-green-500"/> Accès WhatsApp
              </h3>
              <button onClick={() => setShowAuthModal(false)} className="text-gray-500 hover:text-white transition-colors"><X /></button>
            </div>
            
            <div className="text-center space-y-6">
              <div className="bg-[#25D366]/10 p-6 rounded-2xl border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-colors group">
                <p className="text-sm text-gray-300 mb-4">Cliquez ci-dessous pour envoyer <br/><span className="text-[#25D366] font-bold">"JE SUIS {selectedProfile}"</span></p>
                <a 
                  href={`https://wa.me/237${WHATSAPP_NUMBER}?text=JE%20SUIS%20${selectedProfile}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-2xl font-mono font-bold text-white flex items-center justify-center gap-2 group-hover:scale-105 transition-transform"
                >
                  <MessageCircle className="text-[#25D366]" fill="currentColor" /> +237 {WHATSAPP_NUMBER}
                </a>
                <p className="text-[10px] text-gray-500 mt-4">Code d'accès envoyé instantanément par notre Bot.</p>
              </div>

              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Entrez votre code d'accès"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-center text-white focus:border-royalGold outline-none font-mono tracking-widest text-lg"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                />
                <button 
                  onClick={handleLogin}
                  disabled={accessCode.length < 4}
                  className="w-full bg-royalGold text-royalBlue font-black py-4 rounded-xl hover:scale-105 transition-transform disabled:opacity-50 shadow-lg hover:shadow-royalGold/20"
                >
                  ACCÉDER À MA PLATEFORME
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileCard: React.FC<{icon: any, title: string, desc: string, price: string, onClick: () => void, delay: string}> = ({icon, title, desc, price, onClick, delay}) => (
  <div 
    onClick={onClick}
    className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-royalGold/40 transition-all duration-300 cursor-pointer group text-center flex flex-col items-center hover:-translate-y-2 animate-slide-up bg-gradient-to-b from-white/5 to-transparent"
    style={{animationDelay: delay}}
  >
    <div className="w-20 h-20 bg-royalGold/10 rounded-2xl flex items-center justify-center text-royalGold mb-6 group-hover:scale-110 group-hover:bg-royalGold group-hover:text-royalBlue transition-all duration-300 shadow-[0_0_20px_rgba(240,185,11,0.1)]">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">{title}</h3>
    <p className="text-gray-400 text-sm mb-6 leading-relaxed flex-grow">{desc}</p>
    <div className="w-full pt-6 border-t border-white/5">
      <p className="text-royalGold font-mono text-xs font-bold mb-2 uppercase tracking-widest">{price}</p>
      <div className="flex items-center justify-center gap-2 text-white font-bold text-xs group-hover:gap-4 transition-all">
        COMMENCER <ArrowRight size={14} />
      </div>
    </div>
  </div>
);

const StatBox: React.FC<{label: string, val: string, sub: string, detail: string, icon: any}> = ({label, val, sub, detail, icon}) => (
  <div className="p-6 rounded-2xl hover:bg-white/5 transition-colors group">
    <div className="flex flex-col items-center">
        {icon}
        <p className="text-gray-500 uppercase tracking-widest text-xs font-bold mb-4">{label}</p>
        <p className="text-5xl md:text-6xl font-black text-white mb-4 group-hover:text-royalGold transition-colors">{val}</p>
        <p className="text-white font-bold text-sm mb-1">{sub}</p>
        <p className="text-gray-500 text-xs">{detail}</p>
    </div>
  </div>
);

export default Home;
