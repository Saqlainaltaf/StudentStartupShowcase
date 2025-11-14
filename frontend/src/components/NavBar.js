// frontend/src/components/NavBar.js
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../config";

/*
 Updated colors:
  nav/footer bg = #0B1320 (very dark charcoal)
  link/text = #FFFFFF (white)
  subtle text = #cfd8e3 (soft grey-blue)
  accent CTA = #0FA958 (green)
*/

const STYLES = {
  primaryBg: "#0B1320",
  primaryLight: "#cfd8e3",
  accent: "#0FA958",
  linkColor: "#FFFFFF"
};

function initialsFromName(name) {
  if (!name) return "U";
  return name.split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase();
}

export default function NavBar() {
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  const readUser = useCallback(() => {
    try {
      const raw = localStorage.getItem("user");
      setUser(raw ? JSON.parse(raw) : null);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    readUser();
    function onStorage(e) {
      if (e.key === "user" || e.key === "token") readUser();
    }
    window.addEventListener("storage", onStorage);
    window.addEventListener("local-login", readUser);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("local-login", readUser);
    };
  }, [readUser]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("local-login"));
    setUser(null);
    navigate("/");
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (query && query.length >= 2) {
        navigate(`/directory?q=${encodeURIComponent(query)}`);
      }
    }, 600);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, navigate]);

  const Avatar = ({ u, size = 28 }) => {
    if (!u) return (
      <div style={{
        width:size, height:size, borderRadius:6,
        background:"#e9eef6", display:"inline-flex", alignItems:"center", justifyContent:"center",
        color:"#0B1320", fontWeight:700, fontSize:12
      }}>{initialsFromName(null)}</div>
    );
    if (u.avatar) {
      return <img src={u.avatar} alt={u.name||u.email||"avatar"} style={{width:size,height:size,objectFit:"cover",borderRadius:6}}/>;
    }
    return (
      <div style={{
        width:size, height:size, borderRadius:6,
        background:"#e9eef6", display:"inline-flex", alignItems:"center", justifyContent:"center",
        color:"#0B1320", fontWeight:700, fontSize:12
      }}>
        {initialsFromName(u.name || u.email)}
      </div>
    );
  };

  return (
    <nav
      className="navbar navbar-expand-md"
      style={{
        background: STYLES.primaryBg,
        color: STYLES.linkColor,
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        minHeight: 64
      }}
    >
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center" style={{ color: STYLES.linkColor, textDecoration: "none" }}>
          <img src="/logo192.png" alt="logo" style={{ width:40, height:40, marginRight:10, borderRadius:8, background:"#fff" }} />
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontWeight: 700, color: STYLES.primaryLight, fontSize:18 }}>Startup Club</div>
            <small style={{ color: "rgba(207,216,227,0.9)" }}>Idea Showcase</small>
          </div>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ borderColor: "rgba(255,255,255,0.12)" }}
        >
          <span className="navbar-toggler-icon" style={{ filter: "invert(1) brightness(2)" }} />
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto align-items-center" style={{ gap: 10 }}>
            <li className="nav-item">
              <NavLink to="/directory" className="nav-link" style={{ color: STYLES.linkColor }}>Startups</NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/events" className="nav-link" style={{ color: STYLES.linkColor }}>Events</NavLink>
            </li>

            <li className="nav-item mx-2" style={{ minWidth: 220 }}>
              <form onSubmit={e => { e.preventDefault(); if (query) navigate(`/directory?q=${encodeURIComponent(query)}`); }}>
                <input
                  className="form-control form-control-sm"
                  placeholder="Search startups, skills, founders..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  style={{
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.03)",
                    color: STYLES.linkColor
                  }}
                />
              </form>
            </li>

            <li className="nav-item ms-2 d-none d-md-block">
              <Link to="/add-idea" className="btn" style={{ background: STYLES.accent, color: "#fff", borderRadius: 8, padding: "6px 12px", fontWeight:600 }}>
                Submit Idea
              </Link>
            </li>

            {!user && (
              <>
                <li className="nav-item"><NavLink to="/login" className="nav-link" style={{ color: STYLES.linkColor }}>Login</NavLink></li>
                <li className="nav-item"><NavLink to="/register" className="nav-link" style={{ color: STYLES.linkColor }}>Register</NavLink></li>
              </>
            )}

            {user && (
              <>
                <li className="nav-item dropdown ms-3">
                  <button
                    className="btn btn-sm btn-ghost dropdown-toggle d-flex align-items-center"
                    id="userMenu"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ gap:8, color: STYLES.linkColor, background: "transparent", border: "none" }}
                  >
                    <Avatar u={user} />
                    <span className="d-none d-md-inline" style={{ color: STYLES.linkColor, marginLeft:6 }}>{user.name ? user.name.split(" ")[0] : user.email}</span>
                  </button>

                  {/* ensure dropdown menu is white with dark text for readability */}
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu" style={{ minWidth: 200, background: "#ffffff", color: "#0b1320" }}>
                    <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                    <li><Link className="dropdown-item" to="/my-applications">My Applications</Link></li>

                    {/* Admin group - removed Add Event option per request */}
                    {user.role === "admin" && <>
                      <li><hr className="dropdown-divider" /></li>
                      <li><Link className="dropdown-item" to="/admin">Admin Dashboard</Link></li>
                      <li><Link className="dropdown-item" to="/admin/startups">Manage Startups</Link></li>
                      <li><Link className="dropdown-item" to="/admin/events">Manage Events</Link></li>
                       <li><Link className="dropdown-item" to="/admin/users">Manage Users</Link></li>
                
                    </>}

                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                  </ul>
                </li>
              </>
            )}

            <li className="nav-item d-md-none mt-2">
              <Link to="/add-idea" className="btn" style={{ background: STYLES.accent, color:"#fff", borderRadius:8, width:"100%" }}>Submit Idea</Link>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}
