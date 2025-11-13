// frontend/src/pages/Directory.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import StartupCard from "../components/StartupCard";
import StartupFilters from "../components/StartupFilters";
import { API_BASE } from "../config";

export default function Directory(){
  const [filters, setFilters] = useState({
    q: "", category: "", currentStage: "", skill: ""
  });
  const [data, setData] = useState({ items: [], total: 0, page: 1, limit: 12 });
  const [loading, setLoading] = useState(false);

  async function load(page = 1) {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page,
        limit: data.limit,
        sort: "latest"
      };
      const res = await axios.get(`${API_BASE}/api/ideas/search`, { params });
      setData(res.data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Directory load error:", err.response?.data || err.message);
      alert("Failed to load startups.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{ load(1); /* eslint-disable-next-line */ }, [filters]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Startups Directory</h3>
        <div>
          <a href="/add-idea" className="btn btn-primary">Suggest an Idea</a>
        </div>
      </div>

      <div className="row">
        <div className="col-md-3">
          <StartupFilters values={filters} onChange={(next) => setFilters({...filters, ...next})} />
        </div>

        <div className="col-md-9">
          {loading ? <p>Loading…</p> : (
            <>
              <div className="mb-3 text-muted">Showing {data.items.length} of {data.total} startups</div>
              <div className="row">
                {data.items.map(i => (
                  <div className="col-md-6" key={i._id}><StartupCard idea={i} /></div>
                ))}
              </div>

              {/* Pagination */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  Page {data.page} • {Math.ceil(data.total / data.limit)} pages
                </div>
                <div>
                  <button className="btn btn-sm btn-outline-secondary me-2" disabled={data.page <= 1} onClick={()=>load(data.page-1)}>Prev</button>
                  <button className="btn btn-sm btn-outline-secondary" disabled={(data.page * data.limit) >= data.total} onClick={()=>load(data.page+1)}>Next</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
