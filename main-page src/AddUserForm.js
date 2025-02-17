import React, { useState } from 'react';
import './Forms.css';

function AddUserForm({ onAddUser }) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onAddUser(username.trim());
      setUsername('');
    }
  };

  return (
    <div className="form-container">
      <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Add User to List</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username *</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
          />
        </div>

        <button type="submit" className="submit-button">Add User</button>
      </form>
    </div>
  );
}

export default AddUserForm;
