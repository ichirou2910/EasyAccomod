const fs = require('fs');
const db = require('../helpers/db');
const Favorite = db.Favorite;

const getByUser = async (req, res, next) => {
	let favorite;
	try {
		favorite = await Favorite.findById(req.params.user_id);
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if (!favorite) {
		res.status(404).json({ message: 'You do not have any favorites' });
		return;
	}

	res.json(favorite);
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
