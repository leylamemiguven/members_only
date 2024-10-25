const pool = require('../config/db'); // Import your database pool configuration

// Message class for interacting with the messages table
class Message {
    static async create({ title, text, author_id }) {
        const query = `
            INSERT INTO messages (title, text, author_id)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const values = [title, text, author_id];

        const result = await pool.query(query, values);
        return result.rows[0]; // Return the created message
    }

    static async findAll() {
        const query = 'SELECT * FROM messages ORDER BY timestamp DESC;';
        const result = await pool.query(query);
        return result.rows; // Return all messages
    }
}

module.exports = Message; // Export the Message class