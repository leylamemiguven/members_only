const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Login GET Route
router.get('/login', (req, res) => {
    res.render('login', { messages: {} });
});

// Login POST Route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findByUsername(username); // Adjust based on your model

        if (!user) {
            return res.status(401).send('Invalid username or password.');
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).send('Invalid username or password.');
        }

        req.session.userId = user.id; // Store user ID in session
        res.redirect('/'); // Redirect on success
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Server error during login.');
    }
});

// Registration GET Route
router.get('/register', (req, res) => {
    res.render('register', { messages: {} });
});

// Registration POST Route
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, username, password, confirmPassword, isAdmin } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).send('Passwords do not match.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            first_name: firstName,
            last_name: lastName,
            username: username,
            password: hashedPassword,
            membership_status: false,
            is_admin: isAdmin === 'true' // Convert checkbox value
        });

        res.redirect('/'); // Redirect after successful registration
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Server error during registration.');
    }
});

module.exports = router; // Export the router
