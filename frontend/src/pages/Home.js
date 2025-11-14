// frontend/src/pages/Home.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import FeaturedCarousel from "../components/FeaturedCarousel";
import { API_BASE } from "../config";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [stats, setStats] = useState({});
  // keep announcements as read-only constant to avoid unused setter warning
  const [announcements] = useState([
    { id: 1, text: "Hackathon registrations open — deadline Nov 30" }
  ]);

  useEffect(() => {
    (async () => {
      try {
        const [feat, st] = await Promise.all([
          axios.get(`${API_BASE}/api/ideas/featured`),
          axios.get(`${API_BASE}/api/stats`)
        ]);
        setFeatured(feat.data || []);
        setStats(st.data || {});
      } catch (err) {
        console.error("Home load:", err.message);
      }
    })();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="py-5 bg-gradient" style={{ background: "linear-gradient(90deg,#0d6efd22,#0dcaf022)" }}>
        <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between">
          <div style={{ maxWidth: 720 }}>
            <h1 className="display-5 fw-bold">Discover. Collaborate. Build Startups.</h1>
            <p className="lead text-muted">A student-run platform to showcase startup ideas, find teammates, mentors and early adopters.</p>
            <div className="mt-3">
              <Link to="/directory" className="btn btn-primary btn-lg me-2">See Startups</Link>
              <Link to="/register" className="btn btn-outline-primary btn-lg">Join the Club</Link>
            </div>
          </div>
          <div className="d-none d-md-block">
            <img src="/hero-graphic.png" alt="hero" style={{ width: 320 }} />
          </div>
        </div>
      </section>

      {/* Announcements & Stats */}
      <div className="container mt-4">
        {announcements.map(a => (
          <div className="alert alert-info" key={a.id}>{a.text}</div>
        ))}

        <div className="row align-items-center mb-4">
          <div className="col-md-7">
            <div className="row g-2">
              <div className="col-sm-4">
                <div className="card text-center p-3">
                  <h3 className="mb-0">{stats.startupsRegistered ?? 0}</h3>
                  <small className="text-muted">Startups</small>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="card text-center p-3">
                  <h3 className="mb-0">{stats.studentsInvolved ?? 0}</h3>
                  <small className="text-muted">Students</small>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="card text-center p-3">
                  <h3 className="mb-0">{stats.eventsHeld ?? 0}</h3>
                  <small className="text-muted">Events</small>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h5>How it works</h5>
              <ol>
                <li>Browse startups and read profiles</li>
                <li>Apply to join or contact the founders</li>
                <li>Attend events, get mentorship, build your product</li>
              </ol>
            </div>
          </div>

          <div className="col-md-5">
            <h5>Featured Startups</h5>
            <FeaturedCarousel items={featured} />
          </div>
        </div>

        <div className="p-4 rounded bg-light d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1">Ready to get involved?</h5>
            <p className="mb-0 text-muted">Sign up, submit your idea, or join a team.</p>
          </div>
          <div>
            <Link to="/add-idea" className="btn btn-success btn-lg">Submit an idea</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
