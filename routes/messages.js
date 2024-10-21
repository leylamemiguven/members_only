const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
const router = express.Router();

// Render new message form
router.get('/messages/new', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('newMessage', { messages: req.flash('error') });
    } else {
        res.redirect('/login');
    }
});

// Handle new message submission
router.post('/messages', async (req, res) => {
    const { title, text } = req.body;

    const newMessage = new Message({
        title,
        text,
        author: req.user._id // Assuming req.user is populated by Passport
    });

    try {
        await newMessage.save();
        res.redirect('/'); // Redirect to home page after saving
    } catch (error) {
        req.flash('error', 'Error creating message');
        res.redirect('/messages/new');
    }
});


// Delete message route
router.delete('/messages/:id', async (req, res) => {
    if (req.user && req.user.isAdmin) {
        try {
            await Message.findByIdAndDelete(req.params.id);
            res.redirect('/');
        } catch (error) {
            res.status(500).send('Server Error');
        }
    } else {
        res.status(403).send('Forbidden');
    }
});


module.exports = router;
