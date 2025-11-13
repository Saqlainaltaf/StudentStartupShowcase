// frontend/src/components/StartupFilters.js
import React, { useState, useEffect } from "react";

export default function StartupFilters({ values, onChange }){
  const [local, setLocal] = useState(values || { q: "", category: "", currentStage: "", skill: "" });

  useEffect(()=> setLocal(values), [values]);

  function apply() { onChange(local); }

  function clearAll() {
    const cleared = { q: "", category: "", currentStage: "", skill: "" };
    setLocal(cleared);
    onChange(cleared);
  }

  return (
    <div className="card p-3">
      <h6>Filters</h6>
      <div className="mb-2">
        <input className="form-control" placeholder="Search (title, problem, solution)" value={local.q} onChange={e=>setLocal({...local,q:e.target.value})}/>
      </div>
      <div className="mb-2">
        <select className="form-select" value={local.category} onChange={e=>setLocal({...local,category:e.target.value})}>
          <option value="">All domains</option>
          <option value="Fintech">Fintech</option>
          <option value="Health">Health</option>
          <option value="Edtech">Edtech</option>
          <option value="SaaS">SaaS</option>
          <option value="Consumer">Consumer</option>
        </select>
      </div>
      <div className="mb-2">
        <select className="form-select" value={local.currentStage} onChange={e=>setLocal({...local,currentStage:e.target.value})}>
          <option value="">All stages</option>
          <option value="Ideation">Ideation</option>
          <option value="Prototype">Prototype</option>
          <option value="MVP">MVP</option>
          <option value="Market-ready">Market-ready</option>
        </select>
      </div>
      <div className="mb-3">
        <input className="form-control" placeholder="Skill (e.g., React, marketing)" value={local.skill} onChange={e=>setLocal({...local,skill:e.target.value})}/>
      </div>
      <div className="d-flex">
        <button className="btn btn-primary me-2" onClick={apply}>Apply</button>
        <button className="btn btn-outline-secondary" onClick={clearAll}>Clear</button>
      </div>
    </div>
  );
}
