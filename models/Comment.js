const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
	user: {
		type: String,
		required: true,
	},
	blog_id: {
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
	},
	displayDate: { type: String, required: true },
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
