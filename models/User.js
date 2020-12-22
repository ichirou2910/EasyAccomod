const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	realname: {
		type: String,
		required: true,
	},
	identifier: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	avatar: {
		type: String,
		required: false,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

UserSchema.set('toJSON', {
	virtuals: true,
	versionKey: false,
	transform: (doc, ret) => {
		delete ret._id;
		delete ret.hash;
	},
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
