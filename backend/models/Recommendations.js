const mongoose = require('mongoose');

const RecommendationsSchema = new mongoose.Schema({
    task_id: {
        type: Number, 
        required: true, 
        unique: true,
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
    }
});

module.exports = mongoose.model('Recommendations', RecommendationsSchema);