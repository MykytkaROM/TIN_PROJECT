import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import GamesPage from './pages/GamesPage';
import LoginPage from './pages/LoginPage';
import GameDetails from './pages/GameDetails';
import Navbar from './components/Navbar';
import RegisterPage from './pages/RegisterPage';
import './App.css';
import GameGenresPage from "./pages/GameGenresPage";
import GenresPage from "./pages/GenresPage";
import GameFormPage from './pages/GameFormPage';
import AssignmentFormPage from "./pages/AssignmentFormPage";
import GenreFormPage from "./pages/GenreFormPage";
import GenreDetails from "./pages/GenreDetails";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
      <AuthProvider>
          <Router>
              <Navbar />
              <div className="container" style={{ padding: '20px' }}>
                  <Routes>
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/genres/:id" element={<GenreDetails />} />
                      <Route path="/genres/new" element={<GenreFormPage />} />
                      <Route path="/genres/edit/:id" element={<GenreFormPage />} />
                      <Route path="/assignments/new" element={<AssignmentFormPage />} />
                      <Route path="/games/new" element={<GameFormPage />} />
                      <Route path="/games/edit/:id" element={<GameFormPage />} />
                      <Route path="/" element={<GamesPage />} />
                      <Route path="/genres" element={<GenresPage />} />
                      <Route path="/assignments" element={<GameGenresPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/games/:id" element={<GameDetails />} />
                  </Routes>
              </div>
          </Router>
      </AuthProvider>
  );
}

export default App;
