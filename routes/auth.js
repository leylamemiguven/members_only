const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const passport = require('passport');

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
    const { firstName, lastName, username, password, confirmPassword } = req.body;
    // Validate inputs and hash password
    // Save user to the database
});

// Login route
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

module.exports = router;
