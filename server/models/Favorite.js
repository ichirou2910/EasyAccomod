const mongoose = require('mongoose');
const FavoriteSchema = new mongoose.Schema({
	user_id: {
		type: String,
		required: true,
	},
	place_id: {
		type: String,
		required: true,
	},
	title: {
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
	roomNum: {
		type: Number,
		required: true,
	},
	images: {
		type: Array,
		required: true,
	},
});

const Favorite = mongoose.model('Favorite', FavoriteSchema);

module.exports = Favorite;
