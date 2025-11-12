// frontend/src/components/StartupCard.js
import React from "react";
import { Link } from "react-router-dom";

export default function StartupCard({ idea }){
  return (
    <div className="card mb-3">
      <div className="row g-0">
        <div className="col-3 d-flex align-items-center justify-content-center p-2">
          <img src={idea.logoUrl || "/placeholder-logo.png"} alt={idea.title} style={{width:80, height:80, objectFit:"cover"}} className="rounded" />
        </div>
        <div className="col-9">
          <div className="card-body">
            <h5 className="card-title">{idea.title}</h5>
            <p className="card-text text-truncate">{idea.shortDescription || idea.problemStatement}</p>
            <p className="card-text"><small className="text-muted">{idea.founders || ""}</small></p>
            <Link to={`/startup/${idea._id}`} className="stretched-link">View profile</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
