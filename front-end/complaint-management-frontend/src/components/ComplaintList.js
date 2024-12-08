import React, { useEffect, useState } from 'react';
import { getComplaints, deleteComplaint } from '../api';  // API calls
import { useNavigate } from 'react-router-dom';
import '../styles/ComplaintList.css';
import CommentList from './CommentList';  // Import CommentList

const ComplaintList = () => {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      const data = await getComplaints();
      setComplaints(data);
    };
    fetchComplaints();
  }, []);

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this complaint?');
    if (isConfirmed) {
      await deleteComplaint(id);
      setComplaints(complaints.filter((complaint) => complaint.id !== id));
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-complaint/${id}`);
  };

  return (
    <div className="complaint-list">
      <h2>Complaints</h2>
      <ul>
        {complaints.map((complaint) => (
          <li key={complaint.id} className="complaint-item">
            <div className="complaint-header">
              <h3>{complaint.title}</h3>
              <div className="complaint-buttons">
                <button onClick={() => handleEdit(complaint.id)}>Edit</button>
                <button className="delete-button" onClick={() => handleDelete(complaint.id)}>Delete</button>
              </div>
            </div>
            <p>{complaint.description}</p>
            <p>By: {complaint.author}</p>

            {/* Comments Section */}
            <div className="comments-section">
              <CommentList complaintId={complaint.id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComplaintList;
