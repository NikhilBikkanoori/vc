import React, { useRef, useState } from "react";

export default function AdminAdmins({ users, setUsers, escapeHtml }) {
  const adminFormRef = useRef();
  const [adminEditIdx, setAdminEditIdx] = useState(null);
  const [qAdmin, setQAdmin] = useState("");

  function handleAdminSubmit(e) {
    e.preventDefault();
    const form = new FormData(adminFormRef.current);
    const id = form.get("id")?.trim();
    const username = form.get("username")?.trim();
    const password = form.get("password");
    if (!id || !username || !password) return alert("All fields required");
    if (adminEditIdx !== null) {
      setUsers((u) => {
        const copy = { ...u };
        copy.admins = [...(copy.admins || [])];
        copy.admins[adminEditIdx] = { id, username, password };
        return copy;
      });
      setAdminEditIdx(null);
      adminFormRef.current.reset();
      return;
    }
    if (
      (users.admins || []).find((a) => a.id === id || a.username === username)
    )
      return alert("Admin ID or username exists");
    setUsers((u) => ({
      ...u,
      admins: [...(u.admins || []), { id, username, password }],
    }));
    adminFormRef.current.reset();
  }

  return (
    <section>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Admins</h2>
      </div>
      <form
        ref={adminFormRef}
        onSubmit={handleAdminSubmit}
        className="grid grid-cols-3 gap-3 bg-white p-4 rounded shadow mt-4"
      >
        <input
          name="id"
          placeholder="Admin ID (unique)"
          className="border p-2 rounded text-gray-800 bg-white"
          required
        />
        <input
          name="username"
          placeholder="Username"
          className="border p-2 rounded text-gray-800 bg-white"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="border p-2 rounded text-gray-800 bg-white"
          required
        />
        <button
          type="submit"
          className="col-span-3 bg-purple-600 text-white py-2 rounded"
        >
          Add Admin
        </button>
      </form>
      <input
        value={qAdmin}
        onChange={(e) => setQAdmin(e.target.value)}
        className="mt-4 p-2 border rounded w-full text-gray-800 bg-white"
        placeholder="Search admins by id or username"
      />
      {/* <ul className="mt-4 space-y-2">{(users.admins||[]).filter(a=> a.id.toLowerCase().includes(qAdmin.toLowerCase()) || a.username.toLowerCase().includes(qAdmin.toLowerCase())).map((a,i)=> (
        <li key={a.id+i} className="bg-white p-3 flex justify-between rounded"> <div><strong>{escapeHtml(a.username)}</strong> <span className="text-sm text-gray-600">({escapeHtml(a.id)})</span></div> <div className="flex gap-2"><button onClick={()=>{ adminFormRef.current.id.value=a.id; adminFormRef.current.username.value=a.username; adminFormRef.current.password.value=a.password; setAdminEditIdx(i); }} className="bg-blue-500 text-white px-2 py-1 rounded text-sm">Edit</button><button onClick={()=>{ if(!confirm('Delete admin?')) return; const logged = localStorage.getItem('isLoggedIn')||''; const loggedId = logged.split(':')[1]||''; if((users.admins||[]).length<=1) return alert("Can't delete the last admin."); if(a.id===loggedId) return alert("Can't delete the currently logged-in admin."); setUsers(u=> ({ ...u, admins: (u.admins||[]).filter((_,ii)=>ii!==i) })); }} className="bg-red-500 text-white px-2 py-1 rounded text-sm">Delete</button></div></li>
      ))}</ul> */}
    </section>
  );
}
