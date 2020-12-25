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

// const create = async (req, res, next) => {
//     var extendDate = new Date();
//     extendDate.setDate(extendDate.getDate() + 7);

//     const notice = new Notice ({
//         user_id_sender: req.params.user_id_sender,
//         user_id_receiver: req.params.user_id_receiver,
//         description: req.params.description,
//         date: Date.now(),
//     })

//     try {
//         await notice.save();
//     } catch (err) {
//         res.status(500).json({ message: 'Notice failed'});
//         return next(err);
//     }

//     res.status(201).json(notice);
// }

exports.getByRecvId = getByRecvId;
// exports.create = create;
