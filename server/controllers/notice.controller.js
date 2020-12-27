const db = require('../helpers/db');
const Notice = db.Notice;

const getByRecvId = async (req, res, next) => {
	if (req.params.user_id !== req.userData.user_id) {
		res.status(401).json({ message: 'You are not authorized to use this' });
	}

	// Display notices to the user with the same ID
	let notices;
	try {
		notices = await Notice.find({ user_id: req.params.user_id }).sort({
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

exports.getByRecvId = getByRecvId;
