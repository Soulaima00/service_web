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
    return response.data || [];  // Ensure it returns an empty array if no comments
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

// Update a comment for a complaint
export const updateComment = async (complaintId, commentId, commentData) => {
  try {
    const response = await axios.put(`${apiUrl}/${complaintId}/comments/${commentId}`, commentData);
    return response.data;
  } catch (error) {
    console.error("Error updating comment", error);
  }
};

// Delete a comment for a complaint
export const deleteComment = async (complaintId, commentId) => {
  try {
    const response = await axios.delete(`${apiUrl}/${complaintId}/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting comment", error);
  }
};
