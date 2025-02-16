// src/TaskItem.js
import React, { useState } from 'react';

function TaskItem({ task, onTaskClick, onTaskCompletion, isAvailable, onTakeTask }) {
    const [showSubtasks, setShowSubtasks] = useState(false);

    const toggleSubtasks = () => {
        setShowSubtasks(!showSubtasks);
    };

    const handleMainTaskClick = (e) => {
        if (e.target.type !== 'checkbox' && e.target.tagName !== 'BUTTON') {
             if (!isAvailable) {
                toggleSubtasks();
            }
          onTaskClick(task);
        }
    };


    return (
        <div className={`task-item ${isAvailable ? 'available-task' : 'my-task'} ${task.completed ? 'completed' : ''}`}>
            <div className="task-item-header" onClick={handleMainTaskClick}>
                {!isAvailable && (
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={(e) => {
                            e.stopPropagation();
                            onTaskCompletion(task.id);
                        }}
                    />
                )}
                <span className="task-title">{task.title}</span>

                <div className="task-details-row">
                    <span className="due-date">Due: {task.dueDate}</span>
                    {/* Removed status and priority */}

                    {isAvailable && (
                        <button
                            className="take-button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onTakeTask(task.id);
                            }}
                        >
                            Take
                        </button>
                    )}
                </div>
              {/* Show/Hide Icon */}
                {!isAvailable && task.subtasks && task.subtasks.length > 0 && (
                    <span className={`toggle-icon ${showSubtasks ? 'expanded' : ''}`}>
                        {showSubtasks ? '▼' : '▶'}
                    </span>
                )}
            </div>

            {/* Subtasks */}
            {showSubtasks && task.subtasks && task.subtasks.length > 0 && (
                <div className="subtasks">
                    {task.subtasks.map((subtask) => (
                        <div key={subtask.id} className="subtask">
                            <input
                                type="checkbox"
                                checked={subtask.completed}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    onTaskCompletion(task.id, subtask.id);
                                }}
                            />
                            <span className={`subtask-title ${subtask.completed ? 'completed' : ''}`}>{subtask.title}</span>
                            <span className="subtask-due-date">Due: {subtask.dueDate}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TaskItem;