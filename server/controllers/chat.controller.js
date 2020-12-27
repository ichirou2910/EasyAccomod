const db = require('../helpers/db');
const Chat = db.Chat;

const getByOwnerID = async (req, res, next) => {
	if (
		req.userData.user_type !== 'Admin' &&
		req.userData.user_id !== req.params.user_id
	) {
		res.status(401).json({ message: 'You are not authorized to use this' });
		return;
	}

	let chats;
	try {
		chats = await Chat.find({ owner_id: req.params.user_id }).sort({
			date: -1,
		});
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	res.json(chats);
};

exports.getByOwnerID = getByOwnerID;
