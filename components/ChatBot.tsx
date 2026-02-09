import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';
import { chatWithYann } from '../services/geminiService';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      // Transform history for API if needed, simpler here
      const response = await chatWithYann(userMsg, messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
      })));
      
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Désolé, je suis hors ligne ou surchargé." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-royalGold text-royalBlue p-4 rounded-full shadow-2xl hover:bg-yellow-400 transition-all duration-300 z-50 flex items-center justify-center border-2 border-white/20"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] bg-[#00152b] border border-white/20 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-[shine_0.3s_ease-out]">
          <div className="bg-royalBlue p-4 border-b border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 bg-royalGold/20 rounded-full flex items-center justify-center text-royalGold">
               <Bot size={24} />
            </div>
            <div>
               <h3 className="font-bold text-white">Assistant Yann</h3>
               <p className="text-xs text-green-400 flex items-center gap-1">
                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                 En ligne (Gemini 3 Pro)
               </p>
            </div>
          </div>

          <div className="flex-grow p-4 overflow-y-auto space-y-4 custom-scrollbar">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-10">
                <p>Bonjour ! Je suis l'IA de Yann.<br/>Posez-moi une question sur vos cours ou votre business.</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-royalGold text-royalBlue rounded-tr-none' : 'bg-white/10 text-white rounded-tl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                   <Loader2 size={16} className="animate-spin text-royalGold" />
                   <span className="text-xs text-gray-400">Yann réfléchit...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-royalBlue/50 border-t border-white/10">
            <div className="flex gap-2">
               <input 
                  type="text" 
                  className="flex-grow bg-[#000a14] border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:border-royalGold outline-none"
                  placeholder="Écrivez votre message..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
               />
               <button 
                  onClick={handleSend}
                  disabled={loading}
                  className="bg-royalGold text-royalBlue p-2 rounded-full hover:bg-yellow-400 transition-colors disabled:opacity-50"
               >
                  <Send size={18} />
               </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
