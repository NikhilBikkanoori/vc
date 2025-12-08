import React, { useEffect, useState, useRef } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

// Import all admin subsection components
import AdminStudents from "./admin/AdminStudents";
import AdminFaculty from "./admin/AdminFaculty";
import AdminParents from "./admin/AdminParents";
//import AdminDepartments from "./admin/AdminDepartments";
//import AdminAttendance from "./admin/AdminAttendance";
import AdminExams from "./admin/AdminExams";
import AdminFees from "./admin/AdminFees";
import AdminAdmins from "./admin/AdminAdmins";

// AdminPanel.jsx
// Single-file React component converted from the provided admin.html
// - Uses Tailwind utility classes for styling
// - Stores data in localStorage (same keys as original)
// - Exports default component

export default function AdminPanel() {
  const USERS_KEY = "users_v4_2";
  const navigate = useNavigate();
  const location = useLocation();

  // Auth
  const [loggedIn, setLoggedIn] = useState(() => {
    const v = localStorage.getItem("isLoggedIn") || "";
    return v.startsWith("admin") ? v : null;
  });
  const [loginErr, setLoginErr] = useState("");
  const userRef = useRef();
  const passRef = useRef();

  // Data states
  const [students, setStudents] = useState(() => {
    try {
      const val = localStorage.getItem("students");
      return val && val !== "undefined" ? JSON.parse(val) : [];
    } catch {
      return [];
    }
  });
  const [faculty, setFaculty] = useState(() => {
    try {
      const val = localStorage.getItem("faculty");
      return val && val !== "undefined" ? JSON.parse(val) : [];
    } catch {
      return [];
    }
  });
  const [parents, setParents] = useState(() => {
    try {
      const val = localStorage.getItem("parents");
      return val && val !== "undefined" ? JSON.parse(val) : [];
    } catch {
      return [];
    }
  });
  const [departments, setDepartments] = useState(() => {
    try {
      const val = localStorage.getItem("departments");
      return val && val !== "undefined" ? JSON.parse(val) : [];
    } catch {
      return [];
    }
  });
  
  const [exams, setExams] = useState(() => {
    try {
      const val = localStorage.getItem("exams");
      return val && val !== "undefined" ? JSON.parse(val) : [];
    } catch {
      return [];
    }
  });
  const [fees, setFees] = useState(() => {
    try {
      const val = localStorage.getItem("fees");
      return val && val !== "undefined" ? JSON.parse(val) : [];
    } catch {
      return [];
    }
  });
  const [users, setUsers] = useState(() => {
    try {
      const val = localStorage.getItem(USERS_KEY);
      if (val && val !== "undefined") {
        return JSON.parse(val);
      }
      return {
        admins: [{ id: "A001", username: "admin", password: "admin123" }],
        students: [],
        faculty: [],
        parents: [],
      };
    } catch {
      return {
        admins: [{ id: "A001", username: "admin", password: "admin123" }],
        students: [],
        faculty: [],
        parents: [],
      };
    }
  });

  // Keep localStorage in sync
  useEffect(
    () => localStorage.setItem("students", JSON.stringify(students)),
    [students]
  );
  useEffect(
    () => localStorage.setItem("faculty", JSON.stringify(faculty)),
    [faculty]
  );
  useEffect(
    () => localStorage.setItem("parents", JSON.stringify(parents)),
    [parents]
  );
  useEffect(
    () => localStorage.setItem("departments", JSON.stringify(departments)),
    [departments]
  );
  
  useEffect(() => localStorage.setItem("exams", JSON.stringify(exams)), [exams]);
  useEffect(() => localStorage.setItem("fees", JSON.stringify(fees)), [fees]);
  useEffect(
    () => localStorage.setItem(USERS_KEY, JSON.stringify(users)),
    [users]
  );

  // Convenience
  const escapeHtml = (s) =>
    s === undefined || s === null
      ? ""
      : String(s)
          .replace(/&/g, "&amp;")
          .replace(/"/g, "&quot;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/'/g, "&#039;");

  // Login handler
  function handleLogin(e) {
    e.preventDefault();
    const u = userRef.current.value.trim();
    const p = passRef.current.value;
    const admin = users.admins.find(
      (a) => a.username === u && a.password === p
    );
    if (admin) {
      const token = `admin:${admin.id}`;
      localStorage.setItem("isLoggedIn", token);
      setLoggedIn(token);
      setLoginErr("");
      return;
    }
    const stud = users.students.find(
      (s) => s.username === u && s.password === p
    );
    if (stud) {
      alert("Student login — admin panel not available.");
      localStorage.setItem("isLoggedIn", `student:${stud.roll}`);
      return;
    }
    const fac = users.faculty.find(
      (f) => f.username === u && f.password === p
    );
    if (fac) {
      alert("Faculty login — admin panel not available.");
      localStorage.setItem("isLoggedIn", `faculty:${fac.fid}`);
      return;
    }
    const par = users.parents.find(
      (pp) => pp.username === u && pp.password === p
    );
    if (par) {
      alert("Parent login — admin panel not available.");
      localStorage.setItem("isLoggedIn", `parent:${par.pid}`);
      return;
    }
    setLoginErr("Invalid credentials");
  }

  function logout() {
    localStorage.removeItem("isLoggedIn");
    setLoggedIn(null);
    // reload for simplicity
    window.location.reload();
  }

  // Export/Import
  function exportData() {
    const all = {
      users,
      students,
      faculty,
      parents,
      departments,
      
      exams,
      fees,
    };
    const blob = new Blob([JSON.stringify(all, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "backup_v4.2.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function importData(e) {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const d = JSON.parse(r.result);
        if (d.users) setUsers(d.users);
        ["students", "faculty", "parents", "departments", "attendance", "exams", "fees"].forEach(
          (k) => {
            if (d[k]) {
              if (k === "students") setStudents(d[k]);
              if (k === "faculty") setFaculty(d[k]);
              if (k === "parents") setParents(d[k]);
              if (k === "departments") setDepartments(d[k]);
             
              if (k === "exams") setExams(d[k]);
              if (k === "fees") setFees(d[k]);
            }
          }
        );
        alert("Imported");
      } catch (err) {
        console.error(err);
        alert("Invalid file");
      }
    };
    r.readAsText(f);
    e.target.value = "";
  }

  // Get active section from URL
  const getActiveSection = () => {
    const path = location.pathname.replace("/admin", "").replace("/", "");
    return path || "students";
  };

  // Navigation handler
  const handleNavClick = (section) => {
    navigate(`/admin/${section}`);
  };

  // UI layout
  if (!loggedIn)
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 w-96">
          <h2 className="text-2xl font-bold text-center mb-4">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                ref={userRef}
                id="username"
                className="w-full border p-2 pt-5 rounded peer text-gray-800 bg-white focus:outline-none focus:border-purple-600"
                placeholder=" "
                required
              />
              <label 
                htmlFor="username"
                className="absolute left-2 top-1 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-purple-600"
              >
                Username
              </label>
            </div>
            <div className="relative">
              <input
                ref={passRef}
                id="password"
                type="password"
                className="w-full border p-2 pt-5 rounded peer text-gray-800 bg-white focus:outline-none focus:border-purple-600"
                placeholder=" "
                required
              />
              <label 
                htmlFor="password"
                className="absolute left-2 top-1 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-purple-600"
              >
                Password
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
            >
              Sign in
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Default admin: <strong>admin</strong> / <strong>admin123</strong>{" "}
              (ID A001)
            </p>
            {loginErr && <div className="text-red-500">{loginErr}</div>}
          </form>
        </div>
      </div>
    );

  const activeSection = getActiveSection();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-purple-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Panel (React)</h1>
        <div className="flex gap-2 items-center">
          <button
            onClick={exportData}
            className="bg-blue-500 px-3 py-1 rounded"
          >
            Export JSON
          </button>
          <label className="bg-green-600 px-3 py-1 rounded cursor-pointer">
            Import{" "}
            <input type="file" onChange={importData} className="hidden" />
          </label>
          <button
            onClick={() => window.print()}
            className="bg-yellow-500 px-3 py-1 rounded"
          >
            Print
          </button>
          <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">
            Logout
          </button>
        </div>
      </nav>
      <div className="flex">
        <aside className="w-72 min-h-screen bg-gray-800 text-white p-4">
          <div className="font-bold text-lg mb-4">Management</div>
          <ul className="space-y-2 text-sm">
            {[
              "students",
              "faculty",
              "parents",
              "attendance",
              "exams",
              "fees",
              "admins",
            ].map((s) => (
              <li key={s}>
                <button
                  onClick={() => handleNavClick(s)}
                  className={`w-full text-left hover:bg-gray-700 p-2 rounded ${
                    activeSection === s ? "bg-gray-700" : " "
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex-1 p-6 space-y-6">
          <Routes>
            <Route
              path="/"
              element={
                <AdminStudents
                  departments={departments}
                  parents={parents}
                  escapeHtml={escapeHtml}
                />
              }
            />
            <Route
              path="/students"
              element={
                <AdminStudents
                  departments={departments}
                  parents={parents}
                  escapeHtml={escapeHtml}
                />
              }
            />
            <Route
              path="/faculty"
              element={
                <AdminFaculty
                  departments={departments}
                  escapeHtml={escapeHtml}
                />
              }
            />
            <Route
              path="/parents"
              element={
                <AdminParents
                  parents={parents}
                  setParents={setParents}
                  students={students}
                  users={users}
                  setUsers={setUsers}
                  escapeHtml={escapeHtml}
                />
              }
            />
            
            
            <Route
              path="/exams"
              element={
                <AdminExams
                  exams={exams}
                  setExams={setExams}
                  escapeHtml={escapeHtml}
                />
              }
            />
            <Route
              path="/fees"
              element={
                <AdminFees
                  fees={fees}
                  setFees={setFees}
                  escapeHtml={escapeHtml}
                />
              }
            />
            <Route
              path="/admins"
              element={
                <AdminAdmins
                  users={users}
                  setUsers={setUsers}
                  escapeHtml={escapeHtml}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}
