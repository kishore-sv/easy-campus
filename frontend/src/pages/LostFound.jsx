import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HelpCircle, MapPin, Camera, Search, Plus, Filter, Activity, CheckCircle, ChevronRight, X, Clock, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const LostFound = () => {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('Lost');
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    axios.get('http://localhost:5001/api/lost-found')
      .then(res => setItems(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('status', status);
    if (image) formData.append('image', image);

    try {
      await axios.post('http://localhost:5001/api/lost-found', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setShowModal(false);
      fetchItems();
      // Reset form
      setTitle(''); setDescription(''); setLocation(''); setStatus('Lost'); setImage(null);
    } catch (err) {
      alert("Failed to report item");
    }
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Visual Header */}
      <section className="relative overflow-hidden bg-dark rounded-[3.5rem] p-16 text-white shadow-2xl shadow-primary/10">
        <div className="relative z-10 max-w-2xl space-y-8">
           <div className="flex gap-4">
              <span className="bg-primary/20 backdrop-blur-xl border border-primary/20 text-primary-foreground font-black uppercase tracking-widest text-[10px] px-6 py-3 rounded-full flex items-center gap-2 shadow-inner">
                 <Activity size={14} className="text-accent" />
                 Live Recovery Network
              </span>
           </div>
           <h2 className="text-7xl font-black tracking-tighter leading-[0.9] italic uppercase">Lost <span className="text-primary">&</span> <br/> <span className="text-primary italic">Found</span></h2>
           <p className="text-gray-400 text-xl font-medium leading-relaxed max-w-lg mb-8 opacity-80">
              A community-driven system to track misplaced belongings across the university campus.
           </p>
           <div className="flex gap-6">
              <button 
                onClick={() => setShowModal(true)}
                className="btn-primary py-6 px-14 text-xl rounded-[2rem] shadow-2xl shadow-primary/30 flex gap-4 hover:-translate-y-2 active:scale-95 transition-all"
              >
                 Report Item <Plus size={24} />
              </button>
              <div className="hidden md:flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-3 rounded-[2rem] backdrop-blur-xl">
                 <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-4 border-dark overflow-hidden bg-gray-800">
                         <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                      </div>
                    ))}
                 </div>
                 <span className="text-xs font-black uppercase tracking-widest text-primary-foreground leading-none">24 Items <br/> Recovered today</span>
              </div>
           </div>
        </div>
        
        {/* Decorative Abstract Background */}
        <div className="absolute top-0 right-0 w-[45%] h-full flex items-center justify-center opacity-20 pointer-events-none skew-x-12">
           <HelpCircle size={600} strokeWidth={0.5} className="text-white" />
        </div>
      </section>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-10">
           <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm space-y-8">
              <h4 className="text-2xl font-black text-dark tracking-tight leading-none uppercase italic">Filter <span className="text-primary">Feed</span></h4>
              
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest ml-4">Status</label>
                 <div className="flex flex-col gap-3">
                    {['All Items', 'Lost Items', 'Found Items'].map(cat => (
                      <button 
                        key={cat}
                        className={`w-full text-left px-6 py-4 rounded-2xl font-bold transition-all border ${cat === 'All Items' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-gray-50 text-gray-400 border-gray-50 hover:border-primary/20 hover:text-primary'}`}
                      >
                         {cat}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-50">
                 <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest ml-4">Quick Search</label>
                 <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      type="text" 
                      placeholder="e.g. iPhone, Bottle..."
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm"
                    />
                 </div>
              </div>
           </div>

           <div className="bg-primary p-10 rounded-[3rem] text-white shadow-2xl shadow-primary/10 space-y-6 relative overflow-hidden group">
              <div className="relative z-10 space-y-4">
                 <Info size={32} className="text-accent" />
                 <h4 className="text-2xl font-black leading-tight uppercase italic">Security <br/> Reminder</h4>
                 <p className="text-primary-foreground/70 font-semibold leading-relaxed text-sm">Always verify ownership by asking for specific details about found items. Report suspicious activity.</p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
           </div>
        </div>

        {/* Feed Grid */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-10">
          {loading ? (
             Array(4).fill(0).map((_, i) => <div key={i} className="h-96 bg-gray-100 animate-pulse rounded-[3.5rem]" />)
          ) : items.length > 0 ? (
            items.map((item, i) => (
              <motion.div 
                key={item._id} 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[3.5rem] p-10 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all group flex flex-col overflow-hidden"
              >
                <div className="h-64 rounded-[2.5rem] overflow-hidden mb-8 relative shadow-inner ring-4 ring-gray-50/50">
                  <img src={item.image.startsWith('http') ? item.image : `http://localhost:5001${item.image}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={item.title} />
                  <div className={`absolute top-6 left-6 px-6 py-2 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl ${item.status === 'Lost' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                     Status: {item.status}
                  </div>
                </div>
                
                <div className="flex-1 space-y-6">
                   <div className="space-y-3">
                      <h4 className="text-3xl font-black text-dark group-hover:text-primary transition-colors leading-tight italic uppercase">{item.title}</h4>
                      <p className="text-gray-400 font-medium leading-relaxed line-clamp-3">{item.description}</p>
                   </div>
                   
                   <div className="pt-6 border-t border-gray-50 grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 text-gray-500 font-black text-[10px] uppercase tracking-widest">
                         <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-primary">
                            <MapPin size={16} />
                         </div>
                         {item.location}
                      </div>
                      <div className="flex items-center gap-3 text-gray-500 font-black text-[10px] uppercase tracking-widest">
                         <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-secondary">
                            <Clock size={16} />
                         </div>
                         {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                   </div>
                   
                   <button className="w-full btn-secondary py-5 px-8 flex items-center justify-center gap-4 text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-primary hover:text-white border-primary/20 transition-all shadow-lg shadow-primary/5 active:scale-95">
                      Contact Submitter <ChevronRight size={18} />
                   </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-32 text-center bg-white rounded-[4rem] border-2 border-dashed border-gray-100">
               <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-200 mx-auto mb-6">
                  <HelpCircle size={48} />
               </div>
               <h4 className="text-3xl font-black text-gray-300 italic uppercase">Feed is Empty</h4>
               <p className="text-gray-200 font-bold uppercase mt-2 tracking-widest">No reports have been submitted yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal for reporting items */}
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
                  <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center text-white shadow-xl shadow-primary/20 rotate-6 group hover:rotate-0 transition-transform flex-shrink-0">
                     <Camera size={28} />
                  </div>
                  <div>
                    <h3 className="text-4xl font-black text-dark tracking-tighter uppercase italic leading-none">Report <span className="text-primary">Item</span></h3>
                    <p className="text-xs font-black text-gray-300 uppercase mt-2 tracking-widest">Help the community recover belongings</p>
                  </div>
               </div>
               <button onClick={() => setShowModal(false)} className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                  <X size={24} />
               </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-dark uppercase tracking-widest ml-4">Item Name</label>
                    <input 
                      className="input-field py-4 rounded-2xl bg-gray-50/50" 
                      placeholder="e.g. Silver Laptop Bag" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      required 
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-dark uppercase tracking-widest ml-4">Status</label>
                    <div className="flex gap-4">
                       <button 
                         type="button" 
                         onClick={() => setStatus('Lost')}
                         className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all ${status === 'Lost' ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20' : 'bg-gray-50 text-gray-400 border-gray-100'}`}
                       >
                          Misplaced
                       </button>
                       <button 
                         type="button" 
                         onClick={() => setStatus('Found')}
                         className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all ${status === 'Found' ? 'bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/20' : 'bg-gray-50 text-gray-400 border-gray-100'}`}
                       >
                          Found
                       </button>
                    </div>
                 </div>
              </div>

              <div className="space-y-3">
                 <label className="text-[10px] font-black text-dark uppercase tracking-widest ml-4">Detailed Description</label>
                 <textarea 
                    className="input-field py-4 rounded-[2rem] bg-gray-50/50 min-h-[140px] resize-none" 
                    placeholder="Provide unique identifiers (brand, color, stickers)..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                 />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-dark uppercase tracking-widest ml-4">Last Seen / Found At</label>
                    <div className="relative">
                       <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
                       <input 
                         className="input-field pl-14 py-4 rounded-2xl bg-gray-50/50" 
                         placeholder="e.g. L-Block Workstation" 
                         value={location} 
                         onChange={(e) => setLocation(e.target.value)} 
                         required 
                       />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-dark uppercase tracking-widest ml-4">Visual Proof</label>
                    <div className="flex gap-4">
                       <input 
                         type="file" 
                         id="item-img" 
                         className="hidden" 
                         onChange={(e) => setImage(e.target.files[0])}
                       />
                       <label 
                         htmlFor="item-img" 
                         className="flex-1 btn-secondary py-4 rounded-2xl flex items-center justify-center gap-3 cursor-pointer shadow-sm active:scale-95 transition-all text-xs border-primary/10"
                       >
                          {image ? "Photo Attached" : "Capture Photo"} <Camera size={18} />
                       </label>
                    </div>
                 </div>
              </div>

              <button type="submit" className="w-full btn-primary py-6 mt-8 rounded-[2rem] text-xl font-black shadow-2xl flex gap-4 hover:-translate-y-2 active:scale-95 transition-all uppercase italic tracking-tighter">
                 Post to Network <ChevronRight size={24} />
              </button>
              
              <div className="pt-8 border-t border-gray-50 flex items-center justify-center gap-2 text-gray-300">
                 <CheckCircle size={14} />
                 <span className="text-[10px] font-black uppercase tracking-widest text-center mt-0.5">Report will be visible to all campus users immediately</span>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default LostFound;
