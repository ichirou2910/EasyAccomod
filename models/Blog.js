const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
	user: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	cover: {
		type: String,
		required: false,
	},
	date: { type: Date, required: true },
	displayDate: { type: String, required: true },
});

const Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog;
