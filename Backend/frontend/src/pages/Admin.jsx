// import React, { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";
// import { API_BASE } from "../config";

// export default function Admin() {
//   const [chals, setChals] = useState([]);
//   const [form, setForm] = useState({
//     title: "",
//     difficulty: "Easy",
//     category: "Web",
//     description: "",
//     solution: "",
//     hint: "",
//     level: 1
//   });

//   const fetchAll = () => {
//     fetch(`${API_BASE}/admin/challenges_all`)
//       .then(r => r.json())
//       .then(setChals);
//   };

//   useEffect(fetchAll, []);

//   const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const addChallenge = async (e) => {
//     e.preventDefault();
//     await fetch(`${API_BASE}/admin/challenges`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ ...form, level: Number(form.level) })
//     });
//     setForm({ title:"", difficulty:"Easy", category:"Web", description:"", solution:"", hint:"", level:1 });
//     fetchAll();
//   };

//   const deleteChallenge = async (id) => {
//     await fetch(`${API_BASE}/admin/challenges/${id}`, { method: "DELETE" });
//     fetchAll();
//   };

//   return (
//     <div>
//       <Navbar />
//       <div style={{ display:"flex" }}>
//         <Sidebar />
//         <main className="container">
//           <h1 style={{ color:"var(--cyan)" }}>Admin Panel</h1>

//           {/* Add Challenge */}
//           <form onSubmit={addChallenge} className="card" style={{ marginBottom:"20px" }}>
//             <h3 style={{ color:"var(--muted)" }}>Add Challenge</h3>

//             <input className="input" name="title" placeholder="Title" value={form.title} onChange={onChange} required />
//             <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
//               <select className="input" name="difficulty" value={form.difficulty} onChange={onChange}>
//                 <option>Easy</option><option>Medium</option><option>Hard</option><option>Insane</option>
//               </select>
//               <select className="input" name="category" value={form.category} onChange={onChange}>
//                 <option>Web</option><option>Cryptography</option><option>Forensics</option><option>Reverse</option><option>AI</option>
//               </select>
//             </div>

//             <textarea className="input" name="description" placeholder="Description" value={form.description} onChange={onChange}></textarea>
//             <textarea className="input" name="hint" placeholder="Hint" value={form.hint} onChange={onChange}></textarea>
//             <textarea className="input" name="solution" placeholder="Solution (flag)" value={form.solution} onChange={onChange}></textarea>

//             <input className="input" type="number" name="level" min="1" max="5" value={form.level} onChange={onChange} />
//             <button className="btn btn-green" type="submit">Add Challenge</button>
//           </form>

//           {/* List & View */}
//           <h3 style={{ color:"var(--muted)" }}>Existing Challenges</h3>
//           <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:"12px" }}>
//             {chals.map(c => (
//               <div key={c.id} className="card" style={{ position:"relative" }}>
//                 <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
//                   <div>
//                     <b>{c.title}</b> — {c.category} (Level {c.level})
//                   </div>
//                   <button className="btn" onClick={() => deleteChallenge(c.id)}>Delete</button>
//                 </div>

//                 <div style={{ marginTop:"8px", color:"var(--muted)" }}>
//                   <p><b>Difficulty:</b> {c.difficulty}</p>
//                   <p><b>Description:</b> {c.description || "—"}</p>
//                   <p><b>Hint:</b> {c.hint || "—"}</p>
//                   <p><b>Solution:</b> {c.solution || "—"}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
