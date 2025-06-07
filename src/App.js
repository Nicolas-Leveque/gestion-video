import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import FilmDetail from './pages/FilmDetail';
import FilmForm from './pages/FilmForm';
import Categories from './pages/Categories';
import Formats from './pages/Formats';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/film/:id" element={<FilmDetail />} />
            <Route path="/add-film" element={<FilmForm />} />
            <Route path="/edit-film/:id" element={<FilmForm />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/formats" element={<Formats />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;