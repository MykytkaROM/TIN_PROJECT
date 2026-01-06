// This schema + data was fully AI-generated.
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'games.db'), (err) => {
    if (err) {
        return console.error('Connection error:', err.message);
    }
    console.log('Connected to the SQLite database for initialization.');
});
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS genres (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        release_year INTEGER,
        rating REAL DEFAULT 0.0
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS game_genres (
        game_id INTEGER,
        genre_id INTEGER,
        assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (game_id, genre_id),
        FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
        FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT CHECK(role IN ('guest', 'user', 'admin')) DEFAULT 'user'
    )`);
    console.log('All tables created successfully.');
     //db.run("DELETE FROM game_genres");
    //db.run("DELETE FROM games");
    //db.run("DELETE FROM genres");

    const insertGenre = db.prepare("INSERT OR IGNORE INTO genres (name, description) VALUES (?, ?)");
    const genres = [
        ['RPG', 'Role-playing games with deep stories'],
        ['Action', 'Fast-paced gameplay and combat'],
        ['Adventure', 'Focus on exploration and puzzle-solving'],
        ['Strategy', 'Games requiring tactical thinking'],
        ['Horror', 'Designed to frighten and thrill'],
        ['Shooter', 'Combat-focused games using firearms'],
        ['Simulation', 'Real-world activity replication'],
        ['Indie', 'Games made by small independent teams'],
        ['Cyberpunk', 'High tech and low life settings'],
        ['Fantasy', 'Magic and mythical creatures']
    ];
    genres.forEach(g => insertGenre.run(g));
    insertGenre.finalize();
    const insertGame = db.prepare("INSERT OR IGNORE INTO games (title, description, release_year, rating) VALUES (?, ?, ?, ?)");
    const games = [
        ['The Witcher 3', 'Monster hunter Geralt seeks his daughter.', 2015, 9.8],
        ['Cyberpunk 2077', 'Open-world story set in Night City.', 2020, 8.5],
        ['Elden Ring', 'Rise, Tarnished, and be guided by grace.', 2022, 9.6],
        ['Hades', 'Battle out of hell in this rogue-like.', 2020, 9.2],
        ['Stardew Valley', 'Build your dream farm.', 2016, 9.5],
        ['Doom Eternal', 'Slay demons across dimensions.', 2020, 9.0],
        ['Civilization VI', 'Build an empire to last the test of time.', 2016, 8.8],
        ['Resident Evil Village', 'Survival horror in a mysterious village.', 2021, 8.4],
        ['Disco Elysium', 'Solve a murder as a detective with unique skills.', 2019, 9.7],
        ['Outer Wilds', 'An open world mystery about a solar system.', 2019, 9.4],
        ['Baldur\'s Gate 3', 'Gather your party in the Forgotten Realms.', 2023, 9.9],
        ['Dune: Spice Wars', 'Real-time strategy set on Arrakis.', 2022, 7.9]
    ];
    games.forEach(g => insertGame.run(g));
    insertGame.finalize();
    const insertLink = db.prepare("INSERT OR IGNORE INTO game_genres (game_id, genre_id) VALUES (?, ?)");
    const links = [
        [1, 1], [1, 10],
        [2, 1], [2, 9],
        [3, 1], [3, 10],
        [4, 2], [4, 8],
        [5, 7], [5, 8],
        [6, 6], [6, 2],
        [7, 4],
        [8, 5], [8, 2],
        [9, 1], [9, 8],
        [10, 3], [10, 8]
    ];
    links.forEach(l => insertLink.run(l));
    insertLink.finalize();
    console.log('Seed data added.');
});

db.close();