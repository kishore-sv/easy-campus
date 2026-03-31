import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Hello! I'm your Easy Campus AI Assistant. How can I help you navigate the campus today?", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { type: 'user', text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5001/api/chatbot/query', { message: input });
      const botMsg = { type: 'bot', text: res.data.response, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = { type: 'bot', text: "Sorry, I'm having trouble connecting to my brain right now.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col bg-white rounded-[3rem] shadow-2xl shadow-primary/5 border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-10 py-6 border-b border-gray-50 flex items-center justify-between bg-primary/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Bot size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-dark">Campus Assistant</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Always Online</span>
            </div>
          </div>
        </div>
        <div className="hidden md:flex gap-2">
           {['Where is Dr. Sunitha?', 'Events this week', 'Is tomorrow a holiday?'].map(tip => (
             <button 
               key={tip}
               onClick={() => setInput(tip)}
               className="text-xs font-bold bg-white border border-gray-100 px-4 py-2 rounded-full hover:border-primary/30 hover:text-primary transition-all shadow-sm"
             >
               {tip}
             </button>
           ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar bg-gray-50/30">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: msg.type === 'user' ? 20 : -20, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] flex gap-4 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${msg.type === 'user' ? 'bg-secondary text-white' : 'bg-white text-primary border border-gray-100'}`}>
                  {msg.type === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={`space-y-1 ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-6 py-4 rounded-3xl shadow-sm leading-relaxed font-medium ${msg.type === 'user' ? 'bg-secondary text-white rounded-tr-none' : 'bg-white text-dark border border-gray-100 rounded-tl-none'}`}>
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-tighter px-2">{msg.time}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
             <div className="flex gap-4 items-center bg-white border border-gray-100 px-6 py-4 rounded-3xl shadow-sm">
                <div className="flex gap-1">
                   <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                   <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                   <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">AI is thinking...</span>
             </div>
          </motion.div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="p-8 bg-white border-t border-gray-50">
        <form onSubmit={handleSend} className="relative group">
          <input 
            type="text" 
            placeholder="Search for faculty, navigate campus, or ask about events..."
            className="w-full bg-gray-50/50 border border-gray-100 pl-10 pr-24 py-6 rounded-[2rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-lg font-medium shadow-inner"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors">
             <Sparkles size={18} />
          </div>
          <button 
            type="submit" 
            className="absolute right-4 top-1/2 -translate-y-1/2 btn-primary p-3 rounded-2xl"
            disabled={loading}
          >
            <Send size={20} />
          </button>
        </form>
        <p className="text-center text-[10px] text-gray-300 font-bold uppercase tracking-widest mt-4">Easy Campus AI Assistant V2.1 • Powered by Presidency Logic Engine</p>
      </div>
    </div>
  );
};

export default Chatbot;
