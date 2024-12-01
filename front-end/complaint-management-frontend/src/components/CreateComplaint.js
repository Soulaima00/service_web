import React, { useState } from 'react';
import { createComplaint } from '../api';  // Assuming you have an API file for Axios calls
import { useNavigate } from 'react-router-dom';
import '../styles/CreateComplaint.css';  // Correct path to the CSS file


const CreateComplaint = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const navigate = useNavigate();  // Use useNavigate for redirection

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newComplaint = { title, description, author };
    const response = await createComplaint(newComplaint);
    if (response) {
      navigate('/complaint-list'); // Redirect to Complaint List page after submission
    }
  };

  return (
    <div>
      <h2>Create a New Complaint</h2>
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
        <button type="submit">Create Complaint</button>
      </form>
    </div>
  );
};

export default CreateComplaint;
