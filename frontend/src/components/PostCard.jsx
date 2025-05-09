import React from "react";
import { Link } from "react-router-dom";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaComment,
  FaShare,
  FaImage,
  FaVideo,
  FaCode,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import api from "../services/postService";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const PostCard = ({ post, refreshPosts }) => {
  const [expanded, setExpanded] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [editContent, setEditContent] = React.useState(post.description);

  const containsCode = post?.description?.includes("```");

  const handleLike = async () => {
    try {
      await api.likePost(post.id, post.like || 0);
      refreshPosts?.();
    } catch (err) {
      console.error("Error liking post", err);
    }
  };

  const handleUnlike = async () => {
    try {
      await api.unlikePost(post.id, post.unlike || 0);
      refreshPosts?.();
    } catch (err) {
      console.error("Error unliking post", err);
    }
  };

  const handleDelete = async () => {
    try {
      await api.deletePost(post.id);
      refreshPosts?.();
    } catch (err) {
      console.error("Error deleting post", err);
    }
  };

  const handleEdit = async () => {
    if (editing) {
      try {
        const formData = new FormData();
        formData.append("description", editContent);
        // if you need to re-upload mediaFiles, append them here

        await api.updatePost(post.id, formData);
        refreshPosts?.();
        setEditing(false);
      } catch (err) {
        console.error("Error updating post", err);
      }
    } else {
      setEditing(true);
    }
  };

  const formatContent = (content) => {
    if (!containsCode) return <div>{content}</div>;

    const parts = content.split("```");
    return parts.map((part, index) => {
      if (index % 2 === 0) {
        return <div key={index}>{part}</div>;
      } else {
        const language = part.split("\n")[0];
        const code = part.substring(language.length + 1);
        return (
          <SyntaxHighlighter
            key={index}
            language={language || "javascript"}
            style={atomOneDark}
          >
            {code}
          </SyntaxHighlighter>
        );
      }
    });
  };
  const BASE_URL = "http://localhost:8090";

  const renderMediaContent = () => {
    if (!post.mediaUrls || post.mediaUrls.length === 0) return null;

    return post.mediaUrls.map((url, index) => {
      const fullUrl = `${BASE_URL}/${url}`;
      const isVideo = url.match(/\.(mp4|webm|ogg)$/i);
      return (
        <div key={index} className="media-content">
          {isVideo ? (
            <video controls className="post-media">
              <source src={fullUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={fullUrl} alt={`media-${index}`} className="post-media" />
          )}
        </div>
      );
    });
  };

  return (
    <div className="card post-card">
      <div className="post-header">
        <div className="flex items-center gap-2">
          <div className="avatar">
            {post.userId ? post.userId.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h3 className="post-author">{post.userId || "Unknown User"}</h3>
            <span className="text-xs text-muted">Education Enthusiast</span>
          </div>
        </div>
        <div className="post-actions">
          <button className="btn-icon" onClick={handleEdit}>
            <FaEdit />
          </button>
          <button className="btn-icon btn-danger" onClick={handleDelete}>
            <FaTrash />
          </button>
        </div>
      </div>

      <div className="post-content">
        {editing ? (
          <div className="form-group">
            <textarea
              className="form-control textarea"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <div className="flex gap-2 mt-4">
              <button className="btn btn-primary" onClick={handleEdit}>
                Save
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="post-description">
              {formatContent(post.description)}
            </div>
            {renderMediaContent()}
            {post.description.length > 300 && !expanded && (
              <button className="btn-link" onClick={() => setExpanded(true)}>
                Read more
              </button>
            )}
          </>
        )}
      </div>

      <div className="post-footer">
        <div className="post-stats">
          <button className="btn-stat" onClick={handleLike}>
            <FaThumbsUp /> <span>{post.like || 0}</span>
          </button>
          <button className="btn-stat" onClick={handleUnlike}>
            <FaThumbsDown /> <span>{post.unlike || 0}</span>
          </button>
          <Link to={`/post/${post.id}`} className="btn-stat">
            <FaComment /> <span>{post.comments?.length || 0}</span>
          </Link>
          <button className="btn-stat">
            <FaShare /> Share
          </button>
        </div>

        <div className="post-badges">
          {containsCode && (
            <span className="badge mr-2">
              <FaCode /> Code Snippet
            </span>
          )}
          {post.mediaUrls?.some((url) =>
            url.match(/\.(jpg|png|jpeg|gif)$/i)
          ) && (
            <span className="badge badge-photo">
              <FaImage /> Photo
            </span>
          )}
          {post.mediaUrls?.some((url) => url.match(/\.(mp4|webm|ogg)$/i)) && (
            <span className="badge badge-video">
              <FaVideo /> Video
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
