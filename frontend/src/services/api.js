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
  // In a real application, you would upload the file to a storage service
  // and get back a URL. For this demo, we're using object URLs.

  // TODO: Replace with actual file upload API when backend is ready

  // For demo purposes only - object URLs will only work in the current session
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
  getNotifications: (username) => instance.get(`/notifications/${username}`),
  getUnreadNotifications: (username) =>
    instance.get(`/notifications/${username}/unread`),
  markNotificationAsRead: (notificationId) =>
    instance.put(`/notifications/${notificationId}/mark-read`),
  markAllNotificationsAsRead: (username) =>
    instance.put(`/notifications/${username}/mark-all-read`),
};

export default api;
