import React, { useState, useEffect } from 'react';
import './App.css';
import TaskDetails from './TaskDetails';
import TaskItem from './TaskItem';
import AuthForm from './components/AuthForm';
import ListSelector from './components/ListSelector';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [lists, setLists] = useState([]);
    const [selectedListId, setSelectedListId] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [filter, setFilter] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/check-auth');
                const data = await response.json();
                if (data.isLoggedIn) {
                    setIsLoggedIn(true);
                    setUser(data.user);
                    fetchLists(); // Fetch lists immediately after successful auth check
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                }
            } catch (error) {
                console.error("Error checking auth:", error);
                setIsLoggedIn(false);
                setUser(null);
            }
        };

        checkAuth();
    }, []);

    const fetchLists = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/main');
            if (response.ok) {
                const data = await response.json();
                setLists(data.lists); // Make sure this line is correct
            } else {
                console.error('Failed to fetch lists:', response.status);
                setError('Failed to fetch lists.');
            }
        } catch (error) {
            console.error('Error fetching lists:', error);
            setError('Error fetching lists.');
        }
    };

    const handleLoginSuccess = (userData) => {
        setIsLoggedIn(true);
        setUser(userData);
        fetchLists(); // Fetch lists on login
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/logout');
            if (response.ok) {
                setIsLoggedIn(false);
                setUser(null);
                setLists([]);
                setSelectedListId(null);
                setTasks([]);
                setSelectedTask(null);
                setFilter("");
                setError(null);
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };
    const handleSelectList = async (listId, username) => {
      setSelectedListId(listId);
      setError(null);

      if(!listId) {
        setTasks([]);
        return;
      }

      try {
          const response = await fetch(`http://localhost:3001/api/gotolist?list_id=${listId}&username=${username}`);
          if(response.ok) {
              const data = await response.json();
              setTasks([...data.assignedTasks, ...data.nonAssignedTasks]);
              setSelectedTask(null);
          } else {
            console.error('Failed to fetch tasks:', response.status);
            setError('Failed to fetch tasks for the selected list.');
            setTasks([]);
          }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError('Error fetching tasks for the selected list.');
        setTasks([]);
      }
    };

    const handleBackToList = () => {
        setSelectedListId(null);
        setTasks([]);
        setFilter("");
    }

    const handleTaskClick = (task) => {
        setSelectedTask(task);
    };
      const handleTaskCompletion = (taskId, subtaskId = null) => {
        //  backend logic for task completion
        console.log(`Task ${taskId} completed (subtask: ${subtaskId})`);
    };
     const filteredTasks = tasks.filter(task =>
        task.task_name.toLowerCase().includes(filter.toLowerCase())
    );


    return (
        <div className="app">
            {isLoggedIn ? (
                <>
                    <div className='app-header'>
                        <h1>Team Task Manager</h1>
                        {user && <span className="welcome-message">Welcome, {user.username}!</span>}
                        <button className="logout-button" onClick={handleLogout}>Logout</button>
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    {!selectedListId ? (
                        <ListSelector lists={lists} onSelectList={handleSelectList} username={user.username} />
                    ) : (
                        <>
                         <button className="back-button" onClick={handleBackToList}>Back to Lists</button>  {/*Back Button*/}
                         {selectedTask ? (
                                <TaskDetails task={selectedTask}  onBack={() => setSelectedTask(null)} onTaskCompletion={handleTaskCompletion}/>

                         ) :(
                            <div className="task-container">
                                <div className="task-list-container">
                                         <h2>&gt; Tasks</h2>
                                         <input
                                            type="text"
                                            placeholder="Filter tasks..."
                                             value={filter}
                                            onChange={(e) => setFilter(e.target.value)}
                                             className="filter-input"
                                         />
                                    <div className="task-list">

                                        {filteredTasks.map((task) => (
                                        <TaskItem
                                            key={task.task_id} // Use task_id as the key
                                            task={{
                                                id: task.task_id,  // Use task_id
                                                title: task.task_name,
                                                dueDate: task.due_date ? new Date(task.due_date).toLocaleDateString() : "No Due Date",
                                                completed: task.completed,
                                                subtasks: [] // You'll need to handle subtasks separately if you have them
                                               }}
                                            onTaskClick={handleTaskClick}
                                            onTaskCompletion={handleTaskCompletion}
                                             isAvailable={false} // You'll need to adjust this based on your task assignment logic
                                        />
                                        ))}
                                    </div>
                                </div>
                          </div>
                        )}
                        </>
                    )}
                </>
            ) : (
                <AuthForm onLogin={handleLoginSuccess} />
            )}
        </div>
    );
}

export default App;