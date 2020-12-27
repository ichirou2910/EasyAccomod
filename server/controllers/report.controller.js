const db = require('../helpers/db');
const Report = db.Report;

const getByUser = async (req, res, next) => {
	let reports;
	try {
		reports = await Report.find({ user_id: req.params.user_id });
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if (!reports) {
		res.status(404).json({ message: 'No report yet' });
		return;
	}

	res.status(201).json(reports);
};

const getById = async (req, res, next) => {
	let report;
	try {
		report = await Report.findById(req.params.report_id);
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if (!report) {
		res.status(404).json({ message: 'No report yet' });
		return;
	}

	res.status(201).json(report);
};

const create = async (req, res, next) => {
	const report = new Report({
		user_id: req.body.user_id,
		place_id: req.body.place_id,
		content: req.body.content,
		date: Date.now(),
	});

	try {
		await report.save();
	} catch (err) {
		res.status(500).json({ message: 'Report failed' });
		return next(err);
	}

	res.status(201).json(report);
};

exports.getByUser = getByUser;
exports.getById = getById;
exports.create = create;
