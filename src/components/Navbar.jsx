import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Receipt, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { logout } = useContext(AuthContext);

  return (
    <nav className="navbar-glass">
      
      {/* Logo Section */}
      <Link to="/" className="nav-logo-container">
        <div className="nav-logo-icon">
          {/* Using strokeWidth 2.5 for a bolder look */}
          <Receipt size={22} strokeWidth={2.5} />
        </div>
        <span className="nav-logo-text">SplitwisePro</span>
      </Link>

      {/* Logout Button */}
      <button onClick={logout} className="nav-btn-glass">
        <span>Logout</span>
        <LogOut size={16} /> 
      </button>
      
    </nav>
  );
};

export default Navbar;