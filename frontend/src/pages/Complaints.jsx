import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, MessageSquare, AlertCircle, Camera, Search, Plus, Filter, Activity, CheckCircle, ChevronRight, X, Clock, HelpCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();
  
  // Form State
  const [category, setCategory] = useState('Maintenance');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = () => {
    axios.get('http://localhost:5001/api/complaints/my-complaints', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setComplaints(res.data))
    .catch(console.error)
    .finally(() => setLoading(false));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('category', category);
    formData.append('description', description);
    if (image) formData.append('image', image);

    try {
      await axios.post('http://localhost:5001/api/complaints', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setShowModal(false);
      setSuccess(true);
      fetchComplaints();
      setTimeout(() => setSuccess(false), 5000);
      // Reset form
      setDescription(''); setImage(null);
    } catch (err) {
      alert("Failed to submit grievance");
    }
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Visual Header */}
      <section className="relative overflow-hidden bg-primary rounded-[3.5rem] p-16 text-white shadow-2xl shadow-primary/10">
        <div className="relative z-10 max-w-2xl space-y-8">
           <div className="flex gap-4">
              <span className="bg-white/20 backdrop-blur-xl border border-white/20 text-white font-black uppercase tracking-widest text-[10px] px-6 py-3 rounded-full flex items-center gap-2 shadow-inner">
                 <ShieldCheck size={14} className="text-secondary" />
                 Anonymous & Secure
              </span>
           </div>
           <h2 className="text-7xl font-black tracking-tighter leading-[0.9] italic uppercase">Grievance <br/> <span className="text-accent italic">Portal</span></h2>
           <p className="text-primary-foreground/80 text-xl font-medium leading-relaxed max-w-lg mb-8 opacity-80">
              Submit your concerns directly to the administration. Track resolution status in real-time.
           </p>
           <button 
             onClick={() => setShowModal(true)}
             className="btn-primary bg-white text-primary py-6 px-14 text-xl rounded-[2rem] shadow-2xl shadow-white/10 flex gap-4 hover:-translate-y-2 active:scale-95 transition-all font-black italic uppercase"
           >
              Raise Grievance <Plus size={24} />
           </button>
        </div>
        
        {/* Decorative Abstract Background */}
        <div className="absolute top-0 right-0 w-[500px] h-full bg-white/5 skew-x-12 -mr-32 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-accent/20 rounded-full blur-[100px] pointer-events-none"></div>
      </section>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white p-10 rounded-[3rem] border border-gray-100 flex flex-col justify-between h-48 shadow-sm">
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">Total Issues Filed</span>
            <div className="flex items-end justify-between">
               <span className="text-6xl font-black text-dark italic leading-none">{complaints.length}</span>
               <div className="w-12 h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center">
                  <MessageSquare size={24} />
               </div>
            </div>
         </div>
         <div className="bg-white p-10 rounded-[3rem] border border-gray-100 flex flex-col justify-between h-48 shadow-sm">
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">Resolved This Month</span>
            <div className="flex items-end justify-between">
               <span className="text-6xl font-black text-green-500 italic leading-none">{complaints.filter(c => c.status === 'Resolved').length}</span>
               <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center">
                  <CheckCircle size={24} />
               </div>
            </div>
         </div>
         <div className="bg-white p-10 rounded-[3rem] border border-gray-100 flex flex-col justify-between h-48 shadow-sm relative overflow-hidden group">
            <div className="relative z-10">
               <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">Response Time</span>
               <div className="flex items-end justify-between mt-6">
                  <span className="text-4xl font-black text-dark italic leading-none uppercase tracking-tighter">Under <br/> <span className="text-primary italic">24 Hours</span></span>
               </div>
            </div>
            <Activity size={100} className="absolute -right-5 -bottom-5 text-gray-50 group-hover:text-primary/10 transition-colors pointer-events-none" />
         </div>
      </div>

      {success && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="p-8 bg-green-50 border border-green-100 rounded-[2.5rem] flex items-center gap-6 shadow-xl shadow-green-500/5">
           <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/20">
              <CheckCircle size={32} />
           </div>
           <div>
             <h4 className="text-2xl font-black text-green-700 tracking-tight">Grievance Submitted</h4>
             <p className="text-green-600 font-bold mt-1 uppercase tracking-widest text-xs">A ticket has been assigned to our administration team.</p>
           </div>
        </motion.div>
      )}

      {/* Grievance Table/Feed */}
      <div className="space-y-8">
        <h3 className="text-3xl font-black text-dark tracking-tight px-4">Your Recent <span className="text-primary italic">Reports</span></h3>
        
        <div className="grid grid-cols-1 gap-6">
          {loading ? (
             Array(3).fill(0).map((_, i) => <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-[2.5rem]" />)
          ) : complaints.length > 0 ? (
            complaints.map((c, i) => (
              <motion.div 
                key={c._id} 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col md:flex-row items-center gap-10 group"
              >
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                   c.status === 'Pending' ? 'bg-orange-50 text-orange-500 shadow-orange-500/10' : 
                   c.status === 'Resolved' ? 'bg-green-50 text-green-500 shadow-green-500/10' : 
                   'bg-primary/5 text-primary shadow-primary/10'
                }`}>
                   <AlertCircle size={28} />
                </div>
                
                <div className="flex-1 space-y-2">
                   <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black text-primary bg-primary/5 px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-sm">{c.category}</span>
                      <span className="text-xs font-bold text-gray-300 flex items-center gap-2">
                         <Clock size={12} /> {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                   </div>
                   <h4 className="text-2xl font-black text-dark group-hover:text-primary transition-colors italic leading-none">{c.description}</h4>
                </div>

                <div className="flex items-center gap-8">
                   {c.image && (
                     <div className="w-14 h-14 bg-gray-50 rounded-2xl overflow-hidden ring-4 ring-white shadow-sm group-hover:scale-110 transition-transform">
                        <img src={`http://localhost:5001${c.image}`} className="w-full h-full object-cover" alt="Proof" />
                     </div>
                   )}
                   <div className={`px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-sm ${
                      c.status === 'Pending' ? 'bg-orange-500 text-white' : 
                      c.status === 'Resolved' ? 'bg-green-500 text-white' : 
                      'bg-primary text-white'
                   }`}>
                      {c.status}
                   </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-24 text-center bg-white rounded-[4rem] border-2 border-dashed border-gray-100">
               <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-200 mx-auto mb-6">
                  <ShieldCheck size={48} />
               </div>
               <h4 className="text-3xl font-black text-gray-300 italic uppercase">Secure Portal Ready</h4>
               <p className="text-gray-200 font-bold uppercase mt-2 tracking-widest">You haven't filed any grievances yet. Your identity is always protected.</p>
            </div>
          )}
        </div>
      </div>

      {/* Raise Grievance Modal */}
      <AnimatePresence>
      {showModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-dark/95 backdrop-blur-2xl z-50 flex items-center justify-center p-6"
        >
          <motion.div 
             initial={{ scale: 0.9, y: 50, opacity: 0 }}
             animate={{ scale: 1, y: 0, opacity: 1 }}
             className="bg-white max-w-2xl w-full rounded-[4rem] p-14 shadow-2xl relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>
             
             <div className="flex items-center justify-between mb-12 relative z-10">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center text-white shadow-xl shadow-primary/20 rotate-6 group hover:rotate-0 transition-transform">
                      <AlertCircle size={28} />
                   </div>
                   <div>
                     <h3 className="text-4xl font-black text-dark tracking-tighter uppercase italic leading-none">Lodge <span className="text-primary italic">Complaint</span></h3>
                     <p className="text-xs font-black text-gray-300 uppercase mt-2 tracking-widest">Submit your concern directly to PU Admin</p>
                   </div>
                </div>
                <button onClick={() => setShowModal(false)} className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                   <X size={24} />
                </button>
             </div>

             <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-dark uppercase tracking-widest ml-4">Category</label>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {['Maintenance', 'Security', 'Academic', 'Facilities', 'Other'].map(cat => (
                        <button 
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all ${category === cat ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-gray-50 text-gray-400 border-gray-100 hover:border-primary/20'}`}
                        >
                           {cat}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-3">
                   <label className="text-[10px] font-black text-dark uppercase tracking-widest ml-4">Brief Explanation</label>
                   <textarea 
                      className="input-field py-4 rounded-[2.5rem] bg-gray-50/50 min-h-[160px] resize-none" 
                      placeholder="Describe the issue in detail. Include location and time if possible..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                   />
                </div>

                <div className="space-y-3">
                   <label className="text-[10px] font-black text-dark uppercase tracking-widest ml-4">Attach Visual Proof (Optional)</label>
                   <div className="flex gap-4">
                      <input 
                        type="file" 
                        id="comp-img" 
                        className="hidden" 
                        onChange={(e) => setImage(e.target.files[0])}
                      />
                      <label 
                        htmlFor="comp-img" 
                        className="flex-1 btn-secondary py-5 rounded-2xl flex items-center justify-center gap-3 cursor-pointer shadow-sm active:scale-95 transition-all text-xs font-black uppercase tracking-widest border-primary/10"
                      >
                         {image ? "Image Captured" : "Attach Photo"} <Camera size={18} />
                      </label>
                   </div>
                </div>

                <button type="submit" className="w-full btn-primary py-6 mt-8 rounded-[2rem] text-xl font-black shadow-2xl flex gap-4 hover:-translate-y-2 active:scale-95 transition-all uppercase italic tracking-tighter">
                   Submit Report <ChevronRight size={24} />
                </button>
                
                <p className="text-[10px] font-black text-gray-300 text-center uppercase tracking-widest mt-4">PU Secure Grievance Protocol v4.0.2 • End-to-End Encrypted Registry</p>
             </form>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default Complaints;
