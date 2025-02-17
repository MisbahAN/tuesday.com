const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const Users = require('./models/Users');
const Lists = require('./models/Lists');
const Recommendations = require('./models/Recommendations');
const Tasks = require('./models/Tasks');
const Assignments = require('./models/Assignments');
const ListAssignments = require('./models/ListAssignments');

// Connect to MongoDB
mongoose.connect('mongodb+srv://Admin:abcd1234@cluster0.ea58rvf.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });
// Middleware
app.use(express.static('views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(Users.createStrategy());
passport.serializeUser (Users.serializeUser ());
passport.deserializeUser (Users.deserializeUser ());

// Routes
app.get('/', (req, res) => {
    res.render('home');
});
app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    Users.register(new Users({ username: username }), password, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.redirect('/login');
    });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/main',
    failureRedirect: '/home'
}));

app.get('/main', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const username = req.user.username;
            // Get list assignments for the user
            const assignments = await ListAssignments.find({ username });
            // Get list_ids from assignments
            const listIds = assignments.map(a => a.list_id);
            // Get lists using the list_ids
            const lists = await Lists.find({ list_id: { $in: listIds } }).sort({ list_name: 1 }).exec();
            res.render('main', {
                username: username,
                lists: lists
            });
        } catch (err) {
            console.error('Error fetching lists:', err);
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
});

// Route to handle adding a user to the list
app.post('/addusertolist', async (req, res) => {
    const { username, list_id } = req.body;

    try {
        // Check if the user exists
        const user = await Users.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the list exists
        const list = await Lists.findOne({ list_id });
        if (!list) {
            return res.status(404).json({ error: 'List not found' });
        }

        // Check if the user is already assigned to the list
        const existingAssignment = await ListAssignments.findOne({ username, list_id });
        if (existingAssignment) {
            return res.status(400).json({ error: 'User is already assigned to this list' });
        }

        // Create new list assignment
        const newListAssignment = new ListAssignments({
            username,
            list_id
        });

        await newListAssignment.save();
        res.redirect(`/gotolist?list_id=${list_id}`);
    } catch (err) {
        console.error('Error adding user to list:', err);
        res.status(500).json({ error: 'Failed to add user to list' });
    }
});

app.post('/assigntask', async (req, res) => {
    const { task_id, list_id, username } = req.body; // Get task_id, list_id, and username from the form

    try {
        // Step 1: Check if the task is already assigned to the user
        const existingAssignment = await Assignments.findOne({ task_id, username });
        if (existingAssignment) {
            return res.status(400).json({ error: 'Task is already assigned to you' });
        }

        // Step 2: Create a new assignment
        const newAssignment = new Assignments({
            task_id,
            username,
            list_id
        });

        // Step 3: Save the new assignment to the database
        await newAssignment.save();

        // Step 4: Redirect to the tasks page
        res.redirect(`/gotolist?list_id=${list_id}`);
    } catch (err) {
        console.error('Error assigning task:', err);
        res.status(500).json({ error: 'Failed to assign task' });
    }
});
app.get('/gotolist', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    const { list_id } = req.query; // Get list_id from the query
    const username = req.user.username; // Get username from the authenticated session

    try {
        // Step 1: Fetch all tasks for the current list
        const allTasks = await Tasks.find({ list_id });

        // Step 2: Fetch all assignments for the current list
        const allAssignments = await Assignments.find({ list_id });
        
        // Step 3: Get task IDs assigned to the current user
        const userAssignments = allAssignments.filter(a => a.username === username);
        const assignedTaskIds = userAssignments.map(a => a.task_id);

        // Step 4: Get task IDs assigned to other users
        const otherAssignments = allAssignments.filter(a => a.username !== username);
        const otherAssignedTaskIds = otherAssignments.map(a => a.task_id);

        // Step 5: Separate tasks
        const assignedTasks = allTasks
            .filter(task => assignedTaskIds.includes(task.task_id))
            .sort((a, b) => {
                // Sort by completion status first, then by task_id
                if (a.completed === b.completed) {
                    return a.task_id - b.task_id;
                }
                return a.completed ? 1 : -1;
            });

        const nonAssignedTasks = allTasks
            .filter(task => !assignedTaskIds.includes(task.task_id) && 
                           !otherAssignedTaskIds.includes(task.task_id))
            .sort((a, b) => {
                // Sort by completion status first, then by task_id
                if (a.completed === b.completed) {
                    return a.task_id - b.task_id;
                }
                return a.completed ? 1 : -1;
            });

        // Step 4: Fetch the actual list name
        const list = await Lists.findOne({ list_id });

        // Step 5: Render the tasks page with the fetched data
        res.render('tasks', {
            list_name: list ? list.list_name : "Your List",
            list_id: list_id,
            username: username,
            assignedTasks: assignedTasks,
            nonAssignedTasks: nonAssignedTasks,
            showCompleted: true
        });
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

app.post('/marktaskcompleted', async (req, res) => {
    const { task_id } = req.body; // Get task_id from the request
    const username = req.user.username; // Get username from the authenticated session

    try {
        // Step 1: Find the task by task_id
        const task = await Tasks.findOne({ task_id });
        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        // Step 2: Check if the task is assigned to the user
        const assignment = await Assignments.findOne({ task_id, username });
        if (!assignment) {
            return res.status(403).json({ error: 'Task is not assigned to you' });
        }

        // Step 3: Update the completed field to true
        task.completed = true;

        // Step 4: Save the updated task to the database
        await task.save();

        // Step 5: Redirect back to the tasks page
        res.redirect(`/gotolist?list_id=${task.list_id}`); // No need to pass username here
    } catch (err) {
        console.error('Error marking task as completed:', err);
        res.status(500).json({ success: false, error: 'Failed to mark task as completed' });
    }
});

app.post('/addList', async (req, res) => {
    const { username, list_name } = req.body;
    try {
        const newList = await addList(username, list_name);
        res.redirect('/main');
    } catch (err) {
        console.error('Error creating list:', err);
        res.status(500).json({ error: 'Failed to create list' });
    }
});

async function addList(username, list_name) {
    const user = await Users.findOne({ username });
    if (!user) {
        throw new Error('User not found');
    }

    const list_id = Math.floor(Math.random() * 1000000);
    const newList = new Lists({
        list_id,
        username: user.username,
        list_name
    });

    await newList.save();

    // Create list assignment for the creator
    const newListAssignment = new ListAssignments({
        username: user.username,
        list_id
    });
    await newListAssignment.save();

    return newList;
}


app.post('/createtask', async (req, res) => {
    const { task_name, description, due_date, list_id, assign_to_me } = req.body;
    const username = req.user.username;

    try {
        const task_id = Math.floor(Math.random() * 1000000);
        const newTask = new Tasks({
            task_id,
            task_name,
            list_id: parseInt(list_id),
            description: description || '',
            due_date: due_date ? new Date(due_date) : null,
            completed: false
        });
        await newTask.save();

        // Only create assignment if assign_to_me is true
        if (assign_to_me === 'true') {
            const newAssignment = new Assignments({
                task_id,
                username,
                list_id: parseInt(list_id)
            });
            await newAssignment.save();
        }

        res.redirect(`/gotolist?list_id=${list_id}`);
    } catch (err) {
        console.error('Error creating task:', err);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

async function createUser() {
    const user = {
        username: 'hawkman',
        is_manager: true
    };
    try {
        const savedUser = await Users.create(user);
        return savedUser;
    } catch (err) {
        console.error('Error saving user:', err);
    }
}

async function createLists(username) {
    const lists = [
        { 
            list_id: Math.floor(Math.random() * 1000000),
            username: username,
            list_name: 'Project A' 
        },
        { 
            list_id: Math.floor(Math.random() * 1000000),
            username: username,
            list_name: 'Project B' 
        }
    ];
    try {
        const savedLists = await Lists.insertMany(lists);
        return savedLists;
    } catch (err) {
        console.error('Error saving lists:', err);
    }
}

async function createTasks(listIds) {
    const tasks = listIds.map(listId => ({
        task_id: Math.floor(Math.random() * 1000000),
        name: 'Sample Task',
        description: 'Task description',
        due_date: new Date('2024-03-01'),
        list_id: parseInt(listId)
    }));

    try {
        const savedTasks = await Tasks.insertMany(tasks);
        return savedTasks;
    } catch (err) {
        console.error('Error saving tasks:', err);
    }
}

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
