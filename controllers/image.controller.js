const fs = require('fs');
const db = require('../helpers/db');
const Image = db.Image;

const search = async (req, res, next) => {
	let image;
	try {
		image = await Image.findOne({ path: req.body.path });
	} catch (err) {
		res.status(500).json({ message: 'Image searching failed' });
		return next(err);
	}

	if (!image) {
		res.status(404).json({ message: 'Image not found' });
		return;
	}

	res.status(200).json(image);
};

const upload = async (req, res, next) => {
	const image = new Image({
		user: req.body.user,
		path: req.file.path,
	});

	if (req.body.user !== req.userData.name) {
		res.status(401).json({ message: 'Authorization failed' });
		return;
	}

	try {
		await image.save();
	} catch (err) {
		res.status(500).json({ message: 'Image uploading failed' });
		return next(err);
	}

	res.status(201).json(image);
};

const _delete = async (req, res, next) => {
	let image;
	try {
		image = await Image.findById(req.params.image_id);
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if (image.user !== req.userData.name) {
		res
			.status(401)
			.json({ message: 'You are not allowed to delele this image' });
		return;
	}

	if (!image) {
		res.status(404).json({ message: 'Image not found' });
		return;
	}

	fs.unlink(image.path, (err) => console.log(err));
	await Image.deleteOne(image);
	res.status(201).json({});
};

exports.search = search;
exports.upload = upload;
exports.delete = _delete;
