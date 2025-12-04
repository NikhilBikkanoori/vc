import React, { useRef, useState } from "react";

export default function AdminFees({ fees, setFees, escapeHtml }) {
  const feeFormRef = useRef();
  const [feeEditIdx, setFeeEditIdx] = useState(null);

  function handleFeeSubmit(e) {
    e.preventDefault();
    const form = new FormData(feeFormRef.current);
    const roll = form.get("roll")?.trim();
    const total = form.get("total");
    const paid = form.get("paid");
    if (!roll) return alert("Roll required");
    if (feeEditIdx !== null) {
      setFees((arr) => {
        const c = [...arr];
        c[feeEditIdx] = { roll, total, paid };
        return c;
      });
      setFeeEditIdx(null);
      feeFormRef.current.reset();
      return;
    }
    setFees((f) => [...f, { roll, total, paid }]);
    feeFormRef.current.reset();
  }

  function del(idx) {
    setFees((s) => s.filter((_, i) => i !== idx));
  }

  return (
    <section>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Fees</h2>
      </div>
      <form
        ref={feeFormRef}
        onSubmit={handleFeeSubmit}
        className="grid grid-cols-3 gap-3 bg-white p-4 rounded shadow mt-4"
      >
        <input
          name="roll"
          placeholder="Roll"
          className="border p-2 rounded text-gray-800 bg-white"
          required
        />
        <input
          name="total"
          type="number"
          placeholder="Total Fee"
          className="border p-2 rounded text-gray-800 bg-white"
          required
        />
        <input
          name="paid"
          type="number"
          placeholder="Paid Fee"
          className="border p-2 rounded text-gray-800 bg-white"
          required
        />
        <button
          type="submit"
          className="col-span-3 bg-purple-600 text-white py-2 rounded"
        >
          Save Fee
        </button>
      </form>
      {/* <ul className="mt-4 space-y-2">{fees.map((f,i)=> (
        <li key={i} className="bg-white p-3 flex justify-between rounded"> <div>{escapeHtml(f.roll)} - Paid: {escapeHtml(f.paid)}/{escapeHtml(f.total)}</div> <div className="flex gap-2"><button onClick={()=>{ feeFormRef.current.roll.value=f.roll; feeFormRef.current.total.value=f.total; feeFormRef.current.paid.value=f.paid; setFeeEditIdx(i); }} className="bg-blue-500 text-white px-2 py-1 rounded text-sm">Edit</button><button onClick={()=>{ if(confirm('Delete fee?')) del('fees', i); }} className="bg-red-500 text-white px-2 py-1 rounded text-sm">Delete</button></div></li>
      ))}</ul> */}
    </section>
  );
}
