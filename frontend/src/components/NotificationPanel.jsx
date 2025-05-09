import React from "react";
import {
  FaTimes,
  FaBell,
  FaThumbsUp,
  FaComment,
  FaReply,
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

const NotificationPanel = ({
  notifications,
  markAsRead,
  markAllAsRead,
  onClose,
}) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case "POST_LIKE":
        return <FaThumbsUp className="text-blue-500 w-5 h-5" />;
      case "POST_COMMENT":
        return <FaComment className="text-green-500 w-5 h-5" />;
      case "COMMENT_REPLY":
        return <FaReply className="text-purple-500 w-5 h-5" />;
      default:
        return <FaBell className="text-gray-400 w-5 h-5" />;
    }
  };

  const getNotificationMessage = (notification) => {
    const sender =
      notification.senderUser || `User ${notification.senderUserId}`;
    switch (notification.type) {
      case "POST_LIKE":
        return `${sender} liked your post`;
      case "POST_COMMENT":
        return `${sender} commented on your post`;
      case "COMMENT_REPLY":
        return `${sender} replied to your comment`;
      default:
        return "New notification";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-4 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FaBell /> Notifications
        </h3>
        <div className="flex items-center gap-2">
          <button
            className="text-sm text-blue-500 hover:underline disabled:text-gray-400"
            onClick={markAllAsRead}
            disabled={notifications.every((n) => n.read)}
          >
            Mark all as read
          </button>
          <button
            className="text-gray-500 hover:text-red-500 transition"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition ${
                notification.read
                  ? "bg-gray-50 hover:bg-gray-100"
                  : "bg-blue-50 hover:bg-blue-100"
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">
                  {getNotificationMessage(notification)}
                </p>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            No notifications yet
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
