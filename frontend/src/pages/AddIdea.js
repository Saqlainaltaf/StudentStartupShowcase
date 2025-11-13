// frontend/src/pages/AddIdea.js
import React, { useState } from "react";
import axios from "axios";
import { API_BASE } from "../config";
import { useNavigate } from "react-router-dom";

export default function AddIdea(){
  const [form, setForm] = useState({
    title: "",
    logoUrl: "",
    founders: "",
    contactEmail: "",
    contactPhone: "",
    shortDescription: "",
    problemStatement: "",
    solution: "",
    currentStage: "Ideation",
    teamMembers: "",
    skillsNeeded: "",
    achievements: "",
    mentor: "",
    callToAction: "",
    category: ""
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function submit(e){
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login first.");
      // skillsNeeded: store as array separated by commas
      const payload = { ...form, skillsNeeded: form.skillsNeeded.split(",").map(s => s.trim()).filter(Boolean) };
      await axios.post(`${API_BASE}/api/ideas`, payload, { headers: { Authorization: `Bearer ${token}` }});
      alert("Idea submitted — pending admin approval.");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally { setLoading(false); }
  }

  return (
    <div className="card p-4">
      <h3>Submit Startup Idea</h3>
      <form onSubmit={submit}>
        <div className="row">
          <div className="col-md-8">
            <input className="form-control mb-2" placeholder="Startup name" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required />
            <input className="form-control mb-2" placeholder="Short description (1-2 lines)" value={form.shortDescription} onChange={e=>setForm({...form,shortDescription:e.target.value})} required />
            <textarea className="form-control mb-2" placeholder="Problem statement" value={form.problemStatement} onChange={e=>setForm({...form,problemStatement:e.target.value})} required />
            <textarea className="form-control mb-2" placeholder="Solution summary" value={form.solution} onChange={e=>setForm({...form,solution:e.target.value})} required />
            <textarea className="form-control mb-2" placeholder="Team members & roles" value={form.teamMembers} onChange={e=>setForm({...form,teamMembers:e.target.value})} />
            <input className="form-control mb-2" placeholder="Achievements / traction" value={form.achievements} onChange={e=>setForm({...form,achievements:e.target.value})} />
            <input className="form-control mb-2" placeholder="Mentor name (optional)" value={form.mentor} onChange={e=>setForm({...form,mentor:e.target.value})} />
            <input className="form-control mb-2" placeholder="Call to action (URL or text)" value={form.callToAction} onChange={e=>setForm({...form,callToAction:e.target.value})} />
          </div>

          <div className="col-md-4">
            <input className="form-control mb-2" placeholder="Founders (name, year/program)" value={form.founders} onChange={e=>setForm({...form,founders:e.target.value})} />
            <input className="form-control mb-2" placeholder="Category / Domain (e.g., Edtech)" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} />
            <select className="form-select mb-2" value={form.currentStage} onChange={e=>setForm({...form,currentStage:e.target.value})}>
              <option>Ideation</option><option>Prototype</option><option>MVP</option><option>Market-ready</option>
            </select>
            <input className="form-control mb-2" placeholder="Skills needed (comma separated)" value={form.skillsNeeded} onChange={e=>setForm({...form,skillsNeeded:e.target.value})} />
            <input className="form-control mb-2" placeholder="Logo URL (optional)" value={form.logoUrl} onChange={e=>setForm({...form,logoUrl:e.target.value})} />
            <input className="form-control mb-2" placeholder="Contact email" value={form.contactEmail} onChange={e=>setForm({...form,contactEmail:e.target.value})} />
            <input className="form-control mb-2" placeholder="Contact phone" value={form.contactPhone} onChange={e=>setForm({...form,contactPhone:e.target.value})} />
            <div className="d-grid">
              <button className="btn btn-success" disabled={loading}>{loading ? "Submitting…" : "Submit idea"}</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
