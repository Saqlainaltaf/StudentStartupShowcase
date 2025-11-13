// frontend/src/pages/Events.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../config";

export default function Events(){
  const [events, setEvents] = useState([]);
  useEffect(()=> {
    axios.get(`${API_BASE}/api/events`).then(res => setEvents(res.data)).catch(()=>setEvents([]));
  }, []);
  return (
    <div>
      <h3>Upcoming Events</h3>
      <div className="list-group">
        {events.map(e => (
          <div className="list-group-item" key={e._id}>
            <div className="d-flex justify-content-between">
              <div>
                <h5>{e.title}</h5>
                <div className="text-muted">{new Date(e.start).toLocaleString()} {e.end ? ` - ${new Date(e.end).toLocaleString()}` : ""}</div>
                <p>{e.description}</p>
                {e.link && <a href={e.link} target="_blank" rel="noreferrer">Register</a>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
