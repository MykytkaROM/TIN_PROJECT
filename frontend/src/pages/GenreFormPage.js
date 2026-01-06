// The following translation logic and UI text were AI-modified to apply multi-language support.
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { translations } from '../translations';

const GenreFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { lang } = useContext(AuthContext);
    const t = translations[lang];
    const [formData, setFormData] = useState({ name: '', description: '' });
    useEffect(() => {
        if (id) {
            API.get(`/genres/${id}`).then(res => {
                setFormData({ name: res.data.data.name, description: res.data.data.description });
            }).catch(() => alert(t.error_genre_not_found));
        }
    }, [id, t.error_genre_not_found]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await API.put(`/genres/${id}`, formData);
            } else {
                await API.post('/genres', formData);
            }
            navigate('/genres');
        } catch (err) {
            alert(err.response?.data?.error || t.err_save_genre);
        }
    };
    return (
        <div style={{ maxWidth: '500px', margin: '20px auto' }}>
            <h2>{id ? t.form_edit_genre : t.form_add_genre}</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>{t.label_genre_name}:</label>
                    <input
                        style={{ width: '100%' }}
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        required
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>{t.label_desc}:</label>
                    <textarea
                        style={{ width: '100%', height: '80px' }}
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                </div>
                <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
                    {id ? t.btn_update_action : t.btn_create_action}
                </button>
                <button type="button" onClick={() => navigate('/genres')} style={{ marginLeft: '10px', cursor: 'pointer' }}>
                    {t.btn_cancel}
                </button>
            </form>
        </div>
    );
};

export default GenreFormPage;