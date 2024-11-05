const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Login GET Route
router.get('/login', (req, res) => {
    res.render('login', { messages: {} }); // Render the login.ejs file
});

// Login POST Route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findByUsername(username); // Find user by username
        if (!user) {
            return res.status(401).send('Invalid username or password.'); // User not found
        }

        // Check password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).send('Invalid username or password.'); // Password does not match
        }

        // Set up user session
        req.session.userId = user.id; // Assuming you have a userId field in your User model
        res.redirect('/'); // Redirect to the home page after successful login
    } catch (error) {
        console.error('Error logging in user:', error); // Log the error
        res.status(500).send('Server error during login.');
    }
});

// Registration GET Route
router.get('/register', (req, res) => {
    res.render('register', { messages: {} }); // Render the register.ejs file
});

// Registration POST Route
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, username, password, confirmPassword, isAdmin } = req.body;

        // Validate that passwords match
        if (password !== confirmPassword) {
            return res.status(400).send('Passwords do not match.');
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create a new user instance using the User model
        await User.create({
            first_name: firstName,
            last_name: lastName,
            username: username,
            password: hashedPassword, // Use the hashed password
            membership_status: false, // Set default membership status to false
            is_admin: isAdmin ? true : false // Set admin status based on checkbox
        });

        res.redirect('/'); // Redirect after successful registration
    } catch (error) {
        console.error('Error registering user:', error); // Log the error
        res.status(500).send('Server error during registration.');
    }
});

module.exports = router; // Export the router
