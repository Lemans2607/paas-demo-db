
import React, { useState, useEffect, useMemo } from 'react';
import { Folder, FileAudio, FileVideo, FileImage, Lock, Bell, ExternalLink, ShieldCheck, CloudUpload, Upload, X, Users, TrendingUp, Eye, LayoutGrid, BookTemplate, UserCheck, Shield, ArrowRight, FileText, Trash2, AlertTriangle, ArrowUp, ArrowDown, LogOut, File as FileGeneric } from 'lucide-react';
import { saveFileToStorage, getStoredFiles, deleteFileFromStorage, formatFileSize, StoredFile } from '../services/fileService';

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'FILES' | 'TONTINE'>('DASHBOARD');

  // Files State
  const [localFiles, setLocalFiles] = useState<StoredFile[]>([]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState('SME');
  const [isUploading, setIsUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState<StoredFile | null>(null);
  const [filterType, setFilterType] = useState('ALL');
  
  // Notebook State
  const [clientName, setClientName] = useState('');
  const [sourceFiles, setSourceFiles] = useState<File[]>([]);
  const [generatedNotebook, setGeneratedNotebook] = useState('');

  useEffect(() => {
      setLocalFiles(getStoredFiles());
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase() === 'lion') {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg("Accès Refusé.");
    }
  };

  const handleLogout = () => {
      setIsAuthenticated(false);
      setPassword('');
  };

  const handleFileUpload = async () => {
      if (!uploadFile) return;
      setIsUploading(true);
      try {
          const newFile = await saveFileToStorage(uploadFile, uploadCategory);
          setLocalFiles(prev => [newFile, ...prev]);
          setUploadFile(null);
      } catch (err: any) {
          alert(err.message);
      } finally {
          setIsUploading(false);
      }
  }

  const handleDeleteFile = (id: number) => {
      if (window.confirm("Supprimer ?")) {
          setLocalFiles(deleteFileFromStorage(id));
      }
  };

  const processedFiles = useMemo(() => {
      return localFiles.filter(f => filterType === 'ALL' || f.type.includes(filterType.toLowerCase()));
  }, [localFiles, filterType]);

  const handleGenerateNotebook = () => {
    if (!clientName) return;
    setGeneratedNotebook(`https://notebooklm.google.com/view/${Math.random().toString(36).substr(7)}`);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="glass-panel w-full max-w-md p-8 rounded-3xl text-center">
            <Lock size={48} className="text-royalGold mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-6">Admin Secure</h2>
            <form onSubmit={handleLogin} className="space-y-4">
                <input 
                    type="password" 
                    placeholder="Mot de passe" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-center text-white focus:border-royalGold outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {errorMsg && <p className="text-red-400 text-xs">{errorMsg}</p>}
                <button type="submit" className="w-full bg-royalGold text-royalBlue font-bold py-4 rounded-xl hover:bg-yellow-400">Entrer</button>
            </form>
            <p className="mt-4 text-gray-500 text-xs">Indice: lion</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-10 pb-20 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
            <h2 className="text-4xl font-serif font-bold text-white mb-2">Admin Dashboard</h2>
            <p className="text-gray-400">Système de gestion centralisé.</p>
        </div>
        <div className="flex gap-4">
             <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                <button onClick={() => setActiveTab('DASHBOARD')} className={`px-4 py-2 rounded-lg text-xs font-bold ${activeTab === 'DASHBOARD' ? 'bg-royalGold text-royalBlue' : 'text-gray-400'}`}>Dashboard</button>
                <button onClick={() => setActiveTab('FILES')} className={`px-4 py-2 rounded-lg text-xs font-bold ${activeTab === 'FILES' ? 'bg-royalGold text-royalBlue' : 'text-gray-400'}`}>Fichiers</button>
            </div>
            <button onClick={handleLogout} className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-red-500 hover:text-white transition-colors">
                <LogOut size={14}/> Déconnexion
            </button>
        </div>
      </div>

      {activeTab === 'DASHBOARD' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in">
              {/* Notebook Gen */}
              <div className="glass-panel p-6 rounded-3xl border border-white/10">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2"><BookTemplate className="text-royalGold"/> Générateur Notebook Client</h3>
                  <div className="space-y-4">
                      <input type="text" placeholder="Nom Client" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white" value={clientName} onChange={e => setClientName(e.target.value)} />
                      <div className="border-2 border-dashed border-white/10 rounded-xl p-4 text-center text-gray-400 text-xs cursor-pointer bg-black/20">
                          <Upload size={20} className="mx-auto mb-2"/> Glisser les sources PDF
                      </div>
                      <button onClick={handleGenerateNotebook} className="w-full bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20">Générer Lien</button>
                  </div>
                  {generatedNotebook && (
                      <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                          <p className="text-xs text-green-400 break-all">{generatedNotebook}</p>
                      </div>
                  )}
              </div>
          </div>
      )}

      {activeTab === 'FILES' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in">
              <div className="glass-panel p-6 rounded-3xl border border-white/10 h-fit">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2"><CloudUpload size={18} className="text-blue-400"/> Upload</h3>
                  <div className="space-y-4">
                      <select value={uploadCategory} onChange={e => setUploadCategory(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm">
                          <option value="SME">PME</option>
                          <option value="Student">Étudiant</option>
                      </select>
                      <input type="file" onChange={e => setUploadFile(e.target.files?.[0] || null)} className="w-full text-xs text-gray-400"/>
                      <button onClick={handleFileUpload} disabled={!uploadFile || isUploading} className="w-full bg-royalBlue border border-royalGold/50 text-royalGold font-bold py-3 rounded-xl hover:bg-royalGold hover:text-royalBlue transition-all">
                          {isUploading ? '...' : 'Sauvegarder Local'}
                      </button>
                  </div>
              </div>

              <div className="md:col-span-2 glass-panel p-6 rounded-3xl border border-white/10">
                   <div className="flex justify-between items-center mb-6">
                       <h3 className="font-bold text-white">Fichiers Stockés</h3>
                       <select value={filterType} onChange={e => setFilterType(e.target.value)} className="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-white">
                           <option value="ALL">Tous</option>
                           <option value="image">Images</option>
                           <option value="pdf">PDF</option>
                       </select>
                   </div>
                   <div className="space-y-2">
                       {processedFiles.map(file => (
                           <div key={file.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-royalGold/30 transition-colors">
                               <div className="flex items-center gap-3 overflow-hidden">
                                   <FileGeneric size={16} className="text-gray-400 shrink-0"/>
                                   <div>
                                       <p className="text-sm text-white font-medium truncate max-w-[150px]">{file.name}</p>
                                       <p className="text-[10px] text-gray-500">{file.date} • {formatFileSize(file.size)}</p>
                                   </div>
                               </div>
                               <div className="flex gap-2">
                                   {file.data && <button onClick={() => setPreviewFile(file)} className="p-2 text-gray-400 hover:text-white"><Eye size={14}/></button>}
                                   <button onClick={() => handleDeleteFile(file.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                               </div>
                           </div>
                       ))}
                       {processedFiles.length === 0 && <p className="text-center text-gray-600 text-sm py-8">Vide.</p>}
                   </div>
              </div>
          </div>
      )}

      {/* Preview Modal */}
      {previewFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
              <div className="glass-panel p-4 rounded-2xl max-w-lg w-full relative">
                  <button onClick={() => setPreviewFile(null)} className="absolute top-2 right-2 text-white bg-black/50 rounded-full p-1"><X size={16}/></button>
                  <h3 className="text-white font-bold mb-4">{previewFile.name}</h3>
                  <div className="bg-black/40 rounded-xl overflow-hidden flex justify-center">
                      {previewFile.type.startsWith('image/') ? (
                          <img src={previewFile.data} className="max-h-[60vh] object-contain"/>
                      ) : (
                          <p className="p-8 text-gray-400 text-sm">Aperçu non disponible.</p>
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminPage;
