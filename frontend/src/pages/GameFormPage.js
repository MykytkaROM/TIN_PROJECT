// The following translation logic and UI text were AI-modified to apply multi-language support.
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { translations } from '../translations';

const GameFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { lang } = useContext(AuthContext);
    const t = translations[lang];
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        title: '',
        release_year: '',
        rating: '',
        description: ''
    });
    const validate = () => {
        const newErrors = {};
        const currentYear = new Date().getFullYear();
        if (!formData.title.trim()) {
            newErrors.title = t.err_title_req;
        } else if (formData.title.length < 2) {
            newErrors.title = t.err_title_short;
        }
        const year = parseInt(formData.release_year);
        if (!year || year < 1950 || year > currentYear + 10) {
            newErrors.release_year = `${t.err_year_range} 1950 - ${currentYear + 10}`;
        }
        const rating = parseFloat(formData.rating);
        if (isNaN(rating) || rating < 0 || rating > 10) {
            newErrors.rating = t.err_rating_range;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    useEffect(() => {
        if (id) {
            API.get(`/games/${id}`).then(res => {
                const { title, release_year, rating, description } = res.data.data;
                setFormData({ title, release_year, rating, description });
            }).catch(() => alert(t.err_game_not_found));
        }
    }, [id, t.err_game_not_found]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            if (id) {
                await API.put(`/games/${id}`, formData);
            } else {
                await API.post('/games', formData);
            }
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.error || t.err_save_game);
        }
    };
    return (
        <div style={{ maxWidth: '500px', margin: '20px auto' }}>
            <h2>{id ? t.form_edit_title : t.form_add_title}</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>{t.label_title}:</label>
                    <input style={{ width: '100%' }} value={formData.title}
                           onChange={e => setFormData({...formData, title: e.target.value})} required />
                    {errors.title && <p style={{ color: 'red', fontSize: '0.8em', margin: '5px 0' }}>{errors.title}</p>}
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>{t.label_year}:</label>
                    <input style={{ width: '100%' }} type="number" value={formData.release_year}
                           onChange={e => setFormData({...formData, release_year: e.target.value})} required />
                    {errors.release_year && <p style={{ color: 'red', fontSize: '0.8em', margin: '5px 0' }}>{errors.release_year}</p>}
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>{t.label_rating} (0-10):</label>
                    <input style={{ width: '100%' }} type="number" step="0.1" value={formData.rating}
                           onChange={e => setFormData({...formData, rating: e.target.value})} />
                    {errors.rating && <p style={{ color: 'red', fontSize: '0.8em', margin: '5px 0' }}>{errors.rating}</p>}
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>{t.label_desc}:</label>
                    <textarea style={{ width: '100%', height: '100px' }} value={formData.description}
                              onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <button type="submit" style={{ padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }}>
                    {id ? t.btn_update : t.btn_create}
                </button>
                <button type="button" onClick={() => navigate('/')} style={{ marginLeft: '10px', cursor: 'pointer' }}>
                    {t.btn_cancel}
                </button>
            </form>
        </div>
    );
};

export default GameFormPage;