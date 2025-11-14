// frontend/src/components/Footer.js
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="py-5 bg-light mt-5 border-top">
      <div className="container">
        
        <div className="row gy-4">
          
          {/* Branding */}
          <div className="col-md-4">
            <h5 className="fw-bold">Startup Club – Garden City University</h5>
            <p className="text-muted small mb-2">
              Empowering student innovation through collaboration, mentorship, and real-world execution.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="col-md-3">
            <h6 className="fw-semibold mb-3">Explore</h6>
            <ul className="list-unstyled small">
              <li><Link className="text-decoration-none" to="/">Home</Link></li>
              <li><Link className="text-decoration-none" to="/directory">Startups</Link></li>
              <li><Link className="text-decoration-none" to="/events">Events</Link></li>
              <li><Link className="text-decoration-none" to="/add-idea">Submit Idea</Link></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="col-md-5">
            <h6 className="fw-semibold mb-3">Contact Us</h6>

            <p className="small mb-1">
              <span className="fw-bold">Phone:</span><br />
              <a href="tel:+919738785942" className="text-decoration-none">+91 9738785942</a><br />
              <a href="tel:+919113000357" className="text-decoration-none">+91 9113000357</a>
            </p>

            <p className="small mb-1">
              <span className="fw-bold">Email:</span><br />
              <a href="mailto:Incubation@gcu.edu.in" className="text-decoration-none">
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

        <hr className="my-4" />

        <div className="text-center small text-muted">
          © {new Date().getFullYear()} Garden City University – Startup Club. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
}
