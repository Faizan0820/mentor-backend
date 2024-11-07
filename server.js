const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

// Connect to SQLite database or create it if it doesn’t exist
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Could not connect to database:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Create a "users" table if it doesn't already exist
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    message TEXT
)`, (err) => {
    if (err) {
        console.error('Could not create table:', err.message);
    } else {
        console.log('Table "users" is ready');
    }
});

// Route to handle POST requests to /register
app.post('/register', (req, res) => {
    const formData = req.body;

    db.run(`INSERT INTO users (name, email, message) VALUES (?, ?, ?)`, 
        [formData.name, formData.email, formData.message],
        function(err) {
            if (err) {
                console.error('Error inserting data:', err.message);
                res.status(500).send('An error occurred while saving data');
            } else {
                console.log('Data saved successfully');
                res.send('Form data saved successfully!');
            }
        }
    );
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
