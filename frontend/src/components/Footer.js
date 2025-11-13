// frontend/src/components/Footer.js
import React from "react";

export default function Footer() {
  return (
    <footer className="site-footer mt-5" role="contentinfo">
      <div className="container">
        <div className="d-md-flex justify-content-between align-items-center">
          <div>
            <strong>Startup Club</strong>
            <div className="text-muted">Empowering student founders.</div>
          </div>

          <div className="mt-3 mt-md-0 text-md-end" aria-hidden={false}>
            <small className="text-muted">Connect:</small>

            {/* Replace these URLs with your real social links when ready */}
            <a
              className="ms-2 text-muted"
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <i className="bi bi-twitter" />
            </a>

            <a
              className="ms-2 text-muted"
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <i className="bi bi-instagram" />
            </a>

            <a
              className="ms-2 text-muted"
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <i className="bi bi-linkedin" />
            </a>
          </div>
        </div>

        <div className="text-center mt-3 text-muted" aria-hidden={false}>
          footer @ankith & @saqlain · © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}
