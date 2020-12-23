const fs = require('fs');
const db = require('../helpers/db');
const Report = db.Report;

const getAll_admin = async (req, res, next) => {
	let reports;
	try {
		reports = await reports.find();
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if (!reports) {
		res.json({ message: 'No report yet' });
		return;
	}

	res.json(reports);
};

const getAll = async (req, res, next) => {
	let reports;
	try {
		reports = await reports.findById(req.params.user_id);
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	if (!reports) {
		res.json({ message: 'No report yet' });
		return;
	}

	res.json(reports);
};

const create = async (req, res, next) => {
	var extendDate = new Date();
	extendDate.setDate(extendDate.getDate() + 7);

	const report = new Report({
		user_id: req.params.user_id,
		place_id: req.params.place_id,
		description: req.params.description,
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

const _delete = async (req, res, next) => {
	let report;
	try {
		report = await report.findById(req.params.report_id);
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	await report.deleteOne(report);
	res.status(201).json({});
};

exports.getAll_admin = getAll_admin;
exports.getAll = getAll;
exports.create = create;
exports.delete = _delete;
