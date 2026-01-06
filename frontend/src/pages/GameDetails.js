// The following translation logic and UI text were AI-modified to apply multi-language support.
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { translations } from '../translations';
const GameDetails = () => {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [error, setError] = useState('');
    const { lang } = useContext(AuthContext);
    const t = translations[lang];
    useEffect(() => {
        if (parseInt(id) <= 0) {
            setError(t.error_invalid_id);
            return;
        }
        API.get(`/games/${id}`)
            .then(res => setGame(res.data.data))
            .catch(err => setError(t.error_game_not_found));
    }, [id, t]);
    if (error) return <div style={{ color: 'red' }}>{error} <br/> <Link to="/">{t.back_to_list}</Link></div>;
    if (!game) return <div>{t.loading}</div>;
    return (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <Link to="/">← {t.back_to_catalog}</Link>
            <h1>{game.title}</h1>
            <hr />
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '10px' }}>
                <strong>{t.label_release}:</strong> <span>{game.release_year}</span>
                <strong>{t.label_rating}:</strong> <span>{game.rating} / 10</span>
                <strong>{t.label_genres}:</strong> <span>{game.genres_list || t.no_genres}</span>
                <strong>{t.label_desc}:</strong>
                <p style={{ whiteSpace: 'pre-wrap' }}>{game.description || t.no_desc}</p>
            </div>
            <p style={{ marginTop: '20px', fontSize: '0.8em', color: '#666' }}>
                {t.db_id}: {game.id}
            </p>
        </div>
    );
};
export default GameDetails;