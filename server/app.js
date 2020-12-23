const fs = require('fs');
const path = require('path');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());

// Bodyparser
app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));
app.use(express.static(path.join('public')));

// Routes
app.use('/api/user', require('./routes/user.route'));
app.use('/api/place', require('./routes/place.route'));
// app.use('/api/favorite', require('./routes/favorites.route'));
// app.use('/api/notice', require('./routes/notice.route'));
// app.use('/api/report', require('./routes/reports.route'));
// app.use('/api/chat', require('./routes/chat.route'));

app.use((req, res, next) => {
	res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.use((error, req, res, next) => {
	if (req.file) {
		fs.unlink(req.file.path, (err) => {
			console.log(err);
		});
	}
	res.status(error.code || 500);
	res.json({ message: error.message || 'An error occured!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server starts on port ${PORT}`));
