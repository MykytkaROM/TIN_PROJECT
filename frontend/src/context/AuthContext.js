import React, { createContext, useState, useEffect } from 'react';
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);
    // This function was AI-generated and then modified to support language persistence.
    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };
    // This function was AI-generated and then modified to support language persistence.
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };
    const [lang, setLang] = useState('en');
    // This function was AI-generated and then modified to support language persistence.
    const toggleLanguage = () => {
        setLang(prev => (prev === 'en' ? 'ua' : 'en'));
    };
    return (
        <AuthContext.Provider value={{ user, login, logout, lang, toggleLanguage }}>
            {children}
        </AuthContext.Provider>
    );
};