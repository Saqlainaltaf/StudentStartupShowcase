// frontend/src/pages/ApplicationsAdmin.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../config";

export default function ApplicationsAdmin(){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doingId, setDoingId] = useState(null);

  async function fetchAll(){
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/api/applications/all`, { headers: { Authorization: `Bearer ${token}` }});
      setItems(res.data);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally { setLoading(false); }
  }

  useEffect(()=>{ fetchAll(); }, []);

  async function update(id, patch){
    setDoingId(id);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE}/api/applications/${id}`, patch, { headers: { Authorization: `Bearer ${token}` }});
      await fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally { setDoingId(null); }
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <h3>Applications</h3>
      {items.length === 0 ? <p>No applications yet.</p> : items.map(a => (
        <div className="card mb-2" key={a._id}>
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <h5>{a.ideaId?.title || "—"}</h5>
                <div><strong>Applicant:</strong> {a.userId?.name} • {a.userId?.email}</div>
                <div className="text-muted small">{new Date(a.createdAt).toLocaleString()}</div>
                <p className="mt-2">{a.message}</p>
                <div><small>Contact: {a.contact?.email || "—"} {a.contact?.phone ? ` • ${a.contact.phone}` : ""}</small></div>
                {a.assignedToStartupRole && <div><small className="text-success">Assigned: {a.assignedToStartupRole}</small></div>}
              </div>

              <div className="text-end">
                <div className="mb-2">
                  <button className="btn btn-sm btn-success me-2" disabled={doingId===a._id} onClick={()=>update(a._id, { status: "accepted" })}>Accept</button>
                  <button className="btn btn-sm btn-danger" disabled={doingId===a._id} onClick={()=>update(a._id, { status: "rejected" })}>Reject</button>
                </div>
                <div>
                  <button className="btn btn-sm btn-outline-secondary" onClick={()=>{ const role = prompt("Assign role/title to applicant (e.g. Frontend dev)"); if (role) update(a._id, { assignedToStartupRole: role }); }}>Assign role</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
