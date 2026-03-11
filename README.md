# PokéStrat

Minimal React + TypeScript application bootstrapped with Vite. The original
template has been stripped of example assets and code; only the pieces needed
for a PokéAPI‑powered UI remain.

## Development

```bash
npm install      # install dependencies
npm run dev       # start Vite dev server on http://localhost:5173
npm run build     # create production build
npm run preview   # preview the build locally
npm run lint      # run ESLint across the codebase
```

## Pokémon API helper

The module `src/api/pokeapi.ts` exports two basic functions with types defined
in `src/types/pokemon.ts`:

```ts
fetchPokemon(nameOrId)
fetchPokemonList(limit?, offset?)
```

They default to the public endpoint `https://pokeapi.co/api/v2` but you can set
`VITE_POKEAPI_BASE_URL` at build time if you need a different server.

Example usage:

```ts
import { fetchPokemon, fetchPokemonList } from './api/pokeapi';

const firstPage = await fetchPokemonList(20, 0);
console.log(firstPage.results);

const bulbasaur = await fetchPokemon('bulbasaur');
console.log(bulbasaur.id, bulbasaur.sprites.front_default);
```

Feel free to expand the API wrapper and UI as your project grows.

The app now includes simple routing powered by `react-router-dom`. There are two
pages:

- `/` – **Home** screen (currently acts as the welcome page).
- `/pokedex` – lists the first 151 Pokémon using the PokéAPI.

A `<Navbar />` component at the top lets users navigate between them. You can
add additional links/routes as needed.

The home page now displays rotating Pokémon facts/curiosities that change
every few seconds to keep the interface lively. The entire UI uses a
Pokémon-inspired color palette, retro font, and card‑style backgrounds to
give it a polished, thematic appearance.

Recent visual upgrades include:

- Animated background gradient cycling through yellow/blue/red.
- Pokéball pattern spread across the screen using an external sprite image.
- Floating pokéballs animating over the page via a dedicated
  `<BackgroundBalls />` component (also using the online Pokéball icon).
- Improved navbar styling with gradient, shadow and fixed positioning.
- Entire layout now feels more like a game UI with dynamic, responsive
  visuals.

