const db = require('../helpers/db');
const Notice = db.Notice;

const getByContext = async (req, res, next) => {
	// if (req.params.user_id !== req.userData.user_id) {
	// 	res.status(401).json({ message: 'You are not authorized to use this' });
	// }

	let filter = {
		context_id : req.params.context_id
	};

	if (req.query.context) {
		filter["context"] = req.query.context;
	}

	if (req.query.mark) {
		filter["mark"] = req.query.mark;
	} 

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

const getAll = (req, res, next) => {
	let cmts;
	try {
		cmts = await Comment.find()
			.sort({ date: -1 });
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	res.json(cmts);
};

exports.getByContext = getByContext;
exports.getAll = getAll;
