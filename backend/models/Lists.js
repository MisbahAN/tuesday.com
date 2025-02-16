const mongoose = require('mongoose');

const ListsSchema = new mongoose.Schema({
    list_id: { type: Number, required: true, unique: true },
    username: { type: String , required: true, ref: 'Users'},
    list_name: {type: String, required: true}
});

module.exports = mongoose.model('Lists', ListsSchema);
