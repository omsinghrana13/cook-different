const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto'); // Built-in Node module to generate tokens

const app = express();
const PORT = 3000;

// Allow server to read JSON data sent from frontend
app.use(express.json());

// Serve the frontend files (index.html, style.css, script.js) from this exact folder
app.use(express.static(__dirname));

// --- DATABASE SETUP ---
// Create a 'data' subfolder and 'users.json' file if they don't exist yet
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, JSON.stringify([]));

// Helper functions to read and write to our local JSON database
const getUsers = () => JSON.parse(fs.readFileSync(USERS_FILE));
const saveUsers = (users) => fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

// --- API: SIGN UP ---
app.post('/api/signup', (req, res) => {
    const { name, email, password } = req.body;
    const users = getUsers();

    // Check if email is already taken
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: "Email already exists!" });
    }

    // Generate a random 32-character login token
    const token = crypto.randomBytes(16).toString('hex');
    
    // Save user to our local JSON file
    // Note: Saving plain-text passwords is okay ONLY for a local fun project!
    users.push({ name, email, password, token });
    saveUsers(users);

    res.json({ message: "Signup successful", token, name });
});

// --- API: LOG IN ---
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const users = getUsers();

    // Find a matching user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        return res.status(401).json({ error: "Invalid email or password." });
    }

    // Generate a fresh session token upon login
    const token = crypto.randomBytes(16).toString('hex');
    user.token = token;
    saveUsers(users);

    res.json({ message: "Login successful", token, name: user.name });
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`🍔 Cooking Town Server is running!`);
    console.log(`👉 Open your browser and go to: http://localhost:${PORT}`);
});