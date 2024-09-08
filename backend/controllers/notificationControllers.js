const Notification = require('../models/notificationModel')

const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id, isRead: false })
            .populate('sender', 'name pic')
            .populate('chat', 'chatName')
            .sort({ createdAt: -1 });

        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.body;

        await Notification.findByIdAndUpdate(notificationId, { isRead: true });

        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = { getUserNotifications, markAsRead };