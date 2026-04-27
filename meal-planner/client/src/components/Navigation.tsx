import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import './Navigation.css';

export default function Navigation() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authAPI.logout();
    navigate('/');
  };

  const isLoggedIn = localStorage.getItem('token');

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🍽️ Meal Planner
        </Link>

        {isLoggedIn && (
          <div className="nav-links">
            <Link to="/meals">My Meals</Link>
            <Link to="/plan">Meal Plan</Link>
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
