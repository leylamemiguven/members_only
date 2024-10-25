const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER, // database username
    host: 'localhost',
    database: 'members_only',
    password: process.env.DB_PASSWORD, // database password
    port: 5432, // default PostgreSQL port
});

module.exports = pool;

// Test the connection
pool.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Connection error', err.stack));


