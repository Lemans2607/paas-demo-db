import React, { useState } from 'react';
import { Folder, FileAudio, FileVideo, FileImage, Lock, Link as LinkIcon, Bell, ExternalLink, ShieldCheck, CloudUpload, Upload, X } from 'lucide-react';

// Mock Data
const MOCK_MESSAGES = [
  { id: 1, user: 'Moussa (Commerçant)', content: 'Besoin aide import Chine', urgent: true },
  { id: 2, user: 'Sophie (Étudiante)', content: 'Lien NotebookLM cassé', urgent: false },
  { id: 3, user: 'Jean (Répétiteur)', content: 'Demande accès module Tuteur Pro', urgent: false },
];

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [generatedNotebook, setGeneratedNotebook] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // File Upload State
  const [files, setFiles] = useState([
    { id: 1, name: 'Droit_Admin_Chap2.mp3', type: 'AUDIO', category: 'Student' },
    { id: 2, name: 'Bilan_Global_Ressources.pdf', type: 'PDF', category: 'SME' },
    { id: 3, name: 'Maths_Proba_Facile.mp4', type: 'VIDEO', category: 'Tutor' },
  ]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState('Student');
  const [uploadType, setUploadType] = useState('PDF');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase() === 'lion') {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg("Accès Refusé. Protocole de sécurité activé.");
      setPassword('');
    }
  };

  const handleGenerateNotebook = () => {
    if (!urlInput) return;
    setIsGenerating(true);
    setTimeout(() => {
        setGeneratedNotebook(`https://notebooklm.google.com/notebook/generated-id-123`);
        setIsGenerating(false);
    }, 2000);
  }

  const handleFileUpload = () => {
      if (!uploadFile) return;
      const newEntry = {
          id: files.length + 1,
          name: uploadFile.name,
          type: uploadType,
          category: uploadCategory
      };
      setFiles([newEntry, ...files]);
      setUploadFile(null);
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="glass-panel w-full max-w-md p-1 rounded-3xl animate-slide-up">
            <div className="bg-[#000810]/90 rounded-[22px] p-8 border border-white/5 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-royalGold to-transparent opacity-50"></div>
                <div className="w-20 h-20 bg-royalBlue/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-royalGold/20 shadow-[0_0_30px_rgba(240,185,11,0.1)]">
                    <Lock size={32} className="text-royalGold" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-white mb-2">Accès Administrateur</h2>
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-8">Identification Requise</p>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative group">
                        <input 
                            type="password" 
                            placeholder="Mot de passe" 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-center text-white focus:border-royalGold/50 focus:bg-white/10 outline-none transition-all placeholder-gray-600 tracking-widest"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="absolute inset-0 rounded-xl border border-white/0 group-hover:border-white/10 pointer-events-none transition-colors"></div>
                    </div>
                    {errorMsg && (
                        <div className="text-red-400 text-xs bg-red-900/20 py-2 rounded border border-red-500/20 animate-pulse">
                            {errorMsg}
                        </div>
                    )}
                    <button type="submit" className="w-full bg-royalGold hover:bg-yellow-500 text-royalBlue font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-royalGold/20">
                        Déverrouiller le Système
                    </button>
                </form>
                <div className="mt-8 pt-6 border-t border-white/5">
                    <p className="text-xs text-gray-600">
                        <span className="font-bold text-gray-500">INDICE DÉVELOPPEUR :</span> Le mot de passe est <span className="text-royalGold/70 font-mono">lion</span>
                    </p>
                </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-10 pb-20 px-4 max-w-7xl mx-auto animate-slide-up">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
        <div>
            <h2 className="text-4xl font-serif font-bold text-white mb-2">Centre de Commandement</h2>
            <p className="text-gray-400 flex items-center gap-2">
                <ShieldCheck size={16} className="text-green-500"/> Système Sécurisé • v2.5.0
            </p>
        </div>
        <div className="flex gap-4">
            <div className="glass-panel px-6 py-3 rounded-xl flex items-center gap-3">
                <div className="relative">
                    <Bell size={20} className="text-royalGold" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </div>
                <span className="text-sm font-bold text-white">3 Alertes</span>
            </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard label="Requêtes IA" value="1,240" color="text-yellow-400" />
        <StatCard label="Données Traitées" value="45 GB" color="text-blue-400" />
        <StatCard label="Utilisateurs Actifs" value="328" color="text-green-400" />
        <StatCard label="Revenus (XAF)" value="850k" color="text-white" />
      </div>

      {/* Tools Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* File Upload Section */}
        <div className="glass-panel rounded-3xl p-8 border border-white/10 relative overflow-hidden group">
             <div className="absolute top-0 left-0 p-32 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
             <h3 className="font-bold text-xl text-white mb-6 flex items-center gap-3 relative z-10">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><CloudUpload size={20} /></div>
                Upload & Organisation
            </h3>

            <div className="space-y-4 relative z-10">
                <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-royalGold/50 transition-colors cursor-pointer relative bg-black/20">
                    <input 
                        type="file" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    />
                    <div className="flex flex-col items-center gap-2">
                        <Upload size={24} className={uploadFile ? "text-green-400" : "text-gray-400"} />
                        <span className="text-xs text-gray-400">{uploadFile ? uploadFile.name : "Glisser un fichier"}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <select 
                        value={uploadCategory}
                        onChange={(e) => setUploadCategory(e.target.value)}
                        className="bg-black/40 border border-white/10 rounded-lg px-2 py-2 text-xs text-white outline-none focus:border-royalGold/50"
                    >
                        <option value="Student">Étudiant</option>
                        <option value="SME">PME</option>
                        <option value="Tutor">Répétiteur</option>
                    </select>
                    <select 
                        value={uploadType}
                        onChange={(e) => setUploadType(e.target.value)}
                        className="bg-black/40 border border-white/10 rounded-lg px-2 py-2 text-xs text-white outline-none focus:border-royalGold/50"
                    >
                        <option value="PDF">PDF</option>
                        <option value="AUDIO">Audio</option>
                        <option value="VIDEO">Vidéo</option>
                        <option value="IMAGE">Image</option>
                    </select>
                </div>

                <button 
                    onClick={handleFileUpload}
                    disabled={!uploadFile}
                    className="w-full bg-royalBlue border border-royalGold/30 text-royalGold font-bold py-3 rounded-xl hover:bg-royalGold hover:text-royalBlue transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                    Uploader
                </button>
            </div>
        </div>

        {/* Notebook Generator Extension Simulator */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-8 border border-white/10 relative overflow-hidden group flex flex-col justify-center">
            <div className="absolute top-0 right-0 p-32 bg-royalGold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-royalGold/10 transition-colors"></div>
            
            <h3 className="font-bold text-xl text-white mb-6 flex items-center gap-3 relative z-10">
                <div className="p-2 bg-royalGold/20 rounded-lg text-royalGold"><LinkIcon size={20} /></div>
                Générateur NotebookLM (Browser Ext.)
            </h3>
            
            <p className="text-sm text-gray-400 mb-6 relative z-10">
                Simulez l'extension Chrome "Client Content to Notebook". Collez une URL pour générer un espace de travail sécurisé dont vous seul avez le contrôle.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-6 relative z-10">
                <input 
                    type="text" 
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://youtube.com/..."
                    className="flex-grow bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white focus:border-royalGold/50 outline-none"
                />
                <button 
                    onClick={handleGenerateNotebook}
                    disabled={isGenerating}
                    className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl hover:bg-royalGold hover:text-royalBlue hover:border-royalGold transition-all font-bold"
                >
                    {isGenerating ? 'Traitement...' : 'Générer Lien'}
                </button>
            </div>
            {generatedNotebook && (
                <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-xl flex justify-between items-center relative z-10 animate-slide-up">
                    <span className="text-green-400 text-sm font-mono truncate mr-4">{generatedNotebook}</span>
                    <a href={generatedNotebook} target="_blank" rel="noreferrer" className="text-white hover:text-green-300"><ExternalLink size={18}/></a>
                </div>
            )}
        </div>
      </div>

      {/* Inbox Row */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 mb-8">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Bell size={18} className="text-red-400" /> Messages Urgents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOCK_MESSAGES.map(msg => (
                    <div key={msg.id} className="bg-white/5 p-4 rounded-xl border-l-2 border-royalGold hover:bg-white/10 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-bold text-white group-hover:text-royalGold transition-colors">{msg.user}</span>
                            {msg.urgent && <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold shadow-lg shadow-red-500/20">URGENT</span>}
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">{msg.content}</p>
                    </div>
                ))}
            </div>
      </div>

      {/* Files Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-white/10">
        <div className="bg-black/20 px-8 py-5 border-b border-white/5 flex justify-between items-center">
           <h3 className="font-bold text-white">Base de Données Fichiers</h3>
           <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">Synchronisé</span>
        </div>
        <table className="w-full text-left text-sm text-gray-400">
           <thead className="bg-white/5 text-xs uppercase font-medium text-gray-500">
              <tr>
                 <th className="px-8 py-4">Fichier</th>
                 <th className="px-8 py-4">Type</th>
                 <th className="px-8 py-4">Catégorie</th>
                 <th className="px-8 py-4">Action</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-white/5">
              {files.map(file => (
                <tr key={file.id} className="hover:bg-white/5 transition-colors animate-slide-up">
                   <td className="px-8 py-5 font-medium text-white flex items-center gap-3">
                      <FileIcon type={file.type} />
                      {file.name}
                   </td>
                   <td className="px-8 py-5">{file.type}</td>
                   <td className="px-8 py-5">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${file.category === 'SME' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : file.category === 'Tutor' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                        {file.category}
                      </span>
                   </td>
                   <td className="px-8 py-5">
                      <button className="text-royalGold hover:text-white transition-colors text-xs font-bold uppercase">Éditer</button>
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
  <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
    <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-2 group-hover:text-gray-300">{label}</p>
    <p className={`text-3xl font-bold ${color} font-mono`}>{value}</p>
  </div>
);

const FileIcon: React.FC<{type: string}> = ({ type }) => {
  switch(type) {
    case 'AUDIO': return <FileAudio size={18} className="text-orange-400" />;
    case 'VIDEO': return <FileVideo size={18} className="text-red-400" />;
    case 'IMAGE': return <FileImage size={18} className="text-blue-400" />;
    default: return <Folder size={18} className="text-gray-400" />;
  }
};

export default AdminPage;