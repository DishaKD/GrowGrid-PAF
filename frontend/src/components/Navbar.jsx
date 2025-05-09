import React from "react";
import { Link } from "react-router-dom";
import {
  FaGraduationCap,
  FaSearch,
  FaBell,
  FaUserCircle,
  FaBriefcase,
  FaClipboardList,
  FaChartLine,
  FaSignInAlt,
} from "react-icons/fa";

const Navbar = ({ unreadNotifications }) => {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          {/* Brand */}
          <Link to="/" className="navbar-brand">
            <FaGraduationCap className="brand-icon" />
            <span>SkillHub</span>
          </Link>

          {/* Search */}
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search for skills, users..."
              className="search-input"
            />
          </div>

          {/* Right-side navigation */}
          <div className="nav-right">
            {/* Skill Posts */}
            <Link to="/jobs" className="nav-icon" title="Jobs">
              <FaBriefcase />
            </Link>

            {/* Learning Plans */}
            <Link
              to="/learning-plans"
              className="nav-icon"
              title="Learning Plans"
            >
              <FaClipboardList />
            </Link>

            {/* Learning Progress */}
            <Link
              to="/progress-updates"
              className="nav-icon"
              title="Progress Updates"
            >
              <FaChartLine />
            </Link>

            {/* Notifications */}
            <Link
              to="/notifications"
              className="nav-icon"
              title="Notifications"
            >
              <FaBell />
              {unreadNotifications > 0 && (
                <span className="notification-count">
                  {unreadNotifications}
                </span>
              )}
            </Link>

            {/* Profile */}
            <Link to="/profile" className="nav-icon" title="Profile">
              <FaUserCircle />
            </Link>

            {/* OAuth Login (can be replaced with Logout if logged in) */}
            <Link
              to="/login"
              className="nav-icon"
              title="Login with Social Account"
            >
              <FaSignInAlt />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
