const express = require('express');
const router = express.Router();
const db = require('../database');
const verifyToken = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
router.get('/', (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    if (page < 1) page = 1;
    if (limit < 1 || limit > 100) limit = 10;
    const offset = (page - 1) * limit;
    const dataSql = `SELECT * FROM games LIMIT ? OFFSET ?`;
    const countSql = `SELECT COUNT(*) as count FROM games`;
    db.get(countSql, [], (err, result) => {
        if (err) return res.status(400).json({ error: err.message });
        const total = result.count;
        db.all(dataSql, [limit, offset], (err, rows) => {
            if (err) return res.status(400).json({ error: err.message });
            res.json({
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                data: rows
            });
        });
    });
});
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT g.*, GROUP_CONCAT(ge.name, ', ') as genres_list
        FROM games g
                 LEFT JOIN game_genres gg ON g.id = gg.game_id
                 LEFT JOIN genres ge ON gg.genre_id = ge.id
        WHERE g.id = ?
        GROUP BY g.id
    `;
    db.get(sql, [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "Game not found" });
        res.json({ data: row });
    });
});
router.post('/',verifyToken ,(req, res) => {
    const error = validateGame(req.body);
    if (error) return res.status(400).json({ error });
    const { title, description, release_year, rating } = req.body;
    if (!title || !release_year) {
        return res.status(400).json({ error: "Title and Release Year are required" });
    }
    const sql = 'INSERT INTO games (title, description, release_year, rating) VALUES (?,?,?,?)';
    db.run(sql, [title, description, release_year, rating], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});
router.put('/:id',verifyToken ,authorize('admin') ,(req, res) => {
    const error = validateGame(req.body);
    if (error) return res.status(400).json({ error });
    const { title, description, release_year, rating } = req.body;
    const sql = `UPDATE games SET title = ?, description = ?, release_year = ?, rating = ? WHERE id = ?`;
    db.run(sql, [title, description, release_year, rating, req.params.id], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ updated: this.changes });
    });
});
router.delete('/:id',verifyToken ,authorize('admin'),(req, res) => {
    db.run("DELETE FROM games WHERE id = ?", req.params.id, function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});
const validateGame = (data) => {
    let { title, release_year, rating } = data;
    if (!title || typeof title !== 'string' || title.trim() === '') return "Invalid title";
    release_year = parseInt(release_year, 10);
    const currentYear = new Date().getFullYear();
    if (!Number.isInteger(release_year) || release_year < 1950 || release_year > currentYear + 10) {
        return `Year must be from 1950 to ${currentYear + 10}`;
    }
    if (rating !== undefined && rating !== '') {
        const ratingFloat = parseFloat(rating);
        if (isNaN(ratingFloat) || ratingFloat < 0 || ratingFloat > 10) {
            return "Rating must be between 0 and 10";
        }
    }
    return null;
};
module.exports = router;