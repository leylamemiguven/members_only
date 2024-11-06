const express = require('express');
const router = express.Router();
const pool = require('../config/db'); 

// Join Club GET Route
router.get('/join', (req, res) => {
    res.render('join', { messages: {} });
});

// Join Club POST Route
router.post('/join', async (req, res) => {
    try {
        const { passcode } = req.body;
        const secretPasscode = 'superSecretPasscode'; 
        if (passcode === secretPasscode) {
            const userId = req.session.userId; // Get the logged-in user's ID
            await pool.query('UPDATE users SET membership_status = $1 WHERE id = $2', [true, userId]);
            res.redirect('/'); // Redirect after successfully joining
        } else {
            res.status(400).send('Invalid passcode.'); // Handle incorrect passcode
        }
    } catch (error) {
        console.error('Error joining the club:', error);
        res.status(500).send('Server error during membership update.');
    }
});

module.exports = router; 
