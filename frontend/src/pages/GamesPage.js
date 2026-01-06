// The following translation logic and UI text were AI-modified to apply multi-language support.
import React, { useState, useEffect, useContext } from 'react';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { translations } from '../translations';

const GamesPage = () => {
    const [games, setGames] = useState([]);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const [totalPages, setTotalPages] = useState(1);
    const { user, lang } = useContext(AuthContext);
    const t = translations[lang];
    const limit = 5;
    useEffect(() => {
        fetchGames(page);
    }, [page]);
    const fetchGames = async (currentPage) => {
        if (currentPage < 1) return;
        try {
            const response = await API.get(`/games?page=${currentPage}&limit=${limit}`);
            setGames(response.data.data);
            setTotalPages(response.data.totalPages);
            setPage(response.data.page);
        } catch (error) {
            console.error("Error fetching games:", error);
        }
    };
    const handleDelete = async (id) => {
        if (window.confirm(t.confirm_delete_game)) {
            try {
                await API.delete(`/games/${id}`);
                fetchGames(page);
            } catch (error) {
                alert(error.response?.data?.error || t.err_delete_failed);
            }
        }
    };
    return (
        <div className="games-container" style={{ padding: '20px' }}>
            <h1>{t.catalog_title}</h1>
            <>
                {user && (
                    <button
                        onClick={() => navigate('/games/new')}
                        style={{ marginBottom: '15px', padding: '10px', cursor: 'pointer' }}
                    >
                        + {t.add_game}
                    </button>
                )}
                <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr style={{ backgroundColor: '#f4f4f4' }}>
                        <th>{t.label_title}</th>
                        <th>{t.label_year}</th>
                        <th>{t.col_actions}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {games.map(game => (
                        <tr key={game.id}>
                            <td>
                                <Link to={`/games/${game.id}`}>{game.title}</Link>
                            </td>
                            <td>{game.release_year}</td>
                            <td>
                                {user?.role === 'admin' && (
                                    <button
                                        onClick={() => navigate(`/games/edit/${game.id}`)}
                                        style={{ marginRight: '5px', background: '#ffc107', border: 'none', cursor: 'pointer', padding: '5px 10px', borderRadius: '3px' }}
                                    >
                                        {t.btn_edit}
                                    </button>
                                )}
                                {user?.role === 'admin' && (
                                    <button
                                        onClick={() => handleDelete(game.id)}
                                        style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                                    >
                                        {t.btn_delete}
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button
                        disabled={page <= 1}
                        onClick={() => setPage(prev => prev - 1)}
                        style={{ cursor: page <= 1 ? 'not-allowed' : 'pointer' }}
                    >
                        {t.btn_prev}
                    </button>

                    <span>{t.page_info} {page} {t.page_of} {totalPages}</span>

                    <button
                        disabled={page >= totalPages}
                        onClick={() => setPage(prev => prev + 1)}
                        style={{ cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}
                    >
                        {t.btn_next}
                    </button>
                </div>
            </>
        </div>
    );
};
export default GamesPage;