const express = require('express');
const router = express.Router();
const Message = require('../models/Message'); // Your Message model
const pool = require('../config/db'); // Your database connection


// Home route (GET)
router.get('/', async (req, res) => {
    try {
        const messages = await pool.query('SELECT * FROM messages'); // Fetch messages from the database
        const userId = req.session.userId; // Get the logged-in user's ID
        let user = null;

        // Fetch user details if logged in
        if (userId) {
            const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
            user = userResult.rows[0]; // Get the user data
        }

        res.render('home', { messages: messages.rows, user: user }); // Render home view with messages and user data
    } catch (error) {
        console.error('Error fetching messages:', error); // Log any errors
        res.status(500).send('Server error fetching messages.'); // Handle errors
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
