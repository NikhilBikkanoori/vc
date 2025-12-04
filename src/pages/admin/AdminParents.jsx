import React, { useRef, useState } from "react";

export default function AdminParents({
  parents,
  setParents,
  students,
  users,
  setUsers,
  escapeHtml,
}) {
  const pFormRef = useRef();
  const [pEditIdx, setPEditIdx] = useState(null);
  const [qParent, setQParent] = useState("");

  const filteredParents = parents.filter(
    (p) =>
      (p.name || "").toLowerCase().includes(qParent.toLowerCase()) ||
      (p.pid || "").toLowerCase().includes(qParent.toLowerCase()) ||
      (p.linkedStudent || "").toLowerCase().includes(qParent.toLowerCase())
  );

  function handleParentSubmit(e) {
    e.preventDefault();
    const form = new FormData(pFormRef.current);
    const name = form.get("name")?.trim();
    const pid = form.get("pid")?.trim();
    if (!name || !pid) return alert("Name and parent ID required");
    if (pEditIdx !== null) {
      setParents((arr) => {
        const copy = [...arr];
        copy[pEditIdx] = {
          ...copy[pEditIdx],
          name,
          email: form.get("email"),
          phone: form.get("phone"),
          address: form.get("address"),
          linkedStudent: form.get("linkedStudent") || null,
        };
        return copy;
      });
      setPEditIdx(null);
      pFormRef.current.reset();
      return;
    }
    if (parents.find((x) => x.pid === pid)) return alert("Parent ID exists");
    setParents((s) => [
      ...s,
      {
        name,
        pid,
        email: form.get("email"),
        phone: form.get("phone"),
        address: form.get("address"),
        linkedStudent: form.get("linkedStudent") || null,
        createdAt: new Date().toISOString(),
      },
    ]);
    const pu = form.get("username")?.trim();
    const pp = form.get("password");
    if (pu && pp)
      setUsers((u) => ({
        ...u,
        parents: [...(u.parents || []), { pid, username: pu, password: pp }],
      }));
    pFormRef.current.reset();
  }

  return (
    <section>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Parents</h2>
      </div>
      <form
        ref={pFormRef}
        onSubmit={handleParentSubmit}
        className="grid grid-cols-2 gap-3 bg-white p-4 rounded shadow mt-4"
      >
        <input
          name="name"
          placeholder="Parent Name"
          className="border p-2 rounded text-gray-800 bg-white"
          required
        />
        <input
          name="pid"
          placeholder="Parent ID (unique)"
          className="border p-2 rounded text-gray-800 bg-white"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="border p-2 rounded text-gray-800 bg-white"
        />
        <input
          name="phone"
          type="tel"
          placeholder="Phone"
          className="border p-2 rounded text-gray-800 bg-white"
        />
        <input
          name="address"
          placeholder="Address"
          className="border p-2 rounded col-span-2 text-gray-800 bg-white"
        />
        <select name="linkedStudent" className="border p-2 rounded text-gray-800 bg-white">
          <option value="">Link to Student</option>
          {students.map((s) => (
            <option key={s.roll} value={s.roll}>
              {s.name} ({s.roll})
            </option>
          ))}
        </select>
        <input
          name="username"
          placeholder="Login username (optional)"
          className="border p-2 rounded text-gray-800 bg-white"
        />
        <input
          name="password"
          type="password"
          placeholder="Login password (optional)"
          className="border p-2 rounded text-gray-800 bg-white"
        />
        <button
          type="submit"
          className="col-span-2 bg-purple-600 text-white py-2 rounded"
        >
          Save Parent
        </button>
      </form>
      <input
        value={qParent}
        onChange={(e) => setQParent(e.target.value)}
        className="mt-4 p-2 border rounded w-full text-gray-800 bg-white"
        placeholder="Search by name, id, linked student"
      />
      <ul className="mt-4 space-y-2">
        {filteredParents.map((p, i) => (
          <li
            key={p.pid + i}
            className="bg-white p-3 flex justify-between rounded shadow"
          >
            <div>
              <strong className="text-gray-800">{escapeHtml(p.name)}</strong>{" "}
              <span className="text-sm text-gray-600">
                ({escapeHtml(p.pid)})
              </span>
              <div className="text-sm text-gray-600">
                Linked Student: {escapeHtml(p.linkedStudent || "—")}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => {
                  pFormRef.current.name.value = p.name;
                  pFormRef.current.pid.value = p.pid;
                  pFormRef.current.pid.disabled = true;
                  pFormRef.current.email.value = p.email;
                  pFormRef.current.phone.value = p.phone;
                  pFormRef.current.address.value = p.address || "";
                  pFormRef.current.linkedStudent.value = p.linkedStudent || "";
                  setPEditIdx(i);
                }}
                className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
              >
                Edit
              </button>
              {/* <button onClick={()=>{ if(confirm('Delete parent and credentials?')){ del('parents', i); setUsers(u=> ({ ...u, parents: (u.parents||[]).filter(us=>us.pid!==p.pid) })); } }} className="bg-red-500 text-white px-2 py-1 rounded text-sm">Delete</button>  */}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
