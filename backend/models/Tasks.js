const mongoose = require('mongoose');

const TasksSchema = new mongoose.Schema({
    task_id: { type: Number, required: true, unique: true},
    task_name: { type: String, required: true },
    description: { type: String },
    due_date: { type: Date },
    list_id: {type: Number, required: true, ref: 'Lists'},
    completed: {type: Boolean}
});

module.exports = mongoose.model('Tasks', TasksSchema);