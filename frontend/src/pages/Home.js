import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/api/ideas")
      .then(res => setIdeas(res.data))
      .catch(err => console.error("Home load error:", err.message))
      .finally(()=>setLoading(false));
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h1>Startup Idea Showcase</h1>
        <Link to="/add-idea" className="btn btn-primary">Submit an Idea</Link>
      </div>
      <hr/>
      {loading ? <p>Loading ideas…</p> :
        ideas.length === 0 ? <p className="text-muted">No approved ideas yet.</p> :
        <div className="row">
          {ideas.map(idea => (
            <div className="col-md-6" key={idea._id}>
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">{idea.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">By {idea.createdBy?.name || "Unknown"}</h6>
                  <p className="card-text">{idea.problemStatement}</p>
                  <p><strong>Solution:</strong> {idea.solution}</p>
                  <p className="text-muted"><small>Category: {idea.category || "N/A"}</small></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}
