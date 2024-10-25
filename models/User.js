// models/User.js
const pool = require('../config/db'); // Updated import path

class User {
    static async create({ first_name, last_name, username, password }) {
        const query = `
            INSERT INTO users (first_name, last_name, username, password, membership_status, is_admin)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [first_name, last_name, username, password, false, false]; // Default values

        const result = await pool.query(query, values);
        return result.rows[0]; // Return the created user
    }

    static async findByUsername(username) {
        const query = 'SELECT * FROM users WHERE username = $1;';
        const result = await pool.query(query, [username]);
        return result.rows[0]; // Return the user if found
    }
}

module.exports = User; // Export the User class