export type StatKey = 'hp' | 'attack' | 'defense' | 'special-attack' | 'special-defense' | 'speed'
export const STAT_LABELS: Record<StatKey, string> = {
  hp: 'HP',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'Ataque Especial',
  'special-defense': 'Defensa Especial',
  speed: 'Velocidad',
}

export interface PokemonInfo {
  id: number
  name: string
  sprite: string
  stats: Record<StatKey, number>
  abilities: { ability: { name: string } }[];
}

interface PokemonStat {
  base_stat: number
  effort: number
  stat: {
    name: StatKey
    url: string
  }
}

interface NameTranslation {
  name: string;
  language: {
    name: string;
    url: string;
  };
}

export interface ItemInfo {

  name: string;

  description: string;

}



export interface MoveInfo {

  name: string;

  type: string;

  category: string; // 'Physical', 'Special', 'Status'

  power: number | null;

  accuracy: number | null;

  description: string;

}



const MAX_ID = 1025;

const API = 'https://pokeapi.co/api/v2/pokemon/';



export async function fetchMoveDetails(moveName: string): Promise<MoveInfo> {

  const formattedMoveName = moveName.toLowerCase().replace(/ /g, '-');

  const res = await fetch(`https://pokeapi.co/api/v2/move/${formattedMoveName}`);

  if (!res.ok) {

    throw new Error(`PokeAPI fetch move details failed for ${moveName} -> ${res.status}`);

  }

  const data = await res.json();



  const categoryMap: { [key: string]: string } = {

    'physical': 'Physical',

    'special': 'Special',

    'status': 'Status',

  };



  return {

    name: data.name,

    type: data.type.name.charAt(0).toUpperCase() + data.type.name.slice(1), // Capitalize first letter

    category: categoryMap[data.damage_class.name] || 'Status', // Default to Status if unknown

    power: data.power,

    accuracy: data.accuracy,

    description: data.flavor_text_entries.find((entry: any) => entry.language.name === 'es')?.flavor_text || 'No description available.',

  };

}



// --- Caché en memoria + localStorage
const memCache = new Map<number, PokemonInfo>()
function hydrateCache() {
  try {
    const s = localStorage.getItem('qkk-cache')
    if (s) {
      const obj = JSON.parse(s) as Record<string, PokemonInfo>
      for (const k of Object.keys(obj)) memCache.set(Number(k), obj[k])
    }
  } catch {
    // Ignore errors
  }
}

function persistToLS(p: PokemonInfo) {
  try {
    const s = localStorage.getItem('qkk-cache')
    const obj = s ? (JSON.parse(s) as Record<string, PokemonInfo>) : {}
    obj[String(p.id)] = p
    localStorage.setItem('qkk-cache', JSON.stringify(obj))
  } catch {
    // Ignore errors
  }
}

export async function fetchPokemon(id: number): Promise<PokemonInfo> {
  if (memCache.has(id)) return memCache.get(id)!
  const res = await fetch(`${API}${id}`)
  if (!res.ok) throw new Error(`PokeAPI ${id} -> ${res.status}`)
  const data = await res.json()
  const get = (k: StatKey) => data.stats.find((s: PokemonStat) => s.stat.name === k)?.base_stat ?? 0
  const poke: PokemonInfo = {
    id,
    name: data.name,
    sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    stats: {
      hp: get('hp'),
      attack: get('attack'),
      defense: get('defense'),
      'special-attack': get('special-attack'),
      'special-defense': get('special-defense'),
      speed: get('speed'),
    },
    abilities: data.abilities,
  }
  memCache.set(id, poke)
  persistToLS(poke)
  return poke
}

export async function fetchPokemonByName(name: string): Promise<PokemonInfo> {
  const res = await fetch(`${API}${name.toLowerCase()}`);
  if (!res.ok) {
    throw new Error(`PokeAPI ${name} -> ${res.status}`);
  }
  const data = await res.json();
  const get = (k: StatKey) => data.stats.find((s: PokemonStat) => s.stat.name === k)?.base_stat ?? 0;
  const poke: PokemonInfo = {
    id: data.id,
    name: data.name,
    sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`,
    stats: {
      hp: get('hp'),
      attack: get('attack'),
      defense: get('defense'),
      'special-attack': get('special-attack'),
      'special-defense': get('special-defense'),
      speed: get('speed'),
    },
    abilities: data.abilities,
  };
  return poke;
}

export async function fetchAllPokemonNames(): Promise<string[]> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1302`);
  if (!res.ok) {
    throw new Error(`PokeAPI fetch all failed -> ${res.status}`);
  }
  const data = await res.json();
  return data.results.map((p: { name: string }) => p.name.charAt(0).toUpperCase() + p.name.slice(1));
}

let abilityTranslations: Map<string, string> | null = null;

let moveTranslations: Map<string, string> | null = null;

export async function fetchAllMovesWithTranslations(): Promise<Map<string, string>> {
  if (moveTranslations) {
    return moveTranslations;
  }

  const res = await fetch(`https://pokeapi.co/api/v2/move?limit=918`);
  if (!res.ok) {
    throw new Error(`PokeAPI fetch all moves failed -> ${res.status}`);
  }
  const data = await res.json();
  const moves = data.results;

  const translations = new Map<string, string>();
  const BATCH_SIZE = 20; // Process 20 requests at a time

  for (let i = 0; i < moves.length; i += BATCH_SIZE) {
    const batch = moves.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (move: { name: string; url: string }) => {
        const moveRes = await fetch(move.url);
        if (moveRes.ok) {
          const moveData = await moveRes.json();
          const spanishName = moveData.names.find((n: any) => n.language.name === 'es');
          if (spanishName) {
            translations.set(move.name, spanishName.name);
          }
        }
      })
    );
  }

  moveTranslations = translations;
  return translations;
}


export async function fetchAllAbilitiesWithTranslations(): Promise<Map<string, string>> {
  if (abilityTranslations) {
    return abilityTranslations;
  }

  const res = await fetch(`https://pokeapi.co/api/v2/ability?limit=367`);
  if (!res.ok) {
    throw new Error(`PokeAPI fetch all abilities failed -> ${res.status}`);
  }
  const data = await res.json();
  const abilities = data.results;

  const translations = new Map<string, string>();

  await Promise.all(
    abilities.map(async (ability: { name: string; url: string }) => {
      const abilityRes = await fetch(ability.url);
      if (abilityRes.ok) {
        const abilityData = await abilityRes.json();
        const spanishName = abilityData.names.find((n: any) => n.language.name === 'es');
        if (spanishName) {
          translations.set(ability.name, spanishName.name);
        }
      }
    })
  );

  abilityTranslations = translations;
  return translations;
}

export function randomId(exclude?: number) {
  let id = 1
  do id = Math.floor(Math.random() * MAX_ID) + 1
  while (id === exclude)
  return id
}

hydrateCache()