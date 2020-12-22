const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
	user: {
		type: String,
		required: true,
	},
	path: {
		type: String,
		required: true,
	},
	date: { type: Date, required: true, default: Date.now() },
});

const Image = mongoose.model('Image', ImageSchema);

module.exports = Image;
