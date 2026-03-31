import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, Star, Clock, Plus, Minus, Search, ShoppingCart, ShoppingBag as BagIcon, Activity, CheckCircle, ChevronRight, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const FoodOrdering = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();
  const { token } = useAuth();
  const [orderStatus, setOrderStatus] = useState(null); // 'success', 'error'

  useEffect(() => {
    axios.get('http://localhost:5001/api/products')
      .then(res => setProducts(res.data.filter(p => p.category === 'Food')))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const placeOrder = async () => {
    try {
      await axios.post('http://localhost:5001/api/orders', {
        items: cart.map(item => ({ productId: item._id, quantity: item.quantity }))
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      clearCart();
      setOrderStatus('success');
      setTimeout(() => setOrderStatus(null), 5000);
    } catch (err) {
      setOrderStatus('error');
    }
  };

  const filteredProducts = products.filter(p => 
    (selectedCategory === 'All' || p.name.includes(selectedCategory)) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row gap-10 pb-24">
      {/* Main Menu Section */}
      <div className="flex-1 space-y-12">
        <section className="relative overflow-hidden bg-secondary rounded-[3rem] p-12 text-white shadow-2xl shadow-secondary/20">
          <div className="relative z-10 space-y-6 max-w-lg">
             <div className="flex gap-3">
                <span className="bg-white/20 backdrop-blur-xl text-white font-black uppercase tracking-widest text-[10px] px-4 py-2 rounded-full">
                  Campus Canteen
                </span>
                <span className="bg-white/20 backdrop-blur-xl text-white font-black uppercase tracking-widest text-[10px] px-4 py-2 rounded-full flex gap-2 items-center">
                  <Activity size={12} className="text-accent" />
                  Pre-order Live
                </span>
             </div>
             <h2 className="text-6xl font-black tracking-tighter leading-none italic">Fast <br/> Campus <span className="text-accent italic">Bites</span></h2>
             <p className="text-white/80 font-medium text-lg leading-relaxed mb-6">Skip the queue. Order your favorite campus meals right from your dashboard.</p>
             <div className="relative max-w-sm group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:scale-110 transition-transform" />
               <input 
                 type="text" 
                 placeholder="Search by meal name..."
                 className="w-full pl-12 pr-6 py-4 bg-white text-dark rounded-2xl shadow-xl outline-none focus:ring-4 focus:ring-accent/20 transition-all font-medium"
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
               />
             </div>
          </div>
          
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-[400px] h-full bg-white/5 skew-x-12 -mr-24 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-accent/20 rounded-full blur-[100px] pointer-events-none"></div>
        </section>

        <div className="flex items-center justify-between">
           <h3 className="text-3xl font-black text-dark tracking-tight">Main <span className="text-secondary italic">Menu</span></h3>
           <div className="hidden md:flex gap-4">
              {['All', 'Burger', 'Dosa', 'Coffee'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-secondary text-white shadow-xl shadow-secondary/20' : 'bg-white text-gray-400 border border-gray-100 hover:border-secondary/30'}`}
                >
                  {cat}
                </button>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {loading ? (
            Array(6).fill(0).map((_, i) => <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-[3rem]" />)
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((p, i) => (
              <motion.div 
                key={p._id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-[3rem] p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-secondary/5 transition-all overflow-hidden relative flex flex-col items-center text-center"
              >
                <div className="w-48 h-48 rounded-[2.5rem] overflow-hidden mb-6 relative shadow-xl shadow-secondary/5 ring-4 ring-white">
                  <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={p.name} />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-2xl shadow-sm text-xs font-black text-secondary uppercase tracking-widest flex items-center gap-1">
                     <Star size={12} className="fill-accent text-accent" /> 4.9
                  </div>
                </div>
                
                <div className="space-y-4">
                   <h4 className="text-2xl font-black text-dark tracking-tight group-hover:text-secondary transition-colors mb-2">{p.name}</h4>
                   <div className="flex items-center gap-4 justify-center text-gray-400 font-bold bg-gray-50 px-6 py-2 rounded-full w-fit mx-auto text-xs uppercase tracking-widest leading-none">
                      <Clock size={14} className="text-secondary" /> 15m Prep
                   </div>
                   <div className="flex items-center justify-center gap-8 pt-6 border-t border-gray-50">
                      <div className="flex flex-col items-start leading-none">
                         <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Price</span>
                         <span className="text-2xl font-black text-secondary leading-none mt-1">₹{p.price}</span>
                      </div>
                      <button 
                        onClick={() => addToCart(p)}
                        className="btn-secondary p-5 rounded-2xl hover:bg-secondary hover:text-white border-secondary/10 shadow-lg shadow-secondary/5 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center"
                      >
                         <Plus size={24} />
                      </button>
                   </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100 italic font-medium text-gray-300">Nothing matched your taste...</div>
          )}
        </div>
      </div>

      {/* Cart Checkout Section */}
      <div className="w-full lg:w-[480px] space-y-10 flex flex-col items-stretch">
        <div className="bg-white rounded-[3.5rem] p-10 border border-gray-100 shadow-2xl shadow-primary/5 flex flex-col min-h-[600px] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-primary/5 -mt-6 -ml-6 -rotate-6 blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center justify-between mb-12 relative z-10">
             <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center text-white rotate-6 group hover:rotate-0 transition-transform">
                   <BagIcon size={24} />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-dark tracking-tight leading-none">Your <span className="text-primary italic">Cart</span></h3>
                   <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1.5">{cart.length} items ready</p>
                </div>
             </div>
             <button onClick={clearCart} className="text-[10px] font-black text-red-400 bg-red-50 hover:bg-red-500 hover:text-white px-5 py-2.5 rounded-full uppercase tracking-widest transition-all">
                Clear All
             </button>
          </div>

          <div className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence>
              {cart.map((item, i) => (
                <motion.div 
                  key={item._id} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-6 group"
                >
                  <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
                     <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                  </div>
                  <div className="flex-1 space-y-2">
                     <h4 className="font-bold text-dark group-hover:text-primary transition-colors text-lg truncate leading-tight uppercase italic">{item.name}</h4>
                     <p className="text-primary font-black text-sm">₹{item.price * item.quantity}</p>
                     
                     <div className="flex items-center gap-4 bg-gray-50 px-4 py-2.5 rounded-xl w-fit border border-gray-100 shadow-inner">
                        <button onClick={() => updateQuantity(item._id, -1)} className="text-gray-400 hover:text-red-500 transition-colors"><Minus size={16} /></button>
                        <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, 1)} className="text-gray-400 hover:text-secondary transition-colors"><Plus size={16} /></button>
                     </div>
                  </div>
                  <button onClick={() => removeFromCart(item._id)} className="text-gray-200 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"><X size={20}/></button>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {cart.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6 pt-12">
                 <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200 border-4 border-dashed border-gray-100">
                    <ShoppingCart size={40} />
                 </div>
                 <div>
                    <h4 className="text-xl font-bold text-gray-300">Your cart is empty</h4>
                    <p className="text-[10px] font-black text-gray-200 uppercase mt-2 tracking-widest">Hungry? Add some items to start!</p>
                 </div>
              </div>
            )}
          </div>

          <div className="mt-12 space-y-8 pt-10 border-t border-gray-100 border-dashed relative z-10">
             <div className="space-y-4">
                <div className="flex justify-between text-gray-400 font-black text-xs uppercase tracking-widest">
                   <span>Service Fee</span>
                   <span className="text-dark">₹10.00</span>
                </div>
                <div className="flex justify-between items-center bg-primary/5 p-6 rounded-[2rem] border border-primary/5">
                   <div className="flex flex-col">
                      <span className="text-2xl font-black text-dark tracking-tighter leading-none italic uppercase">Total <span className="text-primary">Due</span></span>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Inclusive of GST</span>
                   </div>
                   <span className="text-4xl font-black text-primary tracking-tighter leading-none italic">₹{subtotal > 0 ? subtotal + 10 : 0}</span>
                </div>
             </div>
             
             <button 
               onClick={placeOrder}
               disabled={cart.length === 0}
               className="w-full bg-primary text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all hover:-translate-y-2 active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50 disabled:grayscale disabled:pointer-events-none"
             >
                Confirm Order <ChevronRight size={24} />
             </button>
             
             <p className="text-[10px] font-black text-gray-300 text-center uppercase tracking-widest">By placing order, you agree to Canteen Policies V2.0</p>
          </div>
        </div>

        {/* Success Modal Simulation */}
        <AnimatePresence>
        {orderStatus === 'success' && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-10 right-10 bg-white p-10 rounded-[3rem] shadow-2xl border border-green-100 z-50 flex flex-col items-center text-center space-y-6 max-w-sm overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-green-500 overflow-hidden">
               <div className="w-full h-full bg-green-200 origin-left animate-[loading_5s_linear_forwards]"></div>
            </div>
            <div className="w-20 h-20 bg-green-500 rounded-[2.5rem] flex items-center justify-center text-white shadow-xl shadow-green-500/20">
               <CheckCircle size={40} />
            </div>
            <div>
              <h4 className="text-2xl font-black text-dark italic uppercase tracking-tighter">Order <span className="text-green-500 italic">Confirmed</span></h4>
              <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest leading-relaxed">Your tokens are being generated. Check 'My Orders' for live tracking.</p>
            </div>
            <button onClick={() => setOrderStatus(null)} className="btn-secondary w-full py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest">Got it!</button>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
      
      <style>{`
        @keyframes loading {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
};

export default FoodOrdering;
