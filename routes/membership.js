const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Render membership page
router.get('/membership', (req, res) => {
    res.render('membership', { messages: req.flash('error') });
});

// Handle membership passcode submission
router.post('/membership', async (req, res) => {
    const { username, passcode } = req.body; // Make sure to collect the username as well
    const SECRET_PASSCODE = 'your_secret_passcode'; // Change this to your actual secret

    try {
        const user = await User.findOne({ username });

        if (user && passcode === SECRET_PASSCODE) {
            user.membershipStatus = true;
            await user.save();
            res.redirect('/'); // Redirect to home or dashboard
        } else {
            req.flash('error', 'Invalid passcode or username');
            res.redirect('/membership');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
