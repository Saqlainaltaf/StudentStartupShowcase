// top of src/index.js (or where you import global CSS)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import App from "./App";



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
