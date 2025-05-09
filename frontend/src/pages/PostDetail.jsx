import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaThumbsUp,
  FaThumbsDown,
  FaComment,
  FaImage,
  FaVideo,
} from "react-icons/fa";
import api from "../services/api";
import Navbar from "../components/Navbar";
import CommentSection from "../components/CommentSection";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import PostService from "../services/postService";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await PostService.getPostById(id);
      setPost(response);
      setError(null);
    } catch (err) {
      console.error("Error fetching post details", err);
      setError("Failed to load post details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleLike = async () => {
    try {
      await api.likePost(post.id, post.like);
      fetchPost();
    } catch (err) {
      console.error("Error liking post", err);
    }
  };

  const handleUnlike = async () => {
    try {
      await api.unlikePost(post.id, post.unlike);
      fetchPost();
    } catch (err) {
      console.error("Error unliking post", err);
    }
  };

  const formatContent = (content) => {
    if (!content || !content.includes("```")) return content;

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
            className="code-block"
          >
            {code}
          </SyntaxHighlighter>
        );
      }
    });
  };

  const renderMediaContent = () => {
    if (!post || !post.mediaUrls || post.mediaUrls.length === 0) return null;

    return post.mediaUrls.map((url, index) => {
      const isVideo = url.match(/\.(mp4|webm|ogg)$/i);
      return (
        <div key={index} className="media-content">
          {isVideo ? (
            <video controls className="post-media">
              <source src={`/${url}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={`/${url}`}
              alt={`media-${index}`}
              className="post-media"
            />
          )}
        </div>
      );
    });
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container">
          <div className="loading-container">
            <div className="loading">Loading post details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div>
        <Navbar />
        <div className="container">
          <div className="error-container">
            <div className="error">{error || "Post not found"}</div>
            <Link to="/" className="btn btn-primary">
              <FaArrowLeft /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="post-detail-page">
      <Navbar />

      <div className="container">
        <div className="post-detail-container">
          <div className="back-link">
            <Link to="/" className="btn btn-ghost">
              <FaArrowLeft /> Back to Feed
            </Link>
          </div>

          <div className="card post-detail-card">
            <div className="post-header">
              <div className="flex items-center gap-2">
                <div className="avatar">
                  {post.user ? post.user.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <h3 className="post-author">
                    {post.userId || "Unknown User"}
                  </h3>
                  <div className="avatar">
                    {post.userId ? post.userId.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="text-xs text-muted">
                    Education Enthusiast
                  </span>
                </div>
              </div>
              <div className="post-type">
                {post.postType === "PHOTO" && (
                  <span className="badge badge-photo">
                    <FaImage /> Photo
                  </span>
                )}
                {post.postType === "VIDEO" && (
                  <span className="badge badge-video">
                    <FaVideo /> Video
                  </span>
                )}
              </div>
            </div>

            <div className="post-content detailed">
              {renderMediaContent()}
              {formatContent(post.description)}
            </div>

            <div className="post-stats">
              <button className="btn-stat" onClick={handleLike}>
                <FaThumbsUp /> <span>{post.like}</span>
              </button>
              <button className="btn-stat" onClick={handleUnlike}>
                <FaThumbsDown /> <span>{post.unlike}</span>
              </button>
              <div className="btn-stat">
                <FaComment />{" "}
                <span>{post.comments ? post.comments.length : 0}</span>
              </div>
            </div>
          </div>

          <div className="card comments-card">
            <CommentSection
              postId={post.id}
              comments={post.comments}
              refreshPost={fetchPost}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
