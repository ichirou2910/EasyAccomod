const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    user_type: {
        type: String,
        required: true,
    },
    place_id: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    }
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;