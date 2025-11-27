// frontend/src/pages/GCUIFHome.js
import React from "react";
import { Link } from "react-router-dom";

export default function GCUIFHome() {
  return (
    <div className="container py-5">
      {/* HERO */}
      <section className="row align-items-center mb-5">
        <div className="col-md-6">
          <p className="text-uppercase small text-muted mb-1">
            Garden City University • Incubation & Entrepreneurship
          </p>
          <h1 className="display-5 fw-bold mb-3">
            Garden City University Incubation Foundation (GCUIF)
          </h1>
          <p className="lead mb-4">
            The official incubation and entrepreneurship ecosystem of Garden City University –
            supporting student and faculty founders from idea to venture.
          </p>
          <div className="d-flex flex-wrap gap-2">
            <Link to="/gcuel" className="btn btn-accent btn-lg">
              Enter Entrepreneurship Lab
            </Link>
            <a href="#programs" className="btn btn-ghost btn-lg">
              Explore Programs
            </a>
          </div>
        </div>

        <div className="col-md-6 mt-4 mt-md-0">
          <div className="hero-card">
            <h5 className="mb-3">What is GCUIF?</h5>
            <p className="mb-3 text-muted">
              GCUIF is the university&apos;s dedicated platform to incubate ideas, mentor founders,
              and connect startups with industry, investors, and alumni.
            </p>
            <ul className="small text-muted mb-0">
              <li>Pre-incubation & idea validation</li>
              <li>Mentorship from faculty & industry experts</li>
              <li>Access to investors, demo days & pitch sessions</li>
              <li>Support for student, faculty & alumni ventures</li>
            </ul>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mb-5">
        <div className="row g-3">
          <div className="col-6 col-md-3">
            <div className="card text-center p-3">
              <div className="fw-bold fs-4">25+</div>
              <div className="small text-muted">Startups Supported</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card text-center p-3">
              <div className="fw-bold fs-4">150+</div>
              <div className="small text-muted">Students Engaged</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card text-center p-3">
              <div className="fw-bold fs-4">30+</div>
              <div className="small text-muted">Mentors & Experts</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card text-center p-3">
              <div className="fw-bold fs-4">₹</div>
              <div className="small text-muted">Funding & Grants Facilitated</div>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section id="programs" className="mb-5">
        <h2 className="mb-3">Incubation Programs</h2>
        <p className="text-muted mb-4">
          GCUIF runs structured tracks for founders at every stage – from students exploring ideas
          to early-stage ventures preparing for investors.
        </p>
        <div className="row g-3">
          <div className="col-md-4">
            <div className="card h-100 p-3">
              <h5>Pre-Incubation &amp; Idea Clinic</h5>
              <p className="small text-muted mb-2">
                Weekly clinics and mentor hours to help students shape raw ideas into problem–solution
                clarity.
              </p>
              <ul className="small text-muted mb-0">
                <li>Problem discovery</li>
                <li>Customer interviews</li>
                <li>Basic validation</li>
              </ul>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 p-3">
              <h5>Incubation Track</h5>
              <p className="small text-muted mb-2">
                Structured support for early teams working on MVPs, pilots and initial users.
              </p>
              <ul className="small text-muted mb-0">
                <li>Product & GTM mentoring</li>
                <li>Access to labs & resources</li>
                <li>Industry & alumni connects</li>
              </ul>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 p-3">
              <h5>Investment &amp; Scale Readiness</h5>
              <p className="small text-muted mb-2">
                For teams with traction preparing for grants, angel funding or partnerships.
              </p>
              <ul className="small text-muted mb-0">
                <li>Pitch refinement</li>
                <li>Investor & grant connects</li>
                <li>Legal & compliance guidance</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ENTREPRENEURSHIP LAB HIGHLIGHT */}
      <section className="mb-5">
        <div className="card p-4 d-md-flex align-items-md-center">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h3 className="mb-2">Garden City University Entrepreneurship Lab (GCUEL)</h3>
              <p className="text-muted mb-3">
                The student–facing portal where ideas are submitted, teams are formed, and new startups
                from Garden City University are discovered.
              </p>
              <ul className="small text-muted mb-0">
                <li>Submit startup ideas and profiles</li>
                <li>Discover and join existing teams</li>
                <li>Connect with peers, mentors and opportunities</li>
              </ul>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <Link to="/gcuel" className="btn btn-accent">
                Go to GCUEL Startup Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT / CTA */}
      <section className="mb-5">
        <h3 className="mb-3">Connect with GCUIF</h3>
        <p className="text-muted mb-2">
          Incubation Office, Garden City University – Campus<br />
          16th KM, Old Madras Road, Bangalore – 560 049
        </p>
        <p className="text-muted mb-0">
          Email: <a href="mailto:Incubation@gcu.edu.in">Incubation@gcu.edu.in</a><br />
          Phone: <a href="tel:+919738785942">+91 9738785942</a>,{" "}
          <a href="tel:+919113000357">+91 9113000357</a>
        </p>
      </section>
    </div>
  );
}
