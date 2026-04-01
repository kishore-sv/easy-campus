import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Layout from './components/Layout';

// Pages
import Home from './pages/Home';
import Map from './pages/Map';
import Chatbot from './pages/Chatbot';
import Events from './pages/Events';
import Orders from './pages/Orders';
import Stationery from './pages/Stationery';
import LostFound from './pages/LostFound';
import Complaints from './pages/Complaints';
import Admin from './pages/Admin';
import Login from './pages/Login';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
       <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
  
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/map" element={<PrivateRoute><Map /></PrivateRoute>} />
            <Route path="/chatbot" element={<PrivateRoute><Chatbot /></PrivateRoute>} />
            <Route path="/events" element={<PrivateRoute><Events /></PrivateRoute>} />
            <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
            <Route path="/stationery" element={<PrivateRoute><Stationery /></PrivateRoute>} />
            <Route path="/lost-found" element={<PrivateRoute><LostFound /></PrivateRoute>} />
            <Route path="/complaints" element={<PrivateRoute><Complaints /></PrivateRoute>} />
            
            <Route path="/admin" element={<PrivateRoute adminOnly={true}><Admin /></PrivateRoute>} />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
