import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import './Pokedex.css'
import { fetchPokemonList, fetchPokemonSummary, toPokemonCard } from '../services/pokeapi'
import type { PokemonCard } from '../services/pokeapi'

const PAGE_SIZE = 50

const typeLabels: Record<string, string> = {
  normal: 'Normal',
  fire: 'Fuego',
  water: 'Agua',
  electric: 'Eléctrico',
  grass: 'Planta',
  ice: 'Hielo',
  fighting: 'Lucha',
  poison: 'Veneno',
  ground: 'Tierra',
  flying: 'Volador',
  psychic: 'Psíquico',
  bug: 'Bicho',
  rock: 'Roca',
  ghost: 'Fantasma',
  dragon: 'Dragón',
  dark: 'Siniestro',
  steel: 'Acero',
  fairy: 'Hada',
}

const typeColors: Record<string, string> = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
}

export default function Pokedex() {
  const [search, setSearch] = useState('')
  const [cards, setCards] = useState<PokemonCard[]>([])
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    async function loadPage() {
      setLoading(true)
      setError(null)

      try {
        const data = await fetchPokemonList(PAGE_SIZE, page * PAGE_SIZE)
        if (isCancelled) return

        setTotal(data.count)

        const basicCards = data.results.map(toPokemonCard)
        setCards(basicCards)

        // Fetch basic info in small batches so the UI can show cards quickly
        const batchSize = 10
        for (let i = 0; i < basicCards.length; i += batchSize) {
          const batch = basicCards.slice(i, i + batchSize)

          const updatedBatch = await Promise.all(
            batch.map(async (card) => {
              try {
                const detail = await fetchPokemonSummary(card.id)
                return {
                  ...card,
                  name: detail.name,
                  types: detail.types,
                }
              } catch {
                return card
              }
            }),
          )

          if (isCancelled) return

          setCards((prev) => {
            const prevById = new Map(prev.map((c) => [c.id, c]))
            updatedBatch.forEach((card) => prevById.set(card.id, card))
            return Array.from(prevById.values())
          })
        }
      } catch (err) {
        if (!isCancelled) setError((err as Error)?.message ?? 'Error al cargar la Pokédex')
      } finally {
        if (!isCancelled) setLoading(false)
      }
    }

    loadPage()

    return () => {
      isCancelled = true
    }
  }, [page])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return cards
    return cards.filter((item) => item.name.toLowerCase().includes(term))
  }, [cards, search])

  const totalPages = total ? Math.ceil(total / PAGE_SIZE) : 0
  const showPagination = Boolean(total && totalPages > 1)
  const canPrev = page > 0
  const canNext = total !== null ? page < totalPages - 1 : false

  const paginationWindow = 4
  const startPage = Math.max(0, page - paginationWindow)
  const endPage = Math.min(totalPages - 1, page + paginationWindow)
  const pageNumbers = []

  for (let p = startPage; p <= endPage; p += 1) {
    pageNumbers.push(p)
  }

  return (
    <main className="page">
      <header className="pageHeader">
        <h1>Pokédex</h1>
        <Link className="button secondary" to="/">
          Volver al inicio
        </Link>
      </header>

      <section className="search">
        <label htmlFor="search">Buscar Pokémon</label>
        <input
          id="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Ej. pikachu"
          autoComplete="off"
        />
      </section>

      {loading && <LoadingSpinner label="Cargando Pokémon…" />}
      {error && <p className="status error">{error}</p>}

      {!loading && !error && (
        <>
          <section className="grid">
            {filtered.length === 0 ? (
              <p className="status">No se encontró ningún Pokémon para "{search}".</p>
            ) : (
              filtered.map((pokemon) => {
                const primaryType = pokemon.types[0] || 'normal'
                const baseColor = typeColors[primaryType] || '#A8A77A'

                return (
                  <Link
                    key={pokemon.id}
                    to={`/pokemon/${pokemon.id}`}
                    className="card"
                    style={{
                      background: `linear-gradient(135deg, ${baseColor}20 0%, ${baseColor}10 50%, rgba(10, 14, 26, 0.7) 100%)`,
                      borderColor: `rgba(255,255,255,0.12)`,
                    }}
                  >
                    <img
                      className="sprite"
                      src={pokemon.spriteUrl}
                      alt={pokemon.name}
                      loading="lazy"
                      width={96}
                      height={96}
                    />
                    <div className="cardContent">
                      <span className="badge">#{pokemon.id.toString().padStart(3, '0')}</span>
                      <p className="name">{pokemon.name}</p>
                      <div className="typeList">
                        {pokemon.types.map((type) => {
                          const color = typeColors[type] ?? '#A8A77A'
                          return (
                            <span
                              key={type}
                              className={`typeBadge type-${type}`}
                              style={{
                                background: `${color}33`,
                                border: `1px solid ${color}66`,
                                color: '#fff',
                              }}
                            >
                              {typeLabels[type] ?? type}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  </Link>
                )
              })
            )}
          </section>

          {showPagination && (
            <footer className="pagination">
              <button
                type="button"
                className="button secondary"
                disabled={!canPrev}
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              >
                Anterior
              </button>

              <div className="pageNumberList">
                {startPage > 0 && (
                  <>
                    <button type="button" className="button secondary" onClick={() => setPage(0)}>
                      1
                    </button>
                    {startPage > 1 && <span className="ellipsis">...</span>}
                  </>
                )}

                {pageNumbers.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    className={`button ${pageNumber === page ? 'active' : 'secondary'}`}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber + 1}
                  </button>
                ))}

                {endPage < totalPages - 1 && (
                  <>
                    {endPage < totalPages - 2 && <span className="ellipsis">...</span>}
                    <button
                      type="button"
                      className="button secondary"
                      onClick={() => setPage(totalPages - 1)}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                type="button"
                className="button secondary"
                disabled={!canNext}
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
              >
                Siguiente
              </button>
            </footer>
          )}
        </>
      )}
    </main>
  )
}
