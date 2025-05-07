import React from "react";

interface MediaItem {
  url: string;
  type: "image" | "video";
}

interface Comment {
  id: number;
  user: string;
  text: string;
  createdAt: string;
}

interface Post {
  id: number;
  user: {
    name: string,
    avatarUrl?: string,
  };
  description: string;
  media: MediaItem[];
  createdAt: string;
  likes: number;
  comments: Comment[];
}

interface Props {
  post: Post;
}

const PostCard: React.FC<Props> = ({ post }) => {
  return (
    <div className="border rounded-lg shadow p-4 mb-4 bg-white">
      <div className="flex items-center mb-2">
        <img
          src={post.user.avatarUrl || "/default-avatar.png"}
          alt="avatar"
          className="w-10 h-10 rounded-full mr-2"
        />
        <div>
          <div className="font-semibold">{post.user.name}</div>
          <div className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </div>
        </div>
      </div>

      <p className="mb-3">{post.description}</p>

      {post.media.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
          {post.media.map((m, idx) => (
            <div key={idx}>
              {m.type === "video" ? (
                <video src={m.url} controls className="w-full rounded" />
              ) : (
                <img
                  src={m.url}
                  alt={`media-${idx}`}
                  className="w-full rounded"
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-4 items-center mb-2">
        <button className="text-blue-500 hover:underline">
          👍 {post.likes}
        </button>
        <button className="text-blue-500 hover:underline">
          💬 {post.comments.length}
        </button>
      </div>

      <div>
        {post.comments.slice(0, 2).map((comment) => (
          <div key={comment.id} className="text-sm mb-1">
            <span className="font-semibold">{comment.user}</span>:{" "}
            {comment.text}
          </div>
        ))}
        {post.comments.length > 2 && (
          <button className="text-xs text-blue-600 hover:underline">
            View all comments
          </button>
        )}
      </div>
    </div>
  );
};

export default PostCard;
