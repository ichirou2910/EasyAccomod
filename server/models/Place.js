const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
	user_id: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	time: {
		type: Number,
		required: true,
	},
	timeType: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	nearby: {
		type: String,
		required: false,
	},
	ward: {
		type: String,
		required: true,
	},
	district: {
		type: String,
		required: true,
	},
	city: {
		type: String,
		required: true,
	},
	roomType: {
		type: String,
		required: true,
	},
	roomNum: {
		type: Number,
		required: true,
	},
	rented: {
		type: Boolean,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	priceType: {
		type: String,
		required: true,
	},
	realPrice: {
		type: Number,
		required: true,
	},
	period: {
		type: String,
		required: true,
	},
	area: {
		type: Number,
		required: true,
	},
	shared: {
		type: Number,
		required: true,
	},
	bath: {
		type: String,
		required: true,
	},
	kitchen: {
		type: String,
		required: true,
	},
	ac: {
		type: Number,
		required: true,
	},
	balcony: {
		type: Number,
		required: true,
	},
	elec_water: {
		type: String,
		required: true,
	},
	extras: {
		type: String,
		required: false,
	},
	images: {
		type: Array,
		required: false,
	},
	owner: {
		type: String,
		required: true,
	},
	avatar: {
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
	views: {
		type: Number,
		required: true,
	},
	likes: {
		type: Number,
		required: true,
	},
	status: {
		type: Boolean,
		required: true,
	},
	rateSum: {
		type: Number,
		required: false,
	},
	rateCount: {
		type: Number,
		required: false,
	},
	date: {
		type: Date,
		required: true,
	},
	timeRemain: {
		type: Number,
		required: true,
	},
	backupTimeRemain: {
		type: Number,
		required: false,
	},
	timeFrame: {
		type: Array,
		required: true,
	},
});

const Place = mongoose.model('Place', PlaceSchema);

module.exports = Place;
