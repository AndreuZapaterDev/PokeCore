// Basic types derived from the PokeAPI responses.

export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface NamedAPIResourceList {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
}

// A partial representation of a Pokemon object; add more fields as needed.
export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
    [key: string]: string | null;
  };
  types: Array<{ slot: number; type: NamedAPIResource }>;
  abilities: Array<{ ability: NamedAPIResource; is_hidden: boolean; slot: number }>;
  // other properties can be declared when required
}
