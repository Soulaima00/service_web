import axios from 'axios';

const apiUrl = 'http://localhost:5000/api/complaints';  // Adjust with your Flask backend URL

// Get complaints
export const getComplaints = async () => {
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching complaints", error);
  }
};

// Create a new complaint
export const createComplaint = async (complaintData) => {
  try {
    const response = await axios.post(apiUrl, complaintData);
    return response.data;
  } catch (error) {
    console.error("Error creating complaint", error);
  }
};

// Get a specific complaint
export const getComplaint = async (id) => {
  try {
    const response = await axios.get(`${apiUrl}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching complaint", error);
  }
};

// Update complaint details
export const updateComplaint = async (id, complaintData) => {
  try {
    const response = await axios.put(`${apiUrl}/${id}`, complaintData);
    return response.data;
  } catch (error) {
    console.error("Error updating complaint", error);
  }
};

// Delete a complaint
export const deleteComplaint = async (id) => {
  try {
    const response = await axios.delete(`${apiUrl}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting complaint", error);
  }
};

// Get comments for a complaint
export const getComments = async (complaintId) => {
  try {
    const response = await axios.get(`${apiUrl}/${complaintId}/comments`);
    return response.data || [];  // Ensure empty array is returned if no comments
  } catch (error) {
    console.error("Error fetching comments", error);
  }
};

// Create a new comment for a complaint
export const createComment = async (complaintId, commentData) => {
  try {
    const response = await axios.post(`${apiUrl}/${complaintId}/comments`, commentData);
    return response.data;
  } catch (error) {
    console.error("Error creating comment", error);
  }
};

// Update a comment (using comment's ID)
export const updateComment = async (commentId, commentData) => {
  try {
    const response = await axios.put(`http://localhost:5000/api/comments/${commentId}`, commentData);  // Correct route to update a comment
    return response.data;
  } catch (error) {
    console.error("Error updating comment", error);
  }
};

// Delete a comment (using comment's ID)
export const deleteComment = async (commentId) => {
  try {
    const response = await axios.delete(`http://localhost:5000/api/comments/${commentId}`);  // Correct route to delete a comment
    return response.data;
  } catch (error) {
    console.error("Error deleting comment", error);
  }
};
