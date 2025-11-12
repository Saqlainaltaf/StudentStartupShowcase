import React, { useState } from "react";
import axios from "axios";
import { API_BASE } from "../config";
import { useNavigate } from "react-router-dom";

export default function AddIdea(){
  const [form, setForm] = useState({ title:"", problemStatement:"", solution:"", targetMarket:"", teamMembers:"", category:"" });
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if(!token) return alert("Please login first.");
      await axios.post(`${API_BASE}/api/ideas`, form, { headers: { Authorization: `Bearer ${token}` }});
      alert("Idea submitted (pending)");
      navigate("/");
    } catch (err){
      alert(err.response?.data?.message || err.message);
    }
  }

  return (
    <div className="card p-4">
      <h3>Submit Idea</h3>
      <form onSubmit={submit}>
        <input className="form-control mb-2" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
        <textarea className="form-control mb-2" placeholder="Problem statement" value={form.problemStatement} onChange={e=>setForm({...form,problemStatement:e.target.value})}></textarea>
        <textarea className="form-control mb-2" placeholder="Solution" value={form.solution} onChange={e=>setForm({...form,solution:e.target.value})}></textarea>
        <input className="form-control mb-2" placeholder="Target market" value={form.targetMarket} onChange={e=>setForm({...form,targetMarket:e.target.value})} />
        <input className="form-control mb-2" placeholder="Team members" value={form.teamMembers} onChange={e=>setForm({...form,teamMembers:e.target.value})} />
        <input className="form-control mb-3" placeholder="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} />
        <button className="btn btn-success">Submit Idea</button>
      </form>
    </div>
  );
}
