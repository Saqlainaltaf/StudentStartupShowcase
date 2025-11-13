// frontend/src/pages/Profile.js
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { API_BASE } from "../config";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) {
        setUser(null);
        setLoading(false);
        return;
      }
      const parsed = JSON.parse(raw);
      setUser(parsed);
      setForm({
        name: parsed.name || "",
        email: parsed.email || "",
        phone: parsed.phone || ""
      });
      setLoading(false);
    } catch (err) {
      console.error("loadUser", err);
      setUser(null);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  async function saveProfile(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login to update profile.");
      // Attempt to update backend profile (if endpoint exists), otherwise update localStorage
      try {
        const res = await axios.put(
          `${API_BASE}/api/auth/profile`,
          { name: form.name, phone: form.phone },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // prefer server response if provided
        const updated = res.data || { ...user, name: form.name, phone: form.phone };
        localStorage.setItem("user", JSON.stringify(updated));
        setUser(updated);
      } catch (err) {
        // If backend endpoint doesn't exist, fall back to local update
        console.warn("Profile save to server failed, falling back to local:", err.message || err);
        const updated = { ...user, name: form.name, phone: form.phone };
        localStorage.setItem("user", JSON.stringify(updated));
        setUser(updated);
      }
      setEditing(false);
      alert("Profile updated.");
    } catch (err) {
      console.error("saveProfile", err);
      alert(err.response?.data?.message || "Failed to update profile.");
    }
  }

  if (loading) return <p>Loading…</p>;
  if (!user) return <div className="card p-3">You are not logged in. <a href="/login">Login</a></div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Your Profile</h3>
        <div>
          <button className="btn btn-sm btn-ghost me-2" onClick={() => setEditing(!editing)}>
            {editing ? "Cancel" : "Edit"}
          </button>
          <button className="btn btn-sm btn-accent" onClick={() => { navigator.clipboard.writeText(localStorage.getItem("token") || ""); alert("Token copied (if present)"); }}>
            Copy token
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card p-3">
            <div className="mb-3">
              <strong>Name</strong>
              <div className="text-muted">{user.name || "—"}</div>
            </div>
            <div className="mb-3">
              <strong>Email</strong>
              <div className="text-muted">{user.email}</div>
            </div>
            <div className="mb-3">
              <strong>Role</strong>
              <div className="text-muted">{user.role || "student"}</div>
            </div>

            <div className="mb-3">
              <strong>Phone</strong>
              <div className="text-muted">{user.phone || "—"}</div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          {editing ? (
            <form className="card p-3" onSubmit={saveProfile}>
              <div className="mb-2">
                <label className="form-label">Name</label>
                <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="mb-2">
                <label className="form-label">Email (read-only)</label>
                <input className="form-control" value={form.email} disabled />
              </div>
              <div className="mb-2">
                <label className="form-label">Phone</label>
                <input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>

              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-accent">Save changes</button>
              </div>
            </form>
          ) : (
            <div className="card p-3">
              <h5>About</h5>
              <p className="text-muted">Update your profile so founders can contact you. Use the Edit button to change details.</p>

              <div className="mt-3">
                <a className="btn btn-outline-secondary me-2" href="/my-applications">My Applications</a>
                {user.role === "admin" && <a className="btn btn-outline-primary" href="/admin">Go to Admin</a>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
