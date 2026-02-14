
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Wifi, WifiOff, Mail, MessageSquare, Send, MapPin, Phone, Linkedin, Facebook, Power, Instagram, Smartphone, LogOut } from 'lucide-react';
import { NAV_LINKS, WHATSAPP_NUMBER, CONTACT_EMAIL, ADDRESS, APP_TAGLINE } from '../constants';
import { setForceOffline } from '../services/geminiService';
import ChatBot from './ChatBot';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isForcedOffline, setIsForcedOffline] = useState(false);
  const [showPrivateMsg, setShowPrivateMsg] = useState(false);
  const [msgContent, setMsgContent] = useState('');
  const [msgSent, setMsgSent] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleStatusChange = () => {
        if (!isForcedOffline) setIsOnline(navigator.onLine);
    };
    
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, [isForcedOffline]);

  const toggleOfflineMode = () => {
      const newState = !isForcedOffline;
      setIsForcedOffline(newState);
      setForceOffline(newState);
      
      if (newState) {
          setIsOnline(false); 
      } else {
          setIsOnline(navigator.onLine); 
      }
  };

  const handleSendInternalMsg = () => {
    setMsgSent(true);
    setTimeout(() => {
        // Backend conn logic here
    }, 2000);
  };

  const handleLogout = () => {
      localStorage.removeItem('user_profile');
      navigate('/');
      setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-deepSpace text-white flex flex-col font-sans selection:bg-royalGold selection:text-royalBlue overflow-x-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
         <div className="absolute top-0 left-1/4 w-96 h-96 bg-royalBlue rounded-full blur-[160px] opacity-30 animate-pulse-slow"></div>
         <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-royalGold rounded-full blur-[160px] opacity-10 animate-pulse-slow"></div>
      </div>

      {/* Persistent Connectivity Banner */}
      <div className={`fixed top-0 left-0 right-0 z-[100] text-center py-2 px-4 text-[10px] font-bold uppercase tracking-widest transition-all duration-500 flex justify-between items-center shadow-lg ${isOnline ? 'bg-royalGold/90 text-royalBlue backdrop-blur-md' : 'bg-red-600/90 text-white animate-pulse'}`}>
          <div className="flex items-center gap-2">
              {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
              <span>{isOnline ? "Réseau Optimal • IA en Ligne" : "Mode Hors Ligne • Lion Cub Local"}</span>
          </div>
          
          <button 
            onClick={toggleOfflineMode}
            className="flex items-center gap-2 bg-black/20 hover:bg-black/30 px-3 py-1 rounded-full border border-white/10 transition-all cursor-pointer"
          >
              <span className="hidden sm:inline">{isForcedOffline ? "Reconnecter" : "Forcer Hors Ligne"}</span>
              <Power size={14} className={isForcedOffline ? "text-red-300" : "text-green-800"} />
          </button>
      </div>

      {/* Navbar */}
      <nav className="sticky top-6 z-40 glass-panel border-b-0 border-b-white/5 transition-all duration-300 backdrop-blur-xl mt-8 mx-4 rounded-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3 group">
               <div className="relative w-10 h-10 flex items-center justify-center">
                  <div className="absolute inset-0 bg-royalGold rounded-lg rotate-45 opacity-20 group-hover:rotate-90 transition-transform duration-500"></div>
                  <span className="text-royalGold font-serif font-bold text-xl relative z-10">Y</span>
               </div>
               <div className="flex flex-col">
                 <span className="font-serif font-bold text-lg tracking-widest text-white group-hover:text-royalGold transition-colors">YANN'S NOTE</span>
                 <span className="text-[9px] text-gray-400 uppercase tracking-[0.2em]">{APP_TAGLINE}</span>
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
                
                {/* Admin/Logout Controls */}
                <div className="flex items-center gap-3">
                    <button 
                    onClick={() => { setShowPrivateMsg(true); setMsgSent(false); }}
                    className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    title="Contacter Admin"
                    >
                        <MessageSquare size={18} />
                    </button>
                    
                    {location.pathname !== '/' && (
                        <button 
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-full text-xs font-bold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                        >
                            <LogOut size={14} /> <span className="hidden lg:inline">Déconnexion</span>
                        </button>
                    )}
                </div>
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
          <div className="md:hidden glass-panel border-t border-white/10 animate-slide-up rounded-b-2xl">
            <div className="px-4 pt-2 pb-6 space-y-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-3 rounded-lg text-base font-medium ${
                     location.pathname === link.path
                     ? 'bg-royalGold/10 text-royalGold border border-royalGold/20'
                     : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {location.pathname !== '/' && (
                  <button 
                      onClick={handleLogout}
                      className="w-full text-left block px-3 py-3 rounded-lg text-base font-medium text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                  >
                      <LogOut size={16} /> Se Déconnecter
                  </button>
              )}
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

      {/* STICKY WHATSAPP BUTTON */}
      <a 
        href={`https://wa.me/237${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-24 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center border-2 border-white/20"
        title="Contact WhatsApp"
      >
        <Smartphone size={28} />
      </a>

      {/* Private Message System Modal */}
      {showPrivateMsg && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
           <div className="glass-panel w-full max-w-lg rounded-2xl p-8 relative border border-royalGold/20 shadow-[0_0_50px_rgba(240,185,11,0.2)]">
              <button onClick={() => setShowPrivateMsg(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                 <X size={24} />
              </button>
              <div className="mb-6 flex items-center gap-3">
                 <div className="w-12 h-12 rounded-full bg-royalGold/10 flex items-center justify-center text-royalGold">
                    <Mail size={24} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-white">Messagerie Privée Admin</h3>
                    <p className="text-xs text-royalGold uppercase tracking-wide">Ticket Support & Urgence</p>
                 </div>
              </div>
              
              {!msgSent ? (
                  <>
                      <textarea 
                         value={msgContent}
                         onChange={(e) => setMsgContent(e.target.value)}
                         className="w-full h-40 bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-royalGold/50 outline-none mb-6 placeholder-gray-600 text-sm resize-none"
                         placeholder="Décrivez votre problème ou demande..."
                      />
                      <button 
                        onClick={handleSendInternalMsg}
                        disabled={!msgContent.trim()}
                        className="w-full bg-white/10 border border-white/20 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white/20 transition-all mb-3"
                      >
                         <Send size={16} /> Envoyer via la Plateforme
                      </button>
                  </>
              ) : (
                  <div className="text-center py-6 animate-slide-up">
                      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
                          <Wifi size={32} />
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2">Message Transmis !</h4>
                      <p className="text-sm text-gray-400 mb-6">L'administrateur a reçu une notification système.</p>
                      <button onClick={() => setShowPrivateMsg(false)} className="text-royalGold underline text-sm">Fermer</button>
                  </div>
              )}
           </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 bg-black/80 border-t border-white/5 pt-16 pb-12 backdrop-blur-md mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 text-sm">
            {/* Col 1: Contact */}
            <div>
               <h3 className="text-royalGold font-bold mb-6 uppercase text-xs tracking-widest flex items-center gap-2">
                 <span className="w-8 h-[1px] bg-royalGold"></span> Contact
              </h3>
              <ul className="space-y-4 text-gray-400">
                 <li className="flex items-center gap-2 hover:text-white transition-colors"><Phone size={14}/> +237 {WHATSAPP_NUMBER}</li>
                 <li className="flex items-center gap-2 hover:text-white transition-colors"><Mail size={14}/> {CONTACT_EMAIL}</li>
                 <li className="flex items-start gap-2 hover:text-white transition-colors"><MapPin size={14}/> {ADDRESS}</li>
              </ul>
            </div>

            {/* Col 2: Services ROI */}
            <div>
              <h3 className="text-royalGold font-bold mb-6 uppercase text-xs tracking-widest flex items-center gap-2">
                 <span className="w-8 h-[1px] bg-royalGold"></span> ROI Garanti
              </h3>
              <ul className="space-y-3 text-gray-400">
                <li>Étudiants: +2.5 pts</li>
                <li>Startups: Lève 10M FCFA</li>
                <li>DAO: Gain 50M FCFA</li>
                <li>Support: 24h/7j</li>
              </ul>
            </div>

            {/* Col 3: Légal */}
            <div>
              <h3 className="text-royalGold font-bold mb-6 uppercase text-xs tracking-widest flex items-center gap-2">
                 <span className="w-8 h-[1px] bg-royalGold"></span> Légal
              </h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="/legal" className="hover:text-white transition-colors">CGV / CGU</Link></li>
                <li><Link to="/legal" className="hover:text-white transition-colors">Confidentialité</Link></li>
                <li><Link to="/legal" className="hover:text-white transition-colors">Remboursement</Link></li>
              </ul>
            </div>

            {/* Col 4: Suis-nous */}
            <div>
              <h3 className="text-royalGold font-bold mb-6 uppercase text-xs tracking-widest flex items-center gap-2">
                 <span className="w-8 h-[1px] bg-royalGold"></span> Suis-nous
              </h3>
              <div className="flex gap-4">
                 <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all text-gray-400"><Facebook size={18}/></a>
                 <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#E4405F] hover:text-white transition-all text-gray-400"><Instagram size={18}/></a>
                 <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#0A66C2] hover:text-white transition-all text-gray-400"><Linkedin size={18}/></a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/5 bg-black/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col items-center gap-2">
                <p className="text-xs text-gray-500 font-mono tracking-tighter text-center">
                  © 2026 Yann's NOTE. Tous droits réservés. <br/>L'IA camerounaise qui livre des résultats.
                </p>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
