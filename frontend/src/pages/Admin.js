import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../config";

export default function Admin(){
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchAll(){
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/api/ideas/all`, { headers: { Authorization: `Bearer ${token}` }});
      setIdeas(res.data);
    } catch (err){
      alert(err.response?.data?.message || err.message);
    } finally { setLoading(false); }
  }

  useEffect(()=>{ fetchAll(); }, []);

  async function approve(id){
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE}/api/ideas/approve/${id}`, {}, { headers: { Authorization: `Bearer ${token}` }});
      alert("Idea approved");
      fetchAll();
    } catch (err){
      alert(err.response?.data?.message || err.message);
    }
  }

  if (loading) return <p>Loading…</p>;
  return (
    <div>
      <h3>Admin — Approve Ideas</h3>
      {ideas.length === 0 ? <p>No ideas yet.</p> :
        ideas.map(i => (
          <div className="card mb-2" key={i._id}>
            <div className="card-body">
              <h5>{i.title} <small className="text-muted">({i.status})</small></h5>
              <p>{i.problemStatement}</p>
              <p><strong>By:</strong> {i.createdBy?.name || "Unknown"}</p>
              {i.status === "pending" && <button className="btn btn-sm btn-primary" onClick={()=>approve(i._id)}>Approve</button>}
            </div>
          </div>
        ))
      }
    </div>
  );
}
