import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import GroupDetails from './pages/GroupDetails';
import LandingPage from './pages/LandingPage'; 
import Profile from './pages/Profile'; 
import MobileNav from './components/MobileNav'; // <--- 1. Import MobileNav
import './App.css';

const HomeRoute = () => {
  const { token } = useContext(AuthContext);
  return token ? <Navigate to="/dashboard" replace /> : <LandingPage />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          <Route path="/groups/:id" element={
            <ProtectedRoute>
              <GroupDetails />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* --- 2. ADD MOBILE NAV BAR HERE --- */}
        {/* It handles its own visibility logic (hiding on login/signup) internally */}
        <MobileNav />
        

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;