const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
	username: {
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
	rating: {
		type: Number,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	status: {
		type: Boolean,
		required: true,
	}
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
