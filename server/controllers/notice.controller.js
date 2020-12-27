const db = require('../helpers/db');
const Notice = db.Notice;

const filter = async (req, res, next) => {
	// if (req.params.user_id !== req.userData.user_id) {
	// 	res.status(401).json({ message: 'You are not authorized to use this' });
	// }

	let filter = {};

	if (req.query.context) {
		filter['context'] = req.query.context;
	}

	if (req.query.mark) {
		filter['mark'] = parseInt(req.query.mark) ? true : false;
	}

	console.log(filter);

	// Display notices to the user with the same ID
	let notices;
	try {
		notices = await Notice.find(filter).sort({
			date: -1,
		});
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if (!notices) {
		res.status(404).json({ message: 'No notice yet' });
		return;
	}

	res.json(notices);
};

const getByUser = async (req, res, next) => {
	// Display notices to the user with the same ID
	let notices;
	try {
		notices = await Notice.find({
			user_id: req.params.user_id,
			user_type: 'Admin',
		}).sort({
			date: -1,
		});
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if (!notices) {
		res.status(404).json({ message: 'No notice yet' });
		return;
	}

	res.json(notices);
};

const markByNumber = async (req, res, next) => {
	// if (req.params.user_id !== req.userData.user_id) {
	// 	res.status(401).json({ message: 'You are not authorized to use this' });
	// }

	// Display notices to the user with the same ID
	let notice;
	try {
		notice = await Notice.findOne({ count: parseInt(req.params.count) });
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if (!notice) {
		res.status(404).json({ message: 'No notice yet' });
		return;
	}

	notice.mark = true;

	await notice.save();

	res.json(notice);
};

const getAll = async (req, res, next) => {
	let cmts;
	try {
		cmts = await Notice.find({ count: { $ne: 0 } }).sort({ date: -1 });
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	res.status(200).json(cmts);
};

exports.getByContext = filter;
exports.getByUser = getByUser;
exports.markByNumber = markByNumber;
exports.getAll = getAll;
