const mongoose = require('mongoose');

const db = process.env.MONGO_URI;

mongoose
	.connect(db, {
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(() => console.log('MongoDB connected'))
	.catch((err) => console.log(err));

mongoose.Promise = global.Promise;

module.exports = {
	User: require('../models/User'),
	Blog: require('../models/Blog'),
	Comment: require('../models/Comment'),
	Activity: require('../models/Activity'),
	Image: require('../models/Image'),
};
