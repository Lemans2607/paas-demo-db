import React, { useState } from 'react';
import { Shield, FileText, Scale, Lock, Server, MapPin } from 'lucide-react';

type LegalSection = 'PRIVACY' | 'TERMS' | 'LEGAL';

const LegalPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState<LegalSection>('PRIVACY');

    return (
        <div className="pt-10 pb-20 px-4 max-w-6xl mx-auto min-h-screen">
             <div className="text-center mb-12 animate-slide-up">
                <h2 className="text-4xl font-serif font-bold text-white mb-4">Information Légale</h2>
                <p className="text-gray-400">Transparence et Conformité Cameroun.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Navigation Sidebar */}
                <div className="md:col-span-1 space-y-2 animate-slide-up">
                    <button 
                        onClick={() => setActiveSection('PRIVACY')}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${activeSection === 'PRIVACY' ? 'bg-royalGold text-royalBlue shadow-lg' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                    >
                        <Lock size={16} /> Confidentialité
                    </button>
                    <button 
                        onClick={() => setActiveSection('TERMS')}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${activeSection === 'TERMS' ? 'bg-royalGold text-royalBlue shadow-lg' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                    >
                        <FileText size={16} /> CGV / CGU
                    </button>
                    <button 
                        onClick={() => setActiveSection('LEGAL')}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${activeSection === 'LEGAL' ? 'bg-royalGold text-royalBlue shadow-lg' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                    >
                        <Scale size={16} /> Mentions Légales
                    </button>
                </div>

                {/* Content Area */}
                <div className="md:col-span-3 glass-panel p-8 rounded-3xl border border-white/10 animate-slide-up" style={{animationDelay: '0.1s'}}>
                    
                    {activeSection === 'PRIVACY' && (
                        <div className="prose prose-invert prose-sm max-w-none">
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <Shield className="text-royalGold"/> Politique de Confidentialité
                            </h3>
                            <p className="text-gray-400">Dernière mise à jour : 25 Mai 2025</p>
                            
                            <h4>1. Collecte des Données</h4>
                            <p>Yann's Note privilégie une approche "Local-First". La majorité des données traitées (analyse de DAO, résumés) sont traitées de manière éphémère. Nous ne stockons pas vos documents personnels sur nos serveurs de manière permanente sans votre accord explicite (ex: Tontine).</p>
                            
                            <h4>2. Utilisation de l'IA (Gemini)</h4>
                            <p>Les données envoyées aux modèles d'IA de Google (Gemini Pro/Flash) sont soumises à la politique de confidentialité de Google Cloud Entreprise. Vos données ne sont <strong>pas utilisées pour entraîner les modèles publics</strong>.</p>
                            
                            <h4>3. Cookies & Stockage Local</h4>
                            <p>Nous utilisons le <code>localStorage</code> de votre navigateur pour sauvegarder vos préférences (mode sombre, clés API, historique local). Aucun cookie tiers publicitaire n'est utilisé.</p>
                        </div>
                    )}

                    {activeSection === 'TERMS' && (
                        <div className="prose prose-invert prose-sm max-w-none">
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <FileText className="text-royalGold"/> Conditions Générales de Vente (CGV)
                            </h3>
                            
                            <h4>1. Objet</h4>
                            <p>Les présentes CGV régissent les relations contractuelles entre Yann's Note et toute personne utilisant les services payants de la plateforme (PME, Répétiteurs).</p>
                            
                            <h4>2. Abonnements & Paiements</h4>
                            <ul>
                                <li>Les paiements s'effectuent via Mobile Money (MTN/Orange) ou Carte Bancaire.</li>
                                <li>L'abonnement est sans engagement de durée, renouvelable tacitement sauf résiliation.</li>
                                <li>Tout mois entamé est dû.</li>
                            </ul>

                            <h4>3. Politique de Remboursement</h4>
                            <p>Conformément à la législation sur les produits numériques, aucun remboursement n'est possible une fois le service (génération de document, accès au cours) consommé, sauf en cas de défaillance technique avérée de la plateforme.</p>

                            <h4>4. Responsabilité</h4>
                            <p>Yann's Note fournit des outils d'aide à la décision. L'éditeur ne saurait être tenu responsable des conséquences d'une erreur dans un DAO ou une analyse juridique générée par l'IA. L'utilisateur reste seul responsable de l'usage final des documents.</p>
                        </div>
                    )}

                    {activeSection === 'LEGAL' && (
                        <div className="prose prose-invert prose-sm max-w-none">
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <Scale className="text-royalGold"/> Mentions Légales
                            </h3>
                            
                            <div className="bg-white/5 p-6 rounded-xl border border-white/10 mb-6">
                                <h4 className="text-royalGold font-bold mb-2 uppercase text-xs tracking-widest">Éditeur du Service</h4>
                                <p className="font-bold text-white text-lg">Yann's Note SAS</p>
                                <p className="flex items-center gap-2 mt-2 text-gray-400"><MapPin size={16}/> Siège Social : Douala, Ndogpassi 2, Cameroun</p>
                                <p className="mt-1 text-gray-400">RC/Douala : En cours d'immatriculation</p>
                                <p className="mt-1 text-gray-400">Directeur de la publication : M. Yann Luther</p>
                            </div>

                            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                <h4 className="text-royalGold font-bold mb-2 uppercase text-xs tracking-widest">Hébergement & Infrastructure</h4>
                                <p className="flex items-center gap-2 text-gray-400"><Server size={16}/> Hébergé sur le Cloud (Vercel / Google Cloud Platform)</p>
                                <p className="mt-2 text-gray-400">Les données sont stockées sur des serveurs sécurisés conformes aux normes internationales.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LegalPage;