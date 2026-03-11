import { useEffect, useState } from 'react'
import './Home.css'

const phrases = [
  '¡Pikachu puede generar más de 100.000 voltios!',
  'Bulbasaur es el Pokémon #001 en la Pokédex Nacional.',
  'Magikarp evoluciona en el poderoso Gyarados al nivel 20.',
  'Ditto puede transformarse en casi cualquier Pokémon.',
  'Eevee es conocido por tener muchas evoluciones diferentes.',
  'Snorlax suele bloquear caminos mientras duerme profundamente.',
  'Los Pokémon shiny tienen una probabilidad de 1 entre 4096.',
  'Los entrenadores solo pueden llevar 6 Pokémon en su equipo.',
  'Cubone lleva el cráneo de su madre según la Pokédex.',
  'Gengar se esconde en las sombras para observar a su presa.',
  'Rayquaza vive en la capa de ozono del planeta.',
  'Lapras estuvo en peligro de extinción en el pasado.',
  'Wobbuffet devuelve los ataques en lugar de atacar.',
  'Spinda tiene millones de patrones de manchas únicos.',
  'Shedinja aparece misteriosamente cuando Nincada evoluciona.',
  'Rotom puede poseer distintos electrodomésticos.',
  'Arcanine es conocido como el Pokémon legendario.',
  'Mew contiene el ADN de todos los Pokémon.',
  'Algunos Pokémon evolucionan solo mediante intercambio.',
  'Feebas evoluciona en Milotic con una Escama Bella.',
  'Los Pokémon fantasma son inmunes a ataques normales.',
  'Falso Tortazo nunca debilita al rival.',
  'Los iniciales de cada región suelen ser planta, fuego y agua.',
  'Las Ultra Balls tienen mayor tasa de captura que las Great Balls.',
  'Los Pokémon intercambiados ganan experiencia más rápido.'
];

export default function Home() {
  const [index, setIndex] = useState(0)
  const [fade, setFade] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(true)
      setTimeout(() => {
        setIndex(() => Math.floor(Math.random() * phrases.length))
        setFade(false)
      }, 500)
    }, 5000)
    return () => clearInterval(timer)
  }, [])


  return (
    <section className="home-container">
      <div className="home-text">
        <h1>Bienvenido a PokéStrat</h1>
        <p className="description">
          Aprende sobre tus Pokémon favoritos y crea tus estrategias.
        </p>
        <blockquote className={`phrase${fade ? ' fade' : ''}`}>{phrases[index]}</blockquote>
        <button className="cta" onClick={() => window.location.hash = '/pokedex'}>
          Explorar Pokédex
        </button>
      </div>
    </section>
  )
}
