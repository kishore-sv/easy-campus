import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, User, Bot, Sparkles, Navigation, X, Terminal, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'model', text: "Hello! I am your PU AI Assistant. How can I help you navigate Presidency University today? You can ask me about faculty locations, fees, or campus facilities." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/chatbot/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input,
          history: messages.slice(-6).map(m => ({ role: m.role, text: m.text }))
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to get AI response. Check your API key.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiMessageContent = "";
      let buffer = "";

      // Add a placeholder message for AI
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // Keep the last partial line in the buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const data = trimmed.slice(6);
            if (data === '[DONE]') break;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                aiMessageContent += parsed.text;
                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: 'model', text: aiMessageContent };
                  return updated;
                });
              }
            } catch (e) {}
          }
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: `ERROR: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-180px)] flex flex-col bg-white rounded-[3.5rem] shadow-2xl border border-gray-100 overflow-hidden relative">
      {/* Premium Header */}
      <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-primary relative overflow-hidden">
        <div className="flex items-center gap-6 relative z-10 text-white">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-xl shadow-black/10">
             <Bot size={32} />
          </div>
          <div>
            <div className="flex items-center gap-3">
               <h2 className="text-3xl font-black italic uppercase tracking-tighter">Campus <span className="text-secondary italic">Genius</span></h2>
               <div className="px-3 py-1 bg-white/10 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/10">v2.5 AI Pro</div>
            </div>
            <p className="text-white/60 font-bold uppercase tracking-widest text-[10px] mt-1">AI-Powered University Guide • Real-time Sync</p>
          </div>
        </div>
        <div className="flex gap-3 relative z-10">
           <button className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/10"><Terminal size={20}/></button>
           <button className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/10"><Command size={20}/></button>
        </div>
        
        {/* Abstract Background Design */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar bg-gray-50/30">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-5`}
            >
              {m.role === 'model' && (
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0 mb-1">
                   <Bot size={18} />
                </div>
              )}
              
              <div
                className={`max-w-xl p-8 rounded-[2.5rem] shadow-sm relative group overflow-hidden ${
                  m.role === 'user'
                    ? 'bg-primary text-white rounded-br-lg shadow-primary/20 shadow-xl'
                    : 'bg-white border border-gray-100 text-dark rounded-bl-lg shadow-md'
                }`}
              >
                {m.role === 'user' && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-xl"></div>
                )}
                <div className={`text-base leading-relaxed ${m.role === 'user' ? 'font-bold' : 'font-medium'}`}>
                  {m.text || (isLoading && i === messages.length - 1 ? "..." : "")}
                </div>
                <div className={`text-[8px] font-black uppercase tracking-widest mt-4 opacity-30 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {m.role === 'user' ? 'Authenticated Student' : 'PU Campus Brain'}
                </div>
              </div>

              {m.role === 'user' && (
                <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 shadow-sm flex-shrink-0 mb-1 border border-white">
                   <User size={18} />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <div className="p-10 bg-white border-t border-gray-50 relative">
        {isLoading && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-primary px-6 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-xl animate-bounce">
             Syncing with PU Brain...
          </div>
        )}
        <form onSubmit={handleSendMessage} className="relative max-w-4xl mx-auto flex gap-4">
           <div className="relative flex-1 group">
             <div className="absolute inset-y-0 left-8 flex items-center text-gray-400 group-focus-within:text-primary transition-colors">
               <Sparkles size={20} />
             </div>
             <input
               type="text"
               placeholder="How do I find a faculty? What is the fee for MBA?"
               className="w-full pl-20 pr-10 py-6 bg-gray-50/50 border border-transparent rounded-[2rem] outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-gray-700 shadow-inner"
               value={input}
               onChange={(e) => setInput(e.target.value)}
             />
           </div>
           <button
             type="submit"
             disabled={isLoading}
             className="w-20 h-20 bg-primary text-white rounded-3xl flex items-center justify-center shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50"
           >
             <Send size={28} />
           </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
