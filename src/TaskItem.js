// src/TaskItem.js
import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

function TaskItem({ task, onTaskClick, onTaskCompletion, isAvailable, onTakeTask }) {
    const nodeRef = useRef(null); // Create the ref

    return (
        <CSSTransition
            key={task.id}
            timeout={300}
            classNames={task.completed ? "task-item-complete" : (isAvailable ? "task-item-available" : "task-item")}
            nodeRef={nodeRef} // Pass the ref to CSSTransition
        >
            <li ref={nodeRef} className="task-item" onClick={() => onTaskClick(task.id)}>
                {!isAvailable && (
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={(e) => {e.stopPropagation(); onTaskCompletion(task.id);}} // Stop propagation
                    />
                )}
                <span className={`task-link ${task.completed ? 'completed' : ''}`}>
                    {task.title}
                </span>

                <span className="due-date">Due: {task.dueDate}</span>
                {isAvailable ? (
                    <button className="take-button" onClick={(e) => { e.stopPropagation(); onTakeTask(task.id); }}>Take</button>
                ) : (
                    <div className="task-status-priority">
                        <span className={`status-badge status-${task.status.toLowerCase().replace(/\s+/g, '-')}`}>{task.status}</span>
                        <span className="priority-indicator">{task.priority}</span>
                    </div>
                )}
            </li>
        </CSSTransition>
    );
}

export default TaskItem;