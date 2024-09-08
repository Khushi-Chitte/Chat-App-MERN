const asyncHandler = require("express-async-handler");
const Message = require('../models/messageModel');
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const Notification = require('../models/notificationModel')

const sendMessage = asyncHandler(async(req,res)=>{
    const {content,chatId} = req.body;
    if(!content || !chatId){
        console.log('Invalid data passed into request');
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat:chatId

    }
    try {
        var message = await Message.create(newMessage);
        message = await message.populate('sender','name pic');
        message = await message.populate('chat');
        message = await User.populate(message,{
            path:'chat.users',
            select:'name pic email'
        })
        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage: message,
        })
        res.json(message);

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }


})

const allMessages = asyncHandler(async(req,res)=>{
    try {
        const messages = await Message.find({chat:req.params.chatId})
        .populate('sender','name pic email')
        .populate('chat');
        
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
        
    }
})

const sendNotification = async (req, res) => {
    const { chatId, content } = req.body;

    if (!content || !chatId) {
        return res.status(400).send({ message: 'Invalid data passed' });
    }

    try {
        const newMessage = await Message.create({
            sender: req.user._id,
            content: content,
            chat: chatId,
        });

        // Populate the message with user and chat details
        const populatedMessage = await newMessage.populate('sender', 'name pic')
            .populate('chat')
            .execPopulate();

        // Notify all users in the chat except the sender
        const usersToNotify = populatedMessage.chat.users.filter(user => user._id.toString() !== req.user._id.toString());

        usersToNotify.forEach(async (user) => {
            await Notification.create({
                user: user._id,
                chat: chatId,
                sender: req.user._id,
                message: content,
            });
        });

        res.json(populatedMessage);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

module.exports = { sendMessage, allMessages, sendNotification }