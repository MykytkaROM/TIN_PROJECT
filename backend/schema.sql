-- This schema was fully AI-generated.
DROP TABLE IF EXISTS game_genres;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS genres (
                                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                                      name TEXT NOT NULL UNIQUE,
                                      description TEXT
);

CREATE TABLE IF NOT EXISTS games (
                                     id INTEGER PRIMARY KEY AUTOINCREMENT,
                                     title TEXT NOT NULL,
                                     description TEXT,
                                     release_year INTEGER,
                                     rating REAL DEFAULT 0.0
);

CREATE TABLE IF NOT EXISTS game_genres (
                                           game_id INTEGER,
                                           genre_id INTEGER,
                                           assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                           PRIMARY KEY (game_id, genre_id),
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS users (
                                     id INTEGER PRIMARY KEY AUTOINCREMENT,
                                     username TEXT NOT NULL UNIQUE,
                                     password TEXT NOT NULL,
                                     role TEXT CHECK(role IN ('guest', 'user', 'admin')) DEFAULT 'user'
    );