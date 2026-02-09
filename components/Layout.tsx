import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Wifi, WifiOff, Mail, Bell } from 'lucide-react';
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
    // Simulate sending message to Admin
    alert("Message envoyé à l'administrateur ! Une notification WhatsApp a été déclenchée.");
    setShowPrivateMsg(false);
    setMsgContent('');
  };

  return (
    <div className="min-h-screen bg-royalBlue text-white flex flex-col font-sans selection:bg-royalGold selection:text-royalBlue overflow-x-hidden">
      {/* Connectivity Banner - MORE PROMINENT */}
      <div className={`text-center py-2 px-4 text-xs font-bold uppercase tracking-wider transition-colors duration-500 flex justify-center items-center gap-2 ${isOnline ? 'bg-green-900/20 text-green-400 border-b border-green-900/50' : 'bg-red-600 text-white animate-pulse'}`}>
          {isOnline ? (
            <><Wifi size={14} /> Mode Connecté - IA Active</>
          ) : (
            <><WifiOff size={14} /> Mode Hors Ligne - Fonctionnalités Limitées</>
          )}
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 glass-panel border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-gradient-to-br from-royalGold to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-royalGold/20">
                  <span className="text-royalBlue font-serif font-bold text-xl">Y</span>
               </div>
               <span className="font-serif font-bold text-xl tracking-wider text-royalGold hidden sm:block">YANN'S NOTE</span>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      location.pathname === link.path
                        ? 'text-royalGold bg-white/10'
                        : 'text-gray-300 hover:text-royalGold hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                {/* Private Message Button */}
                <button 
                  onClick={() => setShowPrivateMsg(true)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                >
                  <Mail size={16} /> Contact Admin
                </button>
              </div>
            </div>

            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-royalBlue inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-royalBlue border-b border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                     location.pathname === link.path
                     ? 'text-royalGold bg-white/10'
                     : 'text-gray-300 hover:text-royalGold'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
               <button 
                  onClick={() => { setShowPrivateMsg(true); setIsMenuOpen(false); }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white"
                >
                  Contacter Admin
                </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Floating ChatBot */}
      <ChatBot />

      {/* Private Message Modal */}
      {showPrivateMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
           <div className="bg-[#00152b] w-full max-w-md rounded-2xl border border-white/20 p-6 shadow-2xl relative animate-[shine_0.3s_ease-out]">
              <button onClick={() => setShowPrivateMsg(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                 <X size={24} />
              </button>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                 <Mail className="text-royalGold" /> Message Privé à Yann
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                 Envoyez une requête urgente ou un problème. L'admin recevra une alerte WhatsApp immédiate.
              </p>
              <textarea 
                 value={msgContent}
                 onChange={(e) => setMsgContent(e.target.value)}
                 className="w-full h-32 bg-royalBlue border border-white/10 rounded-xl p-3 text-white focus:border-royalGold outline-none mb-4"
                 placeholder="Votre message ici..."
              />
              <button 
                 onClick={handleSendMsg}
                 disabled={!msgContent.trim()}
                 className="w-full bg-royalGold text-royalBlue font-bold py-3 rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50"
              >
                 Envoyer le Message
              </button>
           </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#00152b] border-t border-white/5 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-royalGold font-serif font-bold text-lg mb-4">YANN'S NOTE</h3>
              <p className="text-gray-400 text-sm">
                Hub de clarté augmenté par l'IA. <br/>
                Ancré sur vos documents. <br/>
                0% Hallucination. 100% Vérifiable.
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Liens Rapides</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/education" className="hover:text-royalGold">Espace Étudiant</Link></li>
                <li><Link to="/business" className="hover:text-royalGold">Espace PME</Link></li>
                <li><Link to="/admin" className="hover:text-royalGold">Connexion Admin</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Paiements Sécurisés</h3>
              <p className="text-xs text-gray-400 mb-2">Acceptés partout au Cameroun</p>
              <div className="flex gap-4">
                <div className="bg-white p-1 rounded w-16 h-10 flex items-center justify-center overflow-hidden">
                    <span className="text-yellow-500 font-bold text-xs">MTN MoMo</span>
                </div>
                <div className="bg-white p-1 rounded w-16 h-10 flex items-center justify-center overflow-hidden">
                    <span className="text-orange-500 font-bold text-xs">Orange</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 text-center text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Yann's Note. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
