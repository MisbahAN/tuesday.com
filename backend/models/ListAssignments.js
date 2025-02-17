const mongoose = require('mongoose');

const ListAssignmentsSchema = new mongoose.Schema({
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

module.exports = mongoose.model('ListAssigments', ListAssignmentsSchema);