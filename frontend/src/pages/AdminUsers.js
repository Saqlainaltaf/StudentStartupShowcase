// frontend/src/pages/AdminUsers.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../config";
import { useNavigate } from "react-router-dom";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20, pages: 0 });
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUsers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchUsers(page = 1) {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        limit: meta.limit,
      };
      if (q) params.q = q;
      if (role) params.role = role;
      const res = await axios.get(`${API_BASE}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });
      setUsers(res.data.data || []);
      setMeta(res.data.meta || { total: 0, page, limit: 20, pages: 0 });
    } catch (err) {
      console.error("fetchUsers error:", err);
      setError(err.response?.data?.message || err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  function onSearch(e) {
    e.preventDefault();
    fetchUsers(1);
  }

  function onPage(nextPage) {
    if (nextPage < 1 || nextPage > meta.pages) return;
    fetchUsers(nextPage);
  }

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3>Registered Users</h3>
        <div className="text-muted small">{meta.total} users</div>
      </div>

      <form className="row g-2 mb-3" onSubmit={onSearch}>
        <div className="col-md-5">
          <input
            className="form-control"
            placeholder="Search by name or email"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">All roles</option>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
            <option value="faculty">Faculty</option>
          </select>
        </div>
        <div className="col-auto">
          <button className="btn btn-accent" type="submit">Search</button>
        </div>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive card p-0">
        <table className="table mb-0">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Program / Year</th>
              <th>Phone</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-4">Loading…</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-4 text-muted">No users found</td></tr>
            ) : users.map(u => (
              <tr key={u._id}>
                <td>{u.name || <em>—</em>}</td>
                <td><a href={`mailto:${u.email}`}>{u.email}</a></td>
                <td>{u.role}</td>
                <td>{u.program ? `${u.program}${u.year ? ` • ${u.year}` : ""}` : (u.year || "—")}</td>
                <td>{u.phone || "—"}</td>
                <td>{new Date(u.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="d-flex align-items-center justify-content-between mt-3">
        <div className="small text-muted">Showing page {meta.page} of {meta.pages}</div>
        <div>
          <button className="btn btn-sm btn-ghost me-2" onClick={() => onPage(meta.page - 1)} disabled={meta.page <= 1}>Prev</button>
          <button className="btn btn-sm btn-ghost" onClick={() => onPage(meta.page + 1)} disabled={meta.page >= meta.pages}>Next</button>
        </div>
      </div>
    </div>
  );
}
