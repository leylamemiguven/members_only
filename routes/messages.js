const express = require('express');
const router = express.Router();
const Message = require('../models/Message'); // Message model
const pool = require('../config/db'); // database connection


// Home route (GET)
router.get('/', async (req, res) => {
    try {
        const messagesResult = await pool.query('SELECT * FROM messages');
        const messages = messagesResult.rows; // Fetch all messages

        // Get user ID from session
        const userId = req.session.userId; 
        let user = null;

        // Fetch user data if logged in
        if (userId) {
            const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
            user = userResult.rows[0]; // Get the user data
        }

        // Render the home page, passing messages (could be empty) and user data
        res.render('home', { messages, user });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).send('Server error fetching messages.');
    }
});
// New Message GET Route
router.get('/newMessage', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // Redirect to login if not logged in
    }
    res.render('newMessage', { messages: {} }); // Render the newMessage.ejs view
});

// New Message POST Route
router.post('/messages', async (req, res) => {
    try {
        const { title, text } = req.body;
        const authorId = req.session.userId; // Get the logged-in user's ID

        const newMessage = await Message.create({
            title: title,
            text: text,
            author_id: authorId,
        });
        res.redirect('/'); // Redirect to home after message creation
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).send('Server error during message creation.');
    }
});

// Delete Message Route
router.delete('/messages/:id', async (req, res) => {
    try {
        const messageId = req.params.id; // Get the message ID from the request parameters
        const userId = req.session.userId; // Get the logged-in user's ID

        // Check if user is an admin
        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        const user = userResult.rows[0];

        if (!user || !user.is_admin) {
            return res.status(403).send('Unauthorized to delete this message.');
        }

        await pool.query('DELETE FROM messages WHERE id = $1;', [messageId]);
        res.redirect('/'); // Redirect after deletion
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).send('Server error during message deletion.');
    }
});

module.exports = router; // Export the router
