import React, { useState } from 'react';
import { Search, MapPin, Info, Navigation, ArrowRight, Activity, ChevronRight, Minimize, Layers, Zap, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Map = () => {
  const [search, setSearch] = useState('');
  const [activePin, setActivePin] = useState(null);

  const locations = [
    { id: 1, name: "L-Block Workstation", x: "32%", y: "45%", type: "Lab", floors: "Ground, 1st, 2nd" },
    { id: 2, name: "S-Block Seminar Hall", x: "65%", y: "25%", type: "Hall", floors: "Ground Only" },
    { id: 3, name: "Main Canteen", x: "48%", y: "75%", type: "Food", floors: "Basement, Ground" },
    { id: 4, name: "Admin Office", x: "20%", y: "20%", type: "Office", floors: "1st Floor" },
    { id: 5, name: "Library", x: "78%", y: "55%", type: "Study", floors: "All Floors" },
  ];

  const filteredLocations = locations.filter(loc => 
    loc.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-24">
      {/* Header with Search */}
      <section className="relative overflow-hidden bg-primary rounded-[3.5rem] p-16 text-white shadow-2xl shadow-primary/10">
        <div className="relative z-10 max-w-2xl space-y-8">
           <div className="flex gap-4">
              <span className="bg-white/20 backdrop-blur-xl border border-white/20 text-white font-black uppercase tracking-widest text-[10px] px-6 py-3 rounded-full flex items-center gap-2 shadow-inner">
                 <Navigation size={14} className="text-accent" />
                 Precision GPS Enabled
              </span>
           </div>
           <h2 className="text-7xl font-black tracking-tighter leading-[0.9] italic uppercase">Campus <br/> <span className="text-accent italic">Navigator</span></h2>
           <p className="text-primary-foreground/80 text-xl font-medium leading-relaxed max-w-lg mb-8 opacity-80">
              Interactive high-resolution campus mapping for classrooms, labs, and office locations.
           </p>
           
           <div className="relative max-w-md group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary group-focus-within:scale-110 transition-transform" />
              <input 
                type="text" 
                placeholder="Search for classroom, lab, or office..."
                className="w-full pl-16 pr-8 py-5 bg-white text-dark rounded-2xl shadow-xl outline-none focus:ring-4 focus:ring-accent/20 transition-all text-lg font-bold"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
        </div>
        
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-[500px] h-full bg-white/5 skew-x-12 -mr-32 blur-3xl pointer-events-none"></div>
      </section>

      {/* Map Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Map UI */}
        <div className="lg:col-span-3 space-y-8">
           <div className="relative bg-white rounded-[4rem] p-4 shadow-2xl shadow-primary/5 border border-gray-100 overflow-hidden min-h-[700px] flex group">
              <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
                 <img 
                   src="https://images.unsplash.com/photo-1541339907198-e08756eaa58f?w=1200" 
                   className="w-full h-full object-cover opacity-80 scale-105 group-hover:scale-100 transition-transform duration-1000 grayscale group-hover:grayscale-0" 
                   alt="Campus Map" 
                 />
                 <div className="absolute inset-0 bg-primary/10 mix-blend-multiply opacity-20"></div>
              </div>

              {/* Hotspots */}
              {locations.map(loc => (
                <motion.button 
                  key={loc.id}
                  onClick={() => setActivePin(loc)}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.2, zIndex: 10 }}
                  style={{ left: loc.x, top: loc.y }}
                  className={`absolute w-12 h-12 -ml-6 -mt-6 rounded-3xl shadow-xl flex items-center justify-center transition-all ${activePin?.id === loc.id ? 'bg-accent text-white ring-8 ring-accent/20 scale-125' : 'bg-white text-primary ring-4 ring-white/50'}`}
                >
                   <MapPin size={24} />
                   <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full text-[10px] font-black uppercase text-dark shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap`}>
                      {loc.name}
                   </div>
                </motion.button>
              ))}

              {/* Map Overlays */}
              <div className="absolute bottom-10 right-10 flex flex-col gap-4">
                 <button className="w-16 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center text-primary border border-gray-100 hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1 active:scale-95">
                    <Layers size={24} />
                 </button>
                 <button className="w-16 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center text-primary border border-gray-100 hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1 active:scale-95">
                    <Minimize size={24} />
                 </button>
              </div>

              {/* Live Status Overlay */}
              <div className="absolute top-10 left-10 p-6 bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl space-y-4 border border-white/50 border-white max-w-[280px]">
                 <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest leading-none mt-0.5">Real-time Traffic</span>
                 </div>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">
                       <span>Campus Crowds</span>
                       <span className="text-secondary italic">Low Density</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                       <span>Labs Status</span>
                       <span className="text-primary italic">80% Open</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-10">
              <div className="w-16 h-16 bg-primary/5 rounded-3xl flex items-center justify-center text-primary flex-shrink-0">
                 <Zap size={28} />
              </div>
              <div className="flex-1 space-y-1">
                 <h4 className="text-2xl font-black text-dark tracking-tight leading-none uppercase italic">Highlight <span className="text-primary">Path</span></h4>
                 <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Select a destination to visualize the shortest route via corridors.</p>
              </div>
              <div className="flex gap-4">
                 <button className="px-10 py-5 bg-gray-50 text-gray-400 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-primary hover:text-white transition-all shadow-xl shadow-primary/5">
                    Select Start
                 </button>
                 <button className="px-10 py-5 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95 transition-all">
                    Navigate
                 </button>
              </div>
           </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-8">
           <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm space-y-8 min-h-[500px] flex flex-col">
              <h4 className="text-2xl font-black text-dark tracking-tight leading-none uppercase italic">Location <span className="text-primary italic">Search</span></h4>
              
              <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar flex-1">
                <AnimatePresence>
                {filteredLocations.map((loc, i) => (
                  <motion.button 
                    key={loc.id}
                    onClick={() => setActivePin(loc)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`w-full text-left p-6 rounded-3xl border transition-all flex flex-col gap-3 group overflow-hidden relative ${activePin?.id === loc.id ? 'bg-primary border-primary shadow-2xl shadow-primary/20' : 'bg-gray-50 border-gray-50 hover:border-primary/20 hover:bg-white'}`}
                  >
                    {activePin?.id === loc.id && (
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-xl"></div>
                    )}
                    <div className="flex items-center justify-between">
                       <span className={`text-[10px] font-black uppercase tracking-widest ${activePin?.id === loc.id ? 'text-white/60' : 'text-gray-300'}`}>{loc.type}</span>
                       <ArrowRight size={16} className={activePin?.id === loc.id ? 'text-white' : 'text-gray-200'} />
                    </div>
                    <h5 className={`text-xl font-black leading-none uppercase italic ${activePin?.id === loc.id ? 'text-white italic' : 'text-dark'}`}>{loc.name}</h5>
                    <div className="flex gap-2">
                       {loc.floors.split(',').map(f => (
                         <span key={f} className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${activePin?.id === loc.id ? 'bg-white/20 text-white' : 'bg-white text-gray-400 shadow-sm'}`}>
                            {f.trim()}
                         </span>
                       ))}
                    </div>
                  </motion.button>
                ))}
                </AnimatePresence>
                {filteredLocations.length === 0 && (
                   <div className="py-24 text-center space-y-4">
                      <Search size={40} className="mx-auto text-gray-100" />
                      <p className="text-xs font-black text-gray-200 uppercase tracking-widest">No Matches</p>
                   </div>
                )}
              </div>

              <div className="pt-8 border-t border-gray-50 flex items-center gap-4">
                 <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-white shadow-lg shadow-accent/20">
                    <Sparkles size={20} />
                 </div>
                 <div className="flex-1">
                    <p className="text-[10px] font-black text-dark uppercase tracking-widest">Smart Suggestion</p>
                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase italic tracking-tighter">Your Class in 15m at L-Block 201</p>
                 </div>
              </div>
           </div>
           
           <div className="bg-dark p-12 rounded-[3.5rem] text-white shadow-2xl shadow-primary/10 space-y-8 relative overflow-hidden group">
              <div className="relative z-10 space-y-6">
                 <Info size={40} className="text-primary" />
                 <h4 className="text-3xl font-black leading-[0.9] uppercase italic tracking-tighter">Need <br/> <span className="text-primary">Help?</span></h4>
                 <p className="text-gray-400 font-bold leading-relaxed text-sm opacity-80 uppercase tracking-widest text-xs">If you are unable to find a specific location, please reach out to the campus helpdesk at Gate 2.</p>
                 <button className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                    View FAQ <ChevronRight size={18} />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
