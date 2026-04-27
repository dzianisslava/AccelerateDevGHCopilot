import React from 'react';
import { authAPI } from '../api';
import './Login.css';

export default function Login() {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo">🍽️</div>
        <h1>Meal Planner</h1>
        <p>Plan your meals, save time, eat better</p>

        <button className="google-btn" onClick={authAPI.googleLogin}>
          <span>🔐</span> Sign in with Google
        </button>

        <div className="features">
          <h3>Why use Meal Planner?</h3>
          <ul>
            <li>📅 Plan your weekly meals</li>
            <li>📝 Save your favorite recipes</li>
            <li>🛒 Generate shopping lists</li>
            <li>📱 Share meals with friends</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
