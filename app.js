const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const Message = require('./models/Message');
const User = require('./models/User');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path'); // Required for path handling
const { Pool } = require('pg'); 
require('dotenv').config(); 

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
