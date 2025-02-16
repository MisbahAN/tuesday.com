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

// Connect to MongoDB
mongoose.connect('mongodb+srv://Admin:<password>@cluster0.ea58rvf.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });
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
            const lists = await Lists.find({ username }).sort({ list_name: 1 }).exec();
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
    const { username, list_id } = req.body; // Get username and list_id from the form

    try {
        // Step 1: Check if the list exists
        const list = await Lists.findOne({ list_id });
        if (!list) {
            return res.status(404).json({ error: 'List not found' });
        }

        // Step 2: Create a new list entry for the user
        const newListEntry = new Lists({
            list_id: list.list_id, // Use the same list_id
            username, // Add the new username
            list_name: list.list_name // Use the same list_name
        });

        // Step 3: Save the new list entry to the database
        await newListEntry.save();

        // Step 4: Redirect to the tasks page
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
    const { list_id, username } = req.query; // Get list_id and username from the query

    try {
        // Step 1: Fetch assigned tasks for the user in the current list
        const assignments = await Assignments.find({ username, list_id });
        const assignedTaskIds = assignments.map(assignment => assignment.task_id);

        // Step 2: Fetch all tasks for the current list
        const allTasks = await Tasks.find({ list_id });

        // Step 3: Separate assigned and non-assigned tasks
        const assignedTasks = allTasks.filter(task => assignedTaskIds.includes(task.task_id));
        const nonAssignedTasks = allTasks.filter(task => !assignedTaskIds.includes(task.task_id));

        // Step 4: Render the tasks page with both assigned and non-assigned tasks
        res.render('tasks', {
            list_name: "Your List Name", // Replace with the actual list name if needed
            list_id: list_id,
            username: username,
            assignedTasks: assignedTasks,
            nonAssignedTasks: nonAssignedTasks
        });
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ error: 'Failed to fetch tasks' });
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
        return newList;
    }


app.post('/createtask', async (req, res) => {
    const { task_name, description, due_date, list_id } = req.body;
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

        const newAssignment = new Assignments({
            task_id,
            username,
            list_id: parseInt(list_id)
        });
        await newAssignment.save();

        res.redirect(`/gotolist?list_id=${list_id}&username=${username}`);
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

