const jwt = require('jsonwebtoken');
const config = process.env.SECRET;

module.exports = (req, res, next) => {
	try {
		let token;
		if (!req.get('authorization')) {
			throw new Error('Authentication failed!');
		} else {
			token = req.get('authorization').split(' ')[1];
			if (!token) {
				throw new Error('Authentication failed!');
			}
		}
		const decodedToken = jwt.verify(token, config);
		req.userData = { name: decodedToken.name };
		next();
	} catch (err) {
		res.status(401).json({ message: 'Authentication failed!' });
		return next(err);
	}
};
