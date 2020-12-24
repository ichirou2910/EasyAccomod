const db = require('../helpers/db');
const Place = db.Place;
const User = db.User;

const permit_update = async (req, res, next) => {
	if (req.userData.user_type !== 'Admin') {
		console.log('You are not an Admin!');
		res.status(401).json({ message: 'You are not an Admin!' });
		return;
	}

	let target;
	try {
		target = await User.findOne({ email: req.body.email }, '-password');
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	target.update_permit = true;

	try {
		await target.save();
	} catch (err) {
		res.status(500).json({ message: 'Update permit failed' });
		return next(err);
	}
	res.status(200).json(target);
};

const permit_account = async (req, res, next) => {
	if (req.userData.user_type !== 'Admin') {
		console.log(req.userData.user_id);
		res.status(401).json({ message: 'You are not an Admin!' });
		return;
	}

	let target;
	try {
		target = await User.findOne({ email: req.body.email }, '-password');
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	target.status = true;

	try {
		await target.save();
	} catch (err) {
		res.status(500).json({ message: 'Update permit failed' });
		return next(err);
	}
	res.status(200).json(target);
};

const confirmExtend = async (req, res, next) => {
	let place;
	try {
		place = await Place.findById(req.body.place_id);
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if (req.userData.user_type !== 'Admin') {
		res.status(401).json({ message: 'You are not Admin!' });
		return;
	}

	if (!place) {
		res.status(404).json({ message: 'Place not found' });
		return;
	}

	place.extend_date = place.backup_extend;
	place.backup_extend = Date.now();
	place.pay_to_extend = 0;

	try {
		await place.save();
	} catch (err) {
		res.status(500).json({ message: 'Confirm Extend failed' });
		return next(err);
	}
	res.status(200).json(place);
};

const confirm = async (req, res, next) => {
	let place;
	try {
		place = await Place.findById(req.body.place_id);
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if (req.userData.user_type !== 'Admin') {
		res.status(401).json({ message: 'You are not Admin!' });
		return;
	}

	if (!place) {
		res.status(404).json({ message: 'Place not found' });
		return;
	}

	place.status = true;

	try {
		await place.save();
	} catch (err) {
		res.status(500).json({ message: 'Confirm status failed' });
		return next(err);
	}
	res.status(200).json(place);
};

const getUnapprovedUser = async (req, res, next) => {
	let users;
	try {
		users = await User.find({ status: false });
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if(req.userData.user_type !== "Admin") {
		res.status(401).json({ message: 'You are not authorized to use this' });
		return;
	}

	res.status(200).json(users);
}

const getUnapprovedPlaces = async (req, res, next) => {
	let places;
	try {
		places = await Place.find({ status: false });
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if(req.userData.user_type !== "Admin") {
		res.status(401).json({ message: 'You are not authorized to use this' });
		return;
	}

	res.status(200).json(places);
}

exports.permit_account = permit_account;
exports.permit_update = permit_update;
exports.confirm = confirm;
exports.confirmExtend = confirmExtend;
exports.getUnapprovedUser = getUnapprovedUser;
exports.getUnapprovedPlaces = getUnapprovedPlaces;
