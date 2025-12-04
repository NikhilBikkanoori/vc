import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MentorDashboard = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);

  const styles = `
    :root {
      --bg: #192047;
      --card: #262C53;
      --soft: #1a2349;
      --muted: #9aa3be;
      --accent: #A2F4F9;
      --danger: #ff6b6b;
      --warning: #ffa500;
      --success: #51cf66;
      --info: #339af0;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      font-family: 'Inter', 'Segoe UI', sans-serif;
      background: var(--bg);
      color: white;
    }

    .topbar {
      background: var(--card);
      padding: 15px 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: rgba(255,255,255,0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
    }

    .top-right {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .profile-mini {
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(255,255,255,0.12);
      padding: 6px 10px;
      border-radius: 999px;
      cursor: pointer;
    }

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--accent);
      color: var(--card);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
    }

    .container {
      display: flex;
      gap: 0;
      margin-top: 60px;
      width: 100%;
    }

    .sidebar {
      width: 200px;
      background: var(--card);
      padding: 20px;
      min-height: calc(100vh - 60px);
      box-shadow: 2px 0 8px rgba(0,0,0,0.1);
    }

    .sidebar h2 {
      font-size: 14px;
      margin: 0 0 12px 0;
      color: var(--accent);
    }

    .nav-item {
      display: block;
      padding: 12px;
      margin: 4px 0;
      background: transparent;
      border: none;
      color: var(--text);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      width: 100%;
      text-align: left;
      font-size: 14px;
    }

    .nav-item:hover {
      background: rgba(255,255,255,0.06);
      color: var(--accent);
    }

    .nav-item.active {
      background: var(--accent);
      color: var(--card);
      font-weight: 600;
    }

    .main {
      flex: 1;
      padding: 28px;
    }

    .card {
      background: var(--card);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }

    .stat-box {
      background: var(--card);
      padding: 20px;
      border-radius: 12px;
      text-align: center;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: var(--accent);
      margin: 10px 0;
    }

    .stat-label {
      color: var(--muted);
      font-size: 0.9rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    th {
      color: var(--accent);
      font-weight: 600;
    }

    .btn {
      padding: 8px 16px;
      background: var(--accent);
      color: var(--card);
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(162, 244, 249, 0.3);
    }

    .profile-dropdown {
      position: absolute;
      top: 66px;
      right: 28px;
      background: var(--card);
      border-radius: 8px;
      padding: 12px;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
      z-index: 1100;
      min-width: 180px;
    }

    .profile-dropdown a {
      display: block;
      padding: 10px;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      transition: background 0.2s;
      cursor: pointer;
    }

    .profile-dropdown a:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  `;

  const mentees = [
    { id: '21CSE046', name: 'Ravi Mehta', gpa: 6.8, attendance: 60, status: 'High Risk' },
    { id: '21CSE047', name: 'Zara Singh', gpa: 9.0, attendance: 88, status: 'Low Risk' },
    { id: '21CSE048', name: 'Rohan Das', gpa: 3.2, attendance: 85, status: 'High Risk' }
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <style>{styles}</style>

      {/* TOPBAR */}
      <div className="topbar">
        <div className="brand">
          <div className="logo">AIT</div>
          <div>
            <div style={{ fontSize: '14px', opacity: 0.95 }}>Mentor Dashboard</div>
            <div style={{ fontSize: '12px', opacity: 0.85 }}>ABC Institute of Technology</div>
          </div>
        </div>

        <div className="top-right">
          <div className="profile-mini" onClick={() => setProfileDropdownVisible(!profileDropdownVisible)}>
            <div className="avatar">S</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>Prof. Sharma</div>
              <small style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.85)' }}>Mentor • CSE</small>
            </div>
          </div>
          {/* Profile Dropdown */}
            {profileDropdownVisible && (
              <div className={`profile-dropdown ${profileDropdownVisible ? 'show' : ''}`}>
                <button onClick={() => navigate('/MentorProfile')} style={{background: 'none', border: 'none', color: '#fff', fontSize: '14px', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', display: 'block', padding: '12px', width: '100%', textAlign: 'left'}}>Profile</button>
                <button onClick={() => navigate('/')} style={{background: 'none', border: 'none', color: '#fff', fontSize: '14px', textDecoration: 'none', cursor: 'pointer', display: 'block', padding: '12px', width: '100%', textAlign: 'left'}}>Logout</button>
              </div>
            )}
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="container">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <h2>Mentor Menu</h2>
          <button className={`nav-item ${activeNav === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveNav('dashboard')}>
            Dashboard
          </button>
          <button className={`nav-item ${activeNav === 'mentees' ? 'active' : ''}`} onClick={() => setActiveNav('mentees')}>
            Mentees
          </button>
          <button className={`nav-item ${activeNav === 'attendance' ? 'active' : ''}`} onClick={() => setActiveNav('attendance')}>
            Attendance
          </button>
          <button className={`nav-item ${activeNav === 'notices' ? 'active' : ''}`} onClick={() => setActiveNav('notices')}>
            Notices
          </button>
          <button className={`nav-item ${activeNav === 'fees' ? 'active' : ''}`} onClick={() => setActiveNav('fees')}>
            Fees Overview
          </button>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main">
          {activeNav === 'dashboard' && (
            <>
              <h2>Dashboard</h2>
              <p style={{ color: 'var(--muted)' }}>Monitor your mentees' performance and attendance.</p>
              
              <div className="grid">
                <div className="stat-box">
                  <div className="stat-label">Total Mentees</div>
                  <div className="stat-value">3</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">At Risk</div>
                  <div className="stat-value">2</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Avg GPA</div>
                  <div className="stat-value">7.67</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Avg Attendance</div>
                  <div className="stat-value">78%</div>
                </div>
              </div>
            </>
          )}

          {activeNav === 'mentees' && (
            <>
              <h2>Your Mentees</h2>
              <div className="card">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Roll No</th>
                      <th>GPA</th>
                      <th>Attendance</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mentees.map((mentee) => (
                      <tr key={mentee.id}>
                        <td>{mentee.name}</td>
                        <td>{mentee.id}</td>
                        <td>{mentee.gpa}</td>
                        <td>{mentee.attendance}%</td>
                        <td style={{ color: mentee.status === 'High Risk' ? '#ff6b6b' : '#51cf66' }}>{mentee.status}</td>
                        <td><button className="btn">Message</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeNav === 'attendance' && (
            <>
              <h2>Mark Attendance (Today)</h2>
              <div className="card">
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Present</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mentees.map((mentee) => (
                      <tr key={mentee.id}>
                        <td>{mentee.name}</td>
                        <td><input type="checkbox" defaultChecked /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button className="btn" style={{ marginTop: '20px' }}>Submit Attendance</button>
              </div>
            </>
          )}

          {activeNav === 'notices' && (
            <>
              <h2>Notices</h2>
              <div className="card">
                <h3 style={{ color: 'var(--accent)', marginTop: 0 }}>Mentor Meeting</h3>
                <p>Important mentor meeting scheduled for September 20, 2025 at 4:00 PM</p>
                <small style={{ color: 'var(--muted)' }}>Posted on: 2025-09-15</small>
              </div>
            </>
          )}

          {activeNav === 'fees' && (
            <>
              <h2>Fees Overview</h2>
              <div className="card">
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Total Fees</th>
                      <th>Paid</th>
                      <th>Pending</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mentees.map((mentee) => (
                      <tr key={mentee.id}>
                        <td>{mentee.name}</td>
                        <td>$50,000</td>
                        <td>$20,000</td>
                        <td style={{ color: '#ff6b6b' }}>$30,000</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <div style={{ marginTop: '40px' }}>
            <button className="btn" onClick={() => navigate('/')}>Back to Home</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MentorDashboard;
