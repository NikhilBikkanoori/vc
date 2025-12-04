import React, { useRef, useState } from "react";

export default function AdminDepartments({
  departments,
  setDepartments,
  faculty,
  escapeHtml,
}) {
  const deptFormRef = useRef();
  const [dEditIdx, setDEditIdx] = useState(null);
  const [qDept, setQDept] = useState("");

  const filteredDepartments = departments.filter((d) =>
    (d.name || "").toLowerCase().includes(qDept.toLowerCase())
  );

  function handleDeptSubmit(e) {
    e.preventDefault();
    const form = new FormData(deptFormRef.current);
    const name = form.get("deptName")?.trim();
    if (!name) return alert("Dept name required");
    if (dEditIdx !== null) {
      setDepartments((arr) => {
        const copy = [...arr];
        copy[dEditIdx] = {
          ...copy[dEditIdx],
          name,
          hod: form.get("hod") || null,
        };
        return copy;
      });
      setDEditIdx(null);
      deptFormRef.current.reset();
      return;
    }
    const id = "d" + Date.now().toString(36).slice(-6);
    setDepartments((d) => [...d, { id, name, hod: form.get("hod") || null }]);
    deptFormRef.current.reset();
  }

  return (
    <section>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Departments</h2>
      </div>
      <form
        ref={deptFormRef}
        onSubmit={handleDeptSubmit}
        className="flex gap-2 bg-white p-4 rounded shadow mt-4"
      >
        <input
          name="deptName"
          placeholder="Department Name"
          className="border p-2 rounded flex-1 text-gray-800 bg-white"
          required
        />
        <select name="hod" className="border p-2 rounded text-gray-800 bg-white">
          <option value="">Select HOD (optional)</option>
          {faculty.map((f) => (
            <option key={f.fid} value={f.fid}>
              {f.name} ({f.fid})
            </option>
          ))}
        </select>
        <button type="submit" className="bg-purple-600 text-white px-4 rounded">
          Save Dept
        </button>
      </form>
      <input
        value={qDept}
        onChange={(e) => setQDept(e.target.value)}
        className="mt-4 p-2 border rounded w-full text-gray-800 bg-white"
        placeholder="Search departments"
      />
      <ul className="mt-4 space-y-2">
        {filteredDepartments.map((d, i) => (
          <li
            key={d.id + i}
            className="bg-white p-3 flex justify-between rounded shadow"
          >
            <div>
              <strong className="text-gray-800">{escapeHtml(d.name)}</strong>
              <div className="text-sm text-gray-600">
                HOD: {(faculty.find((f) => f.fid === d.hod) || {}).name || "—"}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => {
                  deptFormRef.current.deptName.value = d.name;
                  deptFormRef.current.hod.value = d.hod || "";
                  setDEditIdx(i);
                }}
                className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
              >
                Edit
              </button>
              {/* <button onClick={()=>{ if(confirm('Delete department?')) del('departments', i); }} className="bg-red-500 text-white px-2 py-1 rounded text-sm">Delete</button> */}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
