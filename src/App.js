import React, { useState, useEffect } from 'react';
import './App.css';
import TaskDetails from './TaskDetails';
import TaskItem from './TaskItem';
import CreateTaskForm from './CreateTaskForm';
import AddUserForm from './AddUserForm';

function App() {
  const [availableTasks, setAvailableTasks] = useState([
    { id: 1, title: "Design Landing Page", dueDate: "2024-03-10", description: "Create initial design mockups.", completed: false, subtasks: [] },
    { id: 2, title: "Implement User Authentication", dueDate: "2024-03-15", description: "Set up login/registration flow.", completed: false, subtasks: [] },
    { id: 3, title: "Database Schema Design", dueDate: "2024-03-08", description: "Define database tables and relationships.", completed: false, subtasks: [] },
    { id: 4, title: "Write API Endpoints", dueDate: "2024-03-20", description: "Create RESTful API for task management.", completed: false, subtasks: [] },
    { id: 5, title: "Frontend Development", dueDate: "2024-03-22", description: "Coding the FrontEnd in reactJS", completed: false, subtasks: [] },
    { id: 6, title: "Test Task 1", dueDate: "2024-03-25", description: "Testing task 1", completed: false, subtasks: [] },
    { id: 7, title: "Test Task 2", dueDate: "2024-03-28", description: "Testing task 2", completed: false, subtasks: [] },
    { id: 8, title: "Test Task 3", dueDate: "2024-03-30", description: "Testing task 3", completed: false, subtasks: [] },
  ]);

  const [myTasks, setMyTasks] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [users, setUsers] = useState(['John Doe']);

  useEffect(() => {
    const savedMyTasks = localStorage.getItem('myTasks');
    const savedAvailableTasks = localStorage.getItem('availableTasks');
    const savedUsers = localStorage.getItem('users');
    if (savedMyTasks) { setMyTasks(JSON.parse(savedMyTasks)); }
    if (savedAvailableTasks) { setAvailableTasks(JSON.parse(savedAvailableTasks)); }
    if (savedUsers) { setUsers(JSON.parse(savedUsers)); }
  }, []);

  useEffect(() => {
    localStorage.setItem('myTasks', JSON.stringify(myTasks));
    localStorage.setItem('availableTasks', JSON.stringify(availableTasks));
    localStorage.setItem('users', JSON.stringify(users));
  }, [myTasks, availableTasks, users]);

  const handleTakeTask = (taskId) => {
    const taskToTake = availableTasks.find(task => task.id === taskId);
    if (taskToTake) {
      setMyTasks(prevTasks => [...prevTasks, { ...taskToTake }]);
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

  const handleAddTask = (newTask, destination) => {
    const taskId = Date.now();
    const task = {
      id: taskId,
      ...newTask,
      completed: false,
      subtasks: []
    };
    
    if (destination === 'available') {
      setAvailableTasks(prevTasks => [...prevTasks, task]);
    } else if (destination === 'my') {
      setMyTasks(prevTasks => [...prevTasks, task]);
    }
  };

  const handleAddUser = (username) => {
    if (!users.includes(username)) {
      setUsers(prevUsers => [...prevUsers, username]);
    }
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
          users={users}
        />
      ) : (
        <>
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
          
          <div className="forms-container">
            <CreateTaskForm onAddTask={handleAddTask} />
            <AddUserForm onAddUser={handleAddUser} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
