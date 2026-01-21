import { Link } from 'react-router-dom';
import { ArrowRight, PieChart, Users, Mail, ShieldCheck, Zap, Sparkles, BrainCircuit } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="landing-wrapper">
      
      {/* Navbar */}
      <nav className="navbar-glass">
        <div className="nav-logo-container">
          <div className="nav-logo-icon"><Zap size={20} /></div>
          <span className="nav-logo-text">SplitwisePro</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/login" className="nav-btn-glass" style={{ border: 'none' }}>Login</Link>
          <Link to="/signup" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="hero">
        
        {/* Left: Content */}
        <div className="hero-content animate-entry">
          <div className="badge-pill">
            <Sparkles size={14} /> <span>New: AI Financial Assistant</span>
          </div>
          
          <h1 className="hero-title">
            Split bills, <br />
            <span className="text-gradient">not friendships.</span>
          </h1>
          
          <p className="hero-subtitle">
            The advanced expense sharing app. We use <strong>Great Algorithms</strong> to minimize debts and <strong>Gemini AI</strong> to give you instant financial insights.
          </p>
          
          <div className="hero-buttons">
            <Link to="/signup" className="btn-primary btn-lg">
              Start Free <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Right: Visual (Stacked Cards - Premium) */}
<div className="hero-visual-container animate-entry" style={{ animationDelay: '0.2s' }}>
  <div className="glass-card-stack">
    
    {/* --- Back Card (Abstract Data Visualization) --- */}
    <div className="visual-card back">
      {/* Faux Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', opacity: 0.6 }}>
        <div style={{ width: '80px', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px' }}></div>
        <div style={{ width: '30px', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px' }}></div>
      </div>
      
      {/* Abstract Graph Bars */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '110px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
         {/* Bar 1: Debt (Orange) */}
         <div style={{ flex: 1, height: '70%', position: 'relative' }}>
             <div style={{ position:'absolute', top:'-20px', left:'50%', transform:'translateX(-50%)', fontSize:'0.6rem', color:'var(--primary)', fontWeight:'700' }}>-$150</div>
             <div style={{ height: '100%', width: '100%', background: 'linear-gradient(to top, rgba(234,88,12,0.1), rgba(234,88,12,0.4))', borderRadius: '8px 8px 0 0' }}></div>
         </div>
         {/* Bar 2: Credit (Green) */}
         <div style={{ flex: 1, height: '90%', position: 'relative' }}>
             <div style={{ position:'absolute', top:'-20px', left:'50%', transform:'translateX(-50%)', fontSize:'0.6rem', color:'var(--success)', fontWeight:'700' }}>+$320</div>
             <div style={{ height: '100%', width: '100%', background: 'linear-gradient(to top, rgba(16,185,129,0.1), rgba(16,185,129,0.4))', borderRadius: '8px 8px 0 0' }}></div>
         </div>
         {/* Bar 3: Neutral */}
         <div style={{ flex: 1, height: '40%', background: 'rgba(255,255,255,0.05)', borderRadius: '8px 8px 0 0' }}></div>
      </div>
      {/* Faux legend underneath */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '15px', opacity: 0.5 }}>
         <div style={{ width: '20px', height: '6px', background: 'var(--primary)', borderRadius: '3px' }}></div>
         <div style={{ width: '20px', height: '6px', background: 'var(--success)', borderRadius: '3px' }}></div>
      </div>
    </div>

    {/* --- Front Card (AI Focus - Polished) --- */}
    <div className="visual-card front">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Added subtle glow to the icon container */}
          <div style={{ padding: '8px', background: 'rgba(234,88,12,0.15)', borderRadius: '10px', boxShadow: '0 0 15px rgba(234, 88, 12, 0.2)' }}>
            <Sparkles size={20} color="var(--primary)" fill="var(--primary)" />
          </div>
          <span style={{ fontWeight: '700', color: 'white', fontSize: '1.05rem' }}>Fin-AI</span>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--success)', display:'flex', alignItems:'center', gap:'6px' }}>
          <span style={{ display:'block', width:'8px', height:'8px', background:'var(--success)', borderRadius:'50%', boxShadow:'0 0 10px var(--success)' }}></span>
          Online
        </span>
      </div>

      {/* Chat UI */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* User Bubble - Added Gradient */}
        <div style={{ alignSelf: 'flex-end', background: 'var(--primary-gradient)', padding: '12px 18px', borderRadius: '18px 18px 4px 18px', color: 'white', fontSize: '0.9rem', fontWeight: '600', boxShadow: '0 4px 10px rgba(234, 88, 12, 0.3)' }}>
          Who do I owe right now?
        </div>
        {/* AI Bubble - Cleaner Look */}
        <div style={{ alignSelf: 'flex-start', background: '#1a1a1a', padding: '14px 18px', borderRadius: '18px 18px 18px 4px', color: '#e5e5e5', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.05)', lineHeight: '1.5' }}>
          Based on your recent trip, you owe <strong style={{ color: 'white' }}>John $45.50</strong> for the Pizza night. 🍕
        </div>
      </div>

      {/* Input Mockup - Added Send Icon placeholder */}
      <div style={{ marginTop: '30px', height: '48px', borderRadius: '24px', background: '#111', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent:'space-between', padding: '0 6px 0 20px', color: '#777', fontSize: '0.9rem' }}>
        <span>Ask about your spending...</span>
        <div style={{ width:'36px', height:'36px', background:'var(--primary)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', opacity: 0.8 }}>
           <ArrowRight size={16} color="white" />
        </div>
      </div>
    </div>

  </div>
</div>
      </header>

     {/* --- FEATURES SECTION --- */}
     <section className="features-section animate-entry" style={{ animationDelay: '0.3s' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', fontSize: '0.8rem', color: '#888', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
            POWERFUL FEATURES
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', marginBottom: '10px' }}>More than just splitting.</h2>
          <p style={{ maxWidth: '500px', margin: '0 auto', color: '#888' }}>
             Everything you need to manage shared expenses without the awkward math.
          </p>
        </div>

        <div className="bento-grid">
          
          {/* Feature 1: AI (Big Card) - WITH CHAT VISUAL */}
          <div className="bento-item featured" style={{ background: 'linear-gradient(145deg, #111, #0a0a0a)', border: '1px solid rgba(234,88,12,0.2)', position: 'relative', overflow: 'hidden' }}>
            
            {/* Ambient Orange Glow */}
            <div style={{ position: 'absolute', top: '-50%', right: '-20%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(234,88,12,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }}></div>
            
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ marginBottom: '20px', width: '50px', height: '50px', background: 'rgba(234,88,12,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(234,88,12,0.2)' }}>
                <Sparkles size={24} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', color: 'white' }}>AI-Powered Insights</h3>
              <p style={{ color: '#a1a1aa', maxWidth: '400px', marginBottom: '30px' }}>
                Don't manually search through months of history. Just ask Gemini: "How much did I spend on food?"
              </p>

              {/* Mini Chat UI Decoration */}
              <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '350px' }}>
                 <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                 <div style={{ height: '6px', width: '60%', background: '#333', borderRadius: '4px' }}></div>
                 <div style={{ marginLeft: 'auto', padding: '4px 8px', background: 'rgba(234,88,12,0.2)', borderRadius: '6px', fontSize: '0.6rem', color: 'var(--primary)' }}>ASK</div>
              </div>
            </div>
          </div>

          {/* Feature 2: Algorithms - WITH GRAPH VISUAL */}
          <div className="bento-item" style={{ background: 'linear-gradient(145deg, #111, #0a0a0a)', position: 'relative', overflow: 'hidden' }}>
             {/* Green Glow */}
             <div style={{ position: 'absolute', bottom: '-20%', left: '-20%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)', filter: 'blur(40px)' }}></div>
             
             <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ marginBottom: '20px', width: '50px', height: '50px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <BrainCircuit size={24} color="#10b981" />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '10px', color: 'white' }}>Optimised Algorithms</h3>
                <p style={{ color: '#a1a1aa' }}>We use graph theory to minimize transactions. 5 debts become 1.</p>
                
                {/* Abstract Graph Visual */}
                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '5px', opacity: 0.5 }}>
                   <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
                   <div style={{ height: '1px', flex: 1, background: '#333' }}></div>
                   <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
                   <div style={{ height: '1px', flex: 1, background: '#333' }}></div>
                   <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
                </div>
             </div>
          </div>

          {/* Feature 3: Groups - WITH AVATAR VISUAL */}
          <div className="bento-item" style={{ background: 'linear-gradient(145deg, #111, #0a0a0a)', position: 'relative', overflow: 'hidden' }}>
             {/* Blue Glow */}
             <div style={{ position: 'absolute', top: '-20%', right: '-20%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)', filter: 'blur(40px)' }}></div>

             <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ marginBottom: '20px', width: '50px', height: '50px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                  <Users size={24} color="#3b82f6" />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '10px', color: 'white' }}>Flexible Groups</h3>
                <p style={{ color: '#a1a1aa' }}>Split by percentages, shares, or exact amounts. Perfect for any trip.</p>

                {/* Overlapping Avatars Decoration */}
                <div style={{ marginTop: '20px', display: 'flex' }}>
                   <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#333', border: '2px solid #111' }}></div>
                   <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#444', border: '2px solid #111', marginLeft: '-10px' }}></div>
                   <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#555', border: '2px solid #111', marginLeft: '-10px' }}></div>
                </div>
             </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default LandingPage;