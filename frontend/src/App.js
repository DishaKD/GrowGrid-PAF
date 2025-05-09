import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PostDetail from "./pages/PostDetail";
import JobsPage from "./pages/JobHomePage";
import JobDetailsPage from "./pages/JobDetailsPage";
import "./styles/global.css";
import "./styles/components.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
