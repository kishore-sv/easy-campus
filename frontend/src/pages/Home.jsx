import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, MessageCircle, Info, ChevronRight, Activity, Calendar, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const [faculties, setFaculties] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5001/api/faculty')
      .then(res => setFaculties(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredFaculties = faculties.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) || 
    f.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12">
      {/* Search Header */}
      <section className="relative overflow-hidden bg-primary rounded-[2.5rem] p-12 text-white shadow-2xl shadow-primary/30">
        <div className="relative z-10 max-w-2xl space-y-6">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black tracking-tight leading-[1.1]"
          >
            Find faculty members <span className="text-accent">&</span> navigate your campus
          </motion.h2>
          <p className="text-primary-foreground/90 text-xl font-medium max-w-lg mb-8 opacity-80 leading-relaxed">
            Search for your professors name or department to see where they are right now.
          </p>
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary group-focus-within:scale-110 transition-transform" />
            <input 
              type="text" 
              placeholder="Search by name, department, or office number..."
              className="w-full pl-14 pr-6 py-5 bg-white text-dark rounded-2xl shadow-xl outline-none focus:ring-4 focus:ring-accent/20 transition-all text-lg font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-[500px] h-full bg-white/5 skew-x-12 -mr-32 blur-3xl pointer-events-none"></div>
      </section>

      {/* Faculty Locator Heading */}
      <div className="flex items-center justify-between px-2">
        <h3 className="text-3xl font-black text-dark tracking-tight">Campus <span className="text-primary italic">Directory</span></h3>
        <p className="text-gray-500 font-bold bg-white px-5 py-2 rounded-full border border-gray-100 shadow-sm flex items-center gap-2">
          <Activity size={18} className="text-secondary" />
          {faculties.length} Staff Online
        </p>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {loading ? (
          Array(8).fill(0).map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-3xl" />
          ))
        ) : filteredFaculties.length > 0 ? (
          filteredFaculties.map((f, i) => (
            <motion.div 
              key={f._id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card group hover:-translate-y-2 transition-all p-8 border-none ring-1 ring-gray-100"
            >
              <div className="flex flex-col items-center text-center space-y-5">
                <div className="relative">
                   <img src={f.image} className="w-24 h-24 rounded-full border-4 border-white shadow-xl shadow-primary/10 object-cover" alt={f.name} />
                   <div className={`absolute bottom-0 right-1 w-6 h-6 border-4 border-white rounded-full ${
                     f.status === 'Available' ? 'bg-green-500' : 
                     f.status === 'In Class' ? 'bg-orange-500' : 'bg-red-500'
                   }`}></div>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-dark group-hover:text-primary transition-colors">{f.name}</h4>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">{f.department}</p>
                </div>
                
                <div className="w-full space-y-4 pt-4 border-t border-gray-50 flex flex-col items-center">
                  <div className="flex items-center gap-3 text-gray-500 font-semibold group-hover:text-dark transition-colors">
                    <MapPin size={18} className="text-primary" />
                    <span className="text-sm">{f.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400 font-bold">
                     <Info size={18} className="text-accent" />
                     <span className="text-sm">Cabin: {f.cabin}</span>
                  </div>
                  
                  <div className={`mt-2 px-6 py-2 rounded-full text-xs font-black uppercase tracking-tighter shadow-sm ${
                    f.status === 'Available' ? 'bg-green-50 text-green-600' : 
                    f.status === 'In Class' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {f.status}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200">
            <h4 className="text-2xl font-bold text-gray-400 mb-2">No results found</h4>
            <p className="text-gray-300">Try searching for a different name or department</p>
          </div>
        )}
      </div>

      {/* Navigation Quick Links */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Link to="/map" className="group relative h-[400px] overflow-hidden rounded-[3rem] shadow-2xl shadow-primary/20 flex items-end p-12 overflow-hidden bg-primary">
          <img src="https://images.unsplash.com/photo-1541339907198-e08756eaa58f?w=1000" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000" alt="Campus Map" />
          <div className="relative z-10 text-white space-y-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-6">
              <MapPin size={32} />
            </div>
            <h3 className="text-4xl font-black tracking-tight leading-none">Interactive <br/> Campus Map</h3>
            <p className="text-white/80 font-medium max-w-sm">Never get lost again. Find the quickest paths to labs, classrooms, and offices.</p>
            <div className="flex items-center gap-3 font-bold group-hover:gap-6 transition-all pt-4">
               Go to Map <ChevronRight size={24} />
            </div>
          </div>
        </Link>
        <Link to="/chatbot" className="group relative h-[400px] overflow-hidden rounded-[3rem] shadow-2xl shadow-secondary/20 flex items-end p-12 overflow-hidden bg-secondary">
          <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000" alt="Chatbot" />
          <div className="relative z-10 text-white space-y-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-6">
              <Zap size={32} />
            </div>
            <h3 className="text-4xl font-black tracking-tight leading-none">Smart Campus <br/> Assistant</h3>
            <p className="text-white/80 font-medium max-w-sm">Ask anything about faculty availability, canteen menus, or upcoming events.</p>
            <div className="flex items-center gap-3 font-bold group-hover:gap-6 transition-all pt-4">
               Chat with AI <ChevronRight size={24} />
            </div>
          </div>
        </Link>
      </section>
    </div>
  );
};

export default Home;
