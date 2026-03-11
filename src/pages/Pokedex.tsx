import { useEffect, useState } from 'react'
import type { Pokemon } from '../types/pokemon'
import { fetchPokemonList, fetchPokemon } from '../api/pokeapi'
import PokemonCard from '../components/PokemonCard'
import './Pokedex.css'

export default function Pokedex() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const perPage = 20

  const loadPage = (pageIndex: number) => {
    setLoading(true)
    fetchPokemonList(perPage, pageIndex * perPage)
      .then((data) => {
        setTotalCount(data.count)
        return Promise.all(data.results.map((r) => fetchPokemon(r.name)))
      })
      .then((full) => setPokemons(full))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadPage(page)
  }, [page])

  return (
    <section>
      <h1>Pokédex</h1>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <ul>
            {pokemons.map(p => (
              <PokemonCard key={p.name} pokemon={p} />
            ))}
          </ul>
          <div className="pagination">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>
              « Anterior
            </button>
            <span>
              Página {page + 1} de {Math.ceil(totalCount / perPage)}
            </span>
            <button
              disabled={(page + 1) * perPage >= totalCount}
              onClick={() => setPage(p => p + 1)}
            >
              Siguiente »
            </button>
          </div>
        </>
      )}
    </section>
  )
}
