const db = require('../helpers/db');
const Activity = db.Activity;

const getAll = async (req, res, next) => {
	let acts;
	try {
		acts = await Activity.find().sort({ date: -1 });
	} catch (err) {
		res.status(500).json({ message: 'Fetch activities error' });
		return next(err);
	}

	res.status(200).json(acts);
};

const create = async (req, res, next) => {
	const act = new Activity(req.body);
	try {
		await act.save();
	} catch (err) {
		res.status(500).json({ message: 'Create activities error' });
		return next(err);
	}

	res.status(200).json(act);
};

const getByName = async (req, res, next) => {
	let acts;
	try {
		acts = await Activity.find({ user: req.params.user }).sort({ date: -1 });
	} catch (err) {
		res.status(500).json({ message: 'Fetch activities error' });
		return next(err);
	}

	res.status(200).json(acts);
};

const deleteByBlog = async (req, res, next) => {
	try {
		await Activity.deleteMany({ blogId: req.params.blog_id });
	} catch (err) {
		res.status(500).json({ message: 'Fetch activities error' });
		return next(err);
	}

	res.status(201).json({});
};

const deleteByComment = async (req, res, next) => {
	try {
		await Activity.deleteMany({
			type: 'comment',
			actionId: req.params.cmt_id,
		});
	} catch (err) {
		res.status(500).json({ message: 'Fetch activities error' });
		return next(err);
	}

	res.status(201).json({});
};

exports.getAll = getAll;
exports.create = create;
exports.getByName = getByName;
exports.deleteByBlog = deleteByBlog;
exports.deleteByComment = deleteByComment;
