// The following translation logic and UI text were AI-modified to apply multi-language support.
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { translations } from '../translations';
const Navbar = () => {
    const { user, logout ,lang, toggleLanguage} = useContext(AuthContext);
    const navigate = useNavigate();
    const t = translations[lang];
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 20px',
            backgroundColor: '#333',
            color: 'white'
        }}>
            <div>
                <Link to="/" style={{ color: 'white', marginRight: '15px', textDecoration: 'none', fontWeight: 'bold' }}>GameDB</Link>
                <Link to="/" style={{ color: '#ccc', marginRight: '15px', textDecoration: 'none' }}>{t.nav_games}</Link>
                <Link to="/genres" style={{ color: '#ccc', marginRight: '15px', textDecoration: 'none' }}>{t.nav_genres}</Link>
                <Link to="/assignments" style={{ color: '#ccc', marginRight: '15px', textDecoration: 'none' }}>{t.nav_assignments}</Link>
                <button onClick={toggleLanguage}>
                    {lang === 'en' ? 'UA' : 'EN'}
                </button>
            </div>
            <div>
                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span>{t.welcome}, <strong>{user.username}</strong> <small>({user.role})</small></span>
                        <Link to="/profile" style={{ color: '#00d1b2', textDecoration: 'none' }}>
                            {t.nav_profile}
                        </Link>
                        <button
                            onClick={handleLogout}
                            style={{
                                cursor: 'pointer',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                padding: '5px 10px',
                                borderRadius: '4px'
                            }}
                        >
                            {t.nav_logout}
                        </button>
                    </div>
                ) : (
                    <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>{t.login_register}</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;