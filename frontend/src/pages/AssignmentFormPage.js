// The following translation logic and UI text were AI-modified to apply multi-language support.
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { translations } from '../translations';

const AssignmentFormPage = () => {
    const navigate = useNavigate();
    const { lang } = useContext(AuthContext);
    const t = translations[lang];
    const [games, setGames] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selection, setSelection] = useState({ game_id: '', genre_id: '' });
    const [error, setError] = useState('');
    useEffect(() => {
        const loadOptions = async () => {
            const [resGames, resGenres] = await Promise.all([
                API.get('/games?limit=100'),
                API.get('/genres?limit=100')
            ]);
            setGames(resGames.data.data);
            setGenres(resGenres.data.data);
        };
        loadOptions();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const gameId = parseInt(selection.game_id);
        const genreId = parseInt(selection.genre_id);
        if (!gameId || gameId <= 0 || !genreId || genreId <= 0) {
            setError(t.error_select);
            return;
        }
        try {
            await API.post('/game-genres', {
                game_id: gameId,
                genre_id: genreId
            });
            navigate('/assignments');
        } catch (err) {
            setError(err.response?.data?.error || t.error_server);
        }
    };
    return (
        <div style={{ maxWidth: '500px', margin: '20px auto' }}>
            <h2>{t.link_game}</h2>
            {error && (
                <div style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>{t.select_game}:</label>
                    <select style={{ width: '100%', padding: '8px' }} required
                            onChange={e => setSelection({...selection, game_id: e.target.value})}>
                        <option value="">-- {t.choose_game} --</option>
                        {games.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
                    </select>
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>{t.select_genre}:</label>
                    <select style={{ width: '100%', padding: '8px' }} required
                            onChange={e => setSelection({...selection, genre_id: e.target.value})}>
                        <option value="">-- {t.choose_genre} --</option>
                        {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                </div>
                <button type="submit" style={{ padding: '10px 20px', background: '#17a2b8', color: '#fff', border: 'none', cursor: 'pointer' }}>
                    {t.btn_assign}
                </button>
                <button type="button" onClick={() => navigate('/assignments')} style={{ marginLeft: '10px', cursor: 'pointer' }}>
                    {t.btn_cancel}
                </button>
            </form>
        </div>
    );
};

export default AssignmentFormPage;