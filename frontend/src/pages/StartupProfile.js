// frontend/src/pages/StartupProfile.js
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_BASE } from "../config";

export default function StartupProfile(){
  const { id } = useParams();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApply, setShowApply] = useState(false);
  const [appForm, setAppForm] = useState({ message: "", contactEmail: "", contactPhone: "" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/ideas/${id}`);
      setIdea(res.data);
    } catch (err) {
      console.error("load idea:", err.response?.data || err.message);
      setIdea(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const submitApplication = useCallback(async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login to apply.");
      await axios.post(`${API_BASE}/api/applications`, {
        ideaId: id,
        message: appForm.message,
        contact: { email: appForm.contactEmail, phone: appForm.contactPhone }
      }, { headers: { Authorization: `Bearer ${token}` }});
      alert("Application submitted.");
      setShowApply(false);
      setAppForm({ message: "", contactEmail: "", contactPhone: "" });
    } catch (err) {
      console.error("submit application:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Application failed.");
    }
  }, [id, appForm]);

  if (loading) return <p>Loading…</p>;
  if (!idea) return <p>Startup not found or not visible.</p>;

  return (
    <div>
      <div className="d-flex align-items-center mb-3">
        <img src={idea.logoUrl || "/placeholder-logo.png"} style={{width:120,height:120,objectFit:"cover"}} className="me-3 rounded" alt={idea.title}/>
        <div>
          <h2>{idea.title}</h2>
          <div className="text-muted">{idea.founders}</div>
          <div className="mt-2"><strong>Stage:</strong> {idea.currentStage}</div>
        </div>
      </div>

      <p><strong>Short:</strong> {idea.shortDescription}</p>
      <h5>Problem</h5><p>{idea.problemStatement}</p>
      <h5>Solution</h5><p>{idea.solution}</p>

      <h5>Team & Roles</h5><p>{idea.teamMembers}</p>

      <h5>Skills Needed</h5><p>{idea.skillsNeeded?.join?.(", ")}</p>

      <h5>Achievements</h5><p>{idea.achievements}</p>

      <h5>Mentor</h5><p>{idea.mentor}</p>

      <h5>Contact</h5>
      <p>
        {idea.contact?.email && <div>Email: {idea.contact.email}</div>}
        {idea.contact?.phone && <div>Phone: {idea.contact.phone}</div>}
        {idea.contact?.form && <div><a href={idea.contact.form}>Apply / Contact</a></div>}
      </p>

      <div className="my-3">
        <a className="btn btn-outline-primary me-2"
           href={`https://wa.me/916364330786?text=${encodeURIComponent(`Hi, I want to join ${idea.title}. Please connect me.`)}`}
           target="_blank" rel="noreferrer">
          Apply via WhatsApp
        </a>

        <button className="btn btn-primary" onClick={()=>setShowApply(true)}>Apply to Join</button>
      </div>

      {showApply && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog" role="document">
            <form className="modal-content" onSubmit={submitApplication}>
              <div className="modal-header">
                <h5 className="modal-title">Apply to join {idea.title}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={()=>setShowApply(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-2">
                  <label className="form-label">Message</label>
                  <textarea className="form-control" value={appForm.message} onChange={e=>setAppForm({...appForm, message: e.target.value})} required />
                </div>
                <div className="mb-2">
                  <label className="form-label">Contact email</label>
                  <input className="form-control" value={appForm.contactEmail} onChange={e=>setAppForm({...appForm, contactEmail: e.target.value})} />
                </div>
                <div className="mb-2">
                  <label className="form-label">Phone</label>
                  <input className="form-control" value={appForm.contactPhone} onChange={e=>setAppForm({...appForm, contactPhone: e.target.value})}/>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={()=>setShowApply(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Send application</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
