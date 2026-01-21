import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosInstance';
import { Zap } from 'lucide-react';

const Signup = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', currency: '₹' });
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    // 1. Standard Check: Must look like an email
    const basicRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!basicRegex.test(email)) return false;

    // 2. GMAIL SPECIFIC CHECK
    // If the domain contains "gmail", it MUST end with "@gmail.com"
    // This blocks: @gmail.c, @gmail.co, @gmail.in, etc.
    const lowerEmail = email.toLowerCase();
    if (lowerEmail.includes('gmail') && !lowerEmail.endsWith('@gmail.com')) {
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // --- 2. CHECK VALIDATION BEFORE SENDING ---
    if (!validateEmail(form.email)) {
      setError('Please enter a valid email address (e.g., user@gmail.com)');
      return; // STOP here, do not call API
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const res = await api.post('/auth/signup', form);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div className="card" style={{ maxWidth: '420px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ 
            background: 'rgba(234, 88, 12, 0.15)', width: '56px', height: '56px', 
            borderRadius: '16px', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', margin: '0 auto 20px auto',
            border: '1px solid rgba(234, 88, 12, 0.1)'
          }}>
            <Zap size={28} color="var(--primary)" fill="var(--primary)" />
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Create Account</h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>Join us to start splitting expenses.</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="settlement-alert" style={{ 
            borderColor: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', 
            color: '#FCA5A5', marginBottom: '20px', justifyContent:'center' 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Full Name</label>
            <input 
              type="text" placeholder="John Doe" value={form.name} 
              onChange={e => setForm({ ...form, name: e.target.value })} required autoComplete="name"
            />
          </div>

          {/* Email (Now Validated) */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Email Address</label>
            <input 
              type="email" placeholder="name@example.com" value={form.email} 
              onChange={e => setForm({ ...form, email: e.target.value })} required autoComplete="username"
            />
          </div>

          {/* Currency Selector */}
          <div style={{ marginBottom: '20px' }}>
             <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Select Currency</label>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                {['₹', '$', '€', '£'].map((curr) => (
                  <button 
                    key={curr}
                    type="button"
                    onClick={() => setForm({ ...form, currency: curr })}
                    style={{ 
                      padding: '12px', 
                      background: form.currency === curr ? 'var(--primary-gradient)' : 'rgba(255, 255, 255, 0.05)', 
                      border: form.currency === curr ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      color: form.currency === curr ? 'white' : 'var(--text-muted)',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      width: '100%',
                      minWidth: '0',
                      transition: '0.2s',
                      boxShadow: form.currency === curr ? '0 4px 12px rgba(234, 88, 12, 0.4)' : 'none'
                    }}
                  >
                    {curr}
                  </button>
                ))}
             </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Password</label>
            <input 
              type="password" placeholder="Create a strong password" value={form.password} 
              onChange={e => setForm({ ...form, password: e.target.value })} required autoComplete="new-password"
            />
          </div>

          <button className="btn-primary btn-full" style={{ height: '50px', fontSize: '1rem' }}>
            Sign Up
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;