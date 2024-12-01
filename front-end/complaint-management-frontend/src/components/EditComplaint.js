import React, { useEffect, useState } from 'react';
import { getComplaint, updateComplaint } from '../api';  // Assuming you have an API file for Axios calls
import { useNavigate, useParams } from 'react-router-dom'; // useNavigate for React Router v6
import '../styles/EditComplaint.css';  // Correct path to the CSS file


const EditComplaint = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [author, setAuthor] = useState('');
    const navigate = useNavigate(); // Replaced useHistory with useNavigate
    const { id } = useParams();
  
    useEffect(() => {
      const fetchComplaint = async () => {
        const data = await getComplaint(id);
        if (data) {
          setTitle(data.title);
          setDescription(data.description);
          setAuthor(data.author);
        }
      };
      fetchComplaint();
    }, [id]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const updatedComplaint = { title, description, author };
      const response = await updateComplaint(id, updatedComplaint);
      if (response) {
        // Redirect to the complaint list page after update
        navigate('/'); // This redirects to the root (ComplaintList) page
      }
    };
  
    return (
      <div>
        <h2>Edit Complaint</h2>
        <form onSubmit={handleSubmit}>
          <label>Title: </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <label>Description: </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <label>Author: </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
          <button type="submit">Update Complaint</button>
        </form>
      </div>
    );
  };
  
  export default EditComplaint;