// The following translation logic and UI text were AI-modified to apply multi-language support.
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { translations } from '../translations';

const ProfilePage = () => {
    const { user, lang } = useContext(AuthContext);
    const t = translations[lang];
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            await API.put('/auth/profile', { password });
            setMessage(t.msg_update_success);
            setPassword('');
        } catch (err) {
            setMessage(t.err_update_failed + ": " + (err.response?.data?.error || t.err_server));
        } finally {
            setLoading(false);
        }
    };
    return (
        <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h1>{t.nav_profile}</h1>
            <p><strong>{t.label_username}:</strong> {user?.username}</p>
            <p><strong>{t.label_role}:</strong> <span style={{ textTransform: 'uppercase', color: '#007bff' }}>{user?.role}</span></p>
            <hr />
            <h3>{t.title_update_pass}</h3>
            <form onSubmit={handleUpdate}>
                <input
                    type="password"
                    placeholder={t.placeholder_new_pass}
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="6"
                />
                <button
                    type="submit"
                    disabled={loading}
                    style={{ width: '100%', padding: '10px', background: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }}
                >
                    {loading ? t.btn_updating : t.btn_save_pass}
                </button>
            </form>
            {message && <p style={{ marginTop: '15px', textAlign: 'center' }}>{message}</p>}
        </div>
    );
};
export default ProfilePage;