import React, { useState } from "react";

const ManageUsers = () => {
  const [activeTab, setActiveTab] = useState("students");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const [data, setData] = useState({
    students: [
      {
        id: 1,
        name: "Rahul Sharma",
        email: "rahul@gmail.com",
        status: "Active",
        studentId: "22CSE1025",
        mobile: "9876543210",
        year: "2nd Year",
        branch: "CSE",
        attendance: "92%",
        feesPending: "₹5000",
        marks: "88%",
      },
    ],
    mentors: [{ id: 1, name: "Manoj Kumar", email: "manoj@gmail.com", status: "Active" }],
    parents: [{ id: 1, name: "Arun Rao", email: "arun@gmail.com", status: "Active" }],
    admins: [{ id: 1, name: "Admin User", email: "admin@gmail.com", status: "Active" }],
  });

  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  // Form fields including student-specific fields
  const [form, setForm] = useState({
    name: "",
    email: "",
    status: "Active",

    // student-only fields
    studentId: "",
    mobile: "",
    year: "",
    branch: "",
    attendance: "",
    feesPending: "",
    marks: "",
  });

  // Open Modal
  const openModal = (user = null) => {
    setEditUser(user);

    if (user) {
      setForm(user);
    } else {
      setForm({
        name: "",
        email: "",
        status: "Active",
        studentId: "",
        mobile: "",
        year: "",
        branch: "",
        attendance: "",
        feesPending: "",
        marks: "",
      });
    }

    setShowModal(true);
  };

  // Save (Add / Edit)
  const handleSave = () => {
    let updated = { ...data };

    if (editUser) {
      updated[activeTab] = updated[activeTab].map((u) =>
        u.id === editUser.id ? form : u
      );
    } else {
      updated[activeTab] = [
        ...updated[activeTab],
        { ...form, id: Date.now() },
      ];
    }

    setData(updated);
    setShowModal(false);
  };

  // Delete
  const handleDelete = (id) => {
    let updated = { ...data };
    updated[activeTab] = updated[activeTab].filter((u) => u.id !== id);
    setData(updated);
  };

  // Filter
  const filteredData = data[activeTab]
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    .filter((item) => (filter ? item.status === filter : true));

  return (
    <div style={{ padding: "20px", width: "100%" }}>
      <h2>Manage Users</h2>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: 20 }}>
        {["students", "mentors", "parents", "admins"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 16px",
              background: activeTab === tab ? "#4a6cf7" : "#ddd",
              color: activeTab === tab ? "black" : "#000",
              borderRadius: "6px",
            }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Search + Filter + Add */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <input
          type="text"
          placeholder="Search user..."
          style={{ width: "40%", padding: 10 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          style={{ padding: 10 }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button
          style={{
            background: "green",
            color: "white",
            border: "none",
            padding: "10px 16px",
            borderRadius: "6px",
          }}
          onClick={() => openModal(null)}
        >
          + Add {activeTab}
        </button>
      </div>

      {/* TABLE */}
      <table width="100%" border="1" cellPadding={12}>
        <thead>
          <tr>
            <th>ID</th>

            {activeTab === "students" && (
              <>
                <th>Student ID</th>
                <th>Mobile</th>
                <th>Year</th>
                <th>Branch</th>
                <th>Attendance</th>
                <th>Fees Pending</th>
                <th>Marks</th>
              </>
            )}

            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>

                {activeTab === "students" && (
                  <>
                    <td>{user.studentId}</td>
                    <td>{user.mobile}</td>
                    <td>{user.year}</td>
                    <td>{user.branch}</td>
                    <td>{user.attendance}</td>
                    <td>{user.feesPending}</td>
                    <td>{user.marks}</td>
                  </>
                )}

                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.status}</td>

                <td>
                  <button
                    style={{
                      background: "#2196f3",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      marginRight: "5px",
                    }}
                    onClick={() => openModal(user)}
                  >
                    Edit
                  </button>
                  <button
                    style={{
                      background: "#f44336",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                    }}
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10} style={{ textAlign: "center", padding: 20 }}>
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* MODAL */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            width: "100vw",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: 20,
              borderRadius: 8,
              width: 350,
            }}
          >
            <h3>{editUser ? "Edit User" : "Add User"}</h3>

            {/* Common fields */}
            <input
              type="text"
              placeholder="Name"
              style={{ width: "100%", padding: 10, marginBottom: 10 }}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              type="email"
              placeholder="Email"
              style={{ width: "100%", padding: 10, marginBottom: 10 }}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <select
              style={{ width: "100%", padding: 10, marginBottom: 10 }}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>

            {/* STUDENT EXTRA FIELDS */}
            {activeTab === "students" && (
              <>
                <input
                  placeholder="Student ID"
                  style={{ width: "100%", padding: 10, marginBottom: 10 }}
                  value={form.studentId}
                  onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                />

                <input
                  placeholder="Mobile Number"
                  style={{ width: "100%", padding: 10, marginBottom: 10 }}
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                />

                <input
                  placeholder="Year"
                  style={{ width: "100%", padding: 10, marginBottom: 10 }}
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                />

                <input
                  placeholder="Branch"
                  style={{ width: "100%", padding: 10, marginBottom: 10 }}
                  value={form.branch}
                  onChange={(e) => setForm({ ...form, branch: e.target.value })}
                />

                <input
                  placeholder="Attendance (%)"
                  style={{ width: "100%", padding: 10, marginBottom: 10 }}
                  value={form.attendance}
                  onChange={(e) => setForm({ ...form, attendance: e.target.value })}
                />

                <input
                  placeholder="Fees Pending (₹)"
                  style={{ width: "100%", padding: 10, marginBottom: 10 }}
                  value={form.feesPending}
                  onChange={(e) => setForm({ ...form, feesPending: e.target.value })}
                />

                <input
                  placeholder="Marks (%)"
                  style={{ width: "100%", padding: 10, marginBottom: 10 }}
                  value={form.marks}
                  onChange={(e) => setForm({ ...form, marks: e.target.value })}
                />
              </>
            )}

            <button
              onClick={handleSave}
              style={{
                width: "100%",
                padding: 10,
                background: "green",
                color: "white",
                borderRadius: 6,
                border: "none",
              }}
            >
              Save
            </button>

            <button
              onClick={() => setShowModal(false)}
              style={{
                width: "100%",
                padding: 10,
                marginTop: 10,
                background: "gray",
                color: "white",
                borderRadius: 6,
                border: "none",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
