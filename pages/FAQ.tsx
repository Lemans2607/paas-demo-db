import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, MessageCircle, Zap, ShieldCheck, HelpCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../constants';

const FAQ_DATA = [
    {
        category: "Général & Service",
        icon: <HelpCircle size={20}/>,
        questions: [
            {
                q: "Est-ce que ça marche avec les cours en anglais ?",
                a: "Oui ! Notre IA traite les cours en français, anglais, et même les mélanges des deux (très courant au Cameroun). La qualité est identique."
            },
            {
                q: "Combien de temps ça prend pour recevoir mon podcast ?",
                a: "Maximum 2h après l'envoi de ton fichier. Si c'est urgent (examen le lendemain), dis-nous sur WhatsApp, on priorise ta demande."
            },
            {
                q: "Quelle est la différence avec ChatGPT ou d'autres IA ?",
                a: "ChatGPT peut 'halluciner' (inventer des infos). Yann's NOTE utilise un moteur d'ancrage source qui garantit 0 % d'hallucination : chaque information est vérifiable avec la citation exacte de ton cours."
            }
        ]
    },
    {
        category: "Paiement & Garantie",
        icon: <Zap size={20}/>,
        questions: [
            {
                q: "Est-ce que je peux payer par Mobile Money ?",
                a: "Oui ! Nous acceptons MTN Mobile Money et Orange Money. Paiement 100 % sécurisé."
            },
            {
                q: "Quelle est votre politique de remboursement ?",
                a: "Satisfait ou remboursé à 100 %. Si tu n'améliores pas ta note d'au moins 2 points, on te rembourse intégralement + on te donne 5 000 FCFA de compensation. Aucun risque."
            },
            {
                q: "Puis-je partager mon abonnement avec des amis ?",
                a: "L'abonnement est personnel. Mais si 3 amis s'inscrivent avec ton code de parrainage, tu obtiens 1 mois gratuit !"
            }
        ]
    },
    {
        category: "Technique & Sécurité",
        icon: <ShieldCheck size={20}/>,
        questions: [
            {
                q: "Est-ce que mes données sont sécurisées ?",
                a: "Absolument. Tes fichiers sont cryptés, jamais partagés, et supprimés après livraison. Conformité RGPD garantie."
            },
            {
                q: "Yann's Note fonctionne-t-il sans internet ?",
                a: "L'application dispose d'un mode 'Offline First'. Vous pouvez consulter vos documents livrés et utiliser les modèles d'IA légers sans connexion. L'envoi initial des fichiers nécessite une connexion."
            }
        ]
    }
];

const FAQPage: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleAccordion = (index: string) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const filteredData = FAQ_DATA.map(cat => ({
        ...cat,
        questions: cat.questions.filter(q => 
            q.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
            q.a.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(cat => cat.questions.length > 0);

    return (
        <div className="pt-10 pb-20 px-4 max-w-4xl mx-auto min-h-screen">
            <div className="text-center mb-12 animate-slide-up">
                <div className="inline-block p-3 bg-royalGold/10 rounded-full mb-4 border border-royalGold/30">
                    <HelpCircle className="text-royalGold" size={32} />
                </div>
                <h2 className="text-4xl font-serif font-bold text-white mb-4">Foire Aux Questions</h2>
                <p className="text-gray-400">Réponses claires. Pas de jargon.</p>
            </div>

            {/* Search */}
            <div className="relative mb-12 animate-slide-up" style={{animationDelay: '0.1s'}}>
                <input 
                    type="text" 
                    placeholder="Rechercher une question..." 
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-royalGold/50 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            </div>

            <div className="space-y-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
                {filteredData.map((cat, catIdx) => (
                    <div key={catIdx} className="glass-panel rounded-3xl p-6 border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="p-2 bg-white/5 rounded-lg text-royalGold">{cat.icon}</span>
                            {cat.category}
                        </h3>
                        <div className="space-y-4">
                            {cat.questions.map((item, qIdx) => {
                                const index = `${catIdx}-${qIdx}`;
                                const isOpen = openIndex === index;
                                return (
                                    <div key={qIdx} className={`border rounded-xl transition-all duration-300 overflow-hidden ${isOpen ? 'bg-white/5 border-royalGold/30' : 'border-white/5 hover:border-white/10'}`}>
                                        <button 
                                            onClick={() => toggleAccordion(index)}
                                            className="w-full flex justify-between items-center p-4 text-left"
                                        >
                                            <span className={`font-medium text-sm ${isOpen ? 'text-white' : 'text-gray-300'}`}>{item.q}</span>
                                            {isOpen ? <ChevronUp size={16} className="text-royalGold" /> : <ChevronDown size={16} className="text-gray-500" />}
                                        </button>
                                        <div className={`px-4 text-sm text-gray-400 leading-relaxed overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                                            {item.a}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {filteredData.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        Aucune question trouvée pour "{searchTerm}".
                    </div>
                )}
            </div>

            <div className="mt-12 text-center animate-slide-up">
                <p className="text-gray-400 mb-4">Vous ne trouvez pas votre réponse ?</p>
                <a 
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#128C7E] transition-all shadow-lg"
                >
                    <MessageCircle size={20} /> Support WhatsApp Direct
                </a>
            </div>
        </div>
    );
};

export default FAQPage;