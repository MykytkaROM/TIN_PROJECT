const express = require('express');
const router = express.Router();
const db = require('../database');
const verifyToken = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
router.get('/', (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    if (page < 1) page = 1;
    if (limit < 1 || limit > 50) limit = 10;
    const offset = (page - 1) * limit;
    const sql = `SELECT * FROM genres LIMIT ? OFFSET ?`;
    db.all(sql, [limit, offset], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        db.get("SELECT COUNT(*) as count FROM genres", (err, result) => {
            const total = result ? result.count : 0;
            const totalPages = Math.ceil(total / limit);
            res.json({
                page,
                limit,
                total,
                totalPages,
                data: rows
            });
        });
    });
});
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM genres WHERE id = ?", [id], (err, genre) => {
        if (err) return res.status(400).json({ error: err.message });
        if (!genre) return res.status(404).json({ error: "Genre not found" });
        const sqlGames = `
            SELECT g.id, g.title, g.release_year 
            FROM games g
            JOIN game_genres gg ON g.id = gg.game_id
            WHERE gg.genre_id = ?`;
        db.all(sqlGames, [id], (err, games) => {
            if (err) return res.status(400).json({ error: err.message });
            res.json({
                data: {
                    ...genre,
                    games: games
                }
            });
        });
    });
});
router.post('/', verifyToken,(req, res) => {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });
    db.run("INSERT INTO genres (name, description) VALUES (?, ?)",
        [name, description], function(err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ id: this.lastID });
        });
});
router.put('/:id', verifyToken, authorize('admin'),(req, res) => {
    const { name, description } = req.body;
    const { id } = req.params;
    if (!name) {
        return res.status(400).json({ error: "Genre name is required" });
    }
    const sql = 'UPDATE genres SET name = ?, description = ? WHERE id = ?';
    db.run(sql, [name, description, id], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Genre not found" });
        res.json({ message: "Genre updated successfully" });
    });
});
router.delete('/:id', verifyToken, authorize('admin'),(req, res) => {
    db.run("DELETE FROM genres WHERE id = ?", req.params.id, function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});

module.exports = router;