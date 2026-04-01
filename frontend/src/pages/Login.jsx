import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ShieldCheck, ChevronRight, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light p-6 overflow-hidden relative">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>

      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-[480px] bg-white rounded-[3rem] p-12 shadow-2xl shadow-primary/10 border border-gray-100/50 relative z-10"
      >
        <div className="text-center mb-10">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl shadow-primary/20 rotate-6 group hover:rotate-0 transition-transform">
            <MessageSquare size={32} />
          </div>
          <h1 className="text-4xl font-black text-dark tracking-tight">Welcome <span className="text-primary italic">Back</span></h1>
          <p className="text-gray-400 font-bold mt-2 uppercase tracking-widest text-xs">Access your Campus Hub</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3">
             <div className="w-2 h-2 bg-red-500 rounded-full"></div>
             {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-black text-dark uppercase tracking-wider ml-1">University Email</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="email" 
                placeholder="name.rollno@presidencyuniversity.in"
                className="input-field pl-14 py-4 bg-gray-50/50 border-gray-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-dark uppercase tracking-wider ml-1">Secure Password</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="password" 
                placeholder="••••••••"
                className="input-field pl-14 py-4 bg-gray-50/50 border-gray-100"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="w-full btn-primary py-5 text-lg flex gap-3 hover:-translate-y-1 hover:shadow-primary/30 active:translate-y-0 shadow-xl">
             Sign In <ChevronRight size={20} className="mt-0.5" />
          </button>
        </form>

        <div className="mt-10 text-center space-y-4">
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest leading-relaxed">
            Accounts are pre-provided by administration.<br/>
            Contact helpdesk if you cannot access.
          </p>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-50">
           <div className="flex items-center justify-between text-gray-300">
              <div className="flex items-center gap-2">
                 <ShieldCheck size={16} />
                 <span className="text-xs font-bold uppercase tracking-tighter">SSL Secure</span>
              </div>
              <span className="text-xs font-bold tracking-tighter">V1.0.4 - MITM Protected</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
