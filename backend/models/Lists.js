const mongoose = require('mongoose');

const ListsSchema = new mongoose.Schema({
    list_id: { type: Number, required: true, unique: true },
    list_name: {type: String, required: true}
});

module.exports = mongoose.model('Lists', ListsSchema);
