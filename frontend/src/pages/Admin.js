// frontend/src/pages/Admin.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../config";
import { useNavigate } from "react-router-dom";

export default function Admin(){
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const navigate = useNavigate();

  // fetch all ideas (admin only)
  async function fetchAll(){
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login as admin.");
        navigate("/login");
        return;
      }
      const res = await axios.get(`${API_BASE}/api/ideas/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIdeas(res.data || []);
    } catch (err) {
      console.error("Fetch all ideas error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to load ideas. Check console.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Approve idea
  async function approve(id){
    if (!window.confirm("Approve this startup? It will become public.")) return;
    setActionLoadingId(id);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE}/api/ideas/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Approved.");
      await fetchAll();
    } catch (err) {
      console.error("Approve error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Approve failed");
    } finally {
      setActionLoadingId(null);
    }
  }

  // Toggle featured
  async function toggleFeature(id){
    // no confirm for toggle — but you can add if you like
    setActionLoadingId(id);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE}/api/ideas/feature/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Toggled featured status.");
      await fetchAll();
    } catch (err) {
      console.error("Feature toggle error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Toggle feature failed");
    } finally {
      setActionLoadingId(null);
    }
  }

  if (loading) return <div className="p-3">Loading…</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Admin — Review Startups</h3>
        <button className="btn btn-sm btn-outline-secondary" onClick={fetchAll}>Refresh</button>
      </div>

      {ideas.length === 0 ? (
        <div className="alert alert-info">No startups submitted yet.</div>
      ) : (
        ideas.map(i => (
          <div className="card mb-3" key={i._id}>
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h5 style={{marginBottom: 4}}>{i.title} <small className="text-muted">({i.status})</small></h5>
                  <div className="text-muted mb-2">{i.founders || i.createdBy?.name || "—"}</div>
                  <p style={{marginBottom: 6}} className="text-truncate">{i.shortDescription || i.problemStatement || "No description provided."}</p>
                  <div>
                    <small className="text-muted me-2">Stage: {i.currentStage || "N/A"}</small>
                    <small className="text-muted">Category: {i.category || "N/A"}</small>
                  </div>
                </div>

                <div className="text-end">
                  {/* Approve button */}
                  {i.status === "pending" ? (
                    <button
                      className="btn btn-sm btn-primary mb-2"
                      onClick={() => approve(i._id)}
                      disabled={actionLoadingId === i._id}
                    >
                      {actionLoadingId === i._id ? "Working…" : "Approve"}
                    </button>
                  ) : (
                    <span className="badge bg-success mb-2">Approved</span>
                  )}

                  <br />

                  {/* Feature toggle */}
                  <button
                    className={i.featured ? "btn btn-sm btn-outline-warning" : "btn btn-sm btn-outline-secondary"}
                    onClick={() => toggleFeature(i._id)}
                    disabled={actionLoadingId === i._id}
                  >
                    {actionLoadingId === i._id ? "Working…" : (i.featured ? "Unfeature" : "Feature")}
                  </button>

                  <div className="mt-2">
                    <a href={`/startup/${i._id}`} className="btn btn-sm btn-link">View profile</a>
                  </div>
                </div>
              </div>

              {/* Optional extra details collapsed */}
              <div className="mt-3">
                <small className="text-muted">Skills needed: {i.skillsNeeded?.join?.(", ") || "—"}</small>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
