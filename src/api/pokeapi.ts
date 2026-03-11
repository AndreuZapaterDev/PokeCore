import type {
  NamedAPIResourceList,
  Pokemon,
} from '../types/pokemon';

const BASE_URL =
  import.meta.env.VITE_POKEAPI_BASE_URL || 'https://pokeapi.co/api/v2';

function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    return res
      .text()
      .then((text) => {
        throw new Error(`PokeAPI error ${res.status}: ${text}`);
      });
  }
  return res.json();
}

/**
 * Fetches a single Pokémon by name or ID.
 *
 * @param nameOrId - the name (e.g. "pikachu") or numeric id (e.g. 25)
 */
export async function fetchPokemon(
  nameOrId: string | number,
): Promise<Pokemon> {
  const res = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);
  return handleResponse<Pokemon>(res);
}

/**
 * Retrieves a paginated list of Pokémon resources.
 *
 * @param limit - number of results per page (default 20)
 * @param offset - how many entries to skip (default 0)
 */
export async function fetchPokemonList(
  limit = 20,
  offset = 0,
): Promise<NamedAPIResourceList> {
  const res = await fetch(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
  );
  return handleResponse<NamedAPIResourceList>(res);
}

// more helper functions (e.g. fetchAbility, fetchType) can be added here as
// the UI requires them
