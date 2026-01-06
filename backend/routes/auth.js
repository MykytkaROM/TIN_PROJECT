const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const verifyToken = require('../middleware/authMiddleware');
require('dotenv').config();
// This function was AI-generated and then modified to support language persistence.
router.get('/me', verifyToken, (req, res) => {
    const sql = 'SELECT id, username, role FROM users WHERE id = ?';
    db.get(sql, [req.userId], (err, user) => {
        if (err || !user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    });
});
// This function was AI-generated and then modified to support language persistence.
router.put('/profile', verifyToken, async (req, res) => {
    const { password } = req.body;
    const userId = req.user.id;
    if (!password || password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `UPDATE users SET password = ? WHERE id = ?`;
        db.run(query, [hashedPassword, userId], function(err) {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json({ message: "Profile updated successfully" });
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});
// This function was AI-generated and then modified to support language persistence.
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password || password.length < 6) {
        return res.status(400).json({ error: "Username and password (min 6 chars) required" });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
        db.run(sql, [username, hashedPassword, 'user'], function(err) {
            if (err) return res.status(400).json({ error: "Username already exists" });
            res.json({ message: "User registered successfully" });
        });
    } catch (e) {
        res.status(500).json({ error: "Server error during registration" });
    }
});
// This function was AI-generated and then modified to support language persistence.
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err || !user) return res.status(400).json({ error: "User not found" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
    });
});

module.exports = router;