import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

interface ChatWidgetProps {
  lang: 'fr' | 'en';
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  // Initialize welcome message when language changes, but keep history if already open
  useEffect(() => {
    if (!hasInitialized.current) {
        const initialText = lang === 'fr' 
            ? 'Bonjour ! Je suis l\'assistant IA d\'All\'Pro. Comment puis-je vous aider à transformer vos idées en projets ?'
            : 'Hello! I am All\'Pro\'s AI assistant. How can I help you turn your ideas into projects?';
        setMessages([{ role: 'model', text: initialText }]);
        hasInitialized.current = true;
    }
  }, []); // Only run once on mount for simplicity, or we could reset on lang change if desired

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      // Append a small context hint if language is english to guide Gemini
      const messageToSend = lang === 'en' ? `${userMsg} (Please answer in English)` : userMsg;
      const response = await sendMessageToGemini(messageToSend);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: lang === 'fr' ? "Désolé, j'ai rencontré une erreur de connexion." : "Sorry, I encountered a connection error." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-allpro text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-bounce active:scale-90"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {isOpen && (
        <div className="glass-panel w-80 md:w-96 rounded-2xl flex flex-col h-[500px] shadow-2xl overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-allpro p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <span className="font-heading font-semibold">All'Pro AI Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-full p-1 transition hover:rotate-90 duration-300">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/30">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-allpro-rose text-white rounded-br-none'
                      : 'bg-white text-allpro-aubergine shadow-sm rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white text-allpro-aubergine p-3 rounded-2xl rounded-bl-none shadow-sm text-xs italic flex items-center gap-2">
                  <div className="w-2 h-2 bg-allpro-rose rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-allpro-orange rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-allpro-yellow rounded-full animate-bounce delay-200"></div>
                  {lang === 'fr' ? 'Reflexion en cours...' : 'Thinking...'}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white/50 border-t border-white/40">
            <div className="flex items-center gap-2 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={lang === 'fr' ? "Posez votre question..." : "Ask your question..."}
                className="w-full bg-white/80 border border-white/50 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-allpro-rose text-allpro-aubergine placeholder-allpro-aubergine/50 text-sm transition-all focus:scale-[1.01]"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="absolute right-2 p-1.5 bg-gradient-allpro text-white rounded-full hover:shadow-md disabled:opacity-50 transition active:scale-90 hover:scale-110 duration-200"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;