import { useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { openModal } from '../store/slices/uiSlice';
import "../App.css";
import Logo from '../assets/CUDorms.png';

export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="nav-bar">
      <div className="nav-container">
        <NavLink to="/" className="navbar-logo">
          <img className="navbar-logo" src={Logo} alt="CUDorms Logo"/>
        </NavLink>

        {/* Desktop Navigation */}
        <ul className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <li>
            <NavLink to="/" end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/dorms">
              Dorms
            </NavLink>
          </li>
          <li>
            <NavLink to="/blogs">
              Blog
            </NavLink>
          </li>

          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <li>
                  <NavLink to="/admin/dorms">
                    Admin
                  </NavLink>
                </li>
              )}
              <li className="user-menu">
                <div className="user-info">
                  <span>Welcome, {user?.firstName}</span>
                </div>
                <div className="user-dropdown">
                  <NavLink to="/profile">Profile</NavLink>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </li>
            </>
          ) : (
            <li>
              <button 
                className="auth-button"
                onClick={() => dispatch(openModal('authModal'))}
              >
                Login
              </button>
            </li>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={toggleMobileMenu}></div>
      )}
    </nav>
  );
}
