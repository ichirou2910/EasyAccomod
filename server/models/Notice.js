const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
    send_id: {
        type: String,
        required: true,
    },
    recv_id: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: { 
        type: Date, 
        required: true,
	},
});

const Notice = mongoose.model('Notice', NoticeSchema);

module.exports = Notice;