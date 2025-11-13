// frontend/src/pages/MyApplications.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../config";

export default function MyApplications() {
  const [apps, setApps] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setApps([]);
        setLoading(false);
        return;
      }
      const res = await axios.get(`${API_BASE}/api/applications/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApps(res.data || []);
    } catch (err) {
      console.error("Failed to load applications:", err.response?.data || err.message);
      setApps([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <p>Loading…</p>;

  if (!apps || apps.length === 0) {
    return <div className="card p-3"><p className="mb-0">You don't have any applications yet.</p></div>;
  }

  return (
    <div>
      <h3>My Applications</h3>
      {apps.map(a => (
        <div className="card mb-3" key={a._id}>
          <div className="card-body d-flex justify-content-between">
            <div>
              <h5 className="mb-1">{a.ideaId?.title || "—"}</h5>
              <div className="text-muted small mb-2">{new Date(a.createdAt).toLocaleString()}</div>
              <p className="mb-1">{a.message}</p>
              <div className="small text-muted">
                Contact: {a.contact?.email || "—"} {a.contact?.phone ? ` • ${a.contact.phone}` : ""}
              </div>
            </div>
            <div className="text-end">
              <div>
                <span className={
                  a.status === "accepted" ? "badge bg-success" :
                  a.status === "rejected" ? "badge bg-danger" : "badge bg-secondary"
                }>
                  {a.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
