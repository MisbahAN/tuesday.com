const mongoose = require('mongoose');

const AssignmentsSchema = new mongoose.Schema({
    task_id: { 
        type: Number,
        required: true,
        ref: 'Tasks'
    },
    username: { 
        type: String,
        required: true,
        ref: 'Users'
    },
    list_id: { 
        type: Number,
        required: true,
        ref: 'Lists'
    }
});

module.exports = mongoose.model('Assigments', AssignmentsSchema);