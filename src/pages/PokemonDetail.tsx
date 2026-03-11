import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Pokemon } from '../types/pokemon'
import { fetchPokemon } from '../api/pokeapi'

export default function PokemonDetail() {
  const { name } = useParams<{ name: string }>()
  const [pokemon, setPokemon] = useState<Pokemon | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!name) return
    setLoading(true)
    fetchPokemon(name)
      .then(p => setPokemon(p))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [name])

  if (loading) return <p>Cargando...</p>
  if (!pokemon) return <p>Pokémon no encontrado.</p>

  return (
    <section>
      <h1>{pokemon.name}</h1>
      <img src={pokemon.sprites.front_default || ''} alt={pokemon.name} />
      <p>ID: {pokemon.id}</p>
      <p>Tipos: {pokemon.types.map(t => t.type.name).join(', ')}</p>
      <p>Altura: {pokemon.height}</p>
      <p>Peso: {pokemon.weight}</p>
    </section>
  )
}
