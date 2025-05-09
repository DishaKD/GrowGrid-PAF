import React, { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import api from "../services/api";
import Navbar from "../components/Navbar";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import NotificationPanel from "../components/NotificationPanel";
import PostService from "../services/postService";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await PostService.getAllPosts();
      setPosts(response.data);
    } catch (err) {
      console.error("Error fetching posts", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await api.getNotifications("1");
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
      await api.markAllNotificationsAsRead("1");
      fetchNotifications();
    } catch (err) {
      console.error("Error marking all notifications as read", err);
    }
  };

  return (
    <div className="home-page">
      <Navbar unreadNotifications={unreadCount} />

      <div className="container">
        <div className="main-content">
          <aside className="sidebar">
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
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post.id} post={post} refreshPosts={fetchPosts} />
              ))
            ) : (
              <div className="no-posts">
                <h3>No posts found</h3>
                <p>Be the first to share content!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
