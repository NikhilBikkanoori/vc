import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

const API_BASE = "https://dropshieldbe-a3fmaucneacte4av.southindia-01.azurewebsites.net/api/parent-admin";
const STUDENT_API_BASE = "https://dropshieldbe-a3fmaucneacte4av.southindia-01.azurewebsites.net/api/student-admin";

export default function AdminParents({ escapeHtml }) {
  const pFormRef = useRef();
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [pEditIdx, setPEditIdx] = useState(null);
  const [qParent, setQParent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch parents and students on component mount
  useEffect(() => {
    fetchParents();
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${STUDENT_API_BASE}/get-students`);
      // Map API fields to local state fields
      const mapped = res.data.map((s) => ({
        _id: s._id,
        name: s.FullName,
        roll: s.RollNo,
        email: s.Email,
        dept: s.Department,
      }));
      setStudents(mapped);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const fetchParents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/parents`);
      // Map API fields to local state fields
      const mapped = response.data.map((p) => ({
        _id: p._id,
        name: p.FullName,
        email: p.Email,
        phone: p.Phone,
        address: p.Address,
        linkedStudent: p.Student ? p.Student.FullName : "Not linked",
        linkedStudentRoll: p.Student ? p.Student.RollNo : "",
        username: p.Username,
      }));
      setParents(mapped);
      setError("");
    } catch (err) {
      console.error("Error fetching parents:", err);
      setError("Failed to fetch parents from database");
    } finally {
      setLoading(false);
    }
  };

  const filteredParents = parents.filter(
    (p) =>
      (p.name || "").toLowerCase().includes(qParent.toLowerCase()) ||
      (p.email || "").toLowerCase().includes(qParent.toLowerCase()) ||
      (p.username || "").toLowerCase().includes(qParent.toLowerCase())
  );

  const handleParentSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const form = pFormRef.current;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const address = form.address.value.trim();
    const linkedStudent = form.linkedStudent.value.trim();
    const username = form.username.value.trim();
    const password = form.password.value;

    // if (!name || !email || !phone || !linkedStudent || !username || !password) {
    //   setError("Please fill all required fields");
    //   return;
    // }

    // Prepare data for API (matching backend field names)
    const parentData = {
      FullName: name,
      Email: email,
      Phone: phone,
      Address: address,
      StudentRoll: linkedStudent, // Backend expects StudentRoll to find the student
      Username: username,
      Password: password,
    };

    try {
      setLoading(true);

      // CREATE new parent
      await axios.post(`${API_BASE}/parents`, parentData);
      alert("Parent created successfully!");

      // Refresh the list from database
      await fetchParents();

      // Reset form
      setPEditIdx(null);
      form.reset();
    } catch (err) {
      console.error("Error saving parent:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to save parent"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setPEditIdx(null);
    pFormRef.current.reset();
  };

  const handleDeleteParent = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete parent "${name}"?`)) {
      return;
    }
    try {
      setLoading(true);
      await axios.delete(`${API_BASE}/parents/${id}`);
      alert("Parent deleted successfully!");
      await fetchParents();
    } catch (err) {
      console.error("Error deleting parent:", err);
      setError(err.response?.data?.message || "Failed to delete parent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Parents</h2>
        <button
          onClick={fetchParents}
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
        ref={pFormRef}
        onSubmit={handleParentSubmit}
        className="grid grid-cols-2 gap-3 bg-white p-4 rounded shadow mt-4"
      >
        <input
          name="name"
          placeholder="Parent Full Name *"
          className="border p-2 rounded text-gray-800 bg-white"
          required
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
        <input
          name="address"
          placeholder="Address"
          className="border p-2 rounded text-gray-800 bg-white"
        />
        <select
          name="linkedStudent"
          className="border p-2 rounded text-gray-800 bg-white"
          required
        >
          <option value="">Link to Student (Roll No) *</option>
          {students &&
            students.map((s) => (
              <option key={s.roll} value={s.roll}>
                {s.name} ({s.roll})
              </option>
            ))}
        </select>
        <input
          name="username"
          placeholder="Login Username *"
          className="border p-2 rounded text-gray-800 bg-white"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Login Password *"
          className="border p-2 rounded text-gray-800 bg-white"
          required
        />
        <div className="col-span-2 flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-purple-600 text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Parent"}
          </button>
          {pEditIdx !== null && (
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
        value={qParent}
        onChange={(e) => setQParent(e.target.value)}
        className="mt-4 p-2 border rounded w-full text-gray-800 bg-white"
        placeholder="Search by name, email, username"
      />

      {loading && <p className="text-center mt-4 text-gray-500">Loading...</p>}

      <ul className="mt-4 space-y-2">
        {filteredParents.map((p, i) => (
          <li
            key={p._id || i}
            className="bg-white p-3 flex justify-between rounded shadow"
          >
            <div>
              <strong className="text-gray-800">{escapeHtml(p.name)}</strong>
              <div className="text-sm text-gray-600">
                {escapeHtml(p.email)} • {escapeHtml(String(p.phone))}
              </div>
              <div className="text-sm text-gray-600">
                Username: <strong>{escapeHtml(p.username)}</strong>
              </div>
              <div className="text-sm text-gray-600">
                Linked Student:{" "}
                <strong className={p.linkedStudentRoll ? "text-green-600" : "text-red-500"}>
                  {p.linkedStudentRoll
                    ? `${escapeHtml(p.linkedStudent)} (${escapeHtml(p.linkedStudentRoll)})`
                    : "Not linked"}
                </strong>
              </div>
              {p.address && (
                <div className="text-sm text-gray-600">
                  Address: {escapeHtml(p.address)}
                </div>
              )}
            </div>
            <div className="flex items-center">
              <button
                onClick={() => handleDeleteParent(p._id, p.name)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                disabled={loading}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
        {!loading && filteredParents.length === 0 && (
          <p className="text-center text-gray-500">No parents found.</p>
        )}
      </ul>
    </section>
  );
}
