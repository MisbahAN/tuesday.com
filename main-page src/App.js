import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import './index.css';
import TaskDetails from './TaskDetails';
import TaskItem from './TaskItem';
import CreateTaskForm from './CreateTaskForm';
import AddUserForm from './AddUserForm';

const API_BASE_URL = 'http://localhost:3000';


function App() {
  const [availableTasks, setAvailableTasks] = useState([]);

  const [myTasks, setMyTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [users, setUsers] = useState(['John Doe']);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/gotolist`);
        const { assignedTasks, nonAssignedTasks } = response.data;
        setMyTasks(assignedTasks);
        setAvailableTasks(nonAssignedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    
    fetchTasks();
  }, []);


  const handleTakeTask = async (taskId) => {
    try {
      await axios.post(`${API_BASE_URL}/assigntask`, {
        task_id: taskId,
        username: 'currentUser' // TODO: Replace with actual user from auth
      });
      const updatedTasks = availableTasks.filter(task => task.task_id !== taskId);
      const takenTask = availableTasks.find(task => task.task_id === taskId);
      setAvailableTasks(updatedTasks);
      setMyTasks(prev => [...prev, takenTask]);
    } catch (error) {
      console.error('Error assigning task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
      setAvailableTasks(prevTasks => prevTasks.filter(task => task.task_id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleTaskCompletion = async (taskId, subtaskId = null) => {
    try {
      await axios.post(`${API_BASE_URL}/marktaskcompleted`, { task_id: taskId });
      setMyTasks(prevTasks =>
        prevTasks.map(task => {
          if (task.task_id === taskId) {
            return { ...task, completed: !task.completed };
          }
          return task;
        })
      );
    } catch (error) {
      console.error('Error marking task complete:', error);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleAddTask = async (newTask, destination) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/createtask`, {
        task_name: newTask.title,
        description: newTask.description,
        due_date: newTask.dueDate,
        assign_to_me: destination === 'my'
      });
      
      const createdTask = response.data;
      if (destination === 'available') {
        setAvailableTasks(prev => [...prev, createdTask]);
      } else if (destination === 'my') {
        setMyTasks(prev => [...prev, createdTask]);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleAddUser = (username) => {
    if (!users.includes(username)) {
      setUsers(prevUsers => [...prevUsers, username]);
    }
  };


  return (
      <div className="app container">
        <h1 className="text-center">Team Task Manager</h1>

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
            <div className="task-list-container mb-4">
              <h2>My Tasks</h2>
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

            <div className="task-list-container mb-4">
              <h2>Available Tasks</h2>
              <div className="task-list">
                {availableTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onTaskClick={handleTaskClick}
                    onTakeTask={handleTakeTask}
                    onDeleteTask={handleDeleteTask}
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
