import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddIdea from "./pages/AddIdea";
import Admin from "./pages/Admin";
import NavBar from "./components/NavBar";
import StartupProfile from "./pages/StartupProfile";
import Directory from "./pages/Directory";
import ApplicationsAdmin from "./pages/ApplicationsAdmin";
import Events from "./pages/Events";
import AdminEvents from "./pages/AdminEvents";



function App() {
  return (
    <Router>
      <NavBar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-idea" element={<AddIdea />} />
          <Route path="/admin" element={<Admin />} />
  <Route path="/admin/applications" element={<ApplicationsAdmin />} />
  <Route path="/startup/:id" element={<StartupProfile />} />
  <Route path="/directory" element={<Directory />} />
<Route path="/events" element={<Events />} />
<Route path="/admin/events" element={<AdminEvents />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
//redeploying
