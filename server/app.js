const path = require('path');
const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const cors = require('cors');
require('dotenv').config();
const db = require('./helpers/db');
const Chat = db.Chat;
const Notice = db.Notice;
const Place = db.Place;
const socketIo = require('socket.io');

const app = express();

// Middlewares
app.use(cors());

// Bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Crontab
cron.schedule('0 7 * * *', async function () {
	// * * * * *
	// 0 7 * * *
	let places;
	try {
		places = await Place.find();
	} catch (err) {
		res.status(500).json({ message: 'Fetch failed' });
		return next(err);
	}

	places.forEach(async (place) => {
		if (place.status) {
			if (place.timeRemain > 0) {
				place.timeRemain--;
			} else {
				place.status = false;
			}
		}

		await place.save();
	});

	console.log('Refresh Remaining days done!');
});

const server = http.createServer(app);

const io = socketIo(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
});

let notiCount = 1;

io.on('connection', (socket) => {
	// console.log('connect to a socket');
	// Object data in details
	/*
		data : {
			user_type: String,
			sender_id: String,
			recv_id: String,
			message: String,
		}
	*/
	// How chat works
	/*
		Getting data
		- Admin is also a client, who send data to server through socket
		- Add a listener 'fromClient' to hear admin's data
		- When on 'fromClient', server will send the data to all clients
		- Only one client with the corresponding user_id will display the data

		Displaying data
		- Display 1 chat room (admin - 1 owner) through owner_id => getById
		- Whenever the client listens to an event, getById will be emitted
	*/
	// Send back data
	socket.on('fromClient', async (data) => {
		let recv = new Chat({
			user_type: data.user_type,
			owner_id: data.owner_id,
			content: data.content,
			date: Date.now(),
		});
		await recv.save();
		io.sockets.emit('toClient', recv);
	});
	// How notification works
	/*
		Owner
		- When Admin confirm, will emit an event called 'notification'
		- Server will catch that, save notification data and emit 'notiClient'
		- The Owners will listen to 'notiClient', fetch api getByRecvId to display all notifications according to that Owner's id
		Admin
		- When Owner finished updating place(Only for rented field), will emit an event called 'notification'
		- Server will catch that, save notification data and emit 'notiClient'
		- The Admin will listen to 'notiClient', fetch api getByRecvId to display all notifications according to that Admin's id
	*/
	socket.on('notifyAdmin', async (data) => {
		let noti = new Notice({
			count: notiCount,
			user_id: data.user_id,
			context_id: data.context_id,
			description: data.description,
			date: Date.now(),
			context: data.context,
			mark: false,
			value: data.value,
		});
		notiCount++;
		await noti.save();
		io.sockets.emit('sendtoAdmin', noti);
	});

	socket.on('notifyClient', async (data) => {
		let noti = new Notice({
			count: 0,
			user_type: 'Admin',
			user_id: data.user_id,
			context_id: data.context_id,
			description: data.description,
			date: Date.now(),
			context: data.context,
			value: data.value,
		});
		await noti.save();
		io.sockets.emit('sendtoClient', noti);
	});
});

app.use('/uploads/images', express.static(path.join('uploads', 'images')));
app.use(express.static(path.join('public')));

// Routes
app.use('/api/user', require('./routes/user.route'));
app.use('/api/favorite', require('./routes/favorite.route'));
app.use('/api/report', require('./routes/report.route'));
app.use('/api/place', require('./routes/place.route'));
app.use('/api/notice', require('./routes/notice.route'));
app.use('/api/chat', require('./routes/chat.route'));
app.use('/api/admin', require('./routes/admin.route'));
app.use('/api/comment', require('./routes/comment.route'));

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

server.listen(PORT, console.log(`Server starts on port ${PORT}`));
