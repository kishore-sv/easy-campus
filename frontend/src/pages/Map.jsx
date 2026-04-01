import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Search, MapPin, Info, Navigation, ArrowRight, Activity, ChevronRight, Minimize, Layers, Zap, Sparkles, Building2, School, Coffee, Book, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Fix for Leaflet marker icon issue in production/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const PU_BENGALURU_CENTER = [13.1682, 77.5354];

const locations = [
  { id: 1, name: "Engineering Block (L)", lat: 13.1685, lng: 77.5342, type: "Academic", info: "L-Block houses CS, IS, and AI departments.", floors: "G+4 Floors" },
  { id: 2, name: "Management Block (S)", lat: 13.1680, lng: 77.5361, type: "Academic", info: "S-Block for MBA, Law, and Commerce.", floors: "G+3 Floors" },
  { id: 3, name: "Main Canteen", lat: 13.1670, lng: 77.5358, type: "Food", info: "Central dining area with 15+ counters.", floors: "Ground, Mezzanine" },
  { id: 4, name: "Administrative Block", lat: 13.1668, lng: 77.5341, type: "Admin", info: "Registrar, Accounts, and VP Office.", floors: "Ground, 1st" },
  { id: 5, name: "Central Library", lat: 13.1675, lng: 77.5346, type: "Study", info: "High-tech library with 50k+ books.", floors: "3 Floors" },
  { id: 6, name: "Auditorium Hub", lat: 13.1688, lng: 77.5364, type: "Events", info: "Main Stage for events and hackathons.", floors: "Single Level" },
  { id: 7, name: "Boys Hostel (A-B)", lat: 13.1708, lng: 77.5362, type: "Residence", info: "On-campus residential facility.", floors: "G+8 Floors" },
  { id: 8, name: "Girls Hostel (G1)", lat: 13.1701, lng: 77.5352, type: "Residence", info: "Secure on-campus housing.", floors: "G+6 Floors" },
];

const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const Map = () => {
  const [search, setSearch] = useState('');
  const [activePin, setActivePin] = useState(null);
  const [center, setCenter] = useState(PU_BENGALURU_CENTER);
  const [zoom, setZoom] = useState(17);

  const filteredLocations = locations.filter(loc => 
    loc.name.toLowerCase().includes(search.toLowerCase()) ||
    loc.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleFocus = (loc) => {
    setActivePin(loc);
    setCenter([loc.lat, loc.lng]);
    setZoom(19);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Academic': return <School size={16} />;
      case 'Food': return <Coffee size={16} />;
      case 'Study': return <Book size={16} />;
      case 'Admin': return <UserCheck size={16} />;
      default: return <Building2 size={16} />;
    }
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Dynamic Header */}
      <section className="relative overflow-hidden bg-primary rounded-[3.5rem] p-16 text-white shadow-2xl shadow-primary/10">
        <div className="relative z-10 max-w-2xl space-y-8">
           <div className="flex gap-4">
              <span className="bg-white/20 backdrop-blur-xl border border-white/20 text-white font-black uppercase tracking-widest text-[10px] px-6 py-3 rounded-full flex items-center gap-2 shadow-inner">
                 <Navigation size={14} className="text-secondary" />
                 PU Bengaluru Digital Twin
              </span>
           </div>
           <h2 className="text-7xl font-black tracking-tighter leading-[0.9] italic uppercase">Campus <br/> <span className="text-secondary italic">Cartography</span></h2>
           <p className="text-primary-foreground/80 text-xl font-medium leading-relaxed max-w-lg mb-8 opacity-80">
              High-fidelity interactive mapping for Presidency University. Locate blocks with sub-meter precision.
           </p>
           
           <div className="relative max-w-md group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary group-focus-within:scale-110 transition-transform" />
              <input 
                type="text" 
                placeholder="Search block, lab, or office..."
                className="w-full pl-16 pr-8 py-5 bg-white text-dark rounded-2xl shadow-xl outline-none focus:ring-4 focus:ring-secondary/20 transition-all text-lg font-bold"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
        </div>
        
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[500px] h-full bg-white/5 skew-x-12 -mr-32 blur-3xl pointer-events-none"></div>
      </section>

      {/* Interactive Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Main Map Engine */}
        <div className="lg:col-span-3 space-y-8">
           <div className="relative bg-white rounded-[4rem] p-4 shadow-2xl shadow-primary/5 border border-gray-100 overflow-hidden h-[700px] flex group z-0">
             <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <ChangeView center={center} zoom={zoom} />
                {locations.map(loc => (
                  <Marker 
                    key={loc.id} 
                    position={[loc.lat, loc.lng]}
                    eventHandlers={{ click: () => handleFocus(loc) }}
                  >
                    <Popup className="custom-popup">
                       <div className="p-4 space-y-2 max-w-[200px]">
                          <div className="flex items-center gap-2">
                             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                                {getIcon(loc.type)}
                             </div>
                             <span className="text-[10px] font-black uppercase text-gray-400">{loc.type}</span>
                          </div>
                          <h4 className="text-sm font-black text-dark leading-none">{loc.name}</h4>
                          <p className="text-[10px] font-bold text-gray-500">{loc.info}</p>
                       </div>
                    </Popup>
                  </Marker>
                ))}
             </MapContainer>

              {/* Real-time Status Floating Pane */}
              <div className="absolute top-10 left-10 p-6 bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl space-y-4 border border-white/50 border-white max-w-[280px] pointer-events-auto z-[1000]">
                 <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest leading-none">Live Campus State</span>
                 </div>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">
                       <span>Campus Traffic</span>
                       <span className="text-secondary italic">Fluid</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                       <span>Active Events</span>
                       <span className="text-primary italic font-bold text-xs">Hack PU '24</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-10">
              <div className="w-16 h-16 bg-primary/5 rounded-3xl flex items-center justify-center text-primary flex-shrink-0">
                 <Zap size={28} />
              </div>
              <div className="flex-1 space-y-1">
                 <h4 className="text-2xl font-black text-dark tracking-tight leading-none uppercase italic">Campus <span className="text-primary">Wayfinding</span></h4>
                 <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Auto-calculate routes between PU Blocks for optimal transitions.</p>
              </div>
              <div className="flex gap-4">
                 <button onClick={() => { setCenter(PU_BENGALURU_CENTER); setZoom(17); }} className="px-10 py-5 bg-gray-50 text-gray-400 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-primary hover:text-white transition-all shadow-xl shadow-primary/5">
                    Reset View
                 </button>
                 <button className="px-10 py-5 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95 transition-all">
                    Start Navigation
                 </button>
              </div>
           </div>
        </div>

        {/* Dynamic Sidebar Discovery */}
        <div className="lg:col-span-1 space-y-8">
           <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm space-y-8 min-h-[500px] flex flex-col h-full overflow-hidden">
              <h4 className="text-2xl font-black text-dark tracking-tight leading-none uppercase italic">Campus <span className="text-primary italic">Directory</span></h4>
              
              <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar flex-1">
                <AnimatePresence>
                {filteredLocations.map((loc, i) => (
                  <motion.button 
                    key={loc.id}
                    onClick={() => handleFocus(loc)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`w-full text-left p-6 rounded-3xl border transition-all flex flex-col gap-3 group overflow-hidden relative ${activePin?.id === loc.id ? 'bg-primary border-primary shadow-2xl shadow-primary/20' : 'bg-gray-50 border-gray-50 hover:border-primary/20 hover:bg-white'}`}
                  >
                    {activePin?.id === loc.id && (
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-xl"></div>
                    )}
                    <div className="flex items-center justify-between">
                       <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${activePin?.id === loc.id ? 'text-white/60' : 'text-gray-300'}`}>
                          {getIcon(loc.type)} {loc.type}
                       </span>
                       <ArrowRight size={16} className={activePin?.id === loc.id ? 'text-white' : 'text-gray-200'} />
                    </div>
                    <h5 className={`text-xl font-black leading-none uppercase italic ${activePin?.id === loc.id ? 'text-white italic' : 'text-dark'}`}>{loc.name}</h5>
                    <div className="flex gap-2">
                       <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${activePin?.id === loc.id ? 'bg-white/20 text-white' : 'bg-white text-gray-400 shadow-sm'}`}>
                          {loc.floors}
                       </span>
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
                 <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-secondary/20 rotate-3">
                    <Sparkles size={20} />
                 </div>
                 <div className="flex-1">
                    <p className="text-[10px] font-black text-dark uppercase tracking-widest">Smart Find</p>
                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase italic tracking-tighter">Found {filteredLocations.length} Locations</p>
                 </div>
              </div>
           </div>
           
           <div className="bg-dark p-12 rounded-[3.5rem] text-white shadow-2xl shadow-primary/10 space-y-8 relative overflow-hidden group">
              <div className="relative z-10 space-y-6">
                 <Info size={40} className="text-primary" />
                 <h4 className="text-3xl font-black leading-[0.9] uppercase italic tracking-tighter">Need <br/> <span className="text-primary">Help?</span></h4>
                 <p className="text-gray-400 font-bold leading-relaxed text-[10px] opacity-80 uppercase tracking-widest">Explore the PU Bengaluru campus using our digital navigator. For missing blocks, visit Helpdesk Gate 2.</p>
                 <button className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                    Campus Guide <ChevronRight size={18} />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
