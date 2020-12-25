const db = require('../helpers/db');
const Chat = db.Chat;

const getByOwnerID = async (req, res, next) => {
    let chats;
	try {
		chats = await Chat.find({ owner_id: req.params.user_id });
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if(chats.owner_id !== req.userData.user_id) {
        res.status(401).json({ message: 'You are not authorized to use this' });
    }

	res.json(chats);
}

exports.getByOwnerID = getByOwnerID;