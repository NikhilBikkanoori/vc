import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "mentor_portal_v1";

const DEFAULT_MENTOR = {
  id: "mentor-1",
  name: "Prof. Sharma",
  dept: "CSE",
  mentees: [
    { id: "21CSE046", name: "Ravi Mehta", gpa: 6.8, attendance: 60, finance: { total: 50000, paid: 20000, others: 500 }, assignments: [], exams: [{ subject: "Math", marks: 42 }], scores: [42], attempts: [] },
    { id: "21CSE048", name: "Rohan Das", gpa: 3.2, attendance: 85, finance: { total: 0, paid: 0, others: 0 }, assignments: [], exams: [{ subject: "Math", marks: 32 }], scores: [32], attempts: [] },
    { id: "21CSE047", name: "Zara Singh", gpa: 9.0, attendance: 88, finance: { total: 50000, paid: 50000, others: 0 }, assignments: [], exams: [{ subject: "Math", marks: 92 }], scores: [92], attempts: [] },
    { id: "21CSE049", name: "Ankit Rao", gpa: 5.0, attendance: 65, finance: { total: 40000, paid: 15000, others: 2000 }, assignments: [], exams: [{ subject: "DBMS", marks: 28 }], scores: [28], attempts: [] },
    { id: "21CSE050", name: "Meena Patil", gpa: 4.2, attendance: 70, finance: { total: 30000, paid: 10000, others: 0 }, assignments: [], exams: [{ subject: "OS", marks: 35 }], scores: [35], attempts: [] },
    { id: "21CSE051", name: "Kunal Yadav", gpa: 8.0, attendance: 62, finance: { total: 0, paid: 0, others: 0 }, assignments: [], exams: [{ subject: "CN", marks: 75 }], scores: [75], attempts: [] },
    { id: "21CSE052", name: "Isha Sharma", gpa: 7.5, attendance: 90, finance: { total: 45000, paid: 25000, others: 0 }, assignments: [], exams: [{ subject: "OS", marks: 80 }], scores: [80], attempts: [] },
    { id: "21CSE053", name: "Rahul Nair", gpa: 3.0, attendance: 85, finance: { total: 0, paid: 0, others: 0 }, assignments: [], exams: [{ subject: "DBMS", marks: 25 }], scores: [25], attempts: [] },
    { id: "21CSE054", name: "Sneha Gupta", gpa: 9.1, attendance: 92, finance: { total: 60000, paid: 60000, others: 0 }, assignments: [], exams: [{ subject: "Math", marks: 95 }], scores: [95], attempts: [] },
    { id: "21CSE055", name: "Vikram Singh", gpa: 8.5, attendance: 88, finance: { total: 50000, paid: 50000, others: 0 }, assignments: [], exams: [{ subject: "CN", marks: 85 }], scores: [85], attempts: [] },
    { id: "21CSE056", name: "Pooja Reddy", gpa: 8.8, attendance: 93, finance: { total: 55000, paid: 55000, others: 0 }, assignments: [], exams: [{ subject: "OS", marks: 89 }], scores: [89], attempts: [] },
    { id: "21CSE057", name: "Arjun Verma", gpa: 4.0, attendance: 58, finance: { total: 50000, paid: 15000, others: 1000 }, assignments: [], exams: [{ subject: "Math", marks: 30 }], scores: [30], attempts: [] },
    { id: "21CSE058", name: "Divya Menon", gpa: 5.5, attendance: 62, finance: { total: 45000, paid: 20000, others: 500 }, assignments: [], exams: [{ subject: "DBMS", marks: 40 }], scores: [40], attempts: [] },
    { id: "21CSE059", name: "Harsh Jain", gpa: 7.8, attendance: 80, finance: { total: 20000, paid: 10000, others: 0 }, assignments: [], exams: [{ subject: "CN", marks: 76 }], scores: [76], attempts: [] }
  ],
  assignments: [
    { id: "A1", title: "Integrals HW", course: "Math", due: "2025-09-28" },
    { id: "A2", title: "Process Sync", course: "OS", due: "2025-09-20" }
  ],
  submissions: [
    { studId: "21CSE046", assignId: "A1", status: "Pending", grade: null, file: "" },
    { studId: "21CSE047", assignId: "A2", status: "Submitted", grade: 9, file: "sync_zara.zip" }
  ],
  exams: [
    { studId: "21CSE046", subject: "Math", marks: 42 },
    { studId: "21CSE047", subject: "Math", marks: 92 },
    { studId: "21CSE048", subject: "Math", marks: 32 }
  ],
  notices: [{ id: 1, title: "Meeting", body: "Mentor meeting tomorrow 4pm", date: "2025-09-20" }],
  attendanceToday: {}
};

const cloneMentor = (m) => JSON.parse(JSON.stringify(m));
const rupee = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const parseSimpleCsv = (text) => {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length);
  if (!lines.length) return [];
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const cols = line.split(",");
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = cols[idx] ? cols[idx].trim() : "";
    });
    return obj;
  });
};

const MentorDashboard = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboardPage");
  const [mentor, setMentor] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : cloneMentor(DEFAULT_MENTOR);
    } catch (e) {
      console.error("Failed to load mentor state", e);
      return cloneMentor(DEFAULT_MENTOR);
    }
  });
  const [today, setToday] = useState(() => new Date().toDateString());
  const [modal, setModal] = useState({ open: false, title: "", body: "" });
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [newStudentName, setNewStudentName] = useState("");
  const importStudentsRef = useRef(null);
  const importExamsRef = useRef(null);
  const importFeesRef = useRef(null);

  const riskPieRef = useRef(null);
  const attendanceDistRef = useRef(null);
  const feeBarsRef = useRef(null);
  const perfLineRef = useRef(null);
  const perfBarSmallRef = useRef(null);
  const perfLineSmallRef = useRef(null);

  const mentorDataLS = useMemo(() => {
    try {
      const raw = localStorage.getItem("mentorData");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error("mentorData parse fail", e);
      return null;
    }
  }, []);

  const profileName = mentorDataLS?.name || mentor.name;
  const profileDept = mentorDataLS?.dept || mentor.dept || "CSE";
  const profileEmail = mentorDataLS?.email || "mentor.sharma@ait.edu";
  const profileInitials = (profileName || "").split(" ").map((p) => p[0]).slice(0, 2).join("") || "S";

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mentor));
  }, [mentor]);

  useEffect(() => {
    const handler = () => setToday(new Date().toDateString());
    const id = setInterval(handler, 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const riskData = useMemo(() => {
    const ATT_THRESH = 75;
    const FAIL_SCORE = 40;
    const ATTEMPT_THRESH = 3;
    const FEE_THRESH = 1;

    const result = mentor.mentees.map((s) => {
      const scores = s.scores && s.scores.length ? s.scores.map(Number).filter((x) => !Number.isNaN(x)) : s.exams ? s.exams.map((e) => Number(e.marks)).filter((x) => !Number.isNaN(x)) : [];
      const avgScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : s.gpa ? Number(s.gpa) * 10 : null;
      const attempts = s.attempts || (s.attempts_arr ? Math.max(...s.attempts_arr) : 0);
      const feesPending = s.finance ? (s.finance.total || 0) - (s.finance.paid || 0) + (s.finance.others || 0) : 0;
      const attendance = Number(s.attendance || 0);

      const issues = [];
      if (attendance < ATT_THRESH) issues.push("attendance");
      if (avgScore !== null && avgScore < FAIL_SCORE) issues.push("academics");
      if (attempts >= ATTEMPT_THRESH) issues.push("attempts");
      if (feesPending >= FEE_THRESH) issues.push("financial");

      let risk = "Low";
      if (issues.length >= 2 || (avgScore !== null && avgScore < 30)) risk = "High";
      else if (issues.length === 1) risk = "Medium";

      return { id: s.id, name: s.name, attendance, avgScore, attempts, feesPending, issues, risk };
    });

    const order = { High: 3, Medium: 2, Low: 1 };
    result.sort((a, b) => (order[b.risk] !== order[a.risk] ? order[b.risk] - order[a.risk] : (b.avgScore || 0) - (a.avgScore || 0)));
    return result;
  }, [mentor]);

  const riskSummaryText = useMemo(() => {
    const counts = riskData.reduce((acc, r) => {
      acc[r.risk] = (acc[r.risk] || 0) + 1;
      return acc;
    }, {});
    return `High: ${counts.High || 0}, Med: ${counts.Medium || 0}, Low: ${counts.Low || 0}`;
  }, [riskData]);

  const filteredRisk = useMemo(() => {
    return riskData.filter((r) => {
      if (riskFilter !== "all") {
        const rf = riskFilter === "high" ? "High" : riskFilter === "medium" ? "Medium" : "Low";
        if (r.risk !== rf) return false;
      }
      if (!search) return true;
      return (r.name && r.name.toLowerCase().includes(search.toLowerCase())) || (r.id && r.id.toLowerCase().includes(search.toLowerCase()));
    });
  }, [riskData, riskFilter, search]);

  const addStudent = () => {
    const name = newStudentName.trim();
    if (!name) return alert("Enter name");
    const id = `21CSE${Math.floor(Math.random() * 900 + 100)}`;
    const newMentor = cloneMentor(mentor);
    newMentor.mentees.push({ id, name, gpa: 7.0, attendance: 75, finance: { total: 50000, paid: 0, others: 0 }, assignments: [], exams: [], scores: [], attempts: [] });
    setMentor(newMentor);
    setNewStudentName("");
  };

  const removeStudent = (id) => {
    if (!window.confirm(`Remove student ${id}?`)) return;
    const newMentor = cloneMentor(mentor);
    newMentor.mentees = newMentor.mentees.filter((s) => s.id !== id);
    newMentor.submissions = newMentor.submissions.filter((s) => s.studId !== id);
    newMentor.exams = newMentor.exams.filter((e) => e.studId !== id);
    setMentor(newMentor);
  };

  const saveAttendance = () => {
    const newMentor = cloneMentor(mentor);
    newMentor.mentees.forEach((s) => {
      const present = newMentor.attendanceToday?.[s.id];
      if (present !== undefined) {
        s.attendance = present ? Math.min(100, s.attendance + 1) : Math.max(0, s.attendance - 1);
      }
    });
    setMentor(newMentor);
    alert("Attendance saved.");
  };

  const handleAttendanceToggle = (studId, checked) => {
    setMentor((prev) => {
      const next = cloneMentor(prev);
      next.attendanceToday[studId] = checked;
      return next;
    });
  };

  const createAssignment = (title, course, due) => {
    if (!title) return alert("Enter title");
    const id = `A${Math.floor(Math.random() * 9000 + 100)}`;
    const next = cloneMentor(mentor);
    next.assignments.push({ id, title, course, due });
    setMentor(next);
  };

  const gradeSubmission = (studId, assignId, grade) => {
    const g = Number(grade);
    if (Number.isNaN(g)) return alert("Enter numeric grade");
    const next = cloneMentor(mentor);
    const sub = next.submissions.find((s) => s.studId === studId && s.assignId === assignId);
    if (sub) sub.grade = g;
    const student = next.mentees.find((m) => m.id === studId);
    if (student) {
      student.scores = student.scores || [];
      student.scores.push(g * 10);
      student.gpa = Math.min(10, Math.max(0, ((student.gpa || 0) + g / 10) / 2 + 0.2));
    }
    setMentor(next);
    alert("Graded.");
  };

  const viewStudent = (id) => {
    const s = mentor.mentees.find((x) => x.id === id);
    if (!s) return alert("Student not found");
    setModal({
      open: true,
      title: `${s.name} (${s.id})`,
      body: (
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ width: 120, textAlign: "center" }}>
            <div style={{ width: 100, height: 100, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "var(--c3)" }}>
              {s.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
            </div>
          </div>
          <div>
            <p><b>{s.name}</b></p>
            <p className="muted">GPA: {s.gpa}</p>
            <p className="muted">Attendance: {s.attendance}%</p>
            <p className="muted">Pending Fees: {rupee((s.finance?.total || 0) - (s.finance?.paid || 0) + (s.finance?.others || 0))}</p>
            <div style={{ height: 12 }}></div>
            <button className="btn primary" onClick={() => messageStudent(s.id)}>Message</button>
          </div>
        </div>
      )
    });
  };

  const messageStudent = (id) => {
    const s = mentor.mentees.find((x) => x.id === id);
    setModal({
      open: true,
      title: `Message ${s ? s.name : id}`,
      body: (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <textarea id="msgTxt" rows={5} style={{ padding: 8, borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)", background: "var(--soft)", color: "var(--text-dark)" }}></textarea>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button className="btn" onClick={() => setModal({ open: false, title: "", body: "" })}>Cancel</button>
            <button className="btn primary" onClick={() => {
              setModal({ open: false, title: "", body: "" });
              alert(`Message sent to ${id}. (Demo)`);
            }}>Send</button>
          </div>
        </div>
      )
    });
  };

  const openModal = (title, body) => setModal({ open: true, title, body });
  const closeModal = () => setModal({ open: false, title: "", body: "" });

  const importCsv = async (file, kind) => {
    if (!file) return;
    const text = await file.text();
    const rows = parseSimpleCsv(text);
    const next = cloneMentor(mentor);
    if (kind === "students") {
      rows.forEach((r) => {
        const id = (r.student_id || r.id || r.roll || r.Roll || "").toString().trim();
        if (!id) return;
        let s = next.mentees.find((x) => x.id === id);
        if (!s) {
          s = {
            id,
            name: r.name || "",
            gpa: Number(r.gpa) || 0,
            attendance: Number(r.attendance_pct || r.attendance) || 0,
            finance: { total: 0, paid: 0, others: 0 },
            assignments: [],
            exams: [],
            scores: [],
            attempts: []
          };
          next.mentees.push(s);
        } else {
          s.name = s.name || r.name || s.name;
          s.gpa = Number.isNaN(Number(r.gpa)) ? s.gpa : Number(r.gpa);
          s.attendance = r.attendance_pct || r.attendance ? Number(r.attendance_pct || r.attendance) : s.attendance;
        }
      });
    }
    if (kind === "exams") {
      rows.forEach((r) => {
        const id = (r.student_id || r.id || "").toString().trim();
        if (!id) return;
        const stud = next.mentees.find((x) => x.id === id);
        const marks = Number(r.marks || r.score);
        const attempts = Number(r.attempts || r.attempt || 0);
        if (stud) {
          stud.exams = stud.exams || [];
          stud.exams.push({ subject: r.subject || r.sub || "Exam", marks: Number.isNaN(marks) ? null : marks });
          if (!Number.isNaN(marks)) {
            stud.scores = stud.scores || [];
            stud.scores.push(marks);
          }
          if (!Number.isNaN(attempts) && attempts > 0) {
            stud.attempts = Math.max(stud.attempts || 0, attempts);
            stud.attempts_arr = stud.attempts_arr || [];
            stud.attempts_arr.push(attempts);
          }
        } else {
          const s = { id, name: r.name || "", gpa: 0, attendance: 0, finance: { total: 0, paid: 0, others: 0 }, assignments: [], exams: [], scores: [], attempts: [] };
          if (!Number.isNaN(marks)) {
            s.scores.push(marks);
            s.exams.push({ subject: r.subject || "Exam", marks });
          }
          if (!Number.isNaN(attempts) && attempts > 0) {
            s.attempts = attempts;
            s.attempts_arr = [attempts];
          }
          next.mentees.push(s);
        }
      });
    }
    if (kind === "fees") {
      rows.forEach((r) => {
        const id = (r.student_id || r.id || "").toString().trim();
        if (!id) return;
        const stud = next.mentees.find((x) => x.id === id);
        const total = Number(r.total || r.total_fee || r.total_fees || r.total_amount || 0);
        const paid = Number(r.paid || r.paid_amount || r.paid_fees || 0);
        const others = Number(r.others || r.other || r.fees_due || 0);
        if (stud) {
          stud.finance = stud.finance || { total: 0, paid: 0, others: 0 };
          stud.finance.total = total || stud.finance.total;
          stud.finance.paid = paid || stud.finance.paid;
          stud.finance.others = others || stud.finance.others;
        } else {
          next.mentees.push({ id, name: r.name || "", gpa: 0, attendance: 0, finance: { total, paid, others }, assignments: [], exams: [], scores: [], attempts: [] });
        }
      });
    }
    setMentor(next);
    alert("Import complete");
  };

  const exportRiskCSV = () => {
    const rows = riskData.map((r) => ({
      student_id: r.id,
      name: r.name,
      attendance: r.attendance,
      avg_score: r.avgScore !== null ? r.avgScore.toFixed(1) : "",
      attempts: r.attempts || 0,
      fees_pending: r.feesPending,
      issues: r.issues.join("|"),
      risk: r.risk
    }));
    const header = Object.keys(rows[0] || {}).join(",");
    const body = rows.map((r) => Object.values(r).join(",")).join("\n");
    const csv = `${header}\n${body}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "risk_export.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const drawCanvas = (canvas, drawer) => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(300, Math.floor(rect.width));
    const height = Math.max(160, Math.floor(rect.height));
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawer(ctx, width, height);
  };

  const drawRiskPie = () => {
    drawCanvas(riskPieRef.current, (ctx, W, H) => {
      const counts = { High: 0, Medium: 0, Low: 0 };
      riskData.forEach((r) => {
        counts[r.risk] = (counts[r.risk] || 0) + 1;
      });
      const values = [counts.High, counts.Medium, counts.Low];
      const colors = ["#ff6b6b", "#f59e0b", "#16a34a"];
      const total = values.reduce((a, b) => a + b, 0) || 1;
      const cx = W / 2;
      const cy = H / 2;
      const r = Math.min(W, H) / 4;
      let angle = -Math.PI / 2;
      values.forEach((v, i) => {
        const slice = (v / total) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, angle, angle + slice);
        ctx.closePath();
        ctx.fillStyle = colors[i];
        ctx.fill();
        angle += slice;
      });
      ctx.fillStyle = "#fff";
      ctx.font = "12px Arial";
      ctx.fillText(`High: ${counts.High}`, 10, H - 30);
      ctx.fillText(`Medium: ${counts.Medium}`, 10, H - 14);
      ctx.fillText(`Low: ${counts.Low}`, W - 80, H - 22);
    });
  };

  const drawAttendanceDist = () => {
    drawCanvas(attendanceDistRef.current, (ctx, W, H) => {
      const arr = mentor.mentees.map((m) => Number(m.attendance || 0));
      const a = arr.filter((x) => x > 75).length;
      const b = arr.filter((x) => x <= 75 && x >= 60).length;
      const d = arr.filter((x) => x < 60).length;
      const values = [a, b, d];
      const colors = ["#6a34d8", "#7b3fe4", "#ff6b6b"];
      const total = a + b + d || 1;
      const cx = W / 2;
      const cy = H / 2;
      const r = Math.min(W, H) / 4;
      let angle = -Math.PI / 2;
      values.forEach((v, i) => {
        const slice = (v / total) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, angle, angle + slice);
        ctx.closePath();
        ctx.fillStyle = colors[i];
        ctx.fill();
        angle += slice;
      });
      ctx.beginPath();
      ctx.fillStyle = "#fff";
      ctx.arc(cx, cy, r * 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "12px Arial";
      ctx.fillText(`>75%: ${a}`, 10, H - 30);
      ctx.fillText(`60-75%: ${b}`, 10, H - 14);
      ctx.fillText(`<60%: ${d}`, W - 110, H - 30);
    });
  };

  const drawFeeBars = () => {
    drawCanvas(feeBarsRef.current, (ctx, W, H) => {
      const vals = mentor.mentees.map((m) => (m.finance && m.finance.paid ? m.finance.paid : 0));
      const labels = mentor.mentees.map((m) => m.name.split(" ")[0]);
      const max = Math.max(...vals, 1);
      const paddingLeft = 20;
      const paddingBottom = 40;
      const availableW = W - paddingLeft - 20;
      const barW = Math.floor((availableW / vals.length) * 0.6);
      labels.forEach((lab, i) => {
        const x = paddingLeft + i * (barW + 20);
        const h = (vals[i] / max) * (H - paddingBottom - 20);
        ctx.fillStyle = "#7b3fe4";
        ctx.fillRect(x, H - paddingBottom - h, barW, h);
        ctx.fillStyle = "#fff";
        ctx.font = "12px Arial";
        ctx.fillText(lab, x, H - 12);
        ctx.fillText(rupee(vals[i]), x, H - paddingBottom - h - 6);
      });
    });
  };

  const drawPerfLine = () => {
    drawCanvas(perfLineRef.current, (ctx, W, H) => {
      const labels = mentor.mentees.map((m) => m.name.split(" ")[0]);
      const vals = mentor.mentees.map((m) => Number(m.gpa || 0));
      const paddingLeft = 40;
      const paddingTop = 20;
      const paddingBottom = 40;
      const availableW = W - paddingLeft - 20;
      const step = availableW / Math.max(1, vals.length - 1);
      ctx.strokeStyle = "#6a34d8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      vals.forEach((v, i) => {
        const x = paddingLeft + i * step;
        const y = paddingTop + (1 - v / 10) * (H - paddingTop - paddingBottom);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.strokeStyle = "#6a34d8";
      ctx.lineWidth = 1;
      vals.forEach((v, i) => {
        const x = paddingLeft + i * step;
        const y = paddingTop + (1 - v / 10) * (H - paddingTop - paddingBottom);
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
      ctx.fillStyle = "#fff";
      ctx.font = "12px Arial";
      labels.forEach((lab, i) => {
        const x = paddingLeft + i * step;
        ctx.fillText(lab, x - 10, H - 12);
      });
    });
  };

  const drawPerfBarSmall = () => {
    drawCanvas(perfBarSmallRef.current, (ctx, W, H) => {
      const subjects = ["Math", "OS", "DBMS"];
      const vals = subjects.map((s, i) => 60 + i * 10);
      const paddingLeft = 30;
      const paddingBottom = 30;
      const availableW = W - paddingLeft - 20;
      const barW = Math.floor((availableW / vals.length) * 0.6);
      vals.forEach((v, i) => {
        const x = paddingLeft + i * (barW + 20);
        const h = (v / 100) * (H - paddingBottom - 20);
        ctx.fillStyle = "#6a34d8";
        ctx.fillRect(x, H - paddingBottom - h, barW, h);
        ctx.fillStyle = "#fff";
        ctx.font = "12px Arial";
        ctx.fillText(subjects[i], x, H - 8);
        ctx.fillText`(${v}%, x, H - paddingBottom - h - 6)`;
      });
    });
  };

  const drawPerfLineSmall = () => {
    drawCanvas(perfLineSmallRef.current, (ctx, W, H) => {
      const labels = mentor.mentees.map((m) => m.name.split(" ")[0]);
      const vals = mentor.mentees.map((m) => m.gpa);
      const paddingLeft = 30;
      const paddingTop = 16;
      const paddingBottom = 30;
      const availableW = W - paddingLeft - 20;
      const step = availableW / Math.max(1, vals.length - 1);
      ctx.strokeStyle = "#6a34d8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      vals.forEach((v, i) => {
        const x = paddingLeft + i * step;
        const y = paddingTop + (1 - v / 10) * (H - paddingTop - paddingBottom);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.strokeStyle = "#6a34d8";
      ctx.lineWidth = 1;
      vals.forEach((v, i) => {
        const x = paddingLeft + i * step;
        const y = paddingTop + (1 - v / 10) * (H - paddingTop - paddingBottom);
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
    });
  };

  useEffect(() => {
    if (activePage === "analyticsPage") {
      drawRiskPie();
      drawAttendanceDist();
      drawFeeBars();
      drawPerfLine();
    }
  }, [activePage, mentor, riskData]);

  useEffect(() => {
    drawPerfBarSmall();
    drawPerfLineSmall();
  }, [mentor]);

  useEffect(() => {
    const onResize = () => {
      if (activePage === "analyticsPage") {
        drawRiskPie();
        drawAttendanceDist();
        drawFeeBars();
        drawPerfLine();
      }
      drawPerfBarSmall();
      drawPerfLineSmall();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activePage, mentor]);

  const styles = `
    /* ===============================================================
       Theme variables and base (kept as original, small additions)
       =============================================================== */

     :root {
      --bg: #192047;
      --purple: #A2F4F9;
      --purple-2: #262C53;
      --muted: #7b7b8a;
      --card: #262C53;
      --soft: #1a2349;
      --radius:14px;
      --text-dark: #F7FAFC;
      --c1: #192047;
      --c2: #FFD1D8;
      --c3: #262C53;
      --c4: #A2F4F9;
      --risk-high: #ef4444; /* vivid red */
      --risk-med:  #f97316; /* bright orange */
      --risk-low:  #22c55e; /* crisp green */
    }

    * { box-sizing: border-box; }

    body{
      margin:0;
      font-family: Inter, "Segoe UI", Helvetica, Arial, sans-serif;
      background: var(--bg);
      color: var(--text-dark);
      -webkit-font-smoothing:antialiased;
      -moz-osx-font-smoothing:grayscale;
    }

    /* Topbar / Header */
    .topbar{
      background: var(--c3);
      color: #fff;
      padding: 14px 20px;
      display:flex;
      align-items:center;
      justify-content:space-between;
      box-shadow: 0 8px 24px rgba(34,11,89,0.12);
      position: sticky;
      top: 0;
      z-index: 40;
    }
    .brand { display:flex; align-items:center; gap:12px; }
    .logo{
      width:44px;
      height:44px;
      border-radius:10px;
      background: rgba(255,255,255,0.12);
      display:flex;
      align-items:center;
      justify-content:center;
      font-weight:700;
      font-size:16px;
    }
    .top-right{ display:flex; align-items:center; gap:12px; }
    .profile-mini{
      display:flex;
      align-items:center;
      gap:10px;
      background: rgba(255,255,255,0.12);
      padding:6px 10px;
      border-radius:999px;
    }
    .profile-mini .avatar{
      width:34px;height:34px;border-radius:50%;
      background:var(--c4);color:var(--c3);
      display:flex;align-items:center;justify-content:center;font-weight:700;
    }

    /* Layout */
    .container{
      display:flex;
      gap:18px;
      padding:20px;
      max-width:1200px;
      margin:20px auto;
    }

    aside.sidebar{
      width:220px;
      border-radius:14px;
      padding:16px;
      color:var(--text-dark);
      background: var(--c3);
      box-shadow: 0 6px 18px rgba(0,0,0,0.06);
      flex-shrink:0;
    }
    .sidebar h2{ font-size:14px; margin:0 0 12px 0; color:var(--c4); }
    .nav-item{
      display:block;
      padding:10px;
      border-radius:10px;
      margin-bottom:8px;
      color:var(--muted);
      cursor:pointer;
      text-decoration:none;
    }
    .nav-item.active{ background: var(--c4); color: var(--c3); font-weight:600; }
    .nav-item:hover{ background: rgba(255,255,255,0.06); color:var(--c4); }

    main.main{ flex:1; }

    .grid{
      display:grid;
      grid-template-columns: repeat(12, 1fr);
      gap:18px;
    }
    .card{
      background: var(--card);
      padding:14px;
      border-radius:12px;
      box-shadow: 0 6px 20px rgba(15,12,36,0.06);
    }

    .welcome{
      grid-column: 1 / -1;
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:14px;
      padding:16px;
      border-radius:14px;
    }

    .muted{ color:var(--muted); }

    /* Buttons & lists & forms */
    .btn{ padding:8px 12px; border-radius:8px; border:none; cursor:pointer; }
    .btn.primary{ background: var(--c4); color: var(--c3); font-weight:600; }
    .btn.ghost{ background: var(--soft); border: 1px solid rgba(255,255,255,0.1); color:var(--text-dark); }

    .student-list{ display:flex; flex-direction:column; gap:10px; }
    .student-card{
      display:flex; justify-content:space-between; align-items:center;
      padding:12px; border-radius:10px; background:var(--soft);
    }
    .student-meta{ display:flex; gap:12px; align-items:center; }
    .avatar{ width:44px; height:44px; border-radius:50%; background:var(--c4); color:var(--c3); display:flex; align-items:center; justify-content:center; font-weight:700; }

    table{ width:100%; border-collapse:collapse; }
    th, td{ padding:10px; border-bottom:1px solid rgba(255,255,255,0.08); text-align:left; font-size:14px; }
    th{ color:var(--c4); }

    /* Canvas styling */
    canvas{
      width:100%;
      height:220px;
      border-radius:8px;
      background:#fff;
      border:1px solid rgba(255,255,255,0.1);
      margin:16px 0;
      padding:8px;
      box-sizing:border-box;
      display:block;
    }

    /* small form */
    .form-row{ display:flex; gap:8px; align-items:center; }
    .input{ padding:8px; border-radius:6px; border:1px solid rgba(255,255,255,0.1); flex:1; background:var(--soft); color:var(--text-dark); }

    /* search and small controls */
    .controls {
      display:flex;
      gap:8px;
      align-items:center;
      margin-bottom:12px;
      flex-wrap:wrap;
      background: rgba(162, 244, 249, 0.10);
      border: 1px solid rgba(162, 244, 249, 0.22);
      padding: 10px 12px;
      border-radius: 12px;
    }
    .controls select {
      background: var(--soft);
      color: var(--text-dark);
      border: 1px solid rgba(255,255,255,0.12);
      padding: 8px;
      border-radius: 8px;
    }
    .tag {
      padding:6px 10px;
      border-radius:8px;
      background:rgba(162, 244, 249, 0.18);
      color:var(--c3);
      font-weight:600;
      font-size:13px;
    }

    /* risk badges */
    .risk-b{ padding:6px 10px; border-radius:999px; color:#fff; font-weight:700; font-size:13px; display:inline-block; }
    .risk-high { background: var(--risk-high); }
    .risk-med  { background: var(--risk-med); }
    .risk-low  { background: var(--risk-low); }

    /* table row coloring for quick scanning */
    tr.row-high { background: rgba(239,68,68,0.10); }
    tr.row-med  { background: rgba(249,115,22,0.08); }
    tr.row-low  { background: rgba(34,197,94,0.06); }

    /* hover and striped */
    tr:hover { background: rgba(255,255,255,0.02); }
    tr:nth-child(even) td { opacity:0.98; }

    /* responsive */
    @media (max-width:980px){
      .container{ padding:12px; flex-direction:column; }
      .grid{ grid-template-columns: repeat(6, 1fr); }
      aside.sidebar{ width:100%; display:flex; overflow:auto; }
    }
    @media (max-width:640px){
      .grid{ grid-template-columns: 1fr; }
      aside.sidebar{ display:none; }
    }

    /* spacing helpers */
    .sp-8{ height:8px; }
    .sp-12{ height:12px; }
    .sp-16{ height:16px; }
  `;

  const navigateTo = (page) => {
    setActivePage(page);
  };

  const logout = () => {
    alert("Logged out successfully!");
    navigate("/");
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <style>{styles}</style>

      {/* Topbar */}
      <div className="topbar">
        <div className="brand">
          <div className="logo">AIT</div>
          <div>
            <div style={{ fontSize: 14, opacity: 0.95 }}>ABC Institute of Technology</div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>Mentor Dashboard</div>
          </div>
        </div>

        <div className="top-right">
          <div className="muted" id="todaySmall">{today}</div>
          <div className="profile-mini" title={profileName}>
            <div className="avatar" style={{ width: 34, height: 34, background: "var(--c4)", color: "var(--c3)" }}>{profileInitials}</div>
            <div style={{ color: "#ffffffff" }}>
              {profileName}
              <br />
              <small style={{ opacity: 0.9, color: "#fff" }}>Mentor • {profileDept}</small>
            </div>
          </div>
        </div>
      </div>

      {/* Container */}
      <div className="container">
        {/* Sidebar */}
        <aside className="sidebar" id="sidebar">
          <h2>Mentor Menu</h2>

          {[
            ["dashboardPage", "Dashboard"],
            // ["analyticsPage", "Analytics"],
            ["profilePage", "Profile"],
            ["studentsPage", "Students"],
            ["attendancePage", "Attendance"],
            ["assignmentsPage", "Assignments"],
            ["submissionsPage", "Submissions"],
            ["examsPage", "Exams & Results"],
            // ["performancePage", "Performance"],
            ["noticesPage", "Notices"],
            ["feesPage", "Fees Overview"]
          ].map(([key, label]) => (
            <a
              key={key}
              className={`nav-item ${activePage === key ? "active" : ""}`}
              onClick={() => navigateTo(key)}
            >
              {label}
            </a>
          ))}

          <hr style={{ border: "none", height: 1, background: "rgba(255,255,255,0.03)", margin: "10px 0" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label className="nav-item" style={{ cursor: "default" }}>Import CSVs</label>
            <input ref={importStudentsRef} type="file" accept=".csv" style={{ color: "transparent" }} />
            <input ref={importExamsRef} type="file" accept=".csv" style={{ color: "transparent" }} />
            <input ref={importFeesRef} type="file" accept=".csv" style={{ color: "transparent" }} />
            <button className="btn ghost" onClick={async () => {
              await importCsv(importStudentsRef.current?.files?.[0], "students");
              await importCsv(importExamsRef.current?.files?.[0], "exams");
              await importCsv(importFeesRef.current?.files?.[0], "fees");
            }}>Import Selected</button>
            <button className="btn" onClick={exportRiskCSV}>Export Risk CSV</button>
            <button className="btn ghost" onClick={() => { console.log(cloneMentor(mentor)); alert("State logged to console (debug)."); }}>Debug State</button>
            <a className="nav-item" onClick={logout}>Logout</a>
          </div>
        </aside>

        {/* Main */}
        <main className="main">
          <div className="grid">

            {/* Welcome card */}
            <div className="card welcome" style={{ gridColumn: "1 / -1" }}>
              <div>
                <h2 id="welcomeTitle">Mentor Dashboard</h2>
                <div className="muted">Manage mentees, attendance, submissions and analytics</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <div className="tag" id="riskSummaryTag">Risk: <span id="riskSummary">{riskSummaryText}</span></div>
                <button className="btn ghost" onClick={() => openModal("Export", "Exporting aggregated mentor report. Use Export Risk CSV in the sidebar to download risk list.")}>Export Report</button>
                <button className="btn primary" onClick={() => openModal("Post Notice", "Use Notices page to post.")}>Post Notice</button>
              </div>
            </div>

            

            {/* Analytics page */}
            {activePage === "analyticsPage" && (
              <section className="card" id="analyticsPage" style={{ display: "block", gridColumn: "1 / -1" }}>
                <h3>Analytics</h3>
                <p className="muted">Quick analytics for your mentees. Charts are rendered when this page is opened.</p>

                <div className="sp-12"></div>

                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 320 }} className="card">
                    <h4 style={{ margin: "6px 0" }}>Risk Distribution</h4>
                    <canvas ref={riskPieRef} id="riskPie"></canvas>
                  </div>

                  <div style={{ flex: 1, minWidth: 320 }} className="card">
                    <h4 style={{ margin: "6px 0" }}>Attendance Distribution</h4>
                    <canvas ref={attendanceDistRef} id="attendanceDist"></canvas>
                  </div>

                  <div style={{ flex: 1, minWidth: 320 }} className="card">
                    <h4 style={{ margin: "6px 0" }}>Fees Collected</h4>
                    <canvas ref={feeBarsRef} id="feeBars"></canvas>
                  </div>

                  <div style={{ flex: 1, minWidth: 320 }} className="card">
                    <h4 style={{ margin: "6px 0" }}>GPA / Performance Trend</h4>
                    <canvas ref={perfLineRef} id="perfLine"></canvas>
                  </div>
                </div>
              </section>
            )}

            {/* Profile */}
            {activePage === "profilePage" && (
              <section className="card" id="profilePage" style={{ display: "block", gridColumn: "1 / -1" }}>
                <h3>Profile</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p><b>{profileName}</b></p>
                    <p className="muted">Department: {profileDept}</p>
                    <p className="muted">Email: {profileEmail}</p>
                  </div>
                  <div>
                    <button className="btn primary" onClick={() => openModal("Edit Profile", "Edit profile.")}>Edit</button>
                  </div>
                </div>
              </section>
            )}

            {/* Students */}
            {activePage === "studentsPage" && (
              <section className="card" id="studentsPage" style={{ display: "block", gridColumn: "1 / -1" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ margin: 0 }}>Students</h3>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input className="input" id="newStudentName" placeholder="New student name" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} />
                    <button className="btn primary" onClick={addStudent}>Add Student</button>
                  </div>
                </div>
                <div style={{ height: 12 }}></div>
                <div id="studentsContainer" className="student-list">
                  {mentor.mentees.map((s) => (
                    <div className="student-card" key={s.id}>
                      <div className="student-meta">
                        <div className="avatar">{s.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}</div>
                        <div><b>{s.name}</b><div className="muted">{s.id}</div></div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn ghost" onClick={() => viewStudent(s.id)}>View</button>
                        <button className="btn primary" onClick={() => messageStudent(s.id)}>Message</button>
                        <button className="btn" onClick={() => removeStudent(s.id)}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Attendance */}
            {activePage === "attendancePage" && (
              <section className="card" id="attendancePage" style={{ display: "block", gridColumn: "1 / -1" }}>
                <h3>Mark Attendance (Today)</h3>
                <div style={{ height: 8 }}></div>
                <table>
                  <thead><tr><th>Student</th><th>Roll</th><th>Present</th></tr></thead>
                  <tbody id="attendanceTable">
                    {mentor.mentees.map((s) => {
                      const checked = !!mentor.attendanceToday?.[s.id];
                      return (
                        <tr key={s.id}>
                          <td>{s.name}</td>
                          <td>{s.id}</td>
                          <td><input type="checkbox" checked={checked} onChange={(e) => handleAttendanceToggle(s.id, e.target.checked)} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div style={{ height: 12 }}></div>
                <button className="btn primary" onClick={saveAttendance}>Save Attendance</button>
              </section>
            )}

           
            {/* Submissions */}
            {activePage === "submissionsPage" && (
              <section className="card" id="submissionsPage" style={{ display: "block", gridColumn: "1 / -1" }}>
                <h3>Submissions</h3>
                <table>
                  <thead><tr><th>Student</th><th>Assignment</th><th>Status</th><th>Grade</th><th>Action</th></tr></thead>
                  <tbody id="submissionsTable">
                    {mentor.submissions.map((su) => {
                      const stud = mentor.mentees.find((m) => m.id === su.studId) || { name: su.studId };
                      const assn = mentor.assignments.find((a) => a.id === su.assignId) || { title: su.assignId };
                      return (
                        <tr key={`${su.studId}-${su.assignId}`}>
                          <td>{stud.name}</td>
                          <td>{assn.title}</td>
                          <td>{su.status}</td>
                          <td>{su.grade === null ? "-" : su.grade}</td>
                          <td>
                            <button className="btn ghost" onClick={() => openModal("Submission", (
                              <div>
                                <div><b>Student:</b> {su.studId}</div>
                                <div><b>Assignment:</b> {su.assignId}</div>
                                <div><b>File:</b> {su.file || "—"}</div>
                                <div style={{ height: 10 }}></div>
                                <div style={{ display: "flex", gap: 8 }}>
                                  <input id="gradeInput" className="input" placeholder="Grade (0-10)" />
                                  <button className="btn primary" onClick={() => {
                                    const val = document.getElementById("gradeInput").value;
                                    gradeSubmission(su.studId, su.assignId, val);
                                    closeModal();
                                  }}>Grade</button>
                                </div>
                              </div>
                            ))}>Open</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </section>
            )}

            {/* Exams */}
            {activePage === "examsPage" && (
              <section className="card" id="examsPage" style={{ display: "block", gridColumn: "1 / -1" }}>
                <h3>Exams & Results</h3>
                <table>
                  <thead><tr><th>Student</th><th>Subject</th><th>Marks</th><th>Result</th></tr></thead>
                  <tbody id="examsTable">
                    {mentor.exams.map((e, idx) => {
                      const stud = mentor.mentees.find((m) => m.id === e.studId);
                      return (
                        <tr key={`${e.studId}-${idx}`}>
                          <td>{stud ? stud.name : e.studId}</td>
                          <td>{e.subject}</td>
                          <td>{e.marks}%</td>
                          <td>{e.marks < 50 ? "Fail" : e.marks < 65 ? "Pass" : "Good"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </section>
            )}

            {/* Performance */}
            {activePage === "performancePage" && (
              <section className="card" id="performancePage" style={{ display: "block", gridColumn: "1 / -1" }}>
                <h3>Performance Analysis</h3>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 320 }}><canvas ref={perfBarSmallRef} id="perfBarSmall"></canvas></div>
                  <div style={{ flex: 1, minWidth: 320 }}><canvas ref={perfLineSmallRef} id="perfLineSmall"></canvas></div>
                </div>
              </section>
            )}

            {/* Notices */}
            {activePage === "noticesPage" && (
              <section className="card" id="noticesPage" style={{ display: "block", gridColumn: "1 / -1" }}>
                <h3>Notices & Announcements</h3>
                <div id="noticesList">
                  {mentor.notices.map((n) => (
                    <div key={n.id} style={{ marginBottom: 8 }}>
                      <div style={{ background: "var(--soft)", padding: 10, borderRadius: 8 }}>
                        <b>{n.title}</b>
                        <div className="muted" style={{ fontSize: 13 }}>{n.date}</div>
                        <div style={{ marginTop: 8 }}>{n.body}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Fees */}
            {activePage === "feesPage" && (
              <section className="card" id="feesPage" style={{ display: "block", gridColumn: "1 / -1" }}>
                <h3>Fees Overview</h3>
                <table>
                  <thead><tr><th>Student</th><th>FEE DUE STATUS</th></tr></thead>
                  <tbody id="feesTable">
                    {mentor.mentees.map((s) => {
                      // const pending = (s.finance?.total || 0) - (s.finance?.paid || 0) + (s.finance?.others || 0);
                      var fee_due="YES"
                      return (
                        <tr key={s.id}>
                          <td>{s.name}</td>
                          {/* <td>{rupee(s.finance?.total || 0)}</td> */}
                          {/* <td>{rupee(s.finance?.paid || 0)}</td> */}
                          <td>{(fee_due)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </section>
            )}

          </div> {/* grid */}
        </main>
      </div> {/* container */}

      {/* Modal */}
      {modal.open && (
        <div id="modal" style={{ position: "fixed", left: 0, top: 0, width: "100%", height: "100%", background: "rgba(17,11,34,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "var(--card)", padding: 18, borderRadius: 10, maxWidth: 720, width: "92%", boxShadow: "0 12px 36px rgba(0,0,0,0.25)", color: "var(--text-dark)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 id="modalTitle">{modal.title}</h3>
              <button onClick={closeModal} style={{ border: "none", background: "transparent", fontSize: 20, cursor: "pointer", color: "var(--text-dark)" }}>✕</button>
            </div>
            <div id="modalBody" style={{ marginTop: 12, color: "var(--text-dark)" }}>{modal.body}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorDashboard;
