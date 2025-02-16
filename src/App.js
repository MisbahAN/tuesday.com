// src/App.js
import React, { useState } from 'react';
import './App.css';
import TaskDetails from './TaskDetails';
import TaskItem from './TaskItem'; // Import TaskItem
import { TransitionGroup } from 'react-transition-group'; // Import ONLY TransitionGroup

function App() {
    const [availableTasks, setAvailableTasks] = useState([
        { id: 1, title: "Design Landing Page", dueDate: "2024-03-10", description: "Create initial design mockups.", completed: false, status: "Not Started", priority: "High" },
        { id: 2, title: "Implement User Authentication", dueDate: "2024-03-15", description: "Set up login/registration flow.", completed: false, status: "Not Started", priority: "Medium" },
        { id: 3, title: "Database Schema Design", dueDate: "2024-03-08", description: "Define database tables and relationships.", completed: false, status: "Not Started", priority: "High" },
        { id: 4, title: "Write API Endpoints", dueDate: "2024-03-20", description: "Create RESTful API for task management.", completed: false, status: "Not Started", priority: "Low" },
        { id: 5, title: "Frontend Development", dueDate: "2024-03-22", description: "Coding the FrontEnd in reactJS", completed: false, status: "Not Started", priority: "Medium" },
        { id: 6, title: "Test Task 1", dueDate: "2024-03-25", description: "Testing task 1", completed: false, status: "Not Started", priority: "Low" },
        { id: 7, title: "Test Task 2", dueDate: "2024-03-28", description: "Testing task 2", completed: false, status: "Not Started", priority: "Medium" },
        { id: 8, title: "Test Task 3", dueDate: "2024-03-30", description: "Testing task 3", completed: false, status: "Not Started", priority: "High" },
    ]);

    const [myTasks, setMyTasks] = useState([]);
    const [filter, setFilter] = useState("");
    const [selectedTask, setSelectedTask] = useState(null);

    const handleTakeTask = (taskId) => {
        const taskToTake = availableTasks.find(task => task.id === taskId);
        if (taskToTake) {
            setTimeout(() => {
                setMyTasks(prevMyTasks => [...prevMyTasks, { ...taskToTake, status: "In Progress" }]);
                setAvailableTasks(prevAvailableTasks => prevAvailableTasks.filter(task => task.id !== taskId));
            }, 300); // Animation duration, matches CSS
        }
    };

    const handleTaskCompletion = (taskId) => {
        setTimeout(() => {
            setMyTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        }, 300); // Animation duration, matches CSS
    };

    const handleTaskClick = (taskId) => {
        let task = myTasks.find(task => task.id === taskId);
        if (!task) {
            task = availableTasks.find(task => task.id === taskId);
        }
        if (task) {
            setSelectedTask(task);
        }
    };
     const filteredAvailableTasks = availableTasks.filter((task) =>
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
                    setSelectedTask={setSelectedTask}
                    onBack={() => setSelectedTask(null)}
                />
            ) : (
                <div className="task-container">
                    <div className="my-tasks">
                        <h2>&gt; My Tasks</h2>
                        <div className="scrollable-list">
                            <TransitionGroup component="ul">
                                {myTasks.map((task) => (
                                    <TaskItem
                                        key={task.id}
                                        task={task}
                                        onTaskClick={handleTaskClick}
                                        onTaskCompletion={handleTaskCompletion}
                                        isAvailable={false} //  isAvailable prop
                                    />
                                ))}
                            </TransitionGroup>
                        </div>
                    </div>

                    <div className="available-tasks">
                        <h2>&gt; Available Tasks</h2>
                        <input
                            type="text"
                            placeholder="Filter tasks..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="filter-input"
                        />
                        <div className="scrollable-list">
                            <TransitionGroup component="ul">
                                {filteredAvailableTasks.map((task) => (
                                    <TaskItem
                                        key={task.id}
                                        task={task}
                                        onTaskClick={handleTaskClick}
                                        onTakeTask={handleTakeTask} // Pass onTakeTask
                                        isAvailable={true} //  isAvailable prop
                                    />
                                ))}
                            </TransitionGroup>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;