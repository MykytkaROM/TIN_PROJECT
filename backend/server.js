const express = require('express');
const cors = require('cors');
const gameRoutes = require('./routes/games');
const genreRoutes = require('./routes/genres');
const gameGenreRoutes = require('./routes/gameGenres');
const authRoutes = require('./routes/auth');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/games', gameRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/game-genres', gameGenreRoutes);
app.use('/api/auth', authRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});