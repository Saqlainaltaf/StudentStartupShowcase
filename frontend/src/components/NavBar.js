// frontend/src/components/NavBar.js
import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function NavBar(){
  return (
    <nav className="navbar navbar-expand-md site-nav">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src="/logo192.png" alt="logo" style={{width:40,height:40,marginRight:10, borderRadius:8}} />
          <div style={{lineHeight:1}}>
            <div style={{fontWeight:700}}>Startup Club</div>
            <small className="text-muted">Idea Showcase</small>
          </div>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto align-items-md-center">
            <li className="nav-item"><NavLink className="nav-link" to="/directory">Startups</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/events">Events</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/resources">Resources</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/join">Join Us</NavLink></li>
            <li className="nav-item ms-3">
              <Link className="btn btn-sm btn-accent" to="/add-idea">Submit Idea</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
