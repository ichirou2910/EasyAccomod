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
});

const Favorite = mongoose.model('Favorite', FavoriteSchema);

module.exports = Favorite;
