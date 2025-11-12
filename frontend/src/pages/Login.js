import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login(){
  const [form, setForm] = useState({ email:"", password:"" });
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("Logged in");
      navigate(res.data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err){
      alert(err.response?.data?.message || err.message);
    }
  }

  return (
    <div className="card p-4">
      <h3>Login</h3>
      <form onSubmit={submit}>
        <div className="mb-2"><input className="form-control" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
        <div className="mb-3"><input type="password" className="form-control" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} /></div>
        <button className="btn btn-primary">Login</button>
      </form>
      <div className="mt-2 text-muted">Admin quick login: email <code>admin</code> password <code>admin</code></div>
    </div>
  );
}
