import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, Map, Bot, Calendar, ShoppingBag, 
  Printer, AlertCircle, LogOut, MessageSquare, 
  Settings, Users, ShoppingCart, HelpCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const SidebarItem = ({ to, icon: Icon, label }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => twMerge(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
      isActive 
        ? "bg-primary text-white shadow-lg shadow-primary/20" 
        : "text-gray-500 hover:bg-primary/5 hover:text-primary"
    )}
  >
    <Icon size={20} />
    <span>{label}</span>
  </NavLink>
);

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/map", icon: Map, label: "Campus Map" },
    { to: "/chatbot", icon: Bot, label: "Campus Bot" },
    { to: "/events", icon: Calendar, label: "Events" },
    { to: "/orders", icon: ShoppingBag, label: "Food Canteen" },
    { to: "/stationery", icon: Printer, label: "Stationery" },
    { to: "/lost-found", icon: HelpCircle, label: "Lost & Found" },
    { to: "/complaints", icon: AlertCircle, label: "Grievances" },
  ];

  const adminItems = [
    { to: "/admin", icon: Settings, label: "Admin Panel" },
  ];

  return (
    <div className="w-72 bg-white h-screen fixed left-0 top-0 border-r border-gray-100 flex flex-col p-6 overflow-y-auto">
      <div className="flex items-center gap-2 mb-10 px-2">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-inner">
          <MessageSquare size={24} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Easy <span className="text-primary">Campus</span></h1>
      </div>

      <nav className="flex-1 space-y-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">Menu</p>
        {menuItems.map(item => <SidebarItem key={item.to} {...item} />)}

        {user?.role === 'admin' && (
          <>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-2 px-4">Admin</p>
            {adminItems.map(item => <SidebarItem key={item.to} {...item} />)}
          </>
        )}
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-6 px-4">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{user?.name}</span>
            <span className="text-xs text-gray-400">{user?.role}</span>
          </div>
        </div>
        <button 
          onClick={() => { logout(); navigate('/login'); }}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
