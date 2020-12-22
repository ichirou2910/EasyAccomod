const fs = require('fs');
const db = require('../helpers/db');
const Blog = db.Blog;

const getAll = async (req, res, next) => {
	let blogs;
	try {
		blogs = await Blog.find().sort({ date: -1 });
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	res.json(blogs);
};

const getByUser = async (req, res, next) => {
	let blogs;
	try {
		blogs = await Blog.find({ user: req.params.user }).sort({ date: -1 });
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}
	if (!blogs) {
		res.status(404).json({ message: 'Blog not found' });
		return;
	}

	res.json(blogs);
};

const getById = async (req, res, next) => {
	let blog;
	try {
		blog = await Blog.findById(req.params.blog_id);
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if (!blog) {
		res.status(404).json({ message: 'Blog not found' });
		return;
	}

	res.json(blog);
};

const create = async (req, res, next) => {
	if (req.body.user !== req.userData.name) {
		res.status(401).json({ message: 'Authorization failed' });
		return;
	}

	const blog = new Blog({
		user: req.body.user,
		userId: req.body.userId,
		title: req.body.title,
		content: req.body.content,
		date: Date.parse(req.body.date),
		displayDate: req.body.displayDate,
	});

	if (req.file) {
		blog.cover = req.file.path;
	} else {
		blog.cover = 'uploads/images/blog-no-image.png';
	}

	try {
		await blog.save();
	} catch (err) {
		res.status(500).json({ message: 'Blog creating failed' });
		return next(err);
	}

	res.status(201).json(blog);
};

const update = async (req, res, next) => {
	let blog;
	try {
		blog = await Blog.findById(req.params.blog_id);
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if (blog.user !== req.userData.name) {
		res
			.status(401)
			.json({ message: 'You are not allowed to modify this post' });
		return;
	}

	if (!blog) {
		res.status(404).json({ message: 'Blog not found' });
		return;
	}

	if (req.body.title) {
		blog.title = req.body.title;
	}
	if (req.body.content) {
		blog.content = req.body.content;
	}

	blog.date = req.body.date;
	blog.displayDate = req.body.displayDate;

	// Delete old images and replace with new ones (if needed)
	if (req.file) {
		if (blog.cover !== 'uploads/images/default-avatar.png')
			fs.unlink(blog.cover, (err) => console.log(err));
		blog.cover = req.file ? req.file.path : '';
	}

	try {
		await blog.save();
	} catch (err) {
		res.status(500).json({ message: 'Update failed' });
		return next(err);
	}
	res.status(200).json(blog);
};

const _delete = async (req, res, next) => {
	let blog;
	try {
		blog = await Blog.findById(req.params.blog_id);
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if (blog.user !== req.userData.name) {
		res
			.status(401)
			.json({ message: 'You are not allowed to delete this post' });
		return;
	}

	if (!blog) {
		res.status(404).json({ message: 'Blog not found' });
		return;
	}

	await Blog.deleteOne(blog);
	res.status(201).json({});
};

exports.getAll = getAll;
exports.getByUser = getByUser;
exports.getById = getById;
exports.create = create;
exports.update = update;
exports.delete = _delete;
