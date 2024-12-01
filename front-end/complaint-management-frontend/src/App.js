// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ComplaintList from './components/ComplaintList';
import CreateComplaint from './components/CreateComplaint';
import EditComplaint from './components/EditComplaint';
import './styles/App.css';  // Import global CSS
import './styles/ComplaintList.css';  // Import ComplaintList styles
import './styles/CreateComplaint.css';  // Import CreateComplaint styles
import './styles/EditComplaint.css';  // Import EditComplaint styles
import CommentList from './components/CommentList';

const App = () => {
  return (
    <Router>
      <div className="container">
        <h1>Complaint Management</h1>
        <Routes>
          <Route path="/" element={<CreateComplaint />} />
          <Route path="/complaint-list" element={<ComplaintList />} />
          <Route path="/edit-complaint/:id" element={<EditComplaint />} />
          <Route path="/comment-list" element={<CommentList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
