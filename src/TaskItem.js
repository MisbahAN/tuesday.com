import React from 'react';
import './index.css';

function TaskItem({ task, onTaskClick, onTaskCompletion, onTakeTask, isAvailable }) {
  const handleClick = () => {
    onTaskClick(task);
  };


  return (
    <div 
      className={`task-item ${task.completed ? 'completed' : ''} ${isAvailable ? 'available-task' : ''} mb-2 p-2`}
      onClick={handleClick}
    >
      <div className="task-item-header flex items-center justify-between">
        <span className="task-title">{task.title}</span>
        
        {isAvailable ? (
          <button 
            className="take-task-button bg-primary text-white px-3 py-1 rounded hover:bg-primary-dark transition-all"
            onClick={(e) => {
              e.stopPropagation();
              onTakeTask(task.id);
            }}
          >
            Take Task
          </button>
        ) : (
          <input
            type="checkbox"
            checked={task.completed}
            onChange={(e) => {
              onTaskCompletion(task.id);
            }}

            className="task-checkbox w-4 h-4"
          />
        )}
      </div>

      {task.dueDate && (
        <div className="task-due-date text-sm text-text-secondary mt-1">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </div>
      )}


    </div>
  );
}

export default TaskItem;
