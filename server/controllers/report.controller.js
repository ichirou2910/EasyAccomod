const db = require('../helpers/db');
const Report = db.Report;

const getByUser = async (req, res, next) => {
	let reports;
	try {
		reports = await Report.findById(req.params.user_id);
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
	console.log(req.body);

	// const report = new Report({
	// 	user_id: req.body.user_id,
	// 	place_id: req.body.place_id,
	// 	content: req.body.content,
	// 	date: Date.now(),
	// });

	// try {
	// 	await report.save();
	// } catch (err) {
	// 	res.status(500).json({ message: 'Report failed' });
	// 	return next(err);
	// }

	// res.status(201).json(report);
};

const _delete = async (req, res, next) => {
	let report;
	try {
		report = await Report.findById(req.params.report_id);
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if (
		report.user_id !== req.userData.user_id ||
		req.userData.user_type !== 'Admin'
	) {
		res.status(401).json({ message: 'You are not allowed to delete this' });
		return;
	}

	await report.deleteOne(report);
	res.status(201).json({});
};

exports.getByUser = getByUser;
exports.getById = getById;
exports.create = create;
exports.delete = _delete;
