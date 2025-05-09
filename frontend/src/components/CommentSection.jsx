import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import commentApi from "../services/api";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");

  const fetchComments = async () => {
    try {
      const res = await commentApi.getCommentsByPost(postId);
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching comments", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const comment = {
        userId: 1, // Replace with actual user ID from auth
        content: newComment,
        postId: postId,
      };

      // Add the comment
      await commentApi.addComment(comment);

      // Create a notification for the post owner
      createNotification(comment);

      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Error adding comment", err);
    }
  };

  const createNotification = async (comment) => {
    try {
      const notification = {
        recipientUserId: 1,
        senderUserId: comment.userId,
        postId: postId,
        commentId: comment.id,
        type: "POST_COMMENT",
      };

      await commentApi.createNotification(notification);
    } catch (err) {
      console.error("Error creating notification", err);
    }
  };

  const handleEditComment = async (commentId) => {
    if (editingComment === commentId) {
      try {
        const updatedComment = {
          content: editContent,
        };

        await commentApi.updateComment(commentId, updatedComment);
        setEditingComment(null);
        fetchComments();
      } catch (err) {
        console.error("Error updating comment", err);
      }
    } else {
      const comment = comments.find((c) => c.id === commentId);
      setEditContent(comment.content);
      setEditingComment(commentId);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentApi.deleteComment(commentId);
      fetchComments();
    } catch (err) {
      console.error("Error deleting comment", err);
    }
  };

  return (
    <div className="comments-section">
      <h3 className="section-title">Comments ({comments.length})</h3>

      <div className="add-comment">
        <div className="flex items-center gap-2">
          <div className="avatar">G</div>
          <textarea
            className="form-control textarea"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </div>
        <div className="comment-actions mt-4">
          <button
            className="btn btn-primary"
            onClick={handleAddComment}
            disabled={!newComment.trim()}
          >
            Add Comment
          </button>
        </div>
      </div>

      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div className="comment-item" key={comment.id}>
              <div className="comment-header">
                <div className="flex items-center gap-2">
                  <div className="avatar">U</div>
                  <div>
                    <h4 className="comment-author">User {comment.userId}</h4>
                  </div>
                </div>
                <div className="comment-actions">
                  <button
                    className="btn-icon"
                    onClick={() => handleEditComment(comment.id)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn-icon btn-danger"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              {editingComment === comment.id ? (
                <div className="form-group">
                  <textarea
                    className="form-control textarea"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                  <div className="flex gap-2 mt-4">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleEditComment(comment.id)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-ghost"
                      onClick={() => setEditingComment(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="comment-content">{comment.content}</div>
              )}
            </div>
          ))
        ) : (
          <div className="no-comments">No comments yet. Be the first!</div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
