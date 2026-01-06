const express = require('express');
const router = express.Router();
const db = require('../database');
const verifyToken = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
router.post('/',verifyToken ,(req, res) => {
    const game_id = parseInt(req.body.game_id);
    const genre_id = parseInt(req.body.genre_id);
    if (isNaN(game_id) || game_id <= 0 || isNaN(genre_id) || genre_id <= 0) {
        return res.status(400).json({ error: "Invalid Game or Genre ID. Must be positive integers." });
    }
    const sql = "INSERT INTO game_genres (game_id, genre_id) VALUES (?, ?)";
    db.run(sql, [game_id, genre_id], function(err) {
        if (err) return res.status(400).json({ error: "Relationship already exists or invalid IDs" });
        res.json({ message: "Genre assigned to game" });
    });
});
router.get('/', (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 20;
    if (page < 1) page = 1;
    if (limit < 1) limit = 20;
    const offset = (page - 1) * limit;
    const countSql = `SELECT COUNT(*) as count FROM game_genres`;
    const dataSql = `
        SELECT gg.assigned_at, g.title as game_title, ge.name as genre_name, gg.game_id, gg.genre_id
        FROM game_genres gg
        JOIN games g ON gg.game_id = g.id
        JOIN genres ge ON gg.genre_id = ge.id
        LIMIT ? OFFSET ?`;
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
router.delete('/:gameId/:genreId', verifyToken, authorize('admin'),(req, res) => {
    const { gameId, genreId } = req.params;
    const sql = 'DELETE FROM game_genres WHERE game_id = ? AND genre_id = ?';
    db.run(sql, [gameId, genreId], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        if (this.changes === 0) {
            return res.status(404).json({ error: "Assignment not found" });
        }
        res.json({ message: "Relationship deleted" });
    });
});
module.exports = router;