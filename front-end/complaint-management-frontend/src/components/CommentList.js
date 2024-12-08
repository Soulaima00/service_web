import React, { useEffect, useState } from 'react';
import { getComments, createComment, updateComment, deleteComment } from '../api';  // API calls
import '../styles/ComplaintList.css';

const CommentList = ({ complaintId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [updatedComment, setUpdatedComment] = useState('');

  // Fetch comments when component mounts or complaintId changes
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getComments(complaintId);  // Fetch comments by complaintId
        setComments(Array.isArray(data) ? data : []);  // Ensure comments is always an array
      } catch (error) {
        console.error("Error fetching comments", error);
        setComments([]);  // Fallback to an empty array if an error occurs
      }
    };
    fetchComments();
  }, [complaintId]);

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;  // Avoid empty comment submissions
    const commentData = { text: newComment };
    try {
      const response = await createComment(complaintId, commentData);  // Use complaintId to create a new comment
      setComments([...comments, response]);  // Append new comment
      setNewComment('');  // Reset comment input
    } catch (error) {
      console.error("Error creating comment", error);
    }
  };

  // Handle comment edit
  const handleCommentEdit = async (e) => {
    e.preventDefault();
    if (!updatedComment.trim()) return;  // Avoid empty edits
    try {
      const response = await updateComment(editingCommentId, { text: updatedComment });  // Use comment's ID to update
      const updatedComments = comments.map((comment) =>
        comment.id === editingCommentId ? response : comment
      );
      setComments(updatedComments);  // Update the comment in the list
      setEditingCommentId(null);  // Exit edit mode
      setUpdatedComment('');  // Clear updated comment
    } catch (error) {
      console.error("Error updating comment", error);
    }
  };

  // Handle comment delete
  const handleCommentDelete = async (commentId) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this comment?');
    if (isConfirmed) {
      try {
        await deleteComment(commentId);  // Use comment's ID to delete
        setComments(comments.filter((comment) => comment.id !== commentId));  // Remove comment from list
      } catch (error) {
        console.error("Error deleting comment", error);
      }
    }
  };

  return (
    <div className="comment-list">
      <h4>Comments</h4>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id} className="comment-item">
              {editingCommentId === comment.id ? (
                // Edit form for the comment being edited
                <form onSubmit={handleCommentEdit}>
                  <textarea
                    value={updatedComment}
                    onChange={(e) => setUpdatedComment(e.target.value)}
                    rows="3"
                  />
                  <button type="submit">Update Comment</button>
                  <button type="button" onClick={() => setEditingCommentId(null)}>Cancel</button>
                </form>
              ) : (
                <>
                  <p>{comment.text}</p>
                  <small>{new Date(comment.created_at).toLocaleString()}</small>
                  <div className="comment-buttons">
                    <button onClick={() => { setEditingCommentId(comment.id); setUpdatedComment(comment.text); }}>Edit</button>
                    <button className="delete-button" onClick={() => handleCommentDelete(comment.id)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Add Comment Form */}
      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows="3"
        />
        <button type="submit">Post Comment</button>
      </form>
    </div>
  );
};

export default CommentList;
