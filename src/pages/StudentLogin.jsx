import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const StudentLogin = () => {
  const navigate = useNavigate();

  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("https://dropshieldbe-a3fmaucneacte4av.southindia-01.azurewebsites.net/api/student-login/login", {
        Username: studentId,
        Password: password,
      });

      // Store JWT token
      localStorage.setItem("token", res.data.token);
      
      // Store student ID for profile page
      localStorage.setItem("studentname", res.data.student.Username);
      
      // Store student basic info for quick access
      localStorage.setItem("studentData", JSON.stringify(res.data.student));

      // Navigate to dashboard
      navigate("/Dashboard");

    } catch (err) {
      console.log(err);
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div style={{ background: '#192047', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Segoe UI', sans-serif" }}>
      <header style={{ background: '#262C53', color: '#fff', padding: '15px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ background: 'linear-gradient(135deg, #192047, #A2F4F9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontSize: '1.8em', fontWeight: 'bold' }}>DropShield</h1>
      </header>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
        <div style={{ background: '#262C53', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 6px 18px rgba(0,0,0,0.1)', padding: '2rem' }}>
          <h2 style={{ textAlign: 'center', color: '#A2F4F9', marginBottom: '1.5rem' }}>
            <i className="fas fa-user-graduate" style={{ marginRight: '0.5rem' }}></i> Student Login
          </h2>

          {error && (
            <p style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#A2F4F9', fontWeight: 500 }}>Student ID</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Enter your student ID"
                style={{ width: '100%', color:'black', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '6px', fontSize: '1rem' }}
                required
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#A2F4F9', fontWeight: 500 }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{ width: '100%', color:'black', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '6px', fontSize: '1rem' }}
                required
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'linear-gradient(135deg, #192047, #262C53)',
                color: '#A2F4F9',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginTop: '1rem',
                transition: '0.3s'
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>

      <footer style={{ background: '#262C53', color: '#fff', textAlign: 'center', padding: '20px' }}>
        <p>&copy; 2025 Dropout Prediction & Counselling System</p>
      </footer>
    </div>
  );
};

export default StudentLogin;
