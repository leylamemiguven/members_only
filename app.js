const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const Message = require('./models/Message');
const User = require('./models/User');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const bcrypt = require('bcrypt'); // Import bcrypt 
const path = require('path'); // Required for path handling
require('dotenv').config(); // Load environment variables

const app = express();

const pool = require('./config/db');


// Set the view engine to EJS
app.set('view engine', 'ejs'); // This line sets EJS as the view engine
app.set('views', path.join(__dirname, 'views')); // This line sets the views directory


// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({ secret: 'your secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Login GET Route
app.get('/login', (req, res) => {
    res.render('login',{ messages: {} }); // Render the register.ejs file
});

// Login POST Route
app.post('/login', async (req, res) => {
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
app.get('/register', (req, res) => {
    res.render('register',{ messages: {} }); // Render the register.ejs file
});

// Registration POST Route
app.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, username, password, confirmPassword } = req.body;

        // Validate that passwords match
        if (password !== confirmPassword) {
            return res.status(400).send('Passwords do not match.');
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create a new user instance using the User model
        const newUser = await User.create({
            first_name: firstName,
            last_name: lastName,
            username: username,
            password: hashedPassword, // Use the hashed password
            membership_status: false, // Default membership status
            is_admin: false // Default admin status
        });

        res.redirect('/'); // Redirect after successful registration
    } catch (error) {
        console.error('Error registering user:', error); // Log the error
        res.status(500).send('Server error during registration.');
    }
});

// Home route
app.get('/', async (req, res) => {
    try {
        const messages = await pool.query('SELECT * FROM messages'); // Query the messages table
        res.render('home', { messages: messages.rows, user: req.user }); // Use messages.rows for the result
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send('Server Error');
    }
});

// Server listening
const PORT = process.env.PORT || 3000; // You can change the port if needed
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
