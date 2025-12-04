import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchLoggedInStudent();
  }, []);
  const fetchLoggedInStudent = async () => {
    try {
      // Get student ID from localStorage (stored during login)
      const studentdatastr = localStorage.getItem("studentname");
      if (!studentdatastr) {
        setError("Not logged in. Please login first.");
        setLoading(false);
        // Redirect to login after 2 seconds
        setTimeout(() => navigate("/student-login"), 2000);
        return;
      }
      // Fetch student data by ID
      const response = await fetch(`http://localhost:5000/api/student-admin/get-student-by-username/${studentdatastr}`);
      if (!response.ok) {
        throw new Error("Failed to fetch student data");
      }
      const data = await response.json();
      setStudent(data);
      setLoading(false);
    }
    catch (err) {
      console.error("Error fetching student:", err);
      setError("Failed to load profile. Please try again.");
      setLoading(false);
    } 
  };
  //     setError("Not logged in. Please login first.");
  //     setLoading(false);
  //     // Redirect to login after 2 seconds
  //     setTimeout(() => navigate("/StudentLogin"), 2000);
  //     return;
  //   }
    
  //   // Fetch student data by ID
  //   fetch(`http://localhost:5000/api/student-admin/get-students/${studentdatastr}`)
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch student data");
  //       }
  //       return response.json();
  //     })
  //     .then(data => {
  //       setStudent(data);
  //       setLoading(false);
  //     })
  //     .catch(err => {
  //       console.error("Error fetching student:", err);
  //       setError("Failed to load profile. Please try again.");
  //       setLoading(false);
  //     });
  // }

  return (
    <div style={{ background: "#192047", minHeight: "100vh", margin: 0 }}>
      <style>{`
        :root {
          --bg: #192047;
          --card: #262C53;
          --soft: #1a2349;
          --highlight: #A2F4F9;
          --text: #F7FAFC;
          --radius: 14px;
        }

        body {
          margin: 0;
          font-family: Inter, Segoe UI, Arial;
        }

        .topbar {
          background: var(--card);
          padding: 18px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        }

        .brand {
          font-size: 20px;
          font-weight: 600;
          color: var(--highlight);
        }

        .container {
          max-width: 900px;
          margin: 40px auto;
          background: var(--card);
          padding: 30px;
          border-radius: var(--radius);
          box-shadow: 0 6px 20px rgba(0,0,0,0.25);
        }

        .profile-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .profile-photo {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          background: var(--highlight);
          margin: 0 auto 18px auto;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          color: var(--card);
          font-weight: 700;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        table td {
          padding: 14px;
          border-bottom: 1px solid rgba(255,255,255,0.15);
          font-size: 16px;
        }

        table td:first-child {
          color: var(--highlight);
          width: 30%;
          font-weight: 600;
        }

        .back-btn {
          margin-top: 25px;
          padding: 10px 18px;
          background: var(--highlight);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          color: var(--card);
        }

        .back-btn:hover {
          opacity: 0.85;
        }
      `}</style>

      {/* TOPBAR */}
      <div className="topbar">
        <div className="brand">DropShield — Profile</div>
        <button
          className="back-btn"
          onClick={() => (window.location.href = "/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>

      {/* PROFILE CONTAINER */}
      {loading ? (
        <div className="container" style={{ textAlign: "center", color: "#F7FAFC" }}>
          <p>Loading student data...</p>
        </div>
      ) : error ? (
        <div className="container" style={{ textAlign: "center", color: "#F7FAFC" }}>
          <p style={{ color: "#ff6b6b" }}>{error}</p>
          <button
            className="back-btn"
            onClick={() => navigate("/student-login")}
            style={{ marginTop: "20px" }}
          >
            Go to Login
          </button>
        </div>
      ) : student ? (
        <div className="container">
          <div className="profile-header">
            <div className="profile-photo">
              {student.FullName?.charAt(0).toUpperCase()}
            </div>
            <h2 style={{ margin: 0, color: "#F7FAFC" }}>{student.FullName}</h2>
            <p style={{ marginTop: 4, opacity: 0.8, color: "#F7FAFC" }}>
              {student.Department} — {student.RollNo}
            </p>
          </div>

          <table>
            <tbody>
              {/* <tr>
                <td>Student ID</td>
                <td style={{ color: "#F7FAFC" }}>{student._id}</td>
              </tr> */}
              <tr>
                <td>Roll Number</td>
                <td style={{ color: "#F7FAFC" }}>{student.RollNo}</td>
              </tr>
              <tr>
                <td>Mobile Number</td>
                <td style={{ color: "#F7FAFC" }}>{student.Phone}</td>
              </tr>
              <tr>
                <td>Email ID</td>
                <td style={{ color: "#F7FAFC" }}>{student.Email}</td>
              </tr>
              <tr>
                <td>Date of Birth</td>
                <td style={{ color: "#F7FAFC" }}>
                  {new Date(student.DateOfBirth).toLocaleDateString()}
                </td>
              </tr>
              <tr>
                <td>Gender</td>
                <td style={{ color: "#F7FAFC" }}>{student.Gender}</td>
              </tr>
              <tr>
                <td>Department</td>
                <td style={{ color: "#F7FAFC" }}>{student.Department}</td>
              </tr>
              <tr>
                <td>Address</td>
                <td style={{ color: "#F7FAFC" }}>{student.Address}</td>
              </tr>
              <tr>
                <td>Parent/Guardian</td>
                <td style={{ color: "#F7FAFC" }}>{student.Parent}</td>
              </tr>
              <tr>
                <td>Username</td>
                <td style={{ color: "#F7FAFC" }}>{student.Username}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="container" style={{ textAlign: "center", color: "#F7FAFC" }}>
          <p>No student data found.</p>
        </div>
      )}
    </div>
  );
}
