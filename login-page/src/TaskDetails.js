// src/TaskDetails.js
import React from 'react';
import './TaskDetails.css';

function TaskDetails({ task, setMyTasks, myTasks, onBack, onTaskCompletion }) {
    if (!task) {
        return <div>Task not found!</div>;
    }

     const handleDivideTask = () => {
        const aiGeneratedSubtasks = [
            { id: `${task.id}-${Date.now()}-1`, title: `${task.title} - Subtask 1`, dueDate: task.dueDate, description: `Subtask 1 for ${task.title}`, completed: false}, // Removed status, priority
            { id: `${task.id}-${Date.now()}-2`, title: `${task.title} - Subtask 2`, dueDate: task.dueDate, description: `Subtask 2 for ${task.title}`, completed: false}, // Removed status, priority
        ];

        setMyTasks(prevTasks =>
            prevTasks.map(t =>
                t.id === task.id ? { ...t, subtasks: aiGeneratedSubtasks } : t
            )
        );
    };


    return (
        <div className="task-details">
            <h2>{task.title}</h2>
			<div className="task-details-grid">
            	<p><strong>Due Date:</strong> {task.dueDate}</p>
           		<p><strong>Description:</strong> {task.description}</p>
                 {/* Removed status and priority */}
			</div>


            <p><strong>Assigned To:</strong> John Doe</p>
            <p><strong>Created Date:</strong> 2024-03-01</p>

            <h3>Comments</h3>
            <ul>
                <li><strong>Alice:</strong> This is a comment.</li>
                <li><strong>Bob:</strong> Another comment here.</li>
            </ul>
            {myTasks.find(t => t.id === task.id) && (
                <button onClick={handleDivideTask}>Divide into Subtasks</button>
            )}
             <button onClick={onBack}>Back</button>
               {/* Display subtasks if they exist */}
            {task.subtasks && task.subtasks.length > 0 && (
                <div>
                    <h3>Subtasks:</h3>
                    <ul>
                        {task.subtasks.map(subtask => (
                            <li key={subtask.id}>
                                <input
                                    type="checkbox"
                                    checked={subtask.completed}
                                     onChange={() => onTaskCompletion(task.id, subtask.id)}
                                />
                                {subtask.title} - Due: {subtask.dueDate}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

        </div>
    );
}

export default TaskDetails;