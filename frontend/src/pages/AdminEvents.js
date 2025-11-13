// frontend/src/pages/AdminEvents.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../config";

export default function AdminEvents(){
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title:"", description:"", start:"", end:"", venue:"", link:"" });

  async function fetchAll(){
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/api/events`, { headers: { Authorization: `Bearer ${token}` }});
      setEvents(res.data);
    } catch (err) { console.error(err); }
  }
  useEffect(()=>{ fetchAll(); }, []);

  async function create(e){
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE}/api/events`, form, { headers: { Authorization: `Bearer ${token}` }});
      setForm({ title:"", description:"", start:"", end:"", venue:"", link:"" });
      fetchAll();
    } catch (err) { alert(err.response?.data?.message || err.message); }
  }

  async function remove(id){
    if (!confirm("Delete event?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/api/events/${id}`, { headers: { Authorization: `Bearer ${token}` }});
      fetchAll();
    } catch (err) { alert(err.response?.data?.message || err.message); }
  }

  return (
    <div>
      <h3>Events — Admin</h3>
      <form onSubmit={create} className="card p-3 mb-3">
        <input className="form-control mb-2" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required />
        <input className="form-control mb-2" type="datetime-local" value={form.start} onChange={e=>setForm({...form,start:e.target.value})} required />
        <input className="form-control mb-2" type="datetime-local" value={form.end} onChange={e=>setForm({...form,end:e.target.value})} />
        <input className="form-control mb-2" placeholder="Venue" value={form.venue} onChange={e=>setForm({...form,venue:e.target.value})} />
        <input className="form-control mb-2" placeholder="Registration link" value={form.link} onChange={e=>setForm({...form,link:e.target.value})} />
        <textarea className="form-control mb-2" placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
        <button className="btn btn-primary">Create event</button>
      </form>

      <div>
        {events.map(ev => (
          <div key={ev._id} className="card mb-2 p-2">
            <div className="d-flex justify-content-between">
              <div>
                <h5>{ev.title}</h5>
                <div className="text-muted">{new Date(ev.start).toLocaleString()}</div>
                <p>{ev.description}</p>
              </div>
              <div>
                <button className="btn btn-sm btn-danger" onClick={()=>remove(ev._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
