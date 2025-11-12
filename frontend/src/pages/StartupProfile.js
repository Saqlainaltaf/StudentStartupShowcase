// frontend/src/pages/StartupProfile.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_BASE } from "../config";

export default function StartupProfile(){
  const { id } = useParams();
  const [idea, setIdea] = useState(null);

  useEffect(()=>{
    axios.get(`${API_BASE}/api/ideas/${id}`).then(res=>setIdea(res.data)).catch(err=>console.error(err));
  }, [id]);

  if(!idea) return <p>Loading…</p>;

  return (
    <div>
      <div className="d-flex align-items-center mb-3">
        <img src={idea.logoUrl || "/placeholder-logo.png"} style={{width:120, height:120, objectFit:"cover"}} className="me-3 rounded" alt={idea.title} />
        <div>
          <h2>{idea.title}</h2>
          <div className="text-muted">{idea.founders}</div>
          <div className="mt-2"><strong>Stage:</strong> {idea.currentStage}</div>
        </div>
      </div>

      <p><strong>Short:</strong> {idea.shortDescription}</p>
      <h5>Problem</h5>
      <p>{idea.problemStatement}</p>
      <h5>Solution</h5>
      <p>{idea.solution}</p>

      <h5>Team & Roles</h5>
      <p>{idea.teamMembers}</p>

      <h5>Skills Needed</h5>
      <p>{idea.skillsNeeded?.join?.(", ")}</p>

      <h5>Achievements</h5>
      <p>{idea.achievements}</p>

      <h5>Mentor</h5>
      <p>{idea.mentor}</p>

      <h5>Contact</h5>
      <p>{idea.contact?.email && <div>Email: {idea.contact.email}</div>}
         {idea.contact?.phone && <div>Phone: {idea.contact.phone}</div>}
         {idea.contact?.form && <div><a href={idea.contact.form}>Apply / Contact</a></div>}
      </p>

      {idea.callToAction && <a className="btn btn-primary" href={idea.callToAction}>{idea.callToAction}</a>}
    </div>
  );
}
