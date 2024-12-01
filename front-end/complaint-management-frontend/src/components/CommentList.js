import React, { useEffect, useState } from 'react';
import { getComments, createComment, updateComment, deleteComment } from '../api';  // Adjust imports
import axios from 'axios';

const CommentList = ({ complaintId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [updatedComment, setUpdatedComment] = useState('');

  // Fetch comments when component mounts or complaintId changes
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getComments(complaintId);
        // Ensure comments is always an array
        setComments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching comments", error);
        setComments([]);  // Default to empty array if error occurs
      }
    };

    fetchComments();
  }, [complaintId]);

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    // Ensure new comment is not empty or just whitespace
    if (!newComment.trim()) return;

    const commentData = { content: newComment };  // Ensure the content field is properly filled
    try {
      const response = await createComment(complaintId, commentData);
      setComments((prevComments) => [...prevComments, response]);  // Append new comment
      setNewComment('');  // Reset input after submission
    } catch (error) {
      console.error("Error creating comment", error);
    }
  };

  // Handle comment edit submission
  const handleCommentEdit = async (e) => {
    e.preventDefault();

    // Ensure updated comment is not empty or just whitespace
    if (!updatedComment.trim()) return;

    try {
      const response = await updateComment(complaintId, editingComment.id, { content: updatedComment });
      const updatedComments = comments.map((comment) => 
        comment.id === editingComment.id ? response : comment
      );
      setComments(updatedComments);
      setEditingComment(null);
      setUpdatedComment('');
    } catch (error) {
      console.error("Error updating comment", error);
    }
  };

  // Handle comment deletion
  const handleCommentDelete = async (commentId) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this comment?');
    if (isConfirmed) {
      try {
        await deleteComment(complaintId, commentId);
        setComments(comments.filter((comment) => comment.id !== commentId));
      } catch (error) {
        console.error("Error deleting comment", error);
      }
    }
  };

  return (
    <div className="comment-list">
      <h3>Comments</h3>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul>
          {comments.map((comment) => {
            if (!comment || !comment.content) return null; // Guard against invalid data
            return (
              <li key={comment.id}>
                <p>{comment.content}</p>
                <small>{new Date(comment.created_at).toLocaleString()}</small>
                <button onClick={() => { setEditingComment(comment); setUpdatedComment(comment.content); }}>Edit</button>
                <button onClick={() => handleCommentDelete(comment.id)}>Delete</button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Comment input form */}
      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows="3"
        />
        <button type="submit">Post Comment</button>
      </form>

      {/* Edit comment form */}
      {editingComment && (
        <form onSubmit={handleCommentEdit}>
          <textarea
            value={updatedComment}
            onChange={(e) => setUpdatedComment(e.target.value)}
            rows="3"
          />
          <button type="submit">Update Comment</button>
          <button onClick={() => setEditingComment(null)}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default CommentList;
