import React, { useState } from 'react';
import './Forms.css';

function CreateTaskForm({ onAddTask }) {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    dueDate: ''
  });

  const handleSubmit = (e, destination) => {
    e.preventDefault();
    if (taskData.title && taskData.dueDate) {
      onAddTask(taskData, destination);
      setTaskData({
        title: '',
        description: '',
        dueDate: ''
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="form-container">
      <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Create New Task</h3>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label htmlFor="title">Task Name *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={taskData.title}
            onChange={handleChange}
            placeholder="Enter task name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (optional)</label>
          <textarea
            id="description"
            name="description"
            value={taskData.description}
            onChange={handleChange}
            placeholder="Add task details"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date *</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={taskData.dueDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="button-group">
          <button 
            type="button" 
            className="submit-button available-button"
            onClick={(e) => handleSubmit(e, 'available')}
          >
            Add to Available Tasks
          </button>
          <button 
            type="button" 
            className="submit-button my-button"
            onClick={(e) => handleSubmit(e, 'my')}
          >
            Add to My Tasks
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTaskForm;
