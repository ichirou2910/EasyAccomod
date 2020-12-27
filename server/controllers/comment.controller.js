const db = require('../helpers/db');
const Comment = db.Comment;

const getById = async (req, res, next) => {
	let comments;
	try {
		comments = await Comment.find({ place_id: req.params.place_id });
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if (!comments) {
		res.status(404).json({ message: 'Comments not found' });
		return;
	}

	res.status(201).json(comments);
};

const addComment = async (req, res, next) => {
	console.log(req.body);
	if (!req.userData.user_id && req.userData.user_type !== 'Renter') {
		res.status(401).json({ message: 'You are not allowed to do this' });
		return;
	}

	const cmt = new Comment({
		username: req.body.username,
		place_id: req.params.place_id,
		content: req.body.content,
		rating: parseInt(req.body.rating),
		date: Date.now(),
	});

	try {
		await cmt.save();
	} catch (err) {
		res.status(500).json({ message: 'Comment creating failed' });
		console.log(err);
		return next(err);
	}

	res.status(200).json(cmt);
};

const _delete = async (req, res, next) => {
	let cmt;
	try {
		cmt = await Comment.findById(req.params.comment_id);
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if (cmt.user_id !== req.userData.user_id) {
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

exports.getById = getById;
exports.addComment = addComment;
exports._delete = _delete;
