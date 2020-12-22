const db = require('../helpers/db');
const Comment = db.Comment;

const create = async (req, res, next) => {
	const comment = new Comment({
		user: req.body.user,
		blog_id: req.body.blog_id,
		content: req.body.content,
		date: Date.parse(req.body.date),
		displayDate: req.body.displayDate,
	});

	try {
		await comment.save();
	} catch (err) {
		res.status(500).json({ message: 'Comment creating failed' });
		return next(err);
	}

	res.status(201).json(comment);
};

const getByBlog = async (req, res, next) => {
	let comments;
	try {
		comments = await Comment.find({ blog_id: req.params.blog_id });
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if (!comments) {
		res.status(404).json({ message: 'No comment found' });
		return;
	}

	res.json(comments);
};

const deleteByBlog = async (req, res, next) => {
	try {
		await Comment.deleteMany({ blog_id: req.params.blog_id });
	} catch (err) {
		res.status(500).json({ message: 'Delete failed' });
		return next(err);
	}

	res.status(201).json({});
};

const deleteById = async (req, res, next) => {
	let cmt;
	try {
		cmt = await Comment.findById(req.params.cmt_id);
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if (cmt.user !== req.userData.name) {
		res
			.status(401)
			.json({ message: 'You are not allowed to delete this comment' });
		return;
	}

	if (!cmt) {
		res.status(404).json({ message: 'Comment not found' });
		return;
	}

	await Comment.deleteOne(cmt);
	res.status(201).json({});
};

exports.create = create;
exports.getByBlog = getByBlog;
exports.deleteByBlog = deleteByBlog;
exports.deleteById = deleteById;
