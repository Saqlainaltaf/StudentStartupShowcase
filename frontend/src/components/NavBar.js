// frontend/src/components/NavBar.js
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../config";

function initialsFromName(name) {
  if (!name) return "U";
  return name.split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase();
}

export default function NavBar() {
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState({ pendingApplications: 0, pendingIdeas: 0, featuredCount: 0 });
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  // Read user from localStorage
  const readUser = useCallback(() => {
    try {
      const raw = localStorage.getItem("user");
      setUser(raw ? JSON.parse(raw) : null);
    } catch {
      setUser(null);
    }
  }, []);

  // Fetch admin summary (counts). Only when user.role === 'admin'
  const fetchSummary = useCallback(async () => {
    try {
      if (!user || user.role !== "admin") return;
      const token = localStorage.getItem("token");
      if (!token) return;
      setLoadingSummary(true);
      const res = await axios.get(`${API_BASE}/api/admin/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummary(res.data || { pendingApplications: 0, pendingIdeas: 0, featuredCount: 0 });
    } catch (err) {
      // fail silently — summary is non-critical
      console.warn("Admin summary load failed:", err?.response?.data || err?.message || err);
    } finally {
      setLoadingSummary(false);
    }
  }, [user]);

  useEffect(() => {
    readUser();

    // storage listener for other tabs
    function onStorage(e) {
      if (e.key === "user" || e.key === "token") readUser();
    }
    window.addEventListener("storage", onStorage);

    // custom same-tab event
    function onLocalLogin() { readUser(); }
    window.addEventListener("local-login", onLocalLogin);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("local-login", onLocalLogin);
    };
  }, [readUser]);

  // Refresh summary when user becomes admin
  useEffect(() => {
    fetchSummary();
    // refresh periodically while admin is active (e.g., every 60s)
    let t;
    if (user?.role === "admin") t = setInterval(fetchSummary, 60000);
    return () => clearInterval(t);
  }, [user, fetchSummary]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("local-login"));
    setUser(null);
    navigate("/");
  }

  // Search handling with debounce: navigate on Enter or when debounce triggers
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (query && query.length >= 2) {
        navigate(`/directory?q=${encodeURIComponent(query)}`);
        setSearchOpen(false);
      }
    }, 700);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, navigate]);

  function onSearchSubmit(e) {
    e.preventDefault();
    if (!query) return;
    navigate(`/directory?q=${encodeURIComponent(query)}`);
    setSearchOpen(false);
  }

  // Render avatar or initials
  const Avatar = ({ u, size = 32 }) => {
    if (!u) return <div style={{width:size,height:size,borderRadius:8,background:"#e9ecef",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:12}}>{initialsFromName(null)}</div>;
    if (u.avatar) {
      return <img src={u.avatar} alt={u.name || u.email || "avatar"} style={{width:size,height:size,objectFit:"cover",borderRadius:8}}/>;
    }
    return <div style={{width:size,height:size,borderRadius:8,background:"#e9ecef",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600}}>{initialsFromName(u.name || u.email)}</div>;
  };

  return (
    <nav className="navbar navbar-expand-md site-nav" role="navigation" aria-label="Main">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/" aria-label="Homepage">
          <img src="/logo192.png" alt="logo" style={{ width: 40, height: 40, marginRight: 10, borderRadius: 8 }} />
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontWeight: 700 }}>Startup Club</div>
            <small className="text-muted">Idea Showcase</small>
          </div>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto align-items-md-center">

            <li className="nav-item">
              <NavLink className="nav-link" to="/directory">Startups</NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/events">Events</NavLink>
            </li>

            {/* Inline search (small) */}
            <li className="nav-item mx-2" style={{minWidth: 200}}>
              <form onSubmit={onSearchSubmit} className="d-flex" role="search" aria-label="Search startups">
                <input
                  className="form-control form-control-sm"
                  placeholder="Search startups, skills, founders..."
                  aria-label="Search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </form>
            </li>

            {/* Admin Add Event button */}
            {user?.role === "admin" && (
              <li className="nav-item ms-2 d-none d-md-block">
                <Link className="btn btn-sm btn-outline-primary" to="/admin/events" aria-label="Manage events">
                  Add / Manage Events
                </Link>
              </li>
            )}

            {/* Submit Idea */}
            <li className="nav-item ms-3 d-none d-md-block">
              <Link className="btn btn-sm btn-accent" to="/add-idea">Submit Idea</Link>
            </li>

            {/* Auth buttons */}
            {!user && (
              <>
                <li className="nav-item ms-2"><NavLink className="nav-link" to="/login">Login</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/register">Register</NavLink></li>
              </>
            )}

            {/* Notifications & User menu */}
            {user && (
              <>
                <li className="nav-item dropdown ms-3 me-1">
                  <button
                    className="btn btn-sm btn-ghost position-relative"
                    id="notifMenu"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    aria-label="Notifications"
                  >
                    <i className="bi bi-bell" aria-hidden="true" />
                    {/* show badge if admin and there are pending items */}
                    {user.role === "admin" && (summary.pendingApplications > 0 || summary.pendingIdeas > 0) && (
                      <span className="badge bg-danger text-white position-absolute" style={{ top: -6, right: -6, fontSize: 10 }}>
                        { (summary.pendingApplications || 0) + (summary.pendingIdeas || 0) }
                      </span>
                    )}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end p-2" aria-labelledby="notifMenu" style={{ minWidth: 260 }}>
                    <li className="small text-muted px-2">Notifications</li>
                    <li><hr className="dropdown-divider" /></li>
                    <li className="px-2">
                      <Link className="d-flex justify-content-between text-decoration-none" to="/admin/applications">
                        <div>Pending applications</div>
                        <div className="badge bg-secondary">{summary.pendingApplications ?? 0}</div>
                      </Link>
                    </li>
                    <li className="px-2">
                      <Link className="d-flex justify-content-between text-decoration-none" to="/admin">
                        <div>Pending startups</div>
                        <div className="badge bg-secondary">{summary.pendingIdeas ?? 0}</div>
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li className="px-2 small text-muted">Last updated: {loadingSummary ? "…" : "now"}</li>
                  </ul>
                </li>

                <li className="nav-item dropdown ms-2">
                  <button
                    className="btn btn-sm btn-ghost dropdown-toggle d-flex align-items-center"
                    id="userMenu"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    aria-label="User menu"
                    style={{ gap: 8 }}
                  >
                    <Avatar u={user} size={28} />
                    <span className="d-none d-md-inline">{user.name ? user.name.split(" ")[0] : (user.email || "Account")}</span>
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
                    <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                    <li><Link className="dropdown-item" to="/my-applications">My Applications</Link></li>

                    {/* Admin group */}
                    {user?.role === "admin" && (
                      <>
                        <li><hr className="dropdown-divider" /></li>
                        <li><Link className="dropdown-item" to="/admin">Admin Dashboard</Link></li>
                        <li><Link className="dropdown-item" to="/admin/startups">Manage Startups</Link></li>
                        <li><Link className="dropdown-item" to="/admin/events">Manage Events</Link></li>
                        <li><Link className="dropdown-item" to="/admin/events/new">Add Event</Link></li>
                        <li><Link className="dropdown-item" to="/admin/applications">Applications</Link></li>
                        <li><Link className="dropdown-item" to="/admin/reports">Reports</Link></li>
                      </>
                    )}

                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item" type="button" onClick={handleLogout}>Logout</button></li>
                  </ul>
                </li>
              </>
            )}

            {/* Mobile Submit Idea button */}
            <li className="nav-item d-md-none mt-2">
              <Link className="btn btn-sm btn-accent w-100" to="/add-idea">Submit Idea</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
