import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Settings, Users, Calendar, MessageSquare, 
  ShoppingBag, Trash2, CheckCircle, RefreshCw, 
  Plus, Edit, Eye, Filter, Trash, AlertCircle, Info, ChevronRight 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('Faculty');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();
  
  // States for individual collections
  const [faculties, setFaculties] = useState([]);
  const [events, setEvents] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [fac, eve, com, ord] = await Promise.all([
        axios.get('http://localhost:5001/api/faculty'),
        axios.get('http://localhost:5001/api/events'),
        axios.get('http://localhost:5001/api/complaints', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5001/api/orders', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setFaculties(fac.data);
      setEvents(eve.data);
      setComplaints(com.data);
      setOrders(ord.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteFaculty = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await axios.delete(`http://localhost:5001/api/faculty/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchAll();
  };

  const updateComplaintStatus = async (id, status) => {
    await axios.put(`http://localhost:5001/api/complaints/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
    fetchAll();
  };

  const updateOrderStatus = async (id, status) => {
    await axios.put(`http://localhost:5001/api/orders/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
    fetchAll();
  };

  const tabs = [
    { id: 'Faculty', icon: Users, label: "Staff" },
    { id: 'Events', icon: Calendar, label: "Events" },
    { id: 'Complaints', icon: MessageSquare, label: "Grievances" },
    { id: 'Orders', icon: ShoppingBag, label: "Purchases" }
  ];

  return (
    <div className="space-y-12 pb-24">
      {/* Header */}
      <section className="relative overflow-hidden bg-dark rounded-[3.5rem] p-16 text-white shadow-2xl flex flex-col justify-end min-h-[400px]">
        <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
        <div className="relative z-10 space-y-8 max-w-2xl">
           <div className="flex gap-4">
              <span className="bg-white/10 backdrop-blur-xl border border-white/10 text-white font-black uppercase tracking-widest text-[10px] px-6 py-3 rounded-full flex items-center gap-2 shadow-inner italic">
                 <Settings size={14} className="text-secondary" />
                 Admin Control Panel
              </span>
           </div>
           <h2 className="text-7xl font-black tracking-tighter leading-[0.9] italic uppercase">Manage <br/> <span className="text-primary">Campus</span> <span className="text-white italic">Hub</span></h2>
           <p className="text-gray-400 text-xl font-medium leading-relaxed max-w-lg mb-8 opacity-80">
              Your centralized control center for staff availability, event scheduling, and student grievances.
           </p>
        </div>
        
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-[500px] h-full bg-white/5 skew-x-12 -mr-32 blur-3xl pointer-events-none"></div>
      </section>

      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-6 p-4 bg-white rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden group">
         <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full -ml-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform"></div>
         <div className="relative z-10 flex gap-4 w-full md:w-auto">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 md:flex-none flex items-center gap-4 px-10 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' : 'bg-gray-50 text-gray-400 border border-gray-50 hover:border-primary/20 hover:text-primary'}`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
         </div>
         <div className="md:ml-auto relative z-10 hidden md:flex items-center gap-4">
            <button onClick={fetchAll} className="p-5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-primary hover:border-primary/20 transition-all shadow-sm active:scale-95">
               <RefreshCw size={22} className={loading ? 'animate-spin' : ''} />
            </button>
            <button className="btn-primary py-5 px-10 rounded-2xl text-xs uppercase italic tracking-widest shadow-xl flex gap-3">
               <Plus size={18} /> New Entry
            </button>
         </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-[3.5rem] p-12 border border-gray-100 shadow-sm min-h-[600px] relative overflow-hidden">
        {loading ? (
           <div className="flex flex-col items-center justify-center h-full space-y-6 pt-32">
              <div className="w-20 h-20 bg-gray-50 rounded-[2.5rem] border-4 border-dashed border-gray-100 animate-spin-slow"></div>
              <p className="text-xs font-black text-gray-300 uppercase tracking-widest italic animate-pulse">Syncing Database...</p>
           </div>
        ) : (
          <AnimatePresence mode='wait'>
            {activeTab === 'Faculty' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
                 <div className="flex items-center justify-between">
                    <h4 className="text-3xl font-black text-dark tracking-tighter uppercase italic">Faculty <span className="text-primary italic">Registry</span></h4>
                    <span className="text-[10px] font-black text-gray-300 bg-gray-50 px-5 py-2 rounded-full uppercase tracking-widest">{faculties.length} Records</span>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {faculties.map(fac => (
                      <div key={fac._id} className="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100 flex flex-col group hover:bg-white hover:shadow-xl hover:shadow-primary/5 transition-all">
                         <div className="flex items-start justify-between mb-6">
                            <div className="w-16 h-16 bg-white rounded-2xl overflow-hidden shadow-sm ring-4 ring-white flex-shrink-0">
                               <img src={fac.image} className="w-full h-full object-cover" alt={fac.name} />
                            </div>
                            <div className="flex gap-2">
                               <button className="w-10 h-10 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-primary transition-all flex items-center justify-center shadow-sm active:scale-90"><Edit size={16} /></button>
                               <button onClick={() => deleteFaculty(fac._id)} className="w-10 h-10 bg-white border border-gray-100 rounded-xl text-red-400 hover:text-red-600 transition-all flex items-center justify-center shadow-sm active:scale-90"><Trash2 size={16} /></button>
                            </div>
                         </div>
                         <h5 className="text-xl font-black text-dark group-hover:text-primary transition-colors leading-tight italic uppercase">{fac.name}</h5>
                         <p className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-widest">{fac.department}</p>
                         <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex flex-col">
                               <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Cabin</span>
                               <span className="text-sm font-bold text-dark">{fac.cabin}</span>
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm ${fac.status === 'Available' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>
                               {fac.status}
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </motion.div>
            )}

            {activeTab === 'Complaints' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
                 <div className="flex items-center justify-between">
                    <h4 className="text-3xl font-black text-dark tracking-tighter uppercase italic">Grievance <span className="text-accent italic">Inbox</span></h4>
                    <span className="text-[10px] font-black text-gray-300 bg-gray-50 px-5 py-2 rounded-full uppercase tracking-widest">{complaints.length} Filed Tickets</span>
                 </div>
                 <div className="space-y-6">
                    {complaints.map(comp => (
                      <div key={comp._id} className="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100 flex items-center gap-10 hover:bg-white transition-all group overflow-hidden relative">
                         <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
                            <AlertCircle size={28} />
                         </div>
                         <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-4">
                               <span className="text-[10px] font-black text-primary bg-primary/5 px-4 py-1.5 rounded-full uppercase">{comp.category}</span>
                               <span className="text-[10px] font-bold text-gray-300 flex items-center gap-2 uppercase tracking-widest italic">{comp.userId?.name} ({comp.userId?.email})</span>
                            </div>
                            <h5 className="text-xl font-black text-dark leading-none italic uppercase tracking-tighter">{comp.description}</h5>
                         </div>
                         <div className="flex items-center gap-6">
                            <select 
                               className="bg-white border border-gray-100 rounded-xl px-5 py-3 font-black text-[10px] uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
                               value={comp.status}
                               onChange={(e) => updateComplaintStatus(comp._id, e.target.value)}
                            >
                               <option value="Pending">Pending</option>
                               <option value="In Progress">In Progress</option>
                               <option value="Resolved">Resolved</option>
                            </select>
                            <button className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-300 hover:text-primary transition-all shadow-sm"><Eye size={20} /></button>
                         </div>
                      </div>
                    ))}
                 </div>
              </motion.div>
            )}

            {activeTab === 'Orders' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
                <div className="flex items-center justify-between">
                    <h4 className="text-3xl font-black text-dark tracking-tighter uppercase italic">Order <span className="text-secondary italic">Registry</span></h4>
                    <span className="text-[10px] font-black text-gray-300 bg-gray-50 px-5 py-2 rounded-full uppercase tracking-widest">{orders.length} Total Sales</span>
                </div>
                <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Transaction ID</th>
                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</th>
                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Items</th>
                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Status</th>
                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                         {orders.map(order => (
                           <tr key={order._id} className="hover:bg-primary/5 transition-all group">
                              <td className="px-10 py-6">
                                 <div className="flex flex-col">
                                    <span className="text-xs font-black text-dark italic uppercase tracking-tighter">#{order._id.slice(-6)}</span>
                                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-1">{new Date(order.createdAt).toLocaleDateString()}</span>
                                 </div>
                              </td>
                              <td className="px-10 py-6">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-[10px] font-black">{order.userId?.name?.[0]}</div>
                                    <div className="flex flex-col">
                                       <span className="text-sm font-bold text-dark">{order.userId?.name}</span>
                                       <span className="text-[10px] text-gray-400 leading-none">{order.userId?.email}</span>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-10 py-6">
                                 <span className="text-xs font-bold text-gray-500 bg-white border border-gray-100 px-4 py-2 rounded-xl shadow-sm">{order.items.length} Products</span>
                              </td>
                              <td className="px-10 py-6 text-center">
                                 <select 
                                   className={`px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest outline-none border transition-all shadow-sm ${
                                      order.status === 'Pending' ? 'bg-orange-500 text-white border-orange-500' :
                                      order.status === 'Ready' ? 'bg-green-500 text-white border-green-500' : 
                                      'bg-primary text-white border-primary'
                                   }`}
                                   value={order.status}
                                   onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                 >
                                    <option value="Pending">Pending</option>
                                    <option value="Preparing">Preparing</option>
                                    <option value="Ready">Ready</option>
                                    <option value="Delivered">Delivered</option>
                                 </select>
                              </td>
                              <td className="px-10 py-6 text-right">
                                 <button className="btn-secondary py-2.5 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest flex ml-auto gap-2">
                                    Track <ChevronRight size={14} />
                                 </button>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'Events' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
                 <div className="flex items-center justify-between">
                    <h4 className="text-3xl font-black text-dark tracking-tighter uppercase italic text-primary">Campus <span className="text-dark italic">Schedules</span></h4>
                    <span className="text-[10px] font-black text-gray-300 bg-gray-50 px-5 py-2 rounded-full uppercase tracking-widest">{events.length} Active Events</span>
                 </div>
                 <div className="grid grid-cols-1 gap-6">
                    {events.map(event => (
                      <div key={event._id} className="bg-gray-50 border border-gray-100 p-8 rounded-[2.5rem] flex items-center justify-between group hover:bg-white hover:shadow-xl hover:shadow-primary/5 transition-all overflow-hidden relative">
                         <div className="flex items-center gap-10">
                            <div className="w-16 h-16 bg-white rounded-3xl flex flex-col items-center justify-center text-primary shadow-sm border border-gray-100 group-hover:rotate-6 transition-transform">
                               <span className="text-2xl font-black leading-none">{new Date(event.date).getDate()}</span>
                               <span className="text-[9px] font-black tracking-widest uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                            </div>
                            <div className="space-y-1">
                               <div className="flex items-center gap-3">
                                  <span className="text-[9px] font-black bg-primary text-white px-3 py-1 rounded-full uppercase tracking-widest">{event.venue}</span>
                               </div>
                               <h5 className="text-2xl font-black text-dark italic uppercase tracking-tighter truncate max-w-md">{event.title}</h5>
                            </div>
                         </div>
                         <div className="flex items-center gap-10">
                            <div className="flex flex-col items-end">
                               <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Attendance</span>
                               <div className="flex items-center gap-2 mt-1">
                                  <div className="flex -space-x-2">
                                     {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200" />)}
                                  </div>
                                  <span className="text-sm font-bold text-dark">+{event.registeredUsers.length}</span>
                               </div>
                            </div>
                            <div className="flex gap-4">
                               <button className="p-5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-primary transition-all shadow-sm active:scale-95"><Edit size={22} /></button>
                               <button className="p-5 bg-white border border-gray-100 rounded-2xl text-red-400 hover:text-red-500 transition-all shadow-sm active:scale-95"><Trash2 size={22} /></button>
                            </div>
                         </div>
                         <div className="absolute top-0 right-0 h-full w-2 bg-primary invisible group-hover:visible"></div>
                      </div>
                    ))}
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      <style>{`
         .animate-spin-slow {
            animation: spin 3s linear infinite;
         }
         @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
         }
      `}</style>
    </div>
  );
};

export default AdminPanel;
