// The following translation logic and UI text were AI-modified to apply multi-language support.
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { translations } from '../translations';

const GameGenresPage = () => {
    const [links, setLinks] = useState([]);
    const { user, lang } = useContext(AuthContext);
    const navigate = useNavigate();
    const t = translations[lang];
    useEffect(() => {
        loadLinks();
    }, []);
    const loadLinks = async () => {
        try {
            const res = await API.get('/game-genres?limit=100');
            setLinks(res.data.data);
        } catch (err) {
            console.error("Error loading assignments:", err);
        }
    };
    const handleDelete = async (gameId, genreId) => {
        if (window.confirm(t.confirm_delete_assignment)) {
            try {
                await API.delete(`/game-genres/${gameId}/${genreId}`);
                loadLinks();
            } catch (err) {
                alert(t.err_delete_assignment);
            }
        }
    };
    return (
        <div style={{ padding: '20px' }}>
            <h1>{t.assignments_title}</h1>

            {user && (
                <button
                    onClick={() => navigate('/assignments/new')}
                    style={{ marginBottom: '15px', padding: '10px', cursor: 'pointer' }}
                >
                    + {t.btn_link_new}
                </button>
            )}
            <table border="1" width="100%" style={{ borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                <tr style={{ backgroundColor: '#f4f4f4' }}>
                    <th style={{ padding: '10px' }}>{t.col_game_title}</th>
                    <th style={{ padding: '10px' }}>{t.col_genre}</th>
                    <th style={{ padding: '10px' }}>{t.col_added_date}</th>
                    <th style={{ padding: '10px' }}>{t.col_actions}</th>
                </tr>
                </thead>
                <tbody>
                {links.length > 0 ? links.map((link, idx) => (
                    <tr key={idx}>
                        <td style={{ padding: '10px' }}>{link.game_title}</td>
                        <td style={{ padding: '10px' }}>
                                <span style={{ backgroundColor: '#e9ecef', padding: '2px 8px', borderRadius: '10px', fontSize: '0.9em' }}>
                                    {link.genre_name}
                                </span>
                        </td>
                        <td style={{ padding: '10px' }}>{new Date(link.assigned_at).toLocaleDateString()}</td>
                        <td style={{ padding: '10px' }}>
                            {user?.role === 'admin' && (
                                <button
                                    onClick={() => handleDelete(link.game_id, link.genre_id)}
                                    style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                                >
                                    {t.btn_delete}
                                </button>
                            )}
                        </td>
                    </tr>
                )) : (
                    <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>{t.no_assignments}</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};
export default GameGenresPage;