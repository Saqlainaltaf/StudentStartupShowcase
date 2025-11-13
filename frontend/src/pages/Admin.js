// frontend/src/pages/Admin.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import StarterFilters from "../components/StartupFilters"; // ensure path
import { API_BASE } from "../config";
import { useNavigate } from "react-router-dom";

export default function Admin(){
  const [ideas, setIdeas] = useState([]);
  const [filters, setFilters] = useState({ q: "", category: "", currentStage: "", skill: "" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function fetchAll(){
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return; }
      // call search endpoint with admin token to filter; search returns only approved by default, so to include pending,
      // we fall back to using /api/ideas/all and filter client-side for 'all' view
      const res = await axios.get(`${API_BASE}/api/ideas/all`, { headers: { Authorization: `Bearer ${token}` }});
      setIdeas(res.data);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally { setLoading(false); }
  }

  useEffect(()=>{ fetchAll(); }, []);

  // client-side filter for admin view
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
    // same approve logic as before
  }
  async function toggleFeature(id){ /* same as existing */ }

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
          {loading ? <p>Loading…</p> :
            (filtered.length === 0 ? <div className="alert alert-info">No startups match filters.</div> :
              filtered.map(i => (
                <div className="card mb-3" key={i._id}>
                  <div className="card-body d-flex justify-content-between">
                    <div>
                      <h5>{i.title} <small className="text-muted">({i.status})</small></h5>
                      <p className="mb-1">{i.shortDescription}</p>
                      <small className="text-muted">Stage: {i.currentStage} • Category: {i.category}</small>
                    </div>
                    <div className="text-end">
                      {/* reuse existing approve / feature buttons */}
                      {/* ... */}
                    </div>
                  </div>
                </div>
              ))
            )
          }
        </div>
      </div>
    </div>
  );
}
