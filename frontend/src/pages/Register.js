import React, { useState } from "react";
import axios from "axios";
import { API_BASE } from "../config";
import { useNavigate } from "react-router-dom";

export default function Register(){
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/api/auth/register`, form);
      alert("Registered. Login now.");
      navigate("/login");
    } catch (err){
      alert(err.response?.data?.message || err.message);
    }
  }

  return (
    <div className="card p-4">
      <h3>Register</h3>
      <form onSubmit={submit}>
        <div className="mb-2"><input className="form-control" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
        <div className="mb-2"><input className="form-control" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
        <div className="mb-3"><input type="password" className="form-control" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} /></div>
        <button className="btn btn-success">Register</button>
      </form>
    </div>
  );
}
