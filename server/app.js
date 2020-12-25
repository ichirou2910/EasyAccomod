const fs = require('fs');
const path = require('path');

const express = require('express');
const socket = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const db = require('./helpers/db');
const Chat = db.Chat;
const Notice = db.Notice;

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
app.use('/api/admin', require('./routes/admin.route'));
// app.use('/api/favorite', require('./routes/favorites.route'));
// app.use('/api/notice', require('./routes/notice.route'));
// app.use('/api/report', require('./routes/reports.route'));
// app.use('/api/chat', require('./routes/chat.route'));

// app.use((req, res, next) => {
// 	res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
// });

// app.use((error, req, res, next) => {
// 	if (req.file) {
// 		fs.unlink(req.file.path, (err) => {
// 			console.log(err);
// 		});
// 	}
// 	res.status(error.code || 500);
// 	res.json({ message: error.message || 'An error occured!' });
// });

const PORT = process.env.PORT || 5000;

var server = app.listen(PORT, console.log(`Server starts on port ${PORT}`));

var io = socket(server);

io.on('connection', (socket) => {

	console.log("connect to a socket");
	// Object data in details
	/*
		data : {
			user_type: String,
			sender_id: String,
			recv_id: String,
			message: String,
		}
	*/

	// How it works
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
	socket.on('fromClient', (data) => {

		let owner;

		if(data.user_type !== "Admin") {
			owner = data.sender_id;
		} else owner = data.recv_id;

		let chat = new Chat({
			user_type: data.user_type,
			owner_id: owner,
			content: data.message
		});

		chat.save();

		io.sockets.emit('toClient', data);
	});

	socket.on('notification', (data) => {
		let noti = new Notice({
			user_id_sender: data.admin_id,
			user_id_receiver: data.owner_id,
			description: data.content,
			date: Date.now()
		});

		noti.save();

		io.sockets.emit('notiClient', data);
	});

});
