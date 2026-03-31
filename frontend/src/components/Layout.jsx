import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Layout = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="flex bg-light min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-72 p-10">
        <header className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-dark tracking-tight leading-tight">University Dashboard</h1>
            <p className="text-gray-500 font-medium">Welcome back, <span className="text-primary">{user?.name}</span>!</p>
          </div>
          <div className="flex gap-4">
             <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-none mt-0.5">Campus Online</span>
             </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};

export default Layout;
