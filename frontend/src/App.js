// frontend/src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
// example route in App.js (where your routes are defined)
import AdminUsers from "./pages/AdminUsers";
// ...



// pages
import Home from "./pages/Home";
import GCUIFHome from "./pages/GCUIFHome";
import Directory from "./pages/Directory";
import AddIdea from "./pages/AddIdea";
import StartupProfile from "./pages/StartupProfile";
import Events from "./pages/Events";
import Admin from "./pages/Admin";
import AdminEvents from "./pages/AdminEvents";
import ApplicationsAdmin from "./pages/ApplicationsAdmin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyApplications from "./pages/MyApplications";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Router>
      <NavBar />

      <main className="container my-4">
        <Routes>
          <Route path="/" element={<GCUIFHome />} />
          <Route path="/gcuel" element={<Home />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/add-idea" element={<AddIdea />} />
          <Route path="/startup/:id" element={<StartupProfile />} />
          <Route path="/events" element={<Events />} />

          {/* Admin */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/applications" element={<ApplicationsAdmin />} />
          <Route path="/admin/users" element={<AdminUsers />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User */}
          <Route path="/my-applications" element={<MyApplications />} />
          <Route path="/profile" element={<Profile />} />

          {/* fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}
