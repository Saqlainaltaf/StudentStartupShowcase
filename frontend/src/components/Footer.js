// frontend/src/components/Footer.js
import React from "react";
import { Link } from "react-router-dom";

const COLORS = {
  bg: "#0B1320",        // very dark charcoal
  light: "#E6EEF8",     // pale, readable text
  accent: "#0FA958"     // green CTA
};

export default function Footer() {
  return (
    <footer style={{ background: COLORS.bg, color: COLORS.light, paddingTop: 36, paddingBottom: 28 }}>
      <div className="container">
        <div className="row gy-4">
          <div className="col-md-4">
            <h5 style={{ color: COLORS.light, marginBottom: 8 }}>Startup Club – Garden City University</h5>
            <p style={{ color: COLORS.light, marginBottom: 0, fontSize: 14 }}>
              Empowering student innovation through collaboration, mentorship and real-world execution.
            </p>
          </div>

          <div className="col-md-3">
            <h6 style={{ color: COLORS.light, marginBottom: 12 }}>Explore</h6>
            <ul className="list-unstyled small" style={{ lineHeight: 2 }}>
              <li><Link to="/" style={{ color: COLORS.light, textDecoration: "none" }}>Home</Link></li>
              <li><Link to="/directory" style={{ color: COLORS.light, textDecoration: "none" }}>Startups</Link></li>
              <li><Link to="/events" style={{ color: COLORS.light, textDecoration: "none" }}>Events</Link></li>
              <li><Link to="/add-idea" style={{ color: COLORS.light, textDecoration: "none" }}>Submit Idea</Link></li>
            </ul>
          </div>

          <div className="col-md-5">
            <h6 style={{ color: COLORS.light, marginBottom: 12 }}>Contact Us</h6>

            <p style={{ color: COLORS.light, marginBottom: 6 }}>
              <strong>Phone:</strong><br />
              <a href="tel:+919738785942" style={{ color: COLORS.light, textDecoration: "none" }}>+91 9738785942</a><br />
              <a href="tel:+919113000357" style={{ color: COLORS.light, textDecoration: "none" }}>+91 9113000357</a>
            </p>

            <p style={{ color: COLORS.light, marginBottom: 6 }}>
              <strong>Email:</strong><br />
              <a href="mailto:Incubation@gcu.edu.in" style={{ color: COLORS.light, textDecoration: "none" }}>Incubation@gcu.edu.in</a>
            </p>

            <p style={{ color: COLORS.light, marginBottom: 0 }}>
              <strong>Address:</strong><br />
              Incubation Office, Garden City University – Campus<br />
              16th KM, Old Madras Road, Bangalore – 560 049
            </p>
          </div>
        </div>

        <hr style={{ borderColor: "rgba(255,255,255,0.08)", marginTop: 22, marginBottom: 20 }} />

        <div className="text-center" style={{ color: COLORS.light, fontSize: 13 }}>
          © {new Date().getFullYear()} Garden City University – Startup Club. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
