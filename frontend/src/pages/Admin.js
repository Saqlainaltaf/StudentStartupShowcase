// frontend/src/pages/Admin.js
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import StartupFilters from "../components/StartupFilters";
import { API_BASE } from "../config";
import { useNavigate } from "react-router-dom";

export default function Admin(){
  const [ideas, setIdeas] = useState([]);
  const [filters, setFilters] = useState({ q: "", category: "", currentStage: "", skill: "" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return; }
      const res = await axios.get(`${API_BASE}/api/ideas/all`, { headers: { Authorization: `Bearer ${token}` }});
      setIdeas(res.data || []);
    } catch (err) {
      console.error("fetchAll error:", err.response?.data || err.message);
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
    // fetchAll intentionally has no deps that change during component lifetime
  }, [navigate]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const filtered = ideas.filter(i => {
    if (filters.category && i.category !== filters.category) return false;
    if (filters.currentStage && i.currentStage !== filters.currentStage) return false;
    if (filters.skill && !(i.skillsNeeded || []).some(s => s.toLowerCase().includes(filters.skill.toLowerCase()))) return false;
    if (filters.q) {
      const q = filters.q.toLowerCase();
      const hay = `${i.title} ${i.shortDescription} ${i.problemStatement} ${i.solution} ${i.founders}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  async function approve(id){
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE}/api/ideas/approve/${id}`, {}, { headers: { Authorization: `Bearer ${token}` }});
      await fetchAll();
    } catch (err) {
      console.error("approve error:", err.response?.data || err.message);
      alert(err.response?.data?.message || err.message);
    }
  }

  async function toggleFeature(id){
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE}/api/ideas/feature/${id}`, {}, { headers: { Authorization: `Bearer ${token}` }});
      await fetchAll();
    } catch (err) {
      console.error("toggleFeature error:", err.response?.data || err.message);
      alert(err.response?.data?.message || err.message);
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Admin — Manage Startups</h3>
        <button className="btn btn-sm btn-outline-secondary" onClick={fetchAll}>Refresh</button>
      </div>

      <div className="row">
        <div className="col-md-3">
          <div className="card p-3 mb-3">
            <h6>Filters</h6>
            <StartupFilters values={filters} onChange={(next) => setFilters({...filters, ...next})} />
          </div>
        </div>

        <div className="col-md-9">
          {loading ? <p>Loading…</p> : (
            filtered.length === 0 ? <div className="alert alert-info">No startups match filters.</div> :
            filtered.map(i => (
              <div className="card mb-3" key={i._id}>
                <div className="card-body d-flex justify-content-between">
                  <div>
                    <h5>{i.title} <small className="text-muted">({i.status})</small></h5>
                    <p className="mb-1">{i.shortDescription}</p>
                    <small className="text-muted">Stage: {i.currentStage} • Category: {i.category}</small>
                  </div>

                  <div className="text-end">
                    {i.status === "pending" ? (
                      <button className="btn btn-sm btn-primary mb-2" onClick={() => approve(i._id)}>Approve</button>
                    ) : (
                      <span className="badge bg-success mb-2">Approved</span>
                    )}
                    <br />
                    <button
                      className={i.featured ? "btn btn-sm btn-outline-warning" : "btn btn-sm btn-outline-secondary"}
                      onClick={() => toggleFeature(i._id)}
                    >
                      {i.featured ? "Unfeature" : "Feature"}
                    </button>
                    <div className="mt-2">
                      <a href={`/startup/${i._id}`} className="btn btn-sm btn-link">View profile</a>
                    </div>
                  </div>
                </div>
                <div className="mt-3 p-2">
                  <small className="text-muted">Skills needed: {i.skillsNeeded?.join?.(", ") || "—"}</small>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
