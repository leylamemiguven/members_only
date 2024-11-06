const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path'); // Required for path handling
require('dotenv').config(); // Load environment variables

const app = express();
const pool = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
const membershipRoutes = require('./routes/membership');

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

// Serve static files
app.use(express.static(path.join(__dirname, 'public'))); // For CSS and other static files

// Use routes
app.use('/', messageRoutes); // Use message routes for home and message related routes
app.use('/', authRoutes); // Use authentication routes
app.use('/', membershipRoutes); // Use authentication routes


// Server listening
const PORT = process.env.PORT || 3000; // You can change the port if needed
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
