const config = process.env.SECRET;
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../helpers/db');
const User = db.User;

const schema = require('../config/schema');

const register = async (req, res, next) => {
	let existingUser;
	try {
		existingUser = await User.findOne({ name: req.body.name });
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
		avatar: 'uploads/images/default-avatar.png',
	});

	// Hash password
	user.password = await bcrypt.hash(req.body.password, 10);

	try {
		await user.save();
	} catch (err) {
		res.status(500).json({ message: 'Register failed' });
		return next(err);
	}

	const token = jwt.sign({ name: user.name }, config, { expiresIn: '7d' });
	res.status(201).json({
		user: {
			userId: user.id,
			name: user.name,
			avatar: user.avatar,
		},
		token: token,
	});
};

const login = async (req, res, next) => {
	let user;
	try {
		user = await User.findOne({ name: req.body.name });
	} catch (err) {
		res.status(500).json({ message: 'Login failed' });
		return next(err);
	}

	if (!user) {
		res.status(404).json({ message: 'User not found. Please register.' });
		return;
	}

	if (bcrypt.compareSync(req.body.password, user.password)) {
		const token = jwt.sign({ name: user.name }, config, { expiresIn: '7d' });
		res.status(201).json({
			user: {
				userId: user.id,
				name: user.name,
				avatar: user.avatar,
			},
			token: token,
		});
	} else {
		res.status(400).json({ message: 'Username or password is incorrect' });
	}
};

const getAll = async (_req, res, next) => {
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
	let user;
	try {
		user = await User.findById(req.params.user_id).select('-password');
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
		users = await User.find({ name: req.params.name }, '-password');
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
		users = await User.find({ name: req.params.name });
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
	let users;
	try {
		users = await User.find({ name: req.params.name });
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if (!users) {
		res.status(404).json({ message: 'User not found' });
		return;
	}

	const user = users[0];

	if (user.name !== req.userData.name) {
		res
			.status(401)
			.json({ message: 'You are not allowed to modify this user' });
		return;
	}

	if (req.body.description) {
		user.description = req.body.description;
	}

	// Delete old images and replace with new ones (if needed)
	if (req.files) {
		if (req.files.avatar) {
			if (user.avatar !== 'uploads/images/default-avatar.png')
				fs.unlink(user.avatar, (err) => console.log(err));
			user.avatar = req.files.avatar ? req.files.avatar[0].path : '';
		}
		if (req.files.cover) {
			if (user.cover !== 'uploads/images/default-cover.png')
				fs.unlink(user.cover, (err) => console.log(err));
			user.cover = req.files.cover ? req.files.cover[0].path : '';
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
