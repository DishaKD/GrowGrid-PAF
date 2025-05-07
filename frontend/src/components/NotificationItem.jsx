import React from "react";

interface NotificationProps {
  id: number;
  type: "like" | "comment";
  message: string;
  createdAt: string;
  read: boolean;
  onClick: (id: number) => void;
}

const NotificationItem: React.FC<NotificationProps> = ({
  id,
  type,
  message,
  createdAt,
  read,
  onClick,
}) => {
  return (
    <div
      className={`flex items-start gap-2 p-3 border-b cursor-pointer ${
        read ? "bg-white" : "bg-blue-50"
      }`}
      onClick={() => onClick(id)}
    >
      <div className="text-xl">{type === "like" ? "👍" : "💬"}</div>
      <div className="flex-1">
        <p className="text-sm">{message}</p>
        <p className="text-xs text-gray-500">
          {new Date(createdAt).toLocaleString()}
        </p>
      </div>
      {!read && <span className="w-2 h-2 bg-blue-500 rounded-full mt-1" />}
    </div>
  );
};

export default NotificationItem;
