import axios from "axios";

// Configure axios instance
const instance = axios.create({
  baseURL: "http://localhost:8090/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Handle file uploads and URL creation for development
const handleMediaUpload = async (file) => {
  const objectUrl = URL.createObjectURL(file);

  return {
    url: objectUrl,
    fileType: file.type,
  };
};

const api = {
  // Comments
  addComment: (comment) => instance.post("/comments", comment),
  getCommentsByPost: (postId) => instance.get(`/comments/post/${postId}`),
  updateComment: (commentId, comment) =>
    instance.put(`/comments/${commentId}`, comment),
  deleteComment: (commentId) => instance.delete(`/comments/${commentId}`),

  // Notifications
  // Get notifications for a user
  getNotifications: (username) => instance.get(`/notifications/${username}`),

  // Get unread notifications for a user (Note: this was missing in your backend, so we can assume you will add a new route for unread notifications)
  getUnreadNotifications: (username) =>
    instance.get(`/notifications/unread/${username}`),

  // Mark a notification as read
  markNotificationAsRead: (notificationId) =>
    instance.put(`/notifications/mark-as-read/${notificationId}`),

  // Mark all notifications for a user as read (Add this route in your backend if it doesn't exist yet)
  markAllNotificationsAsRead: (username) =>
    instance.put(`/notifications/mark-all-read/${username}`),

  // Create a notification
  createNotification: (notification) =>
    instance.post(`/notifications`, notification),
};

export default api;
