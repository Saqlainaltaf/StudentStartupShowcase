// frontend/src/pages/Home.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import FeaturedCarousel from "../components/FeaturedCarousel";
import StartupCard from "../components/StartupCard";
import { API_BASE } from "../config";

export default function Home(){
  const [ideas, setIdeas] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const load = async () => {
      try {
        const [ideasRes, featRes, statsRes] = await Promise.all([
          axios.get(`${API_BASE}/api/ideas`),
          axios.get(`${API_BASE}/api/ideas/featured`),
          axios.get(`${API_BASE}/api/stats`)
        ]);
        setIdeas(ideasRes.data);
        setFeatured(featRes.data);
        setStats(statsRes.data);
      } catch(err){
        console.error("Home load error:", err.message);
      } finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <div>
      {/* Hero */}
      <div className="jumbotron p-5 bg-light rounded-3 mb-4">
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <h1 className="display-6">Discover. Collaborate. Build Startups!</h1>
            <p className="lead">A place for students to showcase ideas, find team members, mentors and early traction.</p>
            <div>
              <Link to="/add-idea" className="btn btn-primary me-2">See Startups</Link>
              <a href="#join" className="btn btn-outline-primary">Join the Club</a>
            </div>
          </div>
          <img src="/hero-graphic.png" alt="hero" style={{width:220}}/> {/* optional image */}
        </div>
      </div>

      {/* Stats & Announcement */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="alert alert-info">
            <strong>Announcement:</strong> Hackathon registrations open — deadline <em>Nov 30</em>. <Link to="/events">Register now</Link>
          </div>

          <div className="row">
            <div className="col-sm-4">
              <div className="card p-3 text-center">
                <h3>{stats.startupsRegistered ?? "-"}</h3><small>Startups registered</small>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="card p-3 text-center">
                <h3>{stats.studentsInvolved ?? "-"}</h3><small>Students involved</small>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="card p-3 text-center">
                <h3>{stats.eventsHeld ?? "-"}</h3><small>Events held</small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <h5>Featured Startups</h5>
          <FeaturedCarousel items={featured} />
        </div>
      </div>

      {/* How it works */}
      <div className="mb-4">
        <h4>How it works</h4>
        <ol>
          <li>Browse startups and read profiles.</li>
          <li>Join a team or post your collaboration request.</li>
          <li>Attend events and get mentorship to build further.</li>
        </ol>
      </div>

      {/* Grid of startups */}
      <div>
        <h4>All Startups</h4>
        {loading ? <p>Loading…</p> :
          <div className="row">
            {ideas.map(i=>(
              <div key={i._id} className="col-md-6"><StartupCard idea={i} /></div>
            ))}
          </div>
        }
      </div>

      {/* CTA */}
      <div id="join" className="my-4 p-4 bg-secondary text-white rounded">
        <h4>Ready to join?</h4>
        <p>Sign up as a student, submit your idea, or contact us for mentorship.</p>
        <Link to="/register" className="btn btn-light">Join the Club</Link>
      </div>
    </div>
  );
}
