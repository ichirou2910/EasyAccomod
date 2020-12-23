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
	status: {
		type: Boolean,
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
	area: {
		type: Number,
		required: true,
	},
	shared: {
		type: Boolean,
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
		type: String,
		required: true,
	},
	balcony: {
		type: String,
		required: true,
	},
	elec_water: {
		type: String,
		required: true,
	},
	others: {
		type: String,
		required: false,
	},
	images: {
		type: Array,
		required: true,
	},
	contact: {
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
	rateSum: {
		type: Number,
		required: true,
	},
	rateCount: {
		type: Number,
		required: true,
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
