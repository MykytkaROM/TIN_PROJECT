// The following translation logic and UI text were AI-modified to apply multi-language support.
import React, { useState, useEffect, useContext } from 'react';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { translations } from '../translations';

const GenresPage = () => {
    const [genres, setGenres] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { user, lang } = useContext(AuthContext);
    const navigate = useNavigate();
    const t = translations[lang];
    useEffect(() => {
        fetchGenres();
    }, [page]);
    const fetchGenres = async () => {
        try {
            const res = await API.get(`/genres?page=${page}&limit=5`);
            setGenres(res.data.data);
            setTotalPages(res.data.totalPages);
            setPage(res.data.page);
        } catch (err) {
            console.error(err);
        }
    };
    const handleDelete = async (id) => {
        if (id <= 0) return;
        if (window.confirm(t.confirm_delete_genre)) {
            try {
                await API.delete(`/genres/${id}`);
                fetchGenres();
            } catch (err) {
                alert(t.err_delete_genre_linked);
            }
        }
    };
    return (
        <div style={{ padding: '20px' }}>
            <h1>{t.genres_management_title}</h1>
            {user && (
                <button onClick={() => navigate('/genres/new')} style={{ marginBottom: '15px', padding: '10px', cursor: 'pointer' }}>
                    + {t.form_add_genre}
                </button>
            )}
            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ backgroundColor: '#f4f4f4' }}>
                    <th>ID</th>
                    <th>{t.label_genre_name}</th>
                    <th>{t.label_desc}</th>
                    <th>{t.col_actions}</th>
                </tr>
                </thead>
                <tbody>
                {genres.map(genre => (
                    <tr key={genre.id}>
                        <td>{genre.id}</td>
                        <td><Link to={`/genres/${genre.id}`}>{genre.name}</Link></td>
                        <td>{genre.description}</td>
                        <td>
                            {user?.role === 'admin' && (
                                <button
                                    onClick={() => navigate(`/genres/edit/${genre.id}`)}
                                    style={{ marginRight: '10px', backgroundColor: '#ffc107', border: 'none', cursor: 'pointer', padding: '5px 10px', borderRadius: '3px' }}
                                >
                                    {t.btn_edit}
                                </button>
                            )}
                            {user?.role === 'admin' && (
                                <button onClick={() => handleDelete(genre.id)}
                                        style={{ backgroundColor: '#dc3545', color: '#fff',
                                            border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>
                                    {t.btn_delete}</button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ cursor: page === 1 ? 'not-allowed' : 'pointer' }}>
                    {t.btn_prev}
                </button>
                <span> {page} / {totalPages} </span>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} style={{ cursor: page === totalPages ? 'not-allowed' : 'pointer' }}>
                    {t.btn_next}
                </button>
            </div>
        </div>
    );
};
export default GenresPage;