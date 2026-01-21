import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, LogOut, Settings, ArrowLeft } from 'lucide-react';
import api from '../api/axiosInstance';

const Profile = () => {
  const { user, logout, login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [currency, setCurrency] = useState(user?.currency || '$');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user?.currency) setCurrency(user.currency);
  }, [user]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await api.put(`/auth/update`, { currency });
      login(localStorage.getItem('token'), { ...user, currency });
      setSuccessMsg('Profile updated successfully');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error("Update failed", err);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      
      {/* Back Button */}
      <div style={{ padding: '20px 0', display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate('/dashboard')} style={{ background:'none', border:'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', padding: 0, cursor:'pointer' }}>
          <ArrowLeft size={20} /> <span style={{ fontWeight: '600' }}>Back</span>
        </button>
      </div>

      {/* Main Container */}
      <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
        
        {/* PROFILE HEADER CARD */}
        <div className="card" style={{ 
            textAlign: 'center', marginBottom: '24px', position: 'relative', overflow: 'hidden', padding: '0' 
        }}>
          <div style={{ position: 'absolute', top: '-50%', left: '0', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(234, 88, 12, 0.15) 0%, transparent 70%)', zIndex: 0 }}></div>
          
          <div style={{ position: 'relative', zIndex: 1, padding: '40px 20px' }}>
            <div style={{ 
              width: '86px', height: '86px', background: 'var(--card-bg)', borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--primary)', boxShadow: '0 0 25px rgba(234, 88, 12, 0.25)' 
            }}>
              <User size={42} color="var(--primary)" />
            </div>
            <h1 style={{ fontSize: '1.6rem', margin: '0 0 6px', fontWeight: '800', color: 'var(--text-main)' }}>
              {user?.name || 'User'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              {user?.email}
            </p>
          </div>
        </div>

        {/* SETTINGS CARD */}
        <div className="card">
          <div className="flex" style={{ marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '15px' }}>
            <Settings size={20} color="var(--text-muted)" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)' }}>Preferences</h3>
          </div>

          {/* Currency Selector (FIXED GRID) */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              Default Currency
            </label>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)', // Force 4 columns
                gap: '8px', // Reduced gap to prevent overflow
                width: '100%' 
            }}>
              {['₹', '$', '€', '£'].map((curr) => (
                <button 
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  style={{ 
                    padding: '12px 0', // Vertical padding only, safer for width
                    background: currency === curr ? 'var(--primary-gradient)' : 'rgba(255, 255, 255, 0.05)', 
                    border: currency === curr ? 'none' : '1px solid rgba(255,255,255,0.08)',
                    color: currency === curr ? 'white' : 'var(--text-muted)',
                    borderRadius: '12px', 
                    fontWeight: '700', fontSize: '1.1rem',
                    cursor: 'pointer', 
                    width: '100%',
                    minWidth: '0', // CRITICAL FIX: Allows button to shrink below default size
                    transition: 'all 0.2s ease',
                    boxShadow: currency === curr ? '0 4px 15px rgba(234, 88, 12, 0.3)' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          <button 
            className="btn-primary btn-full" 
            onClick={handleUpdate} 
            disabled={loading || currency === user?.currency}
            style={{ marginBottom: '15px', height: '50px', opacity: (loading || currency === user?.currency) ? 0.7 : 1 }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>

          {successMsg && <p style={{ color: 'var(--success)', textAlign: 'center', fontSize: '0.9rem', margin: 0 }}>{successMsg}</p>}
        </div>

        {/* LOGOUT BUTTON */}
        <button 
          onClick={handleLogout} 
          style={{ 
            width: '100%', padding: '16px', marginTop: '20px',
            background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)', 
            color: '#EF4444', borderRadius: '16px', fontWeight: '700', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            fontSize: '1rem', transition: '0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'; }}
        >
          <LogOut size={20} /> Sign Out
        </button>

      </div>
    </div>
  );
};

export default Profile;