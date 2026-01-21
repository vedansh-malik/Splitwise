import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosInstance';
import { Zap } from 'lucide-react';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
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
      <div className="card" style={{ maxWidth: '400px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ 
            // Orange Tint Background for Icon
            background: 'rgba(234, 88, 12, 0.15)', width: '56px', height: '56px', 
            borderRadius: '16px', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', margin: '0 auto 20px auto',
            border: '1px solid rgba(234, 88, 12, 0.1)'
          }}>
            {/* Orange Icon */}
            <Zap size={28} color="var(--primary)" fill="var(--primary)" />
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Welcome Back</h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>Enter your credentials to access your account.</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="settlement-alert" style={{ 
            borderColor: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', 
            color: '#FCA5A5', marginBottom: '20px', justifyContent:'center' 
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} 
              required
              autoComplete="username"
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} 
              required
              autoComplete="current-password"
            />
          </div>

          {/* Primary Theme Button */}
          <button className="btn-primary btn-full" style={{ height: '50px', fontSize: '1rem' }}>
            Sign In
           </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;