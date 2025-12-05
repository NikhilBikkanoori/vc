import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function AdminExams({ exams, setExams, escapeHtml }) {
  const examFormRef = useRef();
  const [examEditIdx, setExamEditIdx] = useState(null);
  const [qExam, setQExam] = useState("");

  /* ---------------- FETCH ALL STUDENT MARKS ---------------- */
  useEffect(() => {
    const fetchAllMarks = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/student-marks/get-marks"
        );

        // FIXED HERE
        setExams(res.data.students); 
      } catch (err) {
        console.error("Failed to load exams", err);
      }
    };

    fetchAllMarks();
  }, [setExams]);

  /* ---------------- SEARCH FILTER ---------------- */
  const filteredExams = exams.filter((x) =>
    (x.studentId || "").toLowerCase().includes(qExam.toLowerCase())
  );

  /* ---------------- CREATE / UPDATE ---------------- */
  function handleExamSubmit(e) {
    e.preventDefault();
    const form = new FormData(examFormRef.current);

    const studentId = form.get("studentId")?.trim();
    if (!studentId) return alert("Student ID required");

    const subjects = [];
    for (let i = 1; i <= 5; i++) {
      const sub = form.get(`sub${i}`)?.trim();
      const marks = form.get(`marks${i}`);
      if (!sub) return alert("All 5 subjects must have names.");
      if (!marks) return alert("All 5 subjects must have marks.");
      subjects.push({ subject: sub, marks });
    }

    const examObj = { studentId, subjects };

    if (examEditIdx !== null) {
      setExams((arr) => {
        const c = [...arr];
        c[examEditIdx] = examObj;
        return c;
      });
      setExamEditIdx(null);
      examFormRef.current.reset();
      return;
    }

    setExams((arr) => [...arr, examObj]);
    examFormRef.current.reset();
  }

  // Inject custom input styles on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !document.getElementById('custom-input-style')) {
      const style = document.createElement('style');
      style.id = 'custom-input-style';
      style.innerHTML = `
        .custom-input::placeholder {
          color: #a0aec0; /* Tailwind's gray-400 */
        }
        .custom-input:not(:placeholder-shown) {
          color: #4f46e5 !important; /* Tailwind's indigo-600 */
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <section>
      <h2 className="text-xl font-bold mb-2">Exams</h2>

      {/* FORM */}
      <form
        ref={examFormRef}
        onSubmit={handleExamSubmit}
        className="bg-white p-4 rounded shadow grid grid-cols-2 gap-3"
      >

        <input
          name="studentId"
          placeholder="Student ID"
          className="border p-2 rounded col-span-2 custom-input"
          required
        />

        {[1, 2, 3, 4, 5].map((n) => (
          <React.Fragment key={n}>
            <input
              name={`sub${n}`}
              placeholder={`Subject ${n}`}
              className="border p-2 rounded custom-input"
              required
            />
            <input
              name={`marks${n}`}
              type="number"
              placeholder={`Marks ${n}`}
              className="border p-2 rounded custom-input"
              required
            />
          </React.Fragment>
        ))}

        <button
          type="submit"
          className="col-span-2 bg-purple-600 text-white py-2 rounded"
        >
          Save Exam
        </button>
      </form>

      {/* SEARCH */}
      <input
        value={qExam}
        onChange={(e) => setQExam(e.target.value)}
        className="mt-4 p-2 border rounded w-full custom-input"
        placeholder="Search by Student ID"
      />

      {/* LIST */}
      <ul className="mt-4 space-y-2">
        {filteredExams.map((x, i) => (
          <li
            key={i}
            className="bg-white p-3 rounded shadow flex justify-between"
          >
            <div>
              <div className="font-bold">Student: {escapeHtml(x.studentId)}</div>

              <ul className="ml-4 mt-1 text-sm">
                {x.subjects.map((s, idx) => (
                  <li key={idx}>
                    {escapeHtml(s.subject)} — {escapeHtml(String(s.marks))}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                examFormRef.current.studentId.value = x.studentId;
                x.subjects.forEach((s, idx) => {
                  examFormRef.current[`sub${idx + 1}`].value = s.subject;
                  examFormRef.current[`marks${idx + 1}`].value = s.marks;
                });
                setExamEditIdx(i);
              }}
              className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
