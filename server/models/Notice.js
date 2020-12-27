const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
	count: {
		type: Number,
		required: false,
	},
	user_id: {
		type: String,
		required: false,
	},
	user_type: {
		type: String,
		required: false,
	},
	context_id: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	context: {
		type: String,
		required: true,
	},
	mark: {
		type: Boolean,
		required: false,
	},
	value: {
		type: Number,
		required: false,
	},
});

const Notice = mongoose.model('Notice', NoticeSchema);

module.exports = Notice;
