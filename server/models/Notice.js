const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
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
		required: false
	}
});

const Notice = mongoose.model('Notice', NoticeSchema);

module.exports = Notice;
