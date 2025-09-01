import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';
import UserProfile from './UserProfile';

const Header = ({ cartCount, onCartClick }) => {
  const { user, isAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>☕ Brew & Beans</h1>
        </div>
        
        <nav className="nav">
          <ul className="nav-list">
            <li><a href="#home">Home</a></li>
            <li><a href="#menu">Menu</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>

        <div className="header-actions">
          {isAuthenticated ? (
            <div className="user-menu">
              <button 
                className="profile-btn"
                onClick={() => setShowProfile(true)}
              >
                <span className="user-avatar">👤</span>
                <span className="user-name">{user?.name}</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button 
                className="login-btn"
                onClick={() => setShowLogin(true)}
              >
                Sign In
              </button>
              <button 
                className="register-btn"
                onClick={() => setShowLogin(true)}
              >
                Sign Up
              </button>
            </div>
          )}
          
          <div className="cart-button" onClick={onCartClick}>
            <span className="cart-icon">🛒</span>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </div>
        </div>
      </div>

      {showLogin && (
        <Login 
          onClose={() => setShowLogin(false)}
          showRegister={false}
        />
      )}

      {showProfile && (
        <UserProfile 
          onClose={() => setShowProfile(false)}
        />
      )}
    </header>
  );
};

export default Header;

