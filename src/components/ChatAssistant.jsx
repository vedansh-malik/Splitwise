import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Loader2 } from 'lucide-react';
import api from '../api/axiosInstance';

const ChatAssistant = ({ groups, user, currency }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: `Hi ${user?.name?.split(' ')[0] || 'there'}! I can help you analyze your expenses. Ask me "Who owes me money?"` }
  ]);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // --- CONTEXT ENGINE ---
  const generateFinancialContext = () => {
    if (!groups || groups.length === 0) return "User has no groups.";
    let summary = `User: ${user?.name}. Currency: ${currency}.\nGroups Data:\n`;
    groups.forEach(g => {
      summary += `- Group "${g.name}": `;
      if (Math.abs(g.balance) < 0.01) summary += `Settled. `;
      else if (g.balance > 0) summary += `User is OWED ${currency}${g.balance.toFixed(2)}. `;
      else summary += `User OWES ${currency}${Math.abs(g.balance).toFixed(2)}. `;
      summary += `Members: ${g.members.length}.\n`;
    });
    return summary;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const context = generateFinancialContext();

    try {
      const res = await api.post('/chat', { context, question: input });
      setMessages(prev => [...prev, { role: 'assistant', text: res.data.answer }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I couldn't reach the server." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* --- 1. FLOATING BUTTON --- */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed', 
          bottom: '60px', right: '24px',
          width: '56px', height: '56px', borderRadius: '50%',
          background: 'var(--primary-gradient)', 
          border: 'none',
          boxShadow: '0 8px 20px rgba(234, 88, 12, 0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 9999, transition: 'transform 0.2s',
          color: 'white'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? (
          <X color="#ffffff" size={28} strokeWidth={2.5} style={{ flexShrink: 0 }} />
        ) : (
          <Sparkles color="#ffffff" size={28} strokeWidth={2.5} style={{ flexShrink: 0 }} />
        )}
      </button>

      {/* --- 2. CHAT WINDOW --- */}
      {isOpen && (
        <div className="chat-window animate-entry" style={{
          position: 'fixed', bottom: '120px', right: '24px',
          width: '360px', height: '450px',
          background: '#121212', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px', boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
          display: 'flex', flexDirection: 'column', zIndex: 9999, overflow: 'hidden'
        }}>
          
          {/* Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '10px', background: '#1a1a1a' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(234,88,12,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Sparkles size={16} color="var(--primary)" />
            </div>
            <div>
               <h3 style={{ margin: 0, fontSize: '0.95rem', color: 'white' }}>Fin-AI Assistant</h3>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%', padding: '12px 16px', borderRadius: '18px',
                borderBottomRightRadius: msg.role === 'user' ? '4px' : '18px',
                borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '18px',
                background: msg.role === 'user' ? 'var(--primary)' : '#1e1e1e',
                color: msg.role === 'user' ? 'white' : '#e5e5e5',
                fontSize: '0.92rem', lineHeight: '1.5',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', marginLeft: '10px' }}>
                <Loader2 className="spin" size={20} color="var(--primary)" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} style={{ padding: '0px', background: '#121212', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', background: '#1e1e1e', borderRadius: '0px', border: '1px solid rgba(255,255,255,0.1)', padding: '6px' }}>
              <input 
                value={input} onChange={(e) => setInput(e.target.value)}
                placeholder="Ask financial question..." 
                style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', padding: '10px 16px', outline: 'none', fontSize: '0.95rem' }}
              />
              
              {/* --- 3. SEND BUTTON (FIXED) --- */}
              <button type="submit" style={{ 
                width: '40px', height: '40px', borderRadius: '50%', border: 'none', 
                /* Lighter grey background when inactive so it's not too dark */
                background: input.trim() ? 'var(--primary)' : '#444', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                cursor: input.trim() ? 'pointer' : 'default', transition: '0.2s', flexShrink: 0 
              }}>
                <Send 
                  /* Use Hex codes for absolute certainty */
                  color={input.trim() ? '#ffffff' : '#9ca3af'} 
                  size={18} 
                  strokeWidth={2.5} 
                  style={{ marginLeft: '-2px', flexShrink: 0 }} 
                />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- MOBILE RESPONSIVENESS --- */}
      <style>{`
        @media (max-width: 768px) {
          .chat-window {
            width: 90% !important;
            right: 5% !important;
            left: 5% !important;
            bottom: 120px !important;
            height: 60vh !important;
          }
        }
      `}</style>
    </>
  );
};

export default ChatAssistant;