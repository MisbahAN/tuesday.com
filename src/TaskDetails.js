// src/TaskDetails.js
import React from 'react';
import './TaskDetails.css';

function TaskDetails({ task, setMyTasks, myTasks, setSelectedTask, onBack }) {

    if (!task) {
        return <div>Task not found!</div>;
    }
     const handleDivideTask = () => {


        // Simulate AI subtask generation.  In a real app, this would call an API.
        const aiGeneratedSubtasks = [
            { id: Date.now() + 1, title: `${task.title} - Subtask 1`, dueDate: task.dueDate, description: `Subtask 1 for ${task.title}`, completed: false, status: "Not Started", priority: task.priority },
            { id: Date.now() + 2, title: `${task.title} - Subtask 2`, dueDate: task.dueDate, description: `Subtask 2 for ${task.title}`, completed: false, status: "Not Started", priority: task.priority },
        ];

        // Add subtasks to My Tasks.  We add unique IDs.
        setMyTasks([...myTasks, ...aiGeneratedSubtasks]);

        // Remove the original task
        setMyTasks(myTasks.filter(t => t.id !== task.id));
        onBack(); // Go back after dividing

    };

    return (
        <div className="task-details">
            <h2>{task.title}</h2>
            <p><strong>Due Date:</strong> {task.dueDate}</p>
            <p><strong>Description:</strong> {task.description}</p>
            <p><strong>Assigned To:</strong> John Doe</p>
            <p><strong>Priority:</strong> {task.priority}</p>
            <p><strong>Status:</strong> {task.status}</p>
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
        </div>
    );
}

export default TaskDetails;