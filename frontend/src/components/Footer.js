// frontend/src/components/Footer.js
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      className="text-light mt-5"
      style={{
        background: "#0A3D62",
        paddingTop: "40px",
        paddingBottom: "30px",
      }}
    >
      <div className="container">
        <div className="row gy-4">

          {/* Branding */}
          <div className="col-md-4">
            <h5 className="fw-bold">Startup Club – Garden City University</h5>
            <p className="small" style={{ color: "#dbe8ff" }}>
              Empowering student innovation through collaboration, mentorship & real-world execution.
            </p>
          </div>

          {/* Navigation */}
          <div className="col-md-3">
            <h6 className="fw-semibold mb-3">Explore</h6>
            <ul className="list-unstyled small">
              <li><Link className="text-decoration-none text-light" to="/">Home</Link></li>
              <li><Link className="text-decoration-none text-light" to="/directory">Startups</Link></li>
              <li><Link className="text-decoration-none text-light" to="/events">Events</Link></li>
              <li><Link className="text-decoration-none text-light" to="/add-idea">Submit Idea</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-md-5">
            <h6 className="fw-semibold mb-3">Contact Us</h6>
            <p className="small">
              <span className="fw-bold">Phone:</span><br />
              <a href="tel:+919738785942" className="text-light text-decoration-none">+91 9738785942</a><br />
              <a href="tel:+919113000357" className="text-light text-decoration-none">+91 9113000357</a>
            </p>

            <p className="small">
              <span className="fw-bold">Email:</span><br />
              <a href="mailto:Incubation@gcu.edu.in" className="text-light text-decoration-none">
                Incubation@gcu.edu.in
              </a>
            </p>

            <p className="small mb-0">
              <span className="fw-bold">Address:</span><br />
              Incubation Office, Garden City University – Campus<br />
              16th KM, Old Madras Road, Bangalore – 560 049
            </p>
          </div>
        </div>

        <hr style={{ borderColor: "#4b6785" }} />

        <p className="text-center small" style={{ color: "#dbe8ff" }}>
          © {new Date().getFullYear()} Garden City University – Startup Club. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
