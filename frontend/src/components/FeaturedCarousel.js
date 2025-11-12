// frontend/src/components/FeaturedCarousel.js
import React from "react";
import { Link } from "react-router-dom";

export default function FeaturedCarousel({ items = [] }){
  if(items.length === 0) return <div className="text-muted">No featured startups yet</div>;

  return (
    <div id="featuredCarousel" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        {items.map((it, idx) => (
          <div className={`carousel-item ${idx===0 ? "active" : ""}`} key={it._id}>
            <div className="d-flex align-items-center">
              <img src={it.logoUrl || "/placeholder-logo.png"} style={{width:80, height:80, objectFit:"cover"}} alt={it.title} className="me-3 rounded" />
              <div>
                <h6>{it.title}</h6>
                <p className="mb-1 text-truncate" style={{maxWidth:220}}>{it.shortDescription || it.problemStatement}</p>
                <Link to={`/startup/${it._id}`}>View profile</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#featuredCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon"></span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#featuredCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon"></span>
      </button>
    </div>
  );
}
