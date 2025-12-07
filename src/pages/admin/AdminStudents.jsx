import React, { useRef, useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "https://dropshieldbe-a3fmaucneacte4av.southindia-01.azurewebsites.net/api/student-admin";

export default function AdminStudents({
  departments,
  parents,
  escapeHtml,
}) {
  const sFormRef = useRef();
  const [students, setStudents] = useState([]);
  const [sEditIdx, setSEditIdx] = useState(null);
  const [editingId, setEditingId] = useState(null); // MongoDB _id for editing
  const [qStudent, setQStudent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch students from API on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/get-students`);
      // Map API fields to local state fields
      const mapped = res.data.map((s) => ({
        _id: s._id,
        name: s.FullName,
        roll: s.RollNo,
        email: s.Email,
        phone: s.Phone,
        dob: s.DateOfBirth ? s.DateOfBirth.split("T")[0] : "",
        gender: s.Gender,
        address: s.Address,
        dept: s.Department,
        parent: s.Parent,
        username: s.Username,
        password: s.Password,
      }));
      setStudents(mapped);
      setError("");
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to fetch students from database");
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      (s.name || "").toLowerCase().includes(qStudent.toLowerCase()) ||
      (s.roll || "").toLowerCase().includes(qStudent.toLowerCase()) ||
      (s.dept || "").toLowerCase().includes(qStudent.toLowerCase())
  );

  async function handleStudentSubmit(e) {
    e.preventDefault();
    setError("");
    
    const form = new FormData(sFormRef.current);
    const name = form.get("name")?.trim();
    const roll = form.get("roll")?.trim();
    const email = form.get("email")?.trim();
    const phone = form.get("phone")?.trim();
    const dob = form.get("dob");
    const gender = form.get("gender");
    const address = form.get("address")?.trim();
    const dept = form.get("dept")?.trim();
    const parentField = form.get("parent")?.trim();
    const username = form.get("username")?.trim();
    const password = form.get("password");

    // if (!roll || !name) return alert("Name and roll required");
    // if (!email) return alert("Email is required");
    // if (!phone) return alert("Phone is required");
    // if (!dob) return alert("Date of Birth is required");
    // if (!gender) return alert("Gender is required");
    // if (!address) return alert("Address is required");
    // if (!dept) return alert("Department is required");
    // if (!parentField) return alert("Parent field is required");
    // if (!username) return alert("Username is required");
    // if (!password && sEditIdx === null) return alert("Password is required");

    // Prepare data for API (matching backend field names)
    const studentData = {
      FullName: name,
      RollNo: roll,
      Email: email,
      Phone: phone,
      DateOfBirth: dob,
      Gender: gender,
      Department: dept,
      Address: address,
      Parent: parentField,
      Username: username,
      Password: password,
    };

    try {
      setLoading(true);
      
      if (sEditIdx !== null && editingId) {
        // UPDATE existing student
        await axios.put(`${API_BASE}/update-student/${editingId}`, studentData);
        alert("Student updated successfully!");
      } else {
        // CREATE new student
        await axios.post(`${API_BASE}/students`, studentData);
        alert("Student created successfully!");
      }
      
      // Refresh the list from database
      await fetchStudents();
      
      // Reset form
      setSEditIdx(null);
      setEditingId(null);
      sFormRef.current.reset();
      
    } catch (err) {
      console.error("Error saving student:", err);
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to save student");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(student, idx) {
    if (!window.confirm(`Delete student "${student.roll}" and their credentials?`)) {
      return;
    }
    
    try {
      setLoading(true);
      await axios.delete(`${API_BASE}/delete-student/${student.roll}`);
      alert("Student deleted successfully!");
      await fetchStudents();
    } catch (err) {
      console.error("Error deleting student:", err);
      setError(err.response?.data?.message || "Failed to delete student");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(student, idx) {
    // Populate form with existing data
    sFormRef.current.name.value = student.name || "";
    sFormRef.current.roll.value = student.roll || "";
    sFormRef.current.email.value = student.email || "";
    sFormRef.current.phone.value = student.phone || "";
    sFormRef.current.dob.value = student.dob || "";
    sFormRef.current.gender.value = student.gender || "";
    sFormRef.current.address.value = student.address || "";
    sFormRef.current.dept.value = student.dept || "";
    sFormRef.current.parent.value = student.parent || "";
    sFormRef.current.username.value = student.username || "";
    sFormRef.current.password.value = ""; // Don't show password
    setEditingId(student.roll);
  }

  function handleCancelEdit() {
    setSEditIdx(null);
    setEditingId(null);
    sFormRef.current.reset();
  }

  return (
    <section>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Students</h2>
        <button 
          onClick={fetchStudents} 
          className="bg-green-500 text-white px-3 py-1 rounded text-sm"
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-2">
          {error}
        </div>
      )}
      
      <form
        ref={sFormRef}
        onSubmit={handleStudentSubmit}
        className="grid grid-cols-2 gap-3 bg-white p-4 rounded shadow mt-4"
      >
        <input
          name="name"
          placeholder="Full Name *"
          className="border p-2 rounded text-gray-800 bg-white"
          required
        />
        <input
          name="roll"
          placeholder="Roll No (unique) *"
          className="border p-2 rounded text-gray-800 bg-white"
          required
          disabled={sEditIdx !== null}
        />
        <input
          name="email"
          type="email"
          placeholder="Email *"
          className="border p-2 rounded text-gray-800 bg-white"
          required
        />
        <input
          name="phone"
          type="tel"
          placeholder="Phone *"
          className="border p-2 rounded text-gray-800 bg-white"
          required
        />
        <input name="dob" type="date" className="border p-2 rounded text-gray-800 bg-white" required />
        <select name="gender" className="border p-2 rounded text-gray-800 bg-white" required>
          <option value="">Gender *</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <input
          name="address"
          placeholder="Address *"
          className="border p-2 rounded col-span-2 text-gray-800 bg-white"
          required
        />
        <input
          name="dept"
          placeholder="Department *"
          className="border p-2 rounded text-gray-800 bg-white"
          required
        />
        <input
          name="parent"
          placeholder="Parent Name *"
          className="border p-2 rounded text-gray-800 bg-white"
          required
        />
        <input
          name="username"
          placeholder="Login Username *"
          className="border p-2 rounded text-gray-800 bg-white"
          required
        />
        <input
          name="password"
          type="password"
          placeholder={sEditIdx !== null ? "New Password (leave blank to keep)" : "Login Password *"}
          className="border p-2 rounded text-gray-800 bg-white"
          required={sEditIdx === null}
        />
        <div className="col-span-2 flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-purple-600 text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? "Saving..." : sEditIdx !== null ? "Update Student" : "Save Student"}
          </button>
          {sEditIdx !== null && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      
      <input
        value={qStudent}
        onChange={(e) => setQStudent(e.target.value)}
        className="mt-4 p-2 border rounded w-full text-gray-800 bg-white"
        placeholder="Search by name, roll, department"
      />
      
      {loading && <p className="text-center mt-4 text-gray-500">Loading...</p>}
      
      <ul className="mt-4 space-y-2">
        {filteredStudents.map((s, i) => (
          <li key={s._id || s.roll + i} className="bg-white p-3 flex justify-between rounded shadow">
            <div>
              <strong className="text-gray-800">{escapeHtml(s.name)}</strong>{" "}
              <span className="text-sm text-gray-600">
                ({escapeHtml(s.roll)})
              </span>
              <div className="text-sm text-gray-600">
                {escapeHtml(s.email)} • {escapeHtml(s.phone)}
              </div>
              <div className="text-sm text-gray-600">
                Dept: {escapeHtml(s.dept)} | Username: <strong>{escapeHtml(s.username)}</strong>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => handleEdit(s, i)}
                className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                disabled={loading}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(s, i)}
                className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                disabled={loading}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
        {!loading && filteredStudents.length === 0 && (
          <p className="text-center text-gray-500">No students found.</p>
        )}
      </ul>
    </section>
  );
}
