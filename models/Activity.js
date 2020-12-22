const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
	user: {
		type: String,
		required: true,
	},
	blogId: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},
	actionId: {
		type: String,
		required: false,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

const Activity = mongoose.model('Activity', ActivitySchema);

module.exports = Activity;
