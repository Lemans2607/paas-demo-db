import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Wifi, WifiOff, Mail, Bell, Sparkles } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import ChatBot from './ChatBot';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showPrivateMsg, setShowPrivateMsg] = useState(false);
  const [msgContent, setMsgContent] = useState('');
  const location = useLocation();

  useEffect(() => {
    const handleStatusChange = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  const handleSendMsg = () => {
    alert("Message envoyé à l'administrateur ! Une notification WhatsApp a été déclenchée.");
    setShowPrivateMsg(false);
    setMsgContent('');
  };

  return (
    <div className="min-h-screen bg-deepSpace text-white flex flex-col font-sans selection:bg-royalGold selection:text-royalBlue overflow-x-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
         <div className="absolute top-0 left-1/4 w-96 h-96 bg-royalBlue rounded-full blur-[128px] opacity-40 animate-pulse-slow"></div>
         <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-royalGold rounded-full blur-[128px] opacity-10 animate-pulse-slow"></div>
      </div>

      {/* Connectivity Banner */}
      <div className={`relative z-50 text-center py-1 px-4 text-[10px] font-bold uppercase tracking-widest transition-all duration-500 flex justify-center items-center gap-2 ${isOnline ? 'bg-royalGold/10 text-royalGold border-b border-royalGold/20' : 'bg-red-900/80 text-white animate-pulse border-b border-red-500'}`}>
          {isOnline ? (
            <><Wifi size={12} /> Système Connecté • IA Générative Prête</>
          ) : (
            <><WifiOff size={12} /> Mode Déconnecté • Archives Locales Actives</>
          )}
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 glass-panel border-b-0 border-b-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3 group">
               <div className="relative w-10 h-10 flex items-center justify-center">
                  <div className="absolute inset-0 bg-royalGold rounded-lg rotate-45 opacity-20 group-hover:rotate-90 transition-transform duration-500"></div>
                  <div className="absolute inset-0 border border-royalGold rounded-lg rotate-45 group-hover:rotate-0 transition-transform duration-500"></div>
                  <span className="text-royalGold font-serif font-bold text-xl relative z-10">Y</span>
               </div>
               <div className="flex flex-col">
                 <span className="font-serif font-bold text-lg tracking-widest text-white group-hover:text-royalGold transition-colors">YANN'S NOTE</span>
                 <span className="text-[9px] text-gray-400 uppercase tracking-[0.2em]">Hub de Clarté</span>
               </div>
            </Link>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-6">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 hover:text-royalGold group ${
                      location.pathname === link.path ? 'text-royalGold' : 'text-gray-400'
                    }`}
                  >
                    {link.name}
                    <span className={`absolute bottom-0 left-0 h-[1px] bg-royalGold transition-all duration-300 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                  </Link>
                ))}
                {/* Private Message Button */}
                <button 
                  onClick={() => setShowPrivateMsg(true)}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-white/5 border border-white/10 hover:border-royalGold/50 hover:bg-royalGold/10 text-gray-300 hover:text-white transition-all flex items-center gap-2"
                >
                  <Mail size={14} /> <span className="hidden lg:inline">Message Admin</span>
                </button>
              </div>
            </div>

            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-400 hover:text-white focus:outline-none"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden glass-panel border-t border-white/10 animate-slide-up">
            <div className="px-4 pt-2 pb-6 space-y-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-3 rounded-lg text-base font-medium ${
                     location.pathname === link.path
                     ? 'bg-royalGold/10 text-royalGold border border-royalGold/20'
                     : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
               <button 
                  onClick={() => { setShowPrivateMsg(true); setIsMenuOpen(false); }}
                  className="w-full text-left block px-3 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
                >
                  Contacter Admin
                </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow relative z-10">
        {children}
      </main>

      {/* Floating ChatBot */}
      <ChatBot />

      {/* Private Message Modal */}
      {showPrivateMsg && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
           <div className="glass-panel w-full max-w-lg rounded-2xl p-8 relative shadow-[0_0_50px_rgba(240,185,11,0.1)] border border-royalGold/20">
              <button onClick={() => setShowPrivateMsg(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                 <X size={24} />
              </button>
              <div className="mb-6 flex items-center gap-3">
                 <div className="w-12 h-12 rounded-full bg-royalGold/10 flex items-center justify-center text-royalGold">
                    <Mail size={24} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-white">Ligne Directe Admin</h3>
                    <p className="text-xs text-royalGold uppercase tracking-wide">Urgence & Support</p>
                 </div>
              </div>
              
              <textarea 
                 value={msgContent}
                 onChange={(e) => setMsgContent(e.target.value)}
                 className="w-full h-40 bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-royalGold/50 outline-none mb-6 transition-all placeholder-gray-600 text-sm"
                 placeholder="Décrivez votre problème. Yann recevra une notification instantanée..."
              />
              <button 
                 onClick={handleSendMsg}
                 disabled={!msgContent.trim()}
                 className="w-full bg-gradient-to-r from-royalGold to-yellow-600 text-royalBlue font-bold py-4 rounded-xl hover:shadow-[0_0_20px_rgba(240,185,11,0.3)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100"
              >
                 Envoyer le Signal
              </button>
           </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 bg-black/40 border-t border-white/5 pt-16 pb-8 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <h3 className="text-royalGold font-serif font-bold text-2xl mb-4">YANN'S NOTE</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                La première plateforme camerounaise qui transforme le désordre en opportunité. 
                Propulsée par une IA hybride qui comprend le contexte local.
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Navigation</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link to="/education" className="hover:text-royalGold transition-colors">Étudiants & Répétiteurs</Link></li>
                <li><Link to="/business" className="hover:text-royalGold transition-colors">PME & Business</Link></li>
                <li><Link to="/admin" className="hover:text-royalGold transition-colors">Accès Administrateur</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Paiement Mobile</h3>
              <div className="flex gap-4">
                <div className="bg-white p-2 rounded w-14 opacity-80 hover:opacity-100 transition-opacity">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/MTN_Logo.svg" alt="MTN" className="w-full" />
                </div>
                <div className="bg-white p-2 rounded w-14 opacity-80 hover:opacity-100 transition-opacity">
                     <img src="https://upload.wikimedia.org/wikipedia/commons/c/c8/Orange_logo.svg" alt="Orange" className="w-full" />
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 text-center text-xs text-gray-600 font-mono">
            &copy; {new Date().getFullYear()} YANN'S NOTE SYSTEM • MADE WITH GEMINI 3 PRO
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
