const config = process.env.SECRET;
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../helpers/db');
const User = db.User;

const schema = require('../config/schema');

const register = async (req, res, next) => {
	const email = req.body.email;

	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		res.status(500).json({ message: 'Register failed' });
		return next(err);
	}

	if (existingUser) {
		res.status(422).json({ message: 'Username exists' });
		return;
	}

	try {
		schema.validate(req.body);
	} catch (err) {
		res.status(500).json({ message: 'Register failed' });
		return next(err);
	}

	const user = new User({
		...req.body,
		update_permit: false,
		status: false,
		payment: 0,
		avatar: 'uploads/images/default-avatar.png',
	});

	// If user is renter
	if (user.user_type === 'Renter') {
		console.log('User is renter');
		user.status = true;
		user.update_permit = true;
	}

	// Hash password
	user.password = await bcrypt.hash(req.body.password, 10);

	try {
		await user.save();
	} catch (err) {
		res.status(500).json({ message: 'Register failed' });
		return next(err);
	}

	const token = jwt.sign(
		{ email: user.email, user_type: user.user_type, user_id: user.id },
		config,
		{ expiresIn: '7d' }
	);
	res.status(201).json({
		user: {
			userId: user.id,
			email: user.email,
			realname: user.realname,
			avatar: user.avatar,
			address: user.addres,
			phone: user.phone,
			user_type: user.user_type,
			status: user.status,
		},
		token: token,
	});
};

const login = async (req, res, next) => {
	let user;
	try {
		user = await User.findOne({ email: req.body.email });
	} catch (err) {
		res.status(500).json({ message: 'Login failed' });
		return next(err);
	}

	if (!user) {
		res.status(404).json({ message: 'User not found. Please register.' });
		return;
	}

	if (!user.status) {
		res.status(401).json({ message: 'User not yet approved.' });
		return;
	}

	if (bcrypt.compareSync(req.body.password, user.password)) {
		const token = jwt.sign(
			{ email: user.email, user_type: user.user_type, user_id: user.id },
			config,
			{ expiresIn: '7d' }
		);
		res.status(201).json({
			user: {
				user_id: user.id,
				user_type: user.user_type,
				email: user.email,
				realname: user.realname,
				avatar: user.avatar,
				status: user.status,
			},
			token: token,
		});
	} else {
		res.status(400).json({ message: 'Username or password is incorrect' });
	}
};

const getAll = async (_req, res, next) => {
	// This route is admin-only
	if (req.userData.user_type !== 'Admin') {
		res.status(401).json({ message: 'Authorization failed' });
		return;
	}

	let users;
	try {
		users = await User.find({}, '-password');
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	res.json(users);
};

const getById = async (req, res, next) => {
	// Admin can view all users
	if (req.userData.user_type !== 'Admin') {
		// But others can view their own only
		if (req.userData.user_id !== req.params.user_id) {
			res.status(401).json({ message: 'Authorization failed' });
			return;
		}
	}

	let user;
	try {
		user = await User.findById(req.params.user_id).select('-password');
		// user = await User.find({ _id: req.params.user_id }).select('-password');
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if (!user) {
		res.status(404).json({ message: 'User not found' });
		return;
	}

	res.json(user);
};

const getByName = async (req, res, next) => {
	let users;
	try {
		users = await User.find({ realname: req.body.realname }, '-password');
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if (!users) {
		res.status(404).json({ message: 'User not found' });
		return;
	}

	res.json(users[0]);
};

const avatarByName = async (req, res, next) => {
	let users;
	try {
		users = await User.find({ realname: req.params.realname });
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if (!users) {
		res.status(404).json({ message: 'User not found' });
		return;
	}

	const { avatar } = users[0];
	res.json(avatar);
};

const update = async (req, res, next) => {
	// Prevent other people update your profile
	if (req.params.user_id !== req.userData.user_id) {
		res
			.status(401)
			.json({ message: 'You are not allowed to modify this user' });
		return;
	}

	let user;
	try {
		user = await User.findById(req.params.user_id);
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if (!user) {
		res.status(404).json({ message: 'User not found' });
		return;
	}

	// Prevent other people update your profile
	if (user.user_id !== req.userData.user_id) {
		res
			.status(401)
			.json({ message: 'You are not allowed to modify this user' });
		return;
	}

	// Check if it's the Owner and has the permit
	if (user.user_type === 'Owner') {
		if (!user.update_permit) {
			res
				.status(401)
				.json({ message: 'Contact your admin for further changes' });
			return;
		} else {
			user.update_permit = false;
		}
	}

	if (req.body.realname) {
		user.realname = req.body.realname;
	}

	if (req.body.identifier) {
		user.identifier = req.body.identifier;
	}

	if (req.body.address) {
		user.address = req.body.address;
	}

	if (req.body.phone) {
		user.phone = req.body.phone;
	}

	if (req.body.password) {
		user.password = await bcrypt.hash(req.body.password, 10);
	}

	// Delete old images and replace with new ones (if needed)
	if (req.files) {
		if (req.files.avatar) {
			if (user.avatar !== 'uploads/images/default-avatar.png')
				fs.unlink(user.avatar, (err) => console.log(err));
			user.avatar = req.files.avatar ? req.files.avatar[0].path : '';
		}
	}

	try {
		await user.save();
	} catch (err) {
		res.status(500).json({ message: 'Update failed' });
		return next(err);
	}

	const { avatar } = user;
	res.status(201).json({ avatar });
};

const _delete = async (req, res, _next) => {
	await User.findByIdAndRemove(req.params.id);
	res.status(201).json({});
};

exports.register = register;
exports.login = login;
exports.getAll = getAll;
exports.getById = getById;
exports.getByName = getByName;
exports.avatarByName = avatarByName;
exports.update = update;
exports.delete = _delete;
