import React from 'react';
import './TaskDetails.css';
import './index.css';

function TaskDetails({ task, setMyTasks, myTasks, onBack, onTaskCompletion }) {
    if (!task) {
        return <div>Task not found!</div>;
    }

    const handleDivideTask = () => {
        const aiGeneratedSubtasks = [
            { id: `${task.id}-${Date.now()}-1`, title: `${task.title} - Subtask 1`, dueDate: task.dueDate, description: `Subtask 1 for ${task.title}`, completed: false},
            { id: `${task.id}-${Date.now()}-2`, title: `${task.title} - Subtask 2`, dueDate: task.dueDate, description: `Subtask 2 for ${task.title}`, completed: false},
        ];

        setMyTasks(prevTasks =>
            prevTasks.map(t =>
                t.id === task.id ? { ...t, subtasks: aiGeneratedSubtasks } : t
            )
        );
    };

    return (
        <div className="task-details container p-4">
            <h2 className="text-2xl font-semibold mb-4">{task.title}</h2>
            
            <div className="task-details-grid gap-4 mb-6">
                <p><strong>Due Date:</strong> {task.dueDate}</p>
            </div>

            <p className="mb-4"><strong>Assigned To:</strong> John Doe</p>
            <p className="mb-4"><strong>Created Date:</strong> 2024-03-01</p>

            <div className="button-group">
                <button 
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-all"
                    onClick={onBack}
                >
                    Back
                </button>
                {myTasks.find(t => t.id === task.id) && (
                    <button 
                        className="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary-dark transition-all"
                        onClick={handleDivideTask}
                    >
                        Divide into Subtasks
                    </button>
                )}
            </div>

            {task.subtasks && task.subtasks.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-xl font-medium mb-3">Subtasks</h3>
                    <ul>
                        {task.subtasks.map(subtask => (
                            <li key={subtask.id} className="mb-2">
                                <input
                                    type="checkbox"
                                    checked={subtask.completed}
                                    onChange={() => onTaskCompletion(task.id, subtask.id)}
                                    className="mr-2"
                                />
                                {subtask.title} - Due: {subtask.dueDate}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div>
                <h3 className="text-xl font-medium mb-3">Comments</h3>
                <ul>
                    <li className="mb-2"><strong>Alice:</strong> This is a comment.</li>
                    <li className="mb-2"><strong>Bob:</strong> Another comment here.</li>
                </ul>
            </div>
        </div>
    );
}

export default TaskDetails;
