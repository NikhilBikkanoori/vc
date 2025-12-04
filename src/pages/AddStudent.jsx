import React, { useState } from "react";

const AddStudent = () => {
  const [form, setForm] = useState({ name: "", email: "", roll: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Student Added:", form);
    // send to backend using fetch or axios
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Add Student</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Student Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        /><br /><br />

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        /><br /><br />

        <input
          type="text"
          placeholder="Roll Number"
          onChange={(e) => setForm({ ...form, roll: e.target.value })}
        /><br /><br />

        <button type="submit">Add Student</button>
      </form>
    </div>
  );
};

export default AddStudent;
