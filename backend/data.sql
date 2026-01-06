-- This data was fully AI-generated.

INSERT OR IGNORE INTO genres (name, description) VALUES
('RPG', 'Role-playing games with deep stories'),
('Action', 'Fast-paced gameplay and combat'),
('Adventure', 'Focus on exploration and puzzle-solving'),
('Strategy', 'Games requiring tactical thinking'),
('Horror', 'Designed to frighten and thrill'),
('Shooter', 'Combat-focused games using firearms'),
('Simulation', 'Real-world activity replication'),
('Indie', 'Games made by small independent teams'),
('Cyberpunk', 'High tech and low life settings'),
('Fantasy', 'Magic and mythical creatures');

INSERT OR IGNORE INTO games (title, description, release_year, rating) VALUES
('The Witcher 3', 'Monster hunter Geralt seeks his daughter.', 2015, 9.8),
('Cyberpunk 2077', 'Open-world story set in Night City.', 2020, 8.5),
('Elden Ring', 'Rise, Tarnished, and be guided by grace.', 2022, 9.6),
('Hades', 'Battle out of hell in this rogue-like.', 2020, 9.2),
('Stardew Valley', 'Build your dream farm.', 2016, 9.5),
('Doom Eternal', 'Slay demons across dimensions.', 2020, 9.0),
('Civilization VI', 'Build an empire to last the test of time.', 2016, 8.8),
('Resident Evil Village', 'Survival horror in a mysterious village.', 2021, 8.4),
('Disco Elysium', 'Solve a murder as a detective with unique skills.', 2019, 9.7),
('Outer Wilds', 'An open world mystery about a solar system.', 2019, 9.4),
('Baldur''s Gate 3', 'Gather your party in the Forgotten Realms.', 2023, 9.9),
('Dune: Spice Wars', 'Real-time strategy set on Arrakis.', 2022, 7.9);

INSERT OR IGNORE INTO game_genres (game_id, genre_id) VALUES
(1, 1), (1, 10),
(2, 1), (2, 9),
(3, 1), (3, 10),
(4, 2), (4, 8),
(5, 7), (5, 8),
(6, 6), (6, 2),
(7, 4),
(8, 5), (8, 2),
(9, 1), (9, 8),
(10, 3), (10, 8);