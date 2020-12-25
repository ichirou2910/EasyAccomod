const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
	owner_id: {
		type: String,
		required: true,
	},
	user_type: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
});

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;
