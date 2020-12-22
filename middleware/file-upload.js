const multer = require('multer');
const { v4: uuid } = require('uuid');

const MIME_TYPE_MAP = {
	'image/png': 'png',
	'image/jpeg': 'jpeg',
	'image/jpg': 'jpg',
};

const fileUpload = multer({
	limits: 512000,
	storage: multer.diskStorage({
		destination: (_req, _file, func) => {
			func(null, 'uploads/images');
		},
		filename: (_req, file, func) => {
			const ext = MIME_TYPE_MAP[file.mimetype];
			func(null, uuid() + '.' + ext);
		},
	}),
	fileFilter: (_req, file, func) => {
		const isValid = !!MIME_TYPE_MAP[file.mimetype];
		let error = isValid ? null : new Error('Invalid mime type!');
		func(error, isValid);
	},
});

module.exports = fileUpload;
