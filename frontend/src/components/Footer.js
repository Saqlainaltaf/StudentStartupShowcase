// frontend/src/components/Footer.js
import React from "react";

export default function Footer() {
  return (
    <footer className="site-footer mt-5">
      <div className="container">
        <div className="d-md-flex justify-content-between align-items-center">
          <div>
            <strong>Startup Club</strong>
            <div className="text-muted">Empowering student founders.</div>
          </div>

          <div className="mt-3 mt-md-0 text-md-end">
            <small className="text-muted">Connect:</small>
            <a className="ms-2 text-muted" href="#">
              <i className="bi bi-twitter"></i>
            </a>
            <a className="ms-2 text-muted" href="#">
              <i className="bi bi-instagram"></i>
            </a>
            <a className="ms-2 text-muted" href="#">
              <i className="bi bi-linkedin"></i>
            </a>
          </div>
        </div>

        <div className="text-center mt-3 text-muted">
          © {new Date().getFullYear()} Startup Club. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
