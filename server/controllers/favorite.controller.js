const fs = require('fs');
const db = require('../helpers/db');
const Favorite = db.Favorite;

const getByUser = async (req, res, next) => {
	let favorites;
	try {
		favorites = await Favorite.find({ user_id: req.params.user_id });
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if (!favorites) {
		res.status(404).json({ message: 'Favorites not found' });
		return;
	}

	res.json(favorites);
};

const _delete = async (req, res, next) => {
	let favorite;
	try {
		favorite = await favorite.findById(req.params.place_id);
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	/*if (!favorite) {
        res.status(404).json({ message: 'Place do not exsit in your favorite' });
		return;
    }*/

	await favorite.deleteOne(favorite);
	res.status(201).json({});
};

exports.getByUser = getByUser;
exports.delete = _delete;
