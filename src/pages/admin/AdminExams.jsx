import React, { useRef, useState } from "react";

export default function AdminExams({ exams, setExams, escapeHtml }) {
  const examFormRef = useRef();
  const [examEditIdx, setExamEditIdx] = useState(null);
  const [qExam, setQExam] = useState("");

  const filteredExams = exams.filter(
    (x) =>
      (x.roll || "").toLowerCase().includes(qExam.toLowerCase()) ||
      (x.sub || "").toLowerCase().includes(qExam.toLowerCase()) ||
      (x.exam || "").toLowerCase().includes(qExam.toLowerCase())
  );

  function handleExamSubmit(e) {
    e.preventDefault();
    const form = new FormData(examFormRef.current);
    const roll = form.get("roll")?.trim();
    const sub = form.get("sub")?.trim();
    const name = form.get("name")?.trim();
    const marks = form.get("marks");
    if (!roll || !sub || !name) return alert("Roll, subject & exam name required");
    if (examEditIdx !== null) {
      setExams((arr) => {
        const c = [...arr];
        c[examEditIdx] = { roll, sub, exam: name, marks };
        return c;
      });
      setExamEditIdx(null);
      examFormRef.current.reset();
      return;
    }
    setExams((e) => [...e, { roll, sub, exam: name, marks }]);
    examFormRef.current.reset();
  }

  function del(idx) {
    setExams((s) => s.filter((_, i) => i !== idx));
  }

  return (
    <section>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Exams</h2>
      </div>
      <form
        ref={examFormRef}
        onSubmit={handleExamSubmit}
        className="grid grid-cols-4 gap-3 bg-white p-4 rounded shadow mt-4"
      >
        <input
          name="roll"
          placeholder="Roll"
          className="border p-2 rounded text-gray-800 bg-white"
          required
        />
        <input
          name="sub"
          placeholder="Subject"
          className="border p-2 rounded text-gray-800 bg-white"
          required
        />
        <input
          name="name"
          placeholder="Exam Name"
          className="border p-2 rounded text-gray-800 bg-white"
          required
        />
        <input
          name="marks"
          type="number"
          placeholder="Marks"
          className="border p-2 rounded text-gray-800 bg-white"
          required
        />
        <button
          type="submit"
          className="col-span-4 bg-purple-600 text-white py-2 rounded"
        >
          Save Exam
        </button>
      </form>
      <input
        value={qExam}
        onChange={(e) => setQExam(e.target.value)}
        className="mt-4 p-2 border rounded w-full text-gray-800 bg-white"
        placeholder="Search exams"
      />
      {/* <ul className="mt-4 space-y-2">{filteredExams.map((x,i)=> (
        <li key={i} className="bg-white p-3 flex justify-between rounded"> <div>{escapeHtml(x.roll)} - {escapeHtml(x.exam)} ({escapeHtml(x.sub)}) : {escapeHtml(x.marks)}</div> <div className="flex gap-2"><button onClick={()=>{ examFormRef.current.roll.value=x.roll; examFormRef.current.sub.value=x.sub; examFormRef.current.name.value=x.exam; examFormRef.current.marks.value=x.marks; setExamEditIdx(i); }} className="bg-blue-500 text-white px-2 py-1 rounded text-sm">Edit</button><button onClick={()=>{ if(confirm('Delete exam?')) del('exams', i); }} className="bg-red-500 text-white px-2 py-1 rounded text-sm">Delete</button></div></li>
      ))}</ul> */}
    </section>
  );
}
