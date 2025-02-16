// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import TaskDetails from './TaskDetails';
import TaskItem from './TaskItem';

function App() {
    const [availableTasks, setAvailableTasks] = useState([
        { id: 1, title: "Design Landing Page", dueDate: "2024-03-10", description: "Create initial design mockups.", completed: false, subtasks: [] }, // Removed status and priority
        { id: 2, title: "Implement User Authentication", dueDate: "2024-03-15", description: "Set up login/registration flow.", completed: false, subtasks: [] }, // Removed status and priority
        { id: 3, title: "Database Schema Design", dueDate: "2024-03-08", description: "Define database tables and relationships.", completed: false, subtasks: [] }, // Removed status and priority
        { id: 4, title: "Write API Endpoints", dueDate: "2024-03-20", description: "Create RESTful API for task management.", completed: false, subtasks: [] }, // Removed status and priority
        { id: 5, title: "Frontend Development", dueDate: "2024-03-22", description: "Coding the FrontEnd in reactJS", completed: false, subtasks: [] }, // Removed status and priority
        { id: 6, title: "Test Task 1", dueDate: "2024-03-25", description: "Testing task 1", completed: false, subtasks: [] }, // Removed status and priority
        { id: 7, title: "Test Task 2", dueDate: "2024-03-28", description: "Testing task 2", completed: false, subtasks: [] }, // Removed status and priority
        { id: 8, title: "Test Task 3", dueDate: "2024-03-30", description: "Testing task 3", completed: false, subtasks: [] }, // Removed status and priority
    ]);

    const [myTasks, setMyTasks] = useState([]);
    const [filter, setFilter] = useState("");
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        const savedMyTasks = localStorage.getItem('myTasks');
        const savedAvailableTasks = localStorage.getItem('availableTasks');
        if (savedMyTasks) { setMyTasks(JSON.parse(savedMyTasks)); }
        if (savedAvailableTasks) { setAvailableTasks(JSON.parse(savedAvailableTasks)); }
    }, []);

    useEffect(() => {
        localStorage.setItem('myTasks', JSON.stringify(myTasks));
        localStorage.setItem('availableTasks', JSON.stringify(availableTasks));
    }, [myTasks, availableTasks]);

    const handleTakeTask = (taskId) => {
        const taskToTake = availableTasks.find(task => task.id === taskId);
        if (taskToTake) {
            setMyTasks(prevTasks => [...prevTasks, { ...taskToTake }]); // Removed status change
            setAvailableTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        }
    };

    const handleTaskCompletion = (taskId, subtaskId = null) => {
        setMyTasks(prevTasks =>
            prevTasks.map(task => {
                if (task.id === taskId) {
                    if (subtaskId === null) {
                        return { ...task, completed: !task.completed };
                    } else {
                        return {
                            ...task,
                            subtasks: task.subtasks.map(sub =>
                                sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
                            ),
                        };
                    }
                }
                return task;
            })
        );
    };

    const handleTaskClick = (task) => {
      setSelectedTask(task);
    };

    const filteredAvailableTasks = availableTasks.filter(task =>
        task.title.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="app">
            <h1>Team Task Manager</h1>
            {selectedTask ? (
                <TaskDetails
                    task={selectedTask}
                    myTasks={myTasks}
                    setMyTasks={setMyTasks}
                    onBack={() => setSelectedTask(null)}
                    onTaskCompletion={handleTaskCompletion}
                />
            ) : (
                <div className="task-container">
                    <div className="task-list-container">
                        <h2>&gt; My Tasks</h2>
                        <div className="task-list">
                            {myTasks.map(task => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    onTaskClick={handleTaskClick}
                                    onTaskCompletion={handleTaskCompletion}
                                    isAvailable={false}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="task-list-container">
                        <h2>&gt; Available Tasks</h2>
                        <input
                            type="text"
                            placeholder="Filter tasks..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="filter-input"
                        />
                        <div className="task-list">
                            {filteredAvailableTasks.map(task => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    onTaskClick={handleTaskClick}
                                    onTakeTask={handleTakeTask}
                                    isAvailable={true}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;