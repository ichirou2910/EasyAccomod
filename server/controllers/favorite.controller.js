const fs = require('fs');
const db = require('../helpers/db');
const Favorite = db.Favorite;

const getById = async (req, res, next) => {
	let filter = {
		user_id: req.params.user_id,
	};
	if (req.query.place_id) {
		filter['place_id'] = req.query.place_id;
	}

	let favorites;
	try {
		favorites = await Favorite.find(filter);
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if (req.params.user_id !== req.userData.user_id) {
		res
			.status(401)
			.json({ message: 'You are not authorized to see this page' });
		return;
	}

	if (!favorites) {
		res.status(404).json({ message: 'Favorites not found' });
		return;
	}

	res.json(favorites);
};

const add = async (req, res, next) => {
	if (req.body.user_id !== req.userData.user_id) {
		res
			.status(401)
			.json({ message: 'You are not allowed to use this function' });
		return;
	}

	const favorite = new Favorite({
		user_id: req.body.user_id,
		place_id: req.body.place_id,
		title: req.body.title,
		ward: req.body.ward,
		district: req.body.district,
		city: req.body.city,
		price: req.body.price,
		priceType: req.body.priceType,
		area: req.body.area,
		roomNum: req.body.roomNum,
	});

	try {
		await favorite.save();
	} catch (err) {
		res.status(500).json({ message: 'Add to favorite failed' });
		return next(err);
	}

	res.status(201).json({});
};

const _delete = async (req, res, next) => {
	let favorite;
	try {
		favorite = await favorite.findById(req.params.place_id);
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if (req.params.user_id !== req.userData.user_id) {
		res
			.status(401)
			.json({ message: 'You are not allowed to use this function' });
		return;
	}

	if (!favorite) {
		res
			.status(404)
			.json({ message: 'This place does not exsit in your favorite' });
		return;
	}

	await favorite.deleteOne(favorite);
	res.status(201).json({});
};

exports.getById = getById;
exports.add = add;
exports.delete = _delete;
