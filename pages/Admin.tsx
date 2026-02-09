import React, { useState } from 'react';
import { Folder, FileAudio, FileVideo, FileImage, Plus, Lock, Link as LinkIcon, Download, Bell, ExternalLink } from 'lucide-react';

// Mock Data
const MOCK_FILES = [
  { id: 1, name: 'Droit_Admin_Chap2.mp3', type: 'AUDIO', category: 'Student' },
  { id: 2, name: 'Bilan_Global_Ressources.pdf', type: 'PDF', category: 'SME' },
  { id: 3, name: 'Maths_Proba_Facile.mp4', type: 'VIDEO', category: 'Tutor' },
];

const MOCK_MESSAGES = [
  { id: 1, user: 'Moussa (Commerçant)', content: 'Besoin aide import Chine', urgent: true },
  { id: 2, user: 'Sophie (Étudiante)', content: 'Lien NotebookLM cassé', urgent: false },
];

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [generatedNotebook, setGeneratedNotebook] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'lion') {
      setIsAuthenticated(true);
    } else {
      alert("Mot de passe incorrect. Indice: Le roi de la jungle.");
    }
  };

  const handleGenerateNotebook = () => {
    if (!urlInput) return;
    setIsGenerating(true);
    // Simulate extension logic
    setTimeout(() => {
        setGeneratedNotebook(`https://notebooklm.google.com/notebook/generated-id-123`);
        setIsGenerating(false);
    }, 2000);
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="glass-panel p-8 rounded-2xl w-full max-w-md border border-white/10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-royalGold to-transparent"></div>
          <div className="mb-6 inline-flex p-4 bg-royalGold/10 rounded-full text-royalGold animate-pulse-slow">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white mb-2">Accès Réservé Yann</h2>
          <p className="text-xs text-gray-500 mb-6 uppercase tracking-widest">Zone Admin Sécurisée</p>
          
          <input 
            type="password" 
            placeholder="Mot de passe Maître" 
            className="w-full bg-[#00152b] border border-gray-600 rounded-lg p-3 text-white mb-2 focus:border-royalGold outline-none text-center tracking-widest"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-xs text-gray-600 mb-6 italic">Indice: Qui est le roi de la jungle ? (minuscules)</p>
          
          <button type="submit" className="w-full bg-royalGold text-royalBlue font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors">
            Entrer dans la Tanière
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="pt-10 pb-20 px-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-serif font-bold text-white">Tableau de Bord Admin</h2>
        <div className="flex gap-4">
            <div className="bg-red-900/50 text-red-200 px-4 py-2 rounded-lg border border-red-500/30 flex items-center gap-2">
                <Bell size={16} />
                <span className="text-sm font-bold">2 Messages</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard label="Requêtes en attente" value="12" color="text-yellow-400" />
        <StatCard label="Fichiers Audio" value="45" color="text-blue-400" />
        <StatCard label="Utilisateurs Actifs" value="128" color="text-green-400" />
        <StatCard label="Revenus Est. (Mois)" value="150k" color="text-white" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Notebook Generator Extension Simulator */}
        <div className="lg:col-span-2 glass-panel rounded-xl p-6 border border-white/10">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <LinkIcon className="text-royalGold" size={20} />
                Notebook Generator (Extension Browser)
            </h3>
            <p className="text-sm text-gray-400 mb-4">Collez un lien YouTube ou Drive client pour générer un Notebook privé.</p>
            <div className="flex gap-2 mb-4">
                <input 
                    type="text" 
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://youtube.com/..."
                    className="flex-grow bg-[#000a14] border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
                <button 
                    onClick={handleGenerateNotebook}
                    disabled={isGenerating}
                    className="bg-royalBlue border border-royalGold text-royalGold px-4 py-2 rounded-lg hover:bg-royalGold hover:text-royalBlue transition-colors"
                >
                    {isGenerating ? 'Génération...' : 'Créer'}
                </button>
            </div>
            {generatedNotebook && (
                <div className="bg-green-900/20 border border-green-500/30 p-3 rounded-lg flex justify-between items-center">
                    <span className="text-green-400 text-sm truncate">{generatedNotebook}</span>
                    <a href={generatedNotebook} target="_blank" rel="noreferrer" className="text-white hover:text-green-300"><ExternalLink size={16}/></a>
                </div>
            )}
        </div>

        {/* Inbox */}
        <div className="glass-panel rounded-xl p-6 border border-white/10">
            <h3 className="font-bold text-white mb-4">Boîte de Réception</h3>
            <div className="space-y-3">
                {MOCK_MESSAGES.map(msg => (
                    <div key={msg.id} className="bg-[#000a14] p-3 rounded-lg border-l-2 border-royalGold">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-bold text-white">{msg.user}</span>
                            {msg.urgent && <span className="text-[10px] bg-red-500 text-white px-1 rounded">URGENT</span>}
                        </div>
                        <p className="text-xs text-gray-400">{msg.content}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden border border-white/10">
        <div className="bg-[#00152b] px-6 py-4 border-b border-white/10 flex justify-between items-center">
           <h3 className="font-bold text-white">Fichiers NotebookLM Récents</h3>
           <span className="text-xs text-gray-500">Synchronisé Local & Cloud</span>
        </div>
        <table className="w-full text-left text-sm text-gray-400">
           <thead className="bg-royalBlue/50 text-xs uppercase font-medium">
              <tr>
                 <th className="px-6 py-3">Nom du Fichier</th>
                 <th className="px-6 py-3">Type</th>
                 <th className="px-6 py-3">Catégorie</th>
                 <th className="px-6 py-3">Action</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-white/5">
              {MOCK_FILES.map(file => (
                <tr key={file.id} className="hover:bg-white/5">
                   <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                      <FileIcon type={file.type} />
                      {file.name}
                   </td>
                   <td className="px-6 py-4">{file.type}</td>
                   <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${file.category === 'SME' ? 'bg-purple-900/50 text-purple-300' : 'bg-blue-900/50 text-blue-300'}`}>
                        {file.category}
                      </span>
                   </td>
                   <td className="px-6 py-4">
                      <button className="text-royalGold hover:underline">Gérer Lien</button>
                   </td>
                </tr>
              ))}
           </tbody>
        </table>
      </div>
    </div>
  );
};

const StatCard: React.FC<{label: string, value: string, color: string}> = ({ label, value, color }) => (
  <div className="bg-[#00152b] p-6 rounded-xl border border-white/5">
    <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">{label}</p>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

const FileIcon: React.FC<{type: string}> = ({ type }) => {
  switch(type) {
    case 'AUDIO': return <FileAudio size={16} className="text-orange-400" />;
    case 'VIDEO': return <FileVideo size={16} className="text-red-400" />;
    case 'IMAGE': return <FileImage size={16} className="text-blue-400" />;
    default: return <Folder size={16} className="text-gray-400" />;
  }
};

export default AdminPage;
