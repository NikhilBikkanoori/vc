import React from 'react';
import { useNavigate } from 'react-router-dom';

const ParentLogin = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/parent-dashboard');
  };

  return (
    <div style={{ background: '#192047', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Segoe UI', sans-serif" }}>
      <header style={{ background: '#262C53', color: '#fff', padding: '15px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ background: 'linear-gradient(135deg, #192047, #A2F4F9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontSize: '1.8em', fontWeight: 'bold' }}>DropShield</h1>
      </header>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
        <div style={{ background: '#262C53', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 6px 18px rgba(0,0,0,0.1)', padding: '2rem' }}>
          <h2 style={{ textAlign: 'center', color: '#A2F4F9', marginBottom: '1.5rem' }}>
            <i className="fas fa-user-shield" style={{ marginRight: '0.5rem' }}></i> Parent Login
          </h2>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#A2F4F9', fontWeight: 500 }}>Parent ID</label>
              <input type="text" placeholder="Enter your parent ID" style={{ width: '100%', color:'black',padding: '0.75rem', border: '1px solid #ccc', borderRadius: '6px', fontSize: '1rem', boxSizing: 'border-box' }} required />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#A2F4F9', fontWeight: 500 }}>Password</label>
              <input type="password" placeholder="Enter your password" style={{ width: '100%',color:'black', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '6px', fontSize: '1rem', boxSizing: 'border-box' }} required />
            </div>

            <button type="submit" style={{ width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg, #192047, #262C53)', color: '#A2F4F9', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem', transition: 'all 0.3s ease' }}>
              Login
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.9rem' }}>
              <a href="#" style={{ color: '#A2F4F9', textDecoration: 'none' }}>Forgot Password?</a>
              <a href="/" style={{ color: '#A2F4F9', textDecoration: 'none' }}>Back to Home</a>
            </div>
          </form>
        </div>
      </div>

      <footer style={{ background: '#262C53', color: '#fff', textAlign: 'center', padding: '20px' }}>
        <p>&copy; 2025 Dropout Prediction & Counselling System</p>
      </footer>
    </div>
  );
};

export default ParentLogin;