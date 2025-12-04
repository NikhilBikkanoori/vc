import React, { useState, useEffect } from "react";
import axios from "axios";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [dept, setDept] = useState("");
  const [parent, setParent] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState("");

  const [error, setError] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  // Fetch student list on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/student-admin/get-students");
        // Map API fields to local state fields
        const mapped = res.data.map((s) => ({
          name: s.FullName,
          roll: s.RollNo,
          email: s.Email,
          phone: s.Phone,
          dob: s.DateOfBirth.split("T")[0], // just the date part
          gender: s.Gender,
          address: s.Address,
          dept: s.Department,
          parent: s.Parent,
          username: s.Username,
          password: s.Password,
          file: "",
        }));
        setStudents(mapped);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch students");
      }
    };
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // API call example (optional)
    try {
      const res = await axios.post("http://localhost:5000/api/student-admin/students", {

        FullName: name,
        RollNo: roll,
        Email: email,
        Phone: phone,
        DateOfBirth: dob,
        Gender: gender,
        Address: address,
        Department: dept,
        Parent: parent,
        Username: username,
        Password: password,
        File: file
        
      });
      console.log("API response:", res.data);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.msg || "API call failed");
    }

    const studentObj = { name, roll, email, phone, dob, gender, address, dept, parent, username, password, file };

    if (editIndex !== null) {
      const updated = [...students];
      updated[editIndex] = studentObj;
      setStudents(updated);
      setEditIndex(null);
    } else {
      setStudents([...students, studentObj]);
    }

    resetForm();
  };

  const resetForm = () => {
    setName("");
    setRoll("");
    setEmail("");
    setPhone("");
    setDob("");
    setGender("");
    setAddress("");
    setDept("");
    setParent("");
    setUsername("");
    setPassword("");
    setFile("");
  };

  const handleEdit = (index) => {
    const s = students[index];
    setName(s.name);
    setRoll(s.roll);
    setEmail(s.email);
    setPhone(s.phone);
    setDob(s.dob);
    setGender(s.gender);
    setAddress(s.address);
    setDept(s.dept);
    setParent(s.parent);
    setUsername(s.username);
    setPassword(s.password);
    setFile(s.file);
    setEditIndex(index);
  };

  const handleDelete = (i) => {
    if (window.confirm("Delete this student?")) {
      setStudents(students.filter((_, index) => index !== i));
    }
  };

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.roll.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <h2 className="section-title">Student Management</h2>

      <div className="card mb-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input className="input" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input className="input" placeholder="Roll" value={roll} onChange={(e) => setRoll(e.target.value)} required />
          <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input className="input" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
          <select className="input" value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <input className="input col-span-2" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
          <input className="input" placeholder="Department" value={dept} onChange={(e) => setDept(e.target.value)} />
          <input className="input" placeholder="Parent Link" value={parent} onChange={(e) => setParent(e.target.value)} />
          <input className="input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <input className="input col-span-2" type="file" onChange={(e) => setFile(e.target.files[0]?.name || "")} />
          <button type="submit" className="btn-primary col-span-2">{editIndex !== null ? "Update Student" : "Add Student"}</button>
        </form>
      </div>

      <input className="input mb-4" placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} />

      <div className="space-y-3">
        {filtered.map((s, i) => (
          <div key={i} className="student-item">
            <div>
              <strong>{s.name}</strong> ({s.roll})
              <div className="text-sm">{s.email} • {s.phone}</div>
            </div>
            <div className="flex gap-2">
              <button className="btn-small btn-edit" onClick={() => handleEdit(i)}>Edit</button>
              <button className="btn-small btn-delete" onClick={() => handleDelete(i)}>Delete</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-gray-300 text-center">No students found.</p>}
      </div>
    </div>
  );
};

export default Students;
