import React, { useEffect, useState } from 'react';
import { getComplaints, deleteComplaint } from '../api';  // Assuming you have an API file for Axios calls
import { useNavigate } from 'react-router-dom'; // useNavigate for React Router v6
import '../styles/ComplaintList.css';  // Correct path to the CSS file
import CommentList from './CommentList';  // Import CommentList component

const ComplaintList = () => {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate(); // useNavigate hook

  // Fetch complaints from the API
  useEffect(() => {
    const fetchComplaints = async () => {
      const data = await getComplaints();
      setComplaints(data);
    };
    fetchComplaints();
  }, []);

  // Delete complaint handler
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this complaint?');
    if (isConfirmed) {
      await deleteComplaint(id); // Proceed with deletion if confirmed
      setComplaints(complaints.filter((complaint) => complaint.id !== id)); // Update complaint list
    }
  };

  // Edit complaint handler
  const handleEdit = (id) => {
    navigate(`/edit-complaint/${id}`); // use navigate instead of history.push
  };

  return (
    <div>
      <h2>Complaints</h2>
      <ul>
        {complaints.map((complaint) => (
          <li key={complaint.id}>
            <h3>{complaint.title}</h3>
            <p>{complaint.description}</p>
            <p>By: {complaint.author}</p>
            <button onClick={() => handleEdit(complaint.id)}>Edit</button>
            <button className="delete-button" onClick={() => handleDelete(complaint.id)}>Delete</button>

            {/* Render CommentList under each complaint */}
            <CommentList complaintId={complaint.id} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComplaintList;
