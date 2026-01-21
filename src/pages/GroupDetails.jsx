import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PieChart, ArrowRight, ArrowLeft, Trash2, Edit2, X, Calendar } from 'lucide-react'; // Added Calendar icon
import api from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';

const GroupDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext); 
  const currency = user?.currency || '$'; 

  const [data, setData] = useState(null);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [editId, setEditId] = useState(null);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [splitType, setSplitType] = useState('EQUAL');
  const [splitValues, setSplitValues] = useState({});

  useEffect(() => { fetchData(); }, [id]);
  useEffect(() => { if (data?.group?.members.length > 0 && !paidBy) setPaidBy(data.group.members[0]._id); }, [data]);

  const fetchData = async () => {
    try {
      const [groupRes, balRes] = await Promise.all([api.get(`/groups/${id}`), api.get(`/groups/${id}/balances`)]);
      setData(groupRes.data);
      setSettlements(balRes.data);
      setLoading(false);
    } catch (err) { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- ADDED VALIDATION HERE ---
    if (Number(amount) <= 0) {
      alert("Please enter a valid amount greater than zero.");
      return;
    }

    const splitDetails = data.group.members.map(m => ({
      user: m._id,
      amount: splitType === 'EXACT' ? Number(splitValues[m._id] || 0) : 0,
      percentage: splitType === 'PERCENTAGE' ? Number(splitValues[m._id] || 0) : 0
    })).filter(d => splitType === 'EQUAL' ? true : d.amount > 0 || d.percentage > 0);

    const payload = { description: desc, amount: Number(amount), groupId: id, paidBy, splitType, splitDetails: splitType === 'EQUAL' ? data.group.members.map(m => m._id) : splitDetails };

    try {
      editId ? await api.put(`/expenses/${editId}`, payload) : await api.post('/expenses', payload);
      setDesc(''); setAmount(''); setEditId(null); setSplitValues({});
      fetchData();
    } catch (err) { alert('Error saving'); }
  };

  const deleteExpense = async (eid) => {
    if(window.confirm("Delete?")) { await api.delete(`/expenses/${eid}`); fetchData(); }
  };

  const handleEdit = (exp) => {
    setEditId(exp._id); setDesc(exp.description); setAmount(exp.amount); setPaidBy(exp.paidBy._id); setSplitType(exp.splitType);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div className="container" style={{textAlign:'center', marginTop:'50px'}}>Loading...</div>;

  return (
    <div className="container">
      <Link to="/" className="flex" style={{ textDecoration:'none', color:'var(--text-muted)', marginBottom:'20px' }}>
        <ArrowLeft size={16}/> Back
      </Link>
      
      <div className="flex-between" style={{ marginBottom:'30px' }}>
        <h1 style={{ marginBottom:'5px', fontSize:'2.5rem' }}>{data.group.name}</h1>
        <div style={{ background:'var(--primary)', padding:'8px 16px', borderRadius:'20px', fontWeight:'bold' }}>{data.group.members.length} Members</div>
      </div>

      {/* --- MAIN LAYOUT GRID --- */}
      <div className="grid">
        
        {/* LEFT COLUMN: Expenses & Form */}
        <div>
          <div className="card" style={{ marginBottom:'30px', border: editId ? '1px solid var(--primary)' : '' }}>
            <div className="flex-between" style={{ marginBottom:'20px' }}>
               <h3>{editId ? 'Edit Expense' : 'Add Expense'}</h3>
               {editId && <button className="secondary" onClick={() => setEditId(null)} style={{padding:'8px'}}><X size={18}/></button>}
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#94a3b8' }}>Description</label>
                <input placeholder="What is this for?" value={desc} onChange={e => setDesc(e.target.value)} required style={{ margin: 0 }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#94a3b8' }}>Amount ({currency})</label>
                  <input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} required style={{ margin: 0, width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#94a3b8' }}>Paid By</label>
                  <select value={paidBy} onChange={e => setPaidBy(e.target.value)} style={{ margin: 0, width: '100%' }}>
                    {data.group.members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                  </select>
                </div>
              </div>

              <label style={{ display:'block', marginBottom:'8px', fontSize:'0.9rem', color: '#94a3b8' }}>Split Method</label>
              <select value={splitType} onChange={e => setSplitType(e.target.value)} style={{ marginTop: 0 }}>
                <option value="EQUAL">Equal Split (=)</option>
                <option value="EXACT">Exact Amounts ({currency})</option>
                <option value="PERCENTAGE">Percentages (%)</option>
              </select>

              {splitType !== 'EQUAL' && (
                <div style={{ background:'rgba(0,0,0,0.2)', padding:'15px', borderRadius:'10px', marginTop:'15px' }}>
                  {data.group.members.map(m => (
                    <div key={m._id} className="flex-between" style={{ marginBottom:'8px' }}>
                      <span>{m.name}</span>
                      <input type="number" placeholder="0" style={{ width:'80px', margin:0 }} 
                        value={splitValues[m._id] || ''} onChange={e => setSplitValues({...splitValues, [m._id]: e.target.value})} />
                    </div>
                  ))}
                </div>
              )}

              <button style={{ width:'100%', marginTop:'24px', height: '48px' }}>
                {editId ? 'Update Expense' : 'Add Expense'}
              </button>
            </form>
          </div>

          <h3>Recent Activity</h3>
          {data.expenses.length === 0 ? <p style={{ textAlign:'center', marginTop:'20px' }}>No expenses yet.</p> : 
            data.expenses.map(e => (
            <div key={e._id} className="card flex-between animate-entry" style={{ padding:'16px', marginBottom:'12px', borderLeft:'4px solid var(--primary)' }}>
              <div style={{ flex: 1 }}>
                <b style={{ display:'block', fontSize:'1.1rem', marginBottom:'4px' }}>{e.description}</b>
                <span style={{ fontSize:'0.85rem', display:'block', marginBottom:'4px' }}>Paid by <strong style={{ color:'white' }}>{e.paidBy.name}</strong></span>
                
                {/* --- ADDED DATE & TIME HERE --- */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#94a3b8' }}>
                   <Calendar size={12} />
                   {new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} 
                   &nbsp;•&nbsp; 
                   {new Date(e.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>

              </div>
              <div style={{ textAlign:'right', paddingLeft: '15px' }}>
                <div className="money pos" style={{ color: 'white', marginBottom:'8px', fontSize: '1.2rem' }}>{currency}{e.amount}</div>
                <div className="flex" style={{ justifyContent: 'flex-end' }}>
                  <button className="secondary" style={{ padding:'6px', fontSize:'0.75rem' }} onClick={() => handleEdit(e)}><Edit2 size={14}/></button>
                  <button className="danger" style={{ padding:'6px', fontSize:'0.75rem', marginLeft:'8px' }} onClick={() => deleteExpense(e._id)}><Trash2 size={14}/></button>
                </div>
              </div>
            </div>  
            ))
          }
        </div>

        {/* RIGHT COLUMN (Desktop) / TOP COLUMN (Mobile) : Settlements */}
        <div>
          <div className="card" style={{ position:'sticky', top:'20px', background:'rgba(16, 185, 129, 0.1)', borderColor:'rgba(16, 185, 129, 0.3)' }}>
            <h3 className="flex" style={{ color:'#34d399' }}><PieChart /> Optimized Debts</h3>
            <p style={{ fontSize:'0.9rem', marginBottom:'20px' }}>Algorithm minimized transactions for efficiency.</p>
            {settlements.length === 0 ? <div style={{ textAlign:'center', color:'#34d399' }}>All settled up! </div> : 
              settlements.map((s, i) => (
                <div key={i} className="card" style={{ padding:'12px', marginBottom:'10px', background:'rgba(0,0,0,0.3)', border:'none', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontWeight:'bold', color:'#f87171' }}>{s.from}</div>
                    <div style={{ fontSize:'0.7rem', color:'#94a3b8' }}>GIVES</div>
                  </div>
                  <div style={{ color:'white', fontWeight:'bold' }}><ArrowRight /></div>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontWeight:'bold', color:'#34d399' }}>{s.to}</div>
                    <div style={{ fontSize:'0.7rem', color:'#94a3b8' }}>RECIEVES</div>
                  </div>
                  <div className="money" style={{ color:'white' }}>{currency}{s.amount}</div>
                </div>
              ))
            }
          </div>
        </div>

      </div>
    </div>
  );
};

export default GroupDetails;