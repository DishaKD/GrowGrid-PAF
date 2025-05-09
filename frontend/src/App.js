import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PostDetail from "./pages/PostDetail";
import JobsPage from "./pages/JobHomePage";
import JobDetailsPage from "./pages/JobDetailsPage";
import JobCreatePage from "./pages/CreateJobPage";
import JobEditPage from "./pages/EditJobPage";
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
        <Route path="/create-job" element={<JobCreatePage />} />
        <Route path="/jobs/:id/edit" element={<JobEditPage />} />
      </Routes>
    </Router>
  );
}

export default App;
