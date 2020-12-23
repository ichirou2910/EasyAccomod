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
		req.userData = { 
			email: decodedToken.email,
			user_type: decodedToken.user_type,
			user_id: decodedToken.user_id
		};
		next();
	} catch (err) {
		res.status(401).json({ message: 'Authentication failed!' });
		return next(err);
	}
};
