import React from "react";

export default function Dashboard(){
  const user = JSON.parse(localStorage.getItem("user") || "null");
  return (
    <div>
      <h3>Dashboard</h3>
      <p>Welcome, {user?.name || "User"}. Use the navigation to submit ideas or go to admin (if admin).</p>
    </div>
  );
}
