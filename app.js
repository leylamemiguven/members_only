const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const Message = require('./models/Message');
const User = require('./models/User');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path'); // Required for path handling
const { Pool } = require('pg');   // PostgreSQL
require('dotenv').config(); // Load environment variables

const app = express();

// Database setup
const pool = new Pool({
    user: process.env.DB_USER, 
    host: 'localhost',
    database: 'members_only', 
    password: process.env.DB_PASSWORD, 
    port: 5432, // Default PostgreSQL port
});

// Test the connection
pool.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Connection error', err.stack));

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

// Registration GET Route
app.get('/register', (req, res) => {
    res.render('register',{ messages: {} }); // Render the register.ejs file
});

// Registration POST Route
app.post('/register', async (req, res) => {
    const { firstName, lastName, username, password, confirmPassword } = req.body;

    // Validate that passwords match
    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match.');
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create a new user instance
    const newUser = new User({
        first_name: firstName,
        last_name: lastName,
        username: username,
        password: hashedPassword,
        membership_status: false, // Default membership status
        is_admin: false // Default admin status
    });

    // Save the user to the database
    await newUser.save();
    res.redirect('/'); // Redirect after successful registration
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
