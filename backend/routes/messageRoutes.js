const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { sendMessage, allMessages } = require('../controllers/messageControllers');

const router = express.Router();

//2 routes
//1.for sending message
//2.fetch all of the message in particular chat

router.route('/').post(protect,sendMessage);

router.route('/:chatId').get(protect,allMessages);

module.exports = router;