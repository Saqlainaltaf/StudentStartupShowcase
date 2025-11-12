import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddIdea from "./pages/AddIdea";
import Admin from "./pages/Admin";
import NavBar from "./components/NavBar";
import StartupProfile from "./pages/StartupProfile";

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
  <Route path="/startup/:id" element={<StartupProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
