// src/main.tsx
import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import App from "./App";
import Login from "./components/Login";
import { UserProvider } from "./UserContext";

import "./index.css";
import Signup from "./components/Signup";
import Home from "./components/Home";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      {/* Background video */}
      

      {/* Routing */}
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/home" element={<Home/>} />
        </Routes>
      </Router>
    </UserProvider>
  </StrictMode>
);
