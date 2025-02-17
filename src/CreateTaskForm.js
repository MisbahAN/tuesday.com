import React, { useState } from 'react';
import './Forms.css';

function CreateTaskForm({ onAddTask }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [destination, setDestination] = useState('');
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    dueDate: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskData.title || !taskData.dueDate) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      await onAddTask(taskData, destination);
      setTaskData({
        title: '',
        description: '',
        dueDate: ''
      });
    } catch (err) {
      setError('Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
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
            onClick={(e) => {
              setDestination('available');
              handleSubmit(e);
            }}
            disabled={isSubmitting}
          >
            {isSubmitting && destination === 'available' ? 'Adding...' : 'Add to Available Tasks'}
          </button>
          <button 
            type="button" 
            className="submit-button my-button"
            onClick={(e) => {
              setDestination('my');
              handleSubmit(e);
            }}
            disabled={isSubmitting}
          >
            {isSubmitting && destination === 'my' ? 'Adding...' : 'Add to My Tasks'}
          </button>
          {error && <div className="error-message">{error}</div>}
        </div>
      </form>
    </div>
  );
}

export default CreateTaskForm;
