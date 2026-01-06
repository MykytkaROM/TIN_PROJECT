// The following translation logic and UI text were AI-modified to apply multi-language support.
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { translations } from '../translations';

const RegisterPage = () => {
    const { lang } = useContext(AuthContext);
    const t = translations[lang];
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.username.length < 3) {
            setError(t.err_username_short);
            return;
        }
        if (formData.password.length < 6) {
            setError(t.err_password_short);
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError(t.err_passwords_mismatch);
            return;
        }
        try {
            await API.post('/auth/register', {
                username: formData.username,
                password: formData.password
            });
            alert(t.msg_reg_success);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || t.err_reg_failed);
        }
    };
    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>{t.register_title}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>{t.label_username}:</label>
                    <input
                        type="text" name="username"
                        value={formData.username} onChange={handleChange}
                        style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>{t.label_password}:</label>
                    <input
                        type="password" name="password"
                        value={formData.password} onChange={handleChange}
                        style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>{t.label_confirm_password}:</label>
                    <input
                        type="password" name="confirmPassword"
                        value={formData.confirmPassword} onChange={handleChange}
                        style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
                        required
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    {t.btn_register}
                </button>
            </form>
            <p style={{ marginTop: '15px', textAlign: 'center' }}>
                {t.already_have_account} <Link to="/login">{t.login_here}</Link>
            </p>
        </div>
    );
};
export default RegisterPage;