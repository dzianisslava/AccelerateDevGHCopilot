import React from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './AuthSuccess.css';

export default function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState('');

  useEffect(() => {
    const t = searchParams.get('token');
    if (t) {
      localStorage.setItem('token', t);
      setToken(t);
      setTimeout(() => {
        window.location.href = '/meals';
      }, 2000);
    }
  }, [searchParams]);

  return (
    <div className="auth-success">
      <div className="success-card">
        <div className="success-icon">✅</div>
        <h1>Login Successful!</h1>
        <p>Welcome to Meal Planner. Redirecting...</p>
        <div className="token-display">
          <small>Token: {token?.slice(0, 20)}...</small>
        </div>
      </div>
    </div>
  );
}
