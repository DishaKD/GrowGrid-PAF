import React, { useState, useEffect } from "react";
import {
  FaImage,
  FaVideo,
  FaGraduationCap,
  FaBook,
  FaCode,
  FaBell,
  FaClipboardList,
  FaChartLine,
} from "react-icons/fa";
import api from "../services/api";
import Navbar from "../components/Navbar";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import NotificationPanel from "../components/NotificationPanel";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await api.getAllPosts();
      setPosts(response.data);
    } catch (err) {
      console.error("Error fetching posts", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await api.getNotifications("Guest"); // Replace with dynamic username
      setNotifications(response.data);
      const unread = response.data.filter((n) => !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await api.markNotificationAsRead(notificationId);
      fetchNotifications();
    } catch (err) {
      console.error("Error marking notification as read", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.markAllNotificationsAsRead("Guest"); // Replace with dynamic username
      fetchNotifications();
    } catch (err) {
      console.error("Error marking all notifications as read", err);
    }
  };

  const categories = [
    { id: "all", name: "All", icon: <FaGraduationCap /> },
    { id: "text", name: "Text", icon: <FaBook /> },
    { id: "photo", name: "Photos", icon: <FaImage /> },
    { id: "video", name: "Videos", icon: <FaVideo /> },
    { id: "code", name: "Code", icon: <FaCode /> },
    { id: "learningPlan", name: "Learning Plans", icon: <FaClipboardList /> },
    { id: "progressUpdate", name: "Progress Updates", icon: <FaChartLine /> },
  ];

  const filteredPosts = posts.filter((post) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "code") return post.content.includes("```");
    if (activeCategory === "text")
      return post.postType === "TEXT" && !post.content.includes("```");
    if (activeCategory === "photo") return post.postType === "PHOTO";
    if (activeCategory === "video") return post.postType === "VIDEO";
    if (activeCategory === "learningPlan")
      return post.postType === "LEARNING_PLAN";
    if (activeCategory === "progressUpdate")
      return post.postType === "PROGRESS_UPDATE";
    return true;
  });

  return (
    <div className="home-page">
      <Navbar unreadNotifications={unreadCount} />

      <div className="container">
        <div className="main-content">
          <aside className="sidebar">
            <div className="card categories">
              <h3 className="section-title">Post Types</h3>
              <ul className="category-list">
                {categories.map((category) => (
                  <li
                    key={category.id}
                    className={`category-item ${
                      activeCategory === category.id ? "active" : ""
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.icon}
                    <span>{category.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card trending">
              <h3 className="section-title">Trending Topics</h3>
              <ul className="trending-list">
                <li className="trending-item">
                  <span className="badge">React</span>
                </li>
                <li className="trending-item">
                  <span className="badge">Spring Boot</span>
                </li>
                <li className="trending-item">
                  <span className="badge">Machine Learning</span>
                </li>
                <li className="trending-item">
                  <span className="badge">Photography</span>
                </li>
                <li className="trending-item">
                  <span className="badge">Cooking</span>
                </li>
              </ul>
            </div>
          </aside>

          <div className="feed">
            <div className="feed-header">
              <h2 className="feed-title">Latest Posts</h2>
              <button
                className="btn btn-ghost notification-btn"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <FaBell />
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount}</span>
                )}
              </button>
            </div>

            {showNotifications && (
              <NotificationPanel
                notifications={notifications}
                markAsRead={markAsRead}
                markAllAsRead={markAllAsRead}
                onClose={() => setShowNotifications(false)}
              />
            )}

            <CreatePost refreshPosts={fetchPosts} />

            {isLoading ? (
              <div className="loading">Loading posts...</div>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} refreshPosts={fetchPosts} />
              ))
            ) : (
              <div className="no-posts">
                <h3>No posts found</h3>
                <p>Be the first to share content in this category!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
