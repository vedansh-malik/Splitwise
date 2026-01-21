import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, User } from 'lucide-react';

const MobileNav = () => {
  const location = useLocation();

  // Hide Navbar on Login, Signup, and Landing pages
  const hideOnRoutes = ['/login', '/signup', '/'];
  if (hideOnRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <div className="mobile-nav" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '60px', // Tall enough for comfortable tapping
      background: 'rgba(10, 10, 10, 0.95)', // Deep Matte Black
      backdropFilter: 'blur(12px)', // Glass effect
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 1000,
      paddingBottom: '10px' // Extra padding for iPhone Home Indicator
    }}>
      
      {/* Dashboard Tab */}
      <NavLink 
        to="/dashboard" 
        style={({ isActive }) => ({
          textDecoration: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          color: isActive ? 'var(--primary)' : 'var(--text-muted)',
          opacity: isActive ? 1 : 0.6,
          fontSize: '0.75rem',
          fontWeight: isActive ? '600' : '500',
          transition: 'all 0.2s ease'
        })}
      >
        {({ isActive }) => (
          <>
            <LayoutDashboard size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span>Home</span>
          </>
        )}
      </NavLink>

      {/* Profile Tab */}
      <NavLink 
        to="/profile" 
        style={({ isActive }) => ({
          textDecoration: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          color: isActive ? 'var(--primary)' : 'var(--text-muted)',
          opacity: isActive ? 1 : 0.6,
          fontSize: '0.75rem',
          fontWeight: isActive ? '600' : '500',
          transition: 'all 0.2s ease'
        })}
      >
        {({ isActive }) => (
          <>
            <User size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span>Profile</span>
          </>
        )}
      </NavLink>

    </div>
  );
};

export default MobileNav;