import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "mentor_portal_v1";

const DEFAULT_MENTOR = {
  id: "mentor-1",
  name: "Prof. Sharma",
  dept: "CSE",
  mentees: [
    { id: "21CSE046", name: "Ravi Mehta", gpa: 6.8, attendance: 60, finance: { total: 50000, paid: 20000, others: 500 }, assignments: [], exams: [{ subject: "Math", marks: 42 }], scores: [42], attempts: [] },
    { id: "21CSE048", name: "Rohan Das", gpa: 3.2, attendance: 85, finance: { total: 0, paid: 0, others: 0 }, assignments: [], exams: [{ subject: "Math", marks: 32 }], scores: [32], attempts: [] },
    { id: "21CSE047", name: "Zara Singh", gpa: 9.0, attendance: 88, finance: { total: 50000, paid: 50000, others: 0 }, assignments: [], exams: [{ subject: "Math", marks: 92 }], scores: [92], attempts: [] },
    { id: "21CSE049", name: "Ankit Rao", gpa: 5.0, attendance: 65, finance: { total: 40000, paid: 15000, others: 2000 }, assignments: [], exams: [{ subject: "DBMS", marks: 28 }], scores: [28], attempts: [] },
    { id: "21CSE050", name: "Meena Patil", gpa: 4.2, attendance: 70, finance: { total: 30000, paid: 10000, others: 0 }, assignments: [], exams: [{ subject: "OS", marks: 35 }], scores: [35], attempts: [] },
    { id: "21CSE051", name: "Kunal Yadav", gpa: 8.0, attendance: 62, finance: { total: 0, paid: 0, others: 0 }, assignments: [], exams: [{ subject: "CN", marks: 75 }], scores: [75], attempts: [] },
    { id: "21CSE052", name: "Isha Sharma", gpa: 7.5, attendance: 90, finance: { total: 45000, paid: 25000, others: 0 }, assignments: [], exams: [{ subject: "OS", marks: 80 }], scores: [80], attempts: [] },
    { id: "21CSE053", name: "Rahul Nair", gpa: 3.0, attendance: 85, finance: { total: 0, paid: 0, others: 0 }, assignments: [], exams: [{ subject: "DBMS", marks: 25 }], scores: [25], attempts: [] },
    { id: "21CSE054", name: "Sneha Gupta", gpa: 9.1, attendance: 92, finance: { total: 60000, paid: 60000, others: 0 }, assignments: [], exams: [{ subject: "Math", marks: 95 }], scores: [95], attempts: [] },
    { id: "21CSE055", name: "Vikram Singh", gpa: 8.5, attendance: 88, finance: { total: 50000, paid: 50000, others: 0 }, assignments: [], exams: [{ subject: "CN", marks: 85 }], scores: [85], attempts: [] },
    { id: "21CSE056", name: "Pooja Reddy", gpa: 8.8, attendance: 93, finance: { total: 55000, paid: 55000, others: 0 }, assignments: [], exams: [{ subject: "OS", marks: 89 }], scores: [89], attempts: [] },
    { id: "21CSE057", name: "Arjun Verma", gpa: 4.0, attendance: 58, finance: { total: 50000, paid: 15000, others: 1000 }, assignments: [], exams: [{ subject: "Math", marks: 30 }], scores: [30], attempts: [] },
    { id: "21CSE058", name: "Divya Menon", gpa: 5.5, attendance: 62, finance: { total: 45000, paid: 20000, others: 500 }, assignments: [], exams: [{ subject: "DBMS", marks: 40 }], scores: [40], attempts: [] },
    { id: "21CSE059", name: "Harsh Jain", gpa: 7.8, attendance: 80, finance: { total: 20000, paid: 10000, others: 0 }, assignments: [], exams: [{ subject: "CN", marks: 76 }], scores: [76], attempts: [] }
  ],
  assignments: [
    { id: "A1", title: "Integrals HW", course: "Math", due: "2025-09-28" },
    { id: "A2", title: "Process Sync", course: "OS", due: "2025-09-20" }
  ],
  submissions: [
    { studId: "21CSE046", assignId: "A1", status: "Pending", grade: null, file: "" },
    { studId: "21CSE047", assignId: "A2", status: "Submitted", grade: 9, file: "sync_zara.zip" }
  ],
  exams: [
    { studId: "21CSE046", subject: "Math", marks: 42 },
    { studId: "21CSE047", subject: "Math", marks: 92 },
    { studId: "21CSE048", subject: "Math", marks: 32 }
  ],
  notices: [{ id: 1, title: "Meeting", body: "Mentor meeting tomorrow 4pm", date: "2025-09-20" }],
  attendanceToday: {}
};

const cloneMentor = (m) => JSON.parse(JSON.stringify(m));
const rupee = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const parseSimpleCsv = (text) => {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length);
  if (!lines.length) return [];
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const cols = line.split(",");
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = cols[idx] ? cols[idx].trim() : "";
    });
    return obj;
  });
};

const MentorDashboard = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);

  const styles = `
    /* ===============================================================
       Theme variables and base (kept as original, small additions)
       =============================================================== */

     :root {
      --bg: #192047;
      --purple: #A2F4F9;
      --purple-2: #262C53;
      --muted: #7b7b8a;
      --card: #262C53;
      --soft: #1a2349;
      --radius:14px;
      --text-dark: #F7FAFC;
      --c1: #192047;
      --c2: #FFD1D8;
      --c3: #262C53;
      --c4: #A2F4F9;
      --risk-high: #ef4444; /* vivid red */
      --risk-med:  #f97316; /* bright orange */
      --risk-low:  #22c55e; /* crisp green */
    }

    * { box-sizing: border-box; }

    body{
      margin:0;
      font-family: Inter, "Segoe UI", Helvetica, Arial, sans-serif;
      background: var(--bg);
      color: var(--text-dark);
      -webkit-font-smoothing:antialiased;
      -moz-osx-font-smoothing:grayscale;
    }

    /* Topbar / Header */
    .topbar{
      background: var(--c3);
      color: #fff;
      padding: 14px 20px;
      display:flex;
      align-items:center;
      justify-content:space-between;
      box-shadow: 0 8px 24px rgba(34,11,89,0.12);
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
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <style>{styles}</style>

      {/* Topbar */}
      <div className="topbar">
        <div className="brand">
          <div className="logo">AIT</div>
          <div>
            <div style={{ fontSize: 14, opacity: 0.95 }}>ABC Institute of Technology</div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>Mentor Dashboard</div>
          </div>
        </div>

        <div className="top-right">
          <div className="muted" id="todaySmall">{today}</div>
          <div className="profile-mini" title={profileName}>
            <div className="avatar" style={{ width: 34, height: 34, background: "var(--c4)", color: "var(--c3)" }}>{profileInitials}</div>
            <div style={{ color: "#ffffffff" }}>
              {profileName}
              <br />
              <small style={{ opacity: 0.9, color: "#fff" }}>Mentor • {profileDept}</small>
            </div>
          </div>
        </div>
      </div>

      {/* Container */}
      <div className="container">
        {/* Sidebar */}
        <aside className="sidebar" id="sidebar">
          <h2>Mentor Menu</h2>

          {[
            ["dashboardPage", "Dashboard"],
            // ["analyticsPage", "Analytics"],
            ["profilePage", "Profile"],
            ["studentsPage", "Students"],
            ["attendancePage", "Attendance"],
            ["assignmentsPage", "Assignments"],
            ["submissionsPage", "Submissions"],
            ["examsPage", "Exams & Results"],
            // ["performancePage", "Performance"],
            ["noticesPage", "Notices"],
            ["feesPage", "Fees Overview"]
          ].map(([key, label]) => (
            <a
              key={key}
              className={`nav-item ${activePage === key ? "active" : ""}`}
              onClick={() => navigateTo(key)}
            >
              {label}
            </a>
          ))}

          <hr style={{ border: "none", height: 1, background: "rgba(255,255,255,0.03)", margin: "10px 0" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label className="nav-item" style={{ cursor: "default" }}>Import CSVs</label>
            <input ref={importStudentsRef} type="file" accept=".csv" style={{ color: "transparent" }} />
            <input ref={importExamsRef} type="file" accept=".csv" style={{ color: "transparent" }} />
            <input ref={importFeesRef} type="file" accept=".csv" style={{ color: "transparent" }} />
            <button className="btn ghost" onClick={async () => {
              await importCsv(importStudentsRef.current?.files?.[0], "students");
              await importCsv(importExamsRef.current?.files?.[0], "exams");
              await importCsv(importFeesRef.current?.files?.[0], "fees");
            }}>Import Selected</button>
            <button className="btn" onClick={exportRiskCSV}>Export Risk CSV</button>
            <button className="btn ghost" onClick={() => { console.log(cloneMentor(mentor)); alert("State logged to console (debug)."); }}>Debug State</button>
            <a className="nav-item" onClick={logout}>Logout</a>
          </div>
        </aside>

        {/* Main */}
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
