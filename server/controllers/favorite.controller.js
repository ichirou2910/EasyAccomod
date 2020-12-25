const fs = require('fs');
const db = require('../helpers/db');
const Favorite = db.Favorite;

const getById = async (req, res, next) => {
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

const add = async (req, res, next) => {
	const favorite = new Favorite({
			user_id: req.params.user_id,
			post_id: req.params.post_id,
			likes: req.params.likes,
	});

	try {
			await favorite.save();
	} catch (err) {
			res.status(500).json({ message: 'Add to favorite failed'});
			return next(err);
	}

	res.status(201).json(favorite);
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

exports.getById = getById;
exports.add = add;
exports.delete = _delete;
