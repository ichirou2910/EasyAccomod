const fs = require('fs');
const db = require('../helpers/db');
const Place = db.Place;

const getAll = async (req, res, next) => {
	let places;
	try {
		places = await Place.find().sort({ date: -1 });
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	res.json(places);
};

const getByUser = async (req, res, next) => {
	let places;
	try {
		places = await Place.find({ user: req.params.user }).sort({ date: -1 });
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}
	if (!places) {
		res.status(404).json({ message: 'Place not found' });
		return;
	}

	res.json(places);
};

const getById = async (req, res, next) => {
	let place;
	try {
		place = await Place.findById(req.params.place_id);
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if (!place) {
		res.status(404).json({ message: 'Place not found' });
		return;
	}

	place.views += 1;

	try {
		await place.save();
	} catch (err) {
		res.status(500).json({ message: 'Place views update failed' });
		return next(err);
	}

	res.json(place);
};

const create = async (req, res, next) => {
	if (
		req.body.user_id !== req.userData.user_id ||
		req.body.user_type !== 'Owner'
	) {
		res.status(401).json({ message: 'Authorization failed' });
		return;
	}

	let extendDate = new Date();
	extendDate.setDate(extendDate.getDate() + 7);

	const place = new Place({
		user_id: req.body.user_id,
		title: req.body.title,
		time: parseInt(req.body.time),
		timeType: req.body.timeType,
		address: req.body.address,
		nearby: req.body.nearby,
		roomType: req.body.roomType,
		roomNum: parseInt(req.body.roomNum),
		price: parseInt(req.body.price),
		priceType: req.body.priceType,
		period: req.body.period,
		area: parseInt(req.body.area),
		shared: parseInt(req.body.shared),
		bath: req.body.bath,
		kitchen: req.body.kitchen,
		ac: req.body.ac,
		balcony: req.body.balcony,
		elec_water: req.body.elec_water,
		extras: req.body.extras,
		owner: req.body.owner,
		avatar: req.body.avatar,
		phone: req.body.phone,
		email: req.body.email,
		image: req.file.path, // Temp image
		rateSum: 0,
		rateCount: 0,
		date: Date.now(),
		status: false,
		rented: false,
		extend_date: extendDate,
		backup_extend: Date.now(),
		pay_to_extend: 0,
		views: 0,
		likes: 0,
	});

	try {
		await place.save();
	} catch (err) {
		res.status(500).json({ message: 'Place creating failed' });
		return next(err);
	}

	res.status(201).json(place);
};

const update = async (req, res, next) => {
	let place;
	try {
		place = await Place.findById(req.params.place_id);
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if (place.user_id !== req.userData.user_id) {
		res
			.status(401)
			.json({ message: 'You are not allowed to modify this place' });
		return;
	}

	if (!place) {
		res.status(404).json({ message: 'Place not found' });
		return;
	}

	// All fields to update: Fuck this sparta code
	if (!place.status) {
		if (req.body.title) {
			place.title = req.body.title;
		}
		if (req.body.address) {
			place.address = req.body.address;
		}
		if (req.body.proximity) {
			place.proximity = req.body.proximity;
		}
		if (req.body.type) {
			place.type = req.body.type;
		}
		if (req.body.price) {
			place.price = req.body.price;
		}
		if (req.body.area) {
			place.area = req.body.area;
		}
		if (req.body.bath) {
			place.bath = req.body.bath;
		}
		if (req.body.kitchen) {
			place.kitchen = req.body.kitchen;
		}
		if (req.body.ac) {
			place.ac = req.body.ac;
		}
		if (req.body.balcony) {
			place.balcony = req.body.balcony;
		}
		if (req.body.elec_water) {
			place.elec_water = req.body.elec_water;
		}
		if (req.body.others) {
			place.others = req.body.others;
		}
		if (req.body.contact) {
			place.contact = req.body.contact;
		}
	} else {
		if (req.body.rented) {
			place.rented = req.body.rented;
		}
	}

	// Delete old images and replace with new ones (if needed)
	if (req.file) {
		fs.unlink(place.cover, (err) => console.log(err));
		place.picture = req.file.path;
	}

	try {
		await place.save();
	} catch (err) {
		res.status(500).json({ message: 'Update failed' });
		return next(err);
	}
	res.status(200).json(place);
};

const _delete = async (req, res, next) => {
	let place;
	try {
		place = await place.findById(req.params.place_id);
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if (place.user_id !== req.userData.user_id) {
		res
			.status(401)
			.json({ message: 'You are not allowed to delete this place' });
		return;
	}

	if (!place) {
		res.status(404).json({ message: 'Place not found' });
		return;
	}

	await place.deleteOne(place);
	res.status(201).json({});
};

const like = async (req, res, next) => {
	let place;
	try {
		place = await Place.findById(req.params.place_id);
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if (req.userData.user_id) {
		res.status(401).json({ message: 'You are not logged in!' });
		return;
	}

	if (!place) {
		res.status(404).json({ message: 'Place not found' });
		return;
	}

	place.likes += 1;

	try {
		await place.save();
	} catch (err) {
		res.status(500).json({ message: 'Like failed' });
		return next(err);
	}
	res.status(200).json(place);
};

const extend = async (req, res, next) => {
	// Get the current place
	let place;
	try {
		place = await place.findById(req.params.place_id);
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if (place.user_id !== req.userData.user_id) {
		res
			.status(401)
			.json({ message: 'You are not allowed to extend this place' });
		return;
	}

	// Get current date
	var pricePerDay = 20000;
	var date = place.extend_date;
	var extendTo = req.body.extend_date;

	var diff = (date.getTime() - extendTo.getTime()) / (1000 * 3600 * 24);
	var price = diff * pricePerDay;

	// Update payment and extended date
	place.backup_extend = extendTo;
	place.pay_to_extend += price;

	try {
		await place.save();
	} catch (err) {
		res.status(500).json({ message: 'Extend failed' });
		return next(err);
	}
	res.status(200).json(place);
};

const rate = async (req, res, next) => {
	// Get the current place
	let place;
	try {
		place = await place.findById(req.params.place_id);
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if (req.userData.user_type === 'Owner') {
		res.status(401).json({ message: 'Owner cant rate' });
		return;
	}

	place.rateSum += req.body.rating;
	place.rateCount++;
};

exports.getAll = getAll;
exports.getByUser = getByUser;
exports.getById = getById;
exports.create = create;
exports.update = update;
exports.delete = _delete;
exports.extend = extend;
exports.like = like;
exports.rate = rate;
