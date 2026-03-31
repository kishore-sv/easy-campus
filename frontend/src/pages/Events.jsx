import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Users, Ticket, CheckCircle, ChevronRight, Info, Search, Activity, Sparkles } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    axios.get('http://localhost:5001/api/events')
      .then(res => setEvents(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const registerForEvent = async (id) => {
    try {
      await axios.post(`http://localhost:5001/api/events/${id}/register`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess("Ticket generated successfully!");
      fetchEvents();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(search.toLowerCase()) || 
    e.venue.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-24">
      {/* Featured Header */}
      <section className="relative h-[480px] bg-dark rounded-[3.5rem] p-16 text-white overflow-hidden shadow-2xl flex flex-col justify-end">
        <img 
          src="https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=1200" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105" 
          alt="Events Banner" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent"></div>
        
        <div className="relative z-10 space-y-8 max-w-2xl">
          <div className="flex gap-4">
             <span className="bg-primary/20 backdrop-blur-xl border border-primary/20 text-primary-foreground font-black uppercase tracking-widest text-[10px] px-5 py-2.5 rounded-full flex items-center gap-2">
                <Sparkles size={14} className="text-accent" />
                Featured Event
             </span>
             <span className="bg-white/10 backdrop-blur-xl border border-white/10 text-white font-black uppercase tracking-widest text-[10px] px-5 py-2.5 rounded-full">
                Tickets Available
             </span>
          </div>
          <h2 className="text-7xl font-black tracking-tighter leading-[0.9]">Campus <br/> Tech <span className="text-primary italic">Hack</span></h2>
          <p className="text-gray-300 text-xl font-medium leading-relaxed max-w-lg mb-4">
            Join the biggest innovation challenge of the year. Build, code, and win prizes totaling over $5000.
          </p>
          <div className="flex gap-4">
             <button className="btn-primary py-5 rounded-3xl px-12 text-lg shadow-xl hover:shadow-primary/40 active:scale-95 transition-all">
                Register Now
             </button>
             <button className="bg-white/10 backdrop-blur-xl border border-white/20 text-white font-black py-5 px-10 rounded-3xl hover:bg-white/20 transition-all">
                Learn More
             </button>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between px-4">
         <div className="space-y-1">
            <h3 className="text-3xl font-black text-dark tracking-tight">Recent <span className="text-primary italic">Events</span></h3>
            <p className="text-gray-400 font-bold bg-white px-5 py-2 rounded-full border border-gray-100 shadow-sm flex items-center gap-2 w-fit text-xs uppercase tracking-widest">
               <Activity size={14} className="text-secondary" />
               {events.length} Live Schedules
            </p>
         </div>
         <div className="relative w-full max-w-md group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search specific title or venue..."
              className="w-full pl-14 py-5 bg-white border border-gray-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
         </div>
      </div>

      {success && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 p-8 bg-green-50 border border-green-100 rounded-[2.5rem] flex items-center gap-6 shadow-xl shadow-green-500/5"
        >
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/20">
             <CheckCircle size={32} />
          </div>
          <div>
            <h4 className="text-2xl font-black text-green-700 tracking-tight">Success!</h4>
            <p className="text-green-600 font-bold mt-1 uppercase tracking-widest text-xs">Your registration is confirmed. View your ticket below.</p>
          </div>
        </motion.div>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 px-2">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-96 bg-gray-100 animate-pulse rounded-[3rem]" />
          ))
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map((e, index) => {
            const isRegistered = e.registeredUsers.includes(user?._id);
            return (
              <motion.div 
                key={e._id} 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all group overflow-hidden relative flex flex-col md:flex-row gap-10"
              >
                <div className="w-full md:w-56 h-72 rounded-[2.5rem] overflow-hidden bg-gray-50 flex-shrink-0 relative group">
                   <img 
                     src={`https://images.unsplash.com/photo-${1500000000000 + (index * 1000000)}?w=600`} 
                     className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                     alt="Event" 
                   />
                   <div className="absolute top-5 left-5 bg-white/20 backdrop-blur-xl border border-white/20 text-white font-black px-4 py-2 rounded-2xl flex flex-col items-center">
                      <span className="text-2xl leading-none">{new Date(e.date).getDate()}</span>
                      <span className="text-[10px] tracking-tighter uppercase">{new Date(e.date).toLocaleString('default', { month: 'short' })}</span>
                   </div>
                </div>

                <div className="flex-1 space-y-6 flex flex-col justify-center">
                  <div className="space-y-3">
                    <h4 className="text-3xl font-black text-dark group-hover:text-primary transition-colors leading-tight">{e.title}</h4>
                    <p className="text-gray-400 font-medium leading-relaxed line-clamp-2">{e.description}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-gray-500 font-bold bg-gray-50 px-4 py-2 rounded-2xl text-xs uppercase tracking-tighter">
                      <MapPin size={16} className="text-primary" />
                      {e.venue}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 font-bold bg-gray-50 px-4 py-2 rounded-2xl text-xs uppercase tracking-tighter">
                      <Users size={16} className="text-secondary" />
                      {e.registeredUsers.length} Going
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 font-bold bg-gray-50 px-4 py-2 rounded-2xl text-xs uppercase tracking-tighter">
                       <Calendar size={16} className="text-accent" />
                       {new Date(e.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <div className="mt-auto pt-6 flex items-center justify-between">
                    {isRegistered ? (
                      <button 
                        onClick={() => setSelectedEvent(e)}
                        className="btn-secondary py-4 px-8 flex gap-3 text-lg rounded-[1.5rem] shadow-lg shadow-primary/5 hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1 active:scale-95"
                      >
                         <Ticket size={20} /> View Ticket
                      </button>
                    ) : (
                      <button 
                         onClick={() => registerForEvent(e._id)}
                         className="btn-primary py-4 px-10 text-lg rounded-[1.5rem] shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all active:scale-95 flex gap-3"
                      >
                         Join Now <ChevronRight size={20} className="mt-0.5" />
                      </button>
                    )}
                    <button className="w-12 h-12 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/5 transition-all">
                       <Info size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })
        ) : (
          <div className="col-span-full py-24 text-center bg-white rounded-[4rem] border-2 border-dashed border-gray-100">
             <h4 className="text-3xl font-black text-gray-400">No events found</h4>
             <p className="text-gray-300 font-bold uppercase mt-2 tracking-widest">Adjust your search filters</p>
          </div>
        )}
      </div>

      {/* Ticket Modal */}
      <AnimatePresence>
      {selectedEvent && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-dark/95 backdrop-blur-2xl z-50 flex items-center justify-center p-6"
        >
          <motion.div 
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            className="bg-white max-w-[500px] w-full rounded-[4rem] overflow-hidden shadow-2xl relative"
          >
            {/* Ticket Top */}
            <div className="bg-primary p-12 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-2xl"></div>
               <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-xl border border-white/20 rounded-3xl flex items-center justify-center mb-4">
                     <Ticket size={40} />
                  </div>
                  <h3 className="text-4xl font-black tracking-tight leading-none uppercase italic">{selectedEvent.title}</h3>
                  <p className="text-white/60 font-black tracking-widest text-xs uppercase">{selectedEvent.venue} • {new Date(selectedEvent.date).toDateString()}</p>
               </div>
            </div>

            {/* Ticket Cut Lines */}
            <div className="relative h-12 flex items-center">
               <div className="absolute left-0 -ml-6 w-12 h-12 bg-dark rounded-full"></div>
               <div className="flex-1 flex px-12">
                  <div className="flex-1 border-b-4 border-dashed border-gray-100"></div>
               </div>
               <div className="absolute right-0 -mr-6 w-12 h-12 bg-dark rounded-full"></div>
            </div>

            {/* Ticket Bottom (QR) */}
            <div className="p-16 flex flex-col items-center space-y-10 text-center">
              <div className="p-10 bg-white rounded-[3rem] shadow-2xl ring-1 ring-gray-100 relative group">
                <QRCodeSVG value={`TICKET-${selectedEvent._id}-${user._id}`} size={200} />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors pointer-events-none rounded-[3rem]"></div>
              </div>
              <div className="space-y-4">
                <p className="text-2xl font-black text-dark tracking-tighter">Your Access ID: <span className="text-primary">EZY-CXP-0{user._id.slice(-4)}</span></p>
                <div className="flex items-center gap-4 text-gray-400 font-bold bg-gray-50 px-8 py-3 rounded-full text-xs uppercase tracking-widest">
                  <CheckCircle size={16} className="text-secondary" />
                  Verified Enrollment
                </div>
              </div>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="w-full btn-primary py-6 rounded-[2rem] text-lg font-black shadow-xl"
              >
                Close Ticket
              </button>
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Digital Signature: 0x937...f32231A</p>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default Events;
