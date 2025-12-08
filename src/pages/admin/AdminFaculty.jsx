import React, { useRef, useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/faculty-admin";

export default function AdminFaculty({
  departments,
  escapeHtml,
}) {
  const fFormRef = useRef();
  const [faculty, setFaculty] = useState([]);
  const [fEditIdx, setFEditIdx] = useState(null);
  const [editingFacultyId, setEditingFacultyId] = useState(null); // facultyId for editing
  const [qFaculty, setQFaculty] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  

  // Fetch faculty from API on component mount
  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/get-faculties`);
      // Map API fields to local state fields
      const mapped = res.data.map((f) => ({
        _id: f._id,
        name: f.name,
        fid: f.facultyId,
        email: f.email,
        phone: f.phonenumber,
        dob: f.dob ? f.dob.split("T")[0] : "",
        gender: f.gender,
        address: f.address,
        dept: f.department,
        salary: f.salary,
        username: f.username,
        password: f.password,
      }));
      setFaculty(mapped);
      setError("");
    } catch (err) {
      console.error("Error fetching faculty:", err);
      setError("Failed to fetch faculty from database");
    } finally {
      setLoading(false);
    }
  };
const importData = async (e) => {
  const csv = e.target.files[0];
  if (!csv) return;

  const formData = new FormData();
  formData.append('file', csv);   // 👈 MUST be 'file', not 'csvFile', 'upload', etc.

  try {
    const res = await fetch('http://localhost:5000/api/faculty-admin/upload-faculty-csv', {
      method: 'POST',
      body: formData,             // 👈 no JSON.stringify, no extra headers
    });

   const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      alert(`CSV imported successfully. Inserted ${data.insertedCount} faculty.`);
      // 3. After success, refresh list from DB
      await fetchFaculty();
    } catch (err) {
      console.error('CSV upload error:', err);
      alert('Failed to import CSV. Please check your file format or columns.');
    } 
};

  const filteredFaculty = faculty.filter(
    (f) =>
      (f.name || "").toLowerCase().includes(qFaculty.toLowerCase()) ||
      (f.fid || "").toLowerCase().includes(qFaculty.toLowerCase()) ||
      (f.dept || "").toLowerCase().includes(qFaculty.toLowerCase())
  );

  async function handleFacultySubmit(e) {
    e.preventDefault();
    setError("");

    const form = new FormData(fFormRef.current);
    const name = form.get("name")?.trim();
    const fid = form.get("fid")?.trim();
    const email = form.get("email")?.trim();
    const phone = form.get("phone")?.trim();
    const dob = form.get("dob");
    const gender = form.get("gender");
    const address = form.get("address")?.trim();
    const dept = form.get("dept")?.trim();
    const salary = form.get("salary");
    const username = form.get("username")?.trim();
    const password = form.get("password");

    if (!name || !fid) return alert("Name and Faculty ID required");
    if (!email) return alert("Email is required");
    if (!phone) return alert("Phone is required");
    if (!dob) return alert("Date of Birth is required");
    if (!gender) return alert("Gender is required");
    if (!address) return alert("Address is required");
    if (!dept) return alert("Department is required");
    if (!salary) return alert("Salary is required");
    if (!username) return alert("Username is required");
    if (!password && fEditIdx === null) return alert("Password is required");

    // Prepare data for API (matching backend field names)
    const facultyData = {
      name: name,
      facultyId: fid,
      email: email,
      phonenumber: phone,
      dob: dob,
      gender: gender,
      address: address,
      department: dept,
      salary: Number(salary),
      username: username,
      password: password,
    };

    try {
      setLoading(true);

      if (fEditIdx !== null && editingFacultyId) {
        // UPDATE existing faculty
        await axios.put(`${API_BASE}/update-fac/${editingFacultyId}`, facultyData);
        alert("Faculty updated successfully!");
      } else {
        // CREATE new faculty
        await axios.post(`${API_BASE}/add-fac`, facultyData);
        alert("Faculty created successfully!");
      }

      // Refresh the list from database
      await fetchFaculty();

      // Reset form
      setFEditIdx(null);
      setEditingFacultyId(null);
      fFormRef.current.reset();
      fFormRef.current.fid.disabled = false;

    } catch (err) {
      console.error("Error saving faculty:", err);
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to save faculty");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(facultyMember, username) {
    if (!window.confirm(`Delete faculty "${facultyMember.name}" and their credentials?`)) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${API_BASE}/delete-faculty/${facultyMember.username}`);
      alert("Faculty deleted successfully!");
      await fetchFaculty();
    } catch (err) {
      console.error("Error deleting faculty:", err);
      setError(err.response?.data?.message || "Failed to delete faculty");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(facultyMember, idx) {
    // Populate form with existing data
    fFormRef.current.name.value = facultyMember.name || "";
    fFormRef.current.fid.value = facultyMember.fid || "";
    fFormRef.current.fid.disabled = true; // Can't change faculty ID
    fFormRef.current.email.value = facultyMember.email || "";
    fFormRef.current.phone.value = facultyMember.phone || "";
    fFormRef.current.dob.value = facultyMember.dob || "";
    fFormRef.current.gender.value = facultyMember.gender || "";
    fFormRef.current.address.value = facultyMember.address || "";
    fFormRef.current.dept.value = facultyMember.dept || "";
    fFormRef.current.salary.value = facultyMember.salary || "";
    fFormRef.current.username.value = facultyMember.username || "";
    fFormRef.current.password.value = ""; // Don't show password

    setFEditIdx(idx);
    setEditingFacultyId(facultyMember.fid);
  }

  function handleCancelEdit() {
    setFEditIdx(null);
    setEditingFacultyId(null);
    fFormRef.current.reset();
    fFormRef.current.fid.disabled = false;
  }

  return (
    <section>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Faculty</h2>
        <button
          onClick={fetchFaculty}
          className="bg-green-500 text-white px-3 py-1 rounded text-sm"
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
          </button>
          <label className="bg-green-600 text-white px-3 py-1 rounded cursor-pointer">
            Import CSV
            <input type="file" accept=".csv" onChange={importData} className="hidden" />
          </label>
     
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-2">
          {error}
        </div>
      )}

      <form
        ref={fFormRef}
        onSubmit={handleFacultySubmit}
        className="grid grid-cols-2 gap-3 bg-white p-4 rounded shadow mt-4"
      >
        <input
          name="name"
          placeholder="Full Name *"
          className="border p-2 rounded text-gray-800 bg-white"
          required
        />
        <input
          name="fid"
          placeholder="Faculty ID (unique) *"
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
          name="salary"
          type="number"
          placeholder="Salary *"
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
          placeholder={fEditIdx !== null ? "New Password (leave blank to keep)" : "Login Password *"}
          className="border p-2 rounded text-gray-800 bg-white"
          required={fEditIdx === null}
        />
        <div className="col-span-2 flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-purple-600 text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? "Saving..." : fEditIdx !== null ? "Update Faculty" : "Save Faculty"}
          </button>
          {fEditIdx !== null && (
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
        value={qFaculty}
        onChange={(e) => setQFaculty(e.target.value)}
        className="mt-4 p-2 border rounded w-full text-gray-800 bg-white"
        placeholder="Search by name, id, department"
      />

      {loading && <p className="text-center mt-4 text-gray-500">Loading...</p>}

      <ul className="mt-4 space-y-2">
        {filteredFaculty.map((f, i) => (
          <li
            key={f._id || f.fid + i}
            className="bg-white p-3 flex justify-between rounded shadow"
          >
            <div>
              <strong className="text-gray-800">{escapeHtml(f.name)}</strong>{" "}
              <span className="text-sm text-gray-600">
                ({escapeHtml(f.fid)})
              </span>
              <div className="text-sm text-gray-600">
                {escapeHtml(f.email)} • {escapeHtml(f.phone)}
              </div>
              <div className="text-sm text-gray-600">
                Dept: {escapeHtml(f.dept)} | Salary: ₹{escapeHtml(f.salary)} | Username: <strong>{escapeHtml(f.username)}</strong>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => handleEdit(f, i)}
                className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                disabled={loading}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(f, f.username)}
                className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                disabled={loading}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
        {!loading && filteredFaculty.length === 0 && (
          <p className="text-center text-gray-500">No faculty found.</p>
        )}
      </ul>
    </section>
  );
}
