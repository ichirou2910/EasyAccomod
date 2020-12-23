const fs = require('fs');
const db = require('../helpers/db');
const Notice = db.Notice;

const getAll = async (req, res, next) => {
    let notices;
    try {
        notices = await notices.findById(req.params.user_id);
    } catch (err) {
        res.status(500).json({ message: 'Fetch failed' });
		return next(err);
    }

    if (!notices) {
        res.json({ message: 'No notice yet'});
        return;
    }

    res.json(notices);
};

const create = async (req, res, next) => {
    var extendDate = new Date();
    extendDate.setDate(extendDate.getDate() + 7);

    const notice = new Notice ({
        user_id_sender: req.params.user_id_sender,
        user_id_receiver: req.params.user_id_receiver,
        description: req.params.description,
        date: Date.now(),
    })

    try {
        await notice.save();
    } catch (err) {
        res.status(500).json({ message: 'Notice failed'});
        return next(err);
    }

    res.status(201).json(notice);
}

exports.getAll = getAll;
exports.create = create;