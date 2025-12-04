import React, { useRef, useState } from "react";

export default function AdminAttendance({
  attendance,
  setAttendance,
  escapeHtml,
}) {
  const attFormRef = useRef();
  const [attEditIdx, setAttEditIdx] = useState(null);
  const [qAtt, setQAtt] = useState("");

  function handleAttSubmit(e) {
    e.preventDefault();
    const form = new FormData(attFormRef.current);
    const roll = form.get("roll")?.trim();
    const date = form.get("date");
    const status = form.get("status");
    if (!roll || !date) return alert("Roll & date required");
    if (attEditIdx !== null) {
      setAttendance((arr) => {
        const c = [...arr];
        c[attEditIdx] = { roll, date, status };
        return c;
      });
      setAttEditIdx(null);
      attFormRef.current.reset();
      return;
    }
    setAttendance((a) => [...a, { roll, date, status }]);
    attFormRef.current.reset();
  }

  function del(idx) {
    setAttendance((s) => s.filter((_, i) => i !== idx));
  }

  return (
    <section>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Attendance</h2>
      </div>
      <form
        ref={attFormRef}
        onSubmit={handleAttSubmit}
        className="grid grid-cols-3 gap-3 bg-white p-4 rounded shadow mt-4"
      >
        <input
          name="roll"
          placeholder="Student Roll"
          className="border p-2 rounded text-gray-800 bg-white"
          required
        />
        <input name="date" type="date" className="border p-2 rounded text-gray-800 bg-white" required />
        <select name="status" className="border p-2 rounded text-gray-800 bg-white">
          <option>Present</option>
          <option>Absent</option>
        </select>
        <button
          type="submit"
          className="col-span-3 bg-purple-600 text-white py-2 rounded"
        >
          Save Attendance
        </button>
      </form>
      <input
        value={qAtt}
        onChange={(e) => setQAtt(e.target.value)}
        className="mt-4 p-2 border rounded w-full text-gray-800 bg-white"
        placeholder="Filter by roll/date"
      />
      {/* <ul className="mt-4 space-y-2">{attendance.filter(a=> (a.roll||"").toLowerCase().includes(qAtt.toLowerCase()) || (a.date||"").includes(qAtt)).map((a,i)=> (
          <li key={i} className="bg-white p-3 flex justify-between rounded"> <div>{escapeHtml(a.roll)} - {escapeHtml(a.date)} : {escapeHtml(a.status)}</div> <div className="flex gap-2"><button onClick={()=>{ attFormRef.current.roll.value=a.roll; attFormRef.current.date.value=a.date; attFormRef.current.status.value=a.status; setAttEditIdx(i); }} className="bg-blue-500 text-white px-2 py-1 rounded text-sm">Edit</button><button onClick={()=>{ if(confirm('Delete?')) del('attendance', i); }} className="bg-red-500 text-white px-2 py-1 rounded text-sm">Delete</button></div></li>
      ))}</ul> */}
    </section>
  );
}
