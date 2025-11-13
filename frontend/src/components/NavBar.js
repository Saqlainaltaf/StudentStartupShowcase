// frontend/src/components/NavBar.js
import React, { useEffect, useState, useCallback } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function NavBar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // read user object from localStorage (if present). Stored as JSON string under "user"
  const readUser = useCallback(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return setUser(null);
      const parsed = JSON.parse(raw);
      setUser(parsed);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    readUser();
    // update on storage events (other tabs)
    function onStorage(e) {
      if (e.key === "user" || e.key === "token") readUser();
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [readUser]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  }

  // helper to display name or fallback
  const displayName = user?.name || user?.email || null;

  return (
    <nav className="navbar navbar-expand-md site-nav">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src="/logo192.png"
            alt="logo"
            style={{ width: 40, height: 40, marginRight: 10, borderRadius: 8 }}
          />
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontWeight: 700 }}>Startup Club</div>
            <small className="text-muted">Idea Showcase</small>
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
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto align-items-md-center">
            <li className="nav-item">
              <NavLink className="nav-link" to="/directory">
                Startups
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/events">
                Events
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/join">
                Join Us
              </NavLink>
            </li>

            <li className="nav-item ms-3 d-none d-md-block">
              <Link className="btn btn-sm btn-accent" to="/add-idea">
                Submit Idea
              </Link>
            </li>

            {/* Right side: Auth area */}
            {!user && (
              <>
                <li className="nav-item ms-2">
                  <NavLink className="nav-link" to="/login">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">
                    Register
                  </NavLink>
                </li>
              </>
            )}

            {user && (
              <li className="nav-item dropdown ms-3">
                <button
                  className="btn btn-sm btn-ghost dropdown-toggle"
                  id="userMenu"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {displayName ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <img
                        src={user.avatar || "/placeholder-logo.png"}
                        alt="avatar"
                        style={{ width: 28, height: 28, borderRadius: 6, objectFit: "cover" }}
                      />
                      <span>{displayName.split(" ")[0]}</span>
                    </span>
                  ) : (
                    "Account"
                  )}
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/my-applications">
                      My Applications
                    </Link>
                  </li>

                  {/* Admin link shown only if user.role === 'admin' */}
                  {user?.role === "admin" && (
                    <>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/admin">
                          Admin Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/admin/applications">
                          Applications
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/admin/events">
                          Manage Events
                        </Link>
                      </li>
                    </>
                  )}

                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item" type="button" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            )}

            {/* Mobile submit button placed in collapsed menu */}
            <li className="nav-item d-md-none mt-2">
              <Link className="btn btn-sm btn-accent w-100" to="/add-idea">
                Submit Idea
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
