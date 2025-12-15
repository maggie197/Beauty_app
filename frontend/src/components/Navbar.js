import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-icon">✨</span>
          <span className="logo-text">BeautyBook</span>
        </Link>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          <Link to="/services" className="nav-link" onClick={closeMenu}>Services</Link>
          <Link to="/reviews" className="nav-link" onClick={closeMenu}>Reviews</Link>
          <Link to="/contact" className="nav-link" onClick={closeMenu}>Contact</Link>

          {user ? (
            <>
              <Link to="/appointments" className="nav-link" onClick={closeMenu}>My Appointments</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-link" onClick={closeMenu}>Admin</Link>
              )}
              <div className="nav-user">
                <span className="user-name">{user.name}</span>
                <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="btn btn-secondary btn-sm" onClick={closeMenu}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMenu}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
