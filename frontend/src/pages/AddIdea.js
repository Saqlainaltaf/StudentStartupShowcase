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
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  async function uploadFile() {
    if (!file) return null;
    const fd = new FormData();
    fd.append("file", file);
    const token = localStorage.getItem("token");
    const res = await axios.post(`${API_BASE}/api/uploads`, fd, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      },
      onUploadProgress: (e) => {
        if (e.total) setUploadProgress(Math.round((e.loaded * 100) / e.total));
      }
    });
    return res.data; // { url, filename, originalName, size, resource_type }
  }

  async function submit(e){
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) { alert("Please login first."); setLoading(false); return; }

      // If user added a file, upload it first
      let docMeta = null;
      if (file) {
        docMeta = await uploadFile();
      }

      const payload = {
        ...form,
        skillsNeeded: form.skillsNeeded.split(",").map(s => s.trim()).filter(Boolean),
        supportingDocument: docMeta ? {
          url: docMeta.url,
          filename: docMeta.filename,
          originalName: docMeta.originalName,
          size: docMeta.size,
          resource_type: docMeta.resource_type
        } : undefined
      };

      await axios.post(`${API_BASE}/api/ideas`, payload, { headers: { Authorization: `Bearer ${token}` }});
      alert("Idea submitted — pending admin approval.");
      navigate("/");
    } catch (err) {
      console.error("Submit idea error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Submission failed.");
    } finally { setLoading(false); setUploadProgress(0); }
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

            <label className="form-label mt-2">Supporting document (PDF, PNG, JPG, DOCX)</label>
            <input className="form-control mb-2" type="file" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" onChange={e => setFile(e.target.files[0])} />
            {file && <div className="small text-muted mb-2">Selected: {file.name} • {(file.size/1024).toFixed(0)} KB</div>}
            {uploadProgress > 0 && <div className="mb-2"><div className="progress"><div className="progress-bar" role="progressbar" style={{width: `${uploadProgress}%`}}>{uploadProgress}%</div></div></div>}
            <div className="d-grid">
              <button className="btn btn-success" disabled={loading}>{loading ? "Submitting…" : "Submit idea"}</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
