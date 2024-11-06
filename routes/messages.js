const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const pool = require('../config/db');

// Home route
router.get('/', async (req, res) => {
    try {
        const messages = await pool.query('SELECT * FROM messages'); // Query the messages table
        const userId = req.session.userId; // Get the user ID from the session
        let user = null;

        // Fetch user details if logged in
        if (userId) {
            const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
            user = userResult.rows[0]; // Get the user data
        }

        res.render('home', { messages: messages.rows, user: user }); // Pass user data to the view
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send('Server Error');
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
router.post('/', async (req, res) => {
    try {
        const { title, text } = req.body;
        const authorId = req.session.userId; // Get the logged-in user's ID
        const createdAt = new Date(); // Get the current date and time

        const newMessage = await Message.create({
            title: title,
            text: text,
            author_id: authorId,
            created_at: createdAt // Save the current date
        });
        res.redirect('/'); // Redirect to home after message creation
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).send('Server error during message creation.');
    }
});

// Delete Message Route
router.delete('/:id', async (req, res) => {
    console.log('Attempting to delete message with ID:', req.params.id);
    try {
        const messageId = req.params.id;
        const userId = req.session.userId; // Get the logged-in user's ID
        
        // Check if user is an admin
        const user = await User.findById(userId);
        if (!user.is_admin) {
            return res.status(403).send('Unauthorized to delete this message.');
        }

        const query = 'DELETE FROM messages WHERE id = $1;';
        await pool.query(query, [messageId]);
        
        res.redirect('/'); // Redirect after deletion
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).send('Server error during message deletion.');
    }
});

module.exports = router; // Export the router
