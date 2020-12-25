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
	nearby: {
		type: String,
		required: false,
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
		type: Number,
		required: true,
	},
	kitchen: {
		type: Number,
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
	image: {
		type: String,
		required: true,
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
	extend_date: {
		type: Date,
		required: true,
	},
	pay_to_extend: {
		type: Number,
		required: true,
	},
	backup_extend: {
		type: Date,
		required: false,
	},
});

const Place = mongoose.model('Place', PlaceSchema);

module.exports = Place;
