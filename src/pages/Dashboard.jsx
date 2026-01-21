import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, Wallet, X, ChevronRight, User } from 'lucide-react';
import api from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import ChatAssistant from '../components/ChatAssistant';

// --- SUB-COMPONENT: Group Row (Animated) ---
const GroupRow = ({ group, currency }) => {
  const balance = group.balance || 0; 
  
  let balanceColor = 'var(--text-muted)';
  let sign = '';
  
  if (balance > 0.01) {
    balanceColor = 'var(--success)';
    sign = '+';
  } else if (balance < -0.01) {
    balanceColor = 'var(--danger)';
    sign = '-'; 
  }

  return (
    <Link to={`/groups/${group._id}`} className="animate-entry" style={{ textDecoration: 'none', display: 'block' }}>
      <div className="group-row">
        <div className="flex" style={{ flexGrow: 1, overflow: 'hidden' }}>
          <div className="row-icon">
            <Users size={24} />
          </div>
          <div className="row-content" style={{ paddingRight: '10px' }}>
            <h3 className="row-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {group.name}
            </h3>
            <span className="row-sub">
              {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
            </span>
          </div>
        </div>

        <div className="flex" style={{ flexShrink: 0 }}>
          <div style={{ textAlign: 'right', marginRight: '15px' }}>
            <span style={{ display: 'block', fontSize: '0.95rem', fontWeight: '800', color: balanceColor }}>
              {Math.abs(balance) < 0.01 ? (
                <span style={{ color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem' }}>Settled</span>
              ) : (
                <>{sign}{currency}{Math.abs(balance).toFixed(2)}</>
              )}
            </span>
            {Math.abs(balance) >= 0.01 && (
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {balance > 0 ? 'owed' : 'you owe'}
              </span>
            )}
          </div>
          <div className="row-action">
             <ChevronRight size={20} />
          </div>
        </div>
      </div>
    </Link>
  );
};

// --- Sub-Component: Create Group Modal ---
const CreateGroupModal = ({ onClose, onCreate, newGroup, setNewGroup, toggleMember, users }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(5px)' }}>
    <div className="card" style={{ width: '100%', maxWidth: '500px', position: 'relative', background: '#09090b', border: '1px solid rgba(255,255,255,0.1)' }}>
      <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', padding: 0, boxShadow: 'none', width:'auto', minWidth:'auto', border: 'none', cursor:'pointer' }}>
        <X size={24} color="var(--text-muted)"/>
      </button>
      <h2 style={{ marginBottom: '25px', color: 'var(--text-main)' }}>Create New Group</h2>
      <form onSubmit={onCreate}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Group Name</label>
          <input placeholder="e.g. Hawaii Trip" value={newGroup.name} onChange={e => setNewGroup({ ...newGroup, name: e.target.value })} required />
        </div>
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600' }}>Add Members</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', maxHeight: '150px', overflowY: 'auto' }}>
            {users.map(u => (
              <div key={u._id} onClick={() => toggleMember(u._id)} 
                style={{
                  padding: '8px 16px', borderRadius: '20px', fontSize: '0.85rem', cursor: 'pointer',
                  background: newGroup.members.includes(u._id) ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                  color: newGroup.members.includes(u._id) ? 'black' : 'var(--text-main)', 
                  border: newGroup.members.includes(u._id) ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  fontWeight: newGroup.members.includes(u._id) ? '700' : '400'
                }}>
                {u.name}
              </div>
            ))}
          </div>
        </div>
        <button className="btn-full btn-primary" style={{ width: '100%' }}>Create Group</button>
      </form>
    </div>
  </div>
);

// --- Sub-Component: Balance Summary (RESPONSIVE CLASS ADDED) ---
const BalanceSummary = ({ owedToYou, youOwe, currency }) => {
  const netBalance = owedToYou - youOwe;
  const isNegative = netBalance < 0;

  return (
    // Changed to use "balance-card" class
    <div className="card balance-card">
      <h3 style={{ margin: '0 0 10px 0', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700' }}>
        Total Balance
      </h3>
      
      {/* Changed to use "balance-amount" class */}
      <div className="balance-amount" style={{ color: isNegative ? 'var(--danger)' : 'var(--success)' }}>
        {isNegative ? '-' : '+'}{currency}{Math.abs(netBalance).toFixed(2)}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', flexDirection:'column', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem' }}>You owe</span>
          <span style={{ fontWeight: '700', color: 'var(--danger)', fontSize:'1.1rem' }}>{currency}{youOwe.toFixed(2)}</span>
        </div>
        <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
        <div style={{ display: 'flex', flexDirection:'column', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem' }}>You are owed</span>
          <span style={{ fontWeight: '700', color: 'var(--success)', fontSize:'1.1rem' }}>{currency}{owedToYou.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

// --- MAIN DASHBOARD COMPONENT ---
const Dashboard = () => {
  const { user } = useContext(AuthContext); 
  const currency = user?.currency || '$';
  const firstName = user?.name ? user.name.split(' ')[0] : 'User';

  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', members: [] });
  const [loading, setLoading] = useState(true);
  const [balanceSummary, setBalanceSummary] = useState({ youOwe: 0, owedToYou: 0 });

  useEffect(() => { if (user) fetchData(); }, [user]);

  const fetchData = async () => {
    try {
      const [groupsRes, usersRes] = await Promise.all([api.get('/groups'), api.get('/auth/users')]);
      const allGroups = groupsRes.data;
      setUsers(usersRes.data);

      const groupsWithBalances = await Promise.all(allGroups.map(async (group) => {
        try {
          const res = await api.get(`/groups/${group._id}/balances`);
          const settlements = res.data; 
          let groupBalance = 0;
          settlements.forEach(s => {
            const isPayer = (s.from === user.name) || (s.from === user._id);
            const isReceiver = (s.to === user.name) || (s.to === user._id);
            if (isPayer) groupBalance -= s.amount;
            else if (isReceiver) groupBalance += s.amount;
          });
          return { ...group, balance: groupBalance };
        } catch (e) { return { ...group, balance: 0 }; }
      }));

      let totalOwe = 0;
      let totalOwed = 0;
      groupsWithBalances.forEach(g => {
        if (g.balance > 0) totalOwed += g.balance;
        else totalOwe += Math.abs(g.balance);
      });

      setGroups(groupsWithBalances);
      setBalanceSummary({ youOwe: totalOwe, owedToYou: totalOwed });
      setLoading(false);
    } catch (error) { setLoading(false); }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (newGroup.name.trim() === '') return;
    try {
      await api.post('/groups', newGroup);
      setShowCreate(false);
      setNewGroup({ name: '', members: [] });
      fetchData();
    } catch (error) { alert('Failed'); }
  };

  const toggleMember = (id) => {
    const members = newGroup.members.includes(id) ? newGroup.members.filter(m => m !== id) : [...newGroup.members, id];
    setNewGroup({ ...newGroup, members });
  };

  if (loading) return <div className="container" style={{ textAlign:'center', marginTop:'50px', color: 'var(--text-muted)' }}>Loading...</div>;

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      
      {/* 1. HEADER CARD (Using Responsive Classes) */}
      <div className="card header-card">
        <div>
          <div style={{ width: '40px', height: '4px', background: 'var(--primary-gradient)', borderRadius: '4px', marginBottom: '10px' }}></div>
          <h1 className="header-title">
              Hey {firstName}!
          </h1>
          <p className="header-subtitle">
              Welcome back.
          </p>
        </div>

        {/* Profile Button */}
        <Link to="/profile">
          <div className="profile-btn"
            onMouseEnter={(e) => {
               e.currentTarget.style.borderColor = 'var(--primary)';
               e.currentTarget.style.background = 'rgba(234, 88, 12, 0.1)';
            }}
            onMouseLeave={(e) => {
               e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
               e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
            }}
          >
            <User size={26} color="var(--primary)" />
          </div>
        </Link>
      </div>

      <div className="grid">
        {/* Left Column (Groups) */}
        <div>
          <div className="flex-between" style={{ marginBottom: '20px' }}>
            <div className="flex">
              <Wallet color="var(--primary)" size={24} /> 
              <h2 style={{ color: 'var(--text-main)', fontSize: '1.3rem', margin: 0 }}>Your Groups</h2>
            </div>
            <button onClick={() => setShowCreate(true)} style={{ background: 'none', color: 'var(--primary)', padding: 0, fontSize: '0.95rem', width:'auto', minWidth:'auto', boxShadow:'none', fontWeight: '600' }}>
              + New Group
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {groups.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '50px 30px' }}>
                <Users size={40} style={{ opacity: 0.3, marginBottom: '15px', color: 'var(--text-muted)' }} />
                <h3 style={{color: 'var(--text-main)', fontSize:'1.1rem'}}>No groups yet</h3>
                <p style={{color: 'var(--text-muted)', fontSize:'0.9rem'}}>Create a group to start splitting bills.</p>
              </div>
            ) : (
              groups.map(g => <GroupRow key={g._id} group={g} currency={currency} />)
            )}
          </div>
        </div>

        {/* Right Column (Balance) - Sticky */}
        {/* We adjusted the top to 140px to clear the sticky header on desktop */}
        <div style={{ position: 'sticky', top: '140px', height: 'fit-content' }}>
           <BalanceSummary owedToYou={balanceSummary.owedToYou} youOwe={balanceSummary.youOwe} currency={currency} />
        </div>
      </div>

      {showCreate && <CreateGroupModal onClose={() => setShowCreate(false)} onCreate={handleCreateGroup} newGroup={newGroup} setNewGroup={setNewGroup} toggleMember={toggleMember} users={users} />}

      {/* Pass the data to the assistant */}
   <ChatAssistant groups={groups} user={user} currency={currency} />
    </div>
  );
};

export default Dashboard;