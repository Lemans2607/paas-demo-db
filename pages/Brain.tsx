import React, { useState, useRef, useEffect } from 'react';
import { Brain, Sparkles, Zap, MessageSquare, BookOpen, Send, Loader2, StopCircle, RefreshCw, Paperclip } from 'lucide-react';
import { brainAgent } from '../services/geminiService';
import MarkdownText from '../components/MarkdownText';

interface Message {
    id: number;
    role: 'user' | 'model';
    text: string;
}

const BrainPage: React.FC = () => {
    const [context, setContext] = useState('');
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [useFastMode, setUseFastMode] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!query.trim()) return;

        const userMsg: Message = { id: Date.now(), role: 'user', text: query };
        setMessages(prev => [...prev, userMsg]);
        setQuery('');
        setIsLoading(true);

        try {
            // Convert history to API format
            const historyForApi = messages.map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));

            const response = await brainAgent(context, userMsg.text, historyForApi, useFastMode);
            
            const aiMsg: Message = { id: Date.now() + 1, role: 'model', text: response.text };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            setMessages(prev => [...prev, { id: Date.now(), role: 'model', text: "Erreur de connexion au Cerveau." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pt-10 pb-20 px-4 max-w-7xl mx-auto min-h-screen flex flex-col">
            <div className="text-center mb-10 animate-slide-up">
                <div className="inline-block p-3 bg-royalGold/10 rounded-full mb-4 border border-royalGold/30">
                    <Brain className="text-royalGold" size={32} />
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">Cerveau Numérique</h2>
                <p className="text-gray-400">Interrogez vos propres sources avec une intelligence adaptative.</p>
            </div>

            {/* Main Grid - Auto height on mobile, Fixed height on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow h-auto lg:h-[600px]">
                {/* Left Panel: Context/Sources */}
                <div className="lg:col-span-1 glass-panel rounded-3xl p-6 border border-white/10 flex flex-col animate-slide-up h-[400px] lg:h-full">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <BookOpen className="text-blue-400" /> Sources & Contexte
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">
                        Collez ici les textes, notes ou documents sur lesquels l'IA doit baser ses réponses.
                    </p>
                    <textarea 
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        className="flex-grow w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-royalGold/50 outline-none resize-none placeholder-gray-600 custom-scrollbar"
                        placeholder="Ex: Notes de cours sur le Droit Civil, Contenu du DAO, Rapport financier 2024..."
                    />
                    <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
                        <span>{context.length} caractères</span>
                        <button onClick={() => setContext('')} className="flex items-center gap-1 hover:text-white">
                            <RefreshCw size={12}/> Effacer
                        </button>
                    </div>
                </div>

                {/* Right Panel: Chat Interface */}
                <div className="lg:col-span-2 glass-panel rounded-3xl border border-white/10 flex flex-col overflow-hidden animate-slide-up h-[500px] lg:h-full" style={{animationDelay: '0.1s'}}>
                    {/* Header Controls */}
                    <div className="p-4 border-b border-white/5 bg-black/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="text-royalGold" size={20} />
                            <span className="font-bold text-white">Discussion</span>
                        </div>
                        
                        {/* Mode Toggle */}
                        <div className="flex bg-black/40 rounded-lg p-1 border border-white/10 self-end sm:self-auto">
                            <button 
                                onClick={() => setUseFastMode(false)}
                                className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${!useFastMode ? 'bg-royalGold text-royalBlue shadow-md' : 'text-gray-400 hover:text-white'}`}
                            >
                                <Sparkles size={12} /> Profondeur (Pro)
                            </button>
                            <button 
                                onClick={() => setUseFastMode(true)}
                                className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${useFastMode ? 'bg-blue-500 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                            >
                                <Zap size={12} /> Vitesse (Flash Lite)
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar bg-black/10">
                        {messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                                <Brain size={48} className="text-gray-500 mb-4" />
                                <p className="text-gray-400 text-sm">Le Cerveau attend vos questions.</p>
                                <p className="text-gray-600 text-xs mt-2">N'oubliez pas d'ajouter du contexte à gauche.</p>
                            </div>
                        )}
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[90%] sm:max-w-[85%] p-4 rounded-2xl text-sm ${
                                    msg.role === 'user' 
                                    ? 'bg-royalGold/90 text-royalBlue rounded-tr-sm' 
                                    : 'bg-white/10 text-gray-200 rounded-tl-sm border border-white/5'
                                }`}>
                                    <MarkdownText content={msg.text} isUser={msg.role === 'user'} />
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 p-4 rounded-2xl rounded-tl-sm border border-white/5 flex items-center gap-3">
                                    <Loader2 size={16} className="animate-spin text-royalGold" />
                                    <span className="text-xs text-gray-400">
                                        {useFastMode ? "Réponse rapide..." : "Analyse approfondie (Thinking Mode)..."}
                                    </span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-white/5 bg-black/20">
                        <div className="flex gap-4">
                            <div className="flex-grow relative">
                                <input 
                                    type="text" 
                                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-12 py-4 text-white focus:border-royalGold/50 outline-none transition-all placeholder-gray-600"
                                    placeholder={!context ? "Ajoutez une source..." : "Posez une question..."}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                                    disabled={!context && messages.length === 0}
                                />
                                <Paperclip size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white cursor-pointer" />
                            </div>
                            <button 
                                onClick={handleSend}
                                disabled={isLoading || (!query.trim())}
                                className="bg-royalGold text-royalBlue p-4 rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-royalGold/20"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrainPage;