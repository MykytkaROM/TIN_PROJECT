// The following translation logic and UI text were AI-modified to apply multi-language support.
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { translations } from '../translations';

const GenreDetails = () => {
    const { id } = useParams();
    const [genre, setGenre] = useState(null);
    const [games, setGames] = useState([]);
    const [error, setError] = useState('');
    const { lang } = useContext(AuthContext);
    const t = translations[lang];
    useEffect(() => {
        if (!id || isNaN(id) || parseInt(id) <= 0) {
            setError(t.error_invalid_genre_id);
            return;
        }
        API.get(`/genres/${id}`)
            .then(res => {
                if (res.data && res.data.data) {
                    setGenre(res.data.data);
                } else {
                    setError(t.error_genre_data_empty);
                }
            })
            .catch(err => {
                console.error(err);
                setError(t.error_genre_not_found);
            });
        API.get(`/game-genres?limit=100`)
            .then(res => {
                const filtered = res.data.data.filter(link => link.genre_id === parseInt(id));
                setGames(filtered);
            })
            .catch(err => console.error("Could not load linked games"));
    }, [id, t]);
    if (error) return (
        <div style={{ color: 'red', padding: '20px' }}>
            {error} <br/>
            <Link to="/genres">{t.back_to_genres}</Link>
        </div>
    );
    if (!genre) return <div style={{ padding: '20px' }}>{t.loading}</div>;
    return (
        <div style={{ padding: '20px', maxWidth: '800px' }}>
            <Link to="/genres">← {t.back_to_genres}</Link>
            <h1>{t.genre_label}: {genre.name}</h1>
            <p style={{ fontSize: '1.2em', fontStyle: 'italic', color: '#555' }}>
                {genre.description || t.no_desc}
            </p>
            <hr />
            <h3>{t.games_in_genre}:</h3>
            {games.length > 0 ? (
                <ul>
                    {games.map((g, idx) => (
                        <li key={idx}>
                            <Link to={`/games/${g.game_id}`}>{g.game_title}</Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>{t.no_games_in_genre}</p>
            )}
        </div>
    );
};

export default GenreDetails;