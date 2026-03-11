import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import Pokedex from './pages/Pokedex'
import PokemonDetail from './pages/PokemonDetail'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main id="root">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pokedex" element={<Pokedex />} />
          <Route path="/pokedex/:name" element={<PokemonDetail />} />
        </Routes>
      </main>
      <footer className="app-footer">
        <p>© 2026 PokéStrat. Datos de PokéAPI.</p>
      </footer>
    </BrowserRouter>
  )
}
