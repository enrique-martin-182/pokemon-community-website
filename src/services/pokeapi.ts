export type StatKey = 'hp' | 'attack' | 'defense' | 'special-attack' | 'special-defense' | 'speed'
export const STAT_LABELS: Record<StatKey, string> = {
  hp: 'HP',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'Ataque Especial',
  'special-defense': 'Defensa Especial',
  speed: 'Velocidad',
}

export type Pokemon = {
  id: number
  name: string
  sprite: string
  stats: Record<StatKey, number>
}

const MAX_ID = 1025
const API = 'https://pokeapi.co/api/v2/pokemon/'

// --- Caché en memoria + localStorage
const memCache = new Map<number, Pokemon>()
function hydrateCache() {
  try {
    const s = localStorage.getItem('qkk-cache')
    if (s) {
      const obj = JSON.parse(s) as Record<string, Pokemon>
      for (const k of Object.keys(obj)) memCache.set(Number(k), obj[k])
    }
  } catch {}
}

function persistToLS(p: Pokemon) {
  try {
    const s = localStorage.getItem('qkk-cache')
    const obj = s ? (JSON.parse(s) as Record<string, Pokemon>) : {}
    obj[String(p.id)] = p
    localStorage.setItem('qkk-cache', JSON.stringify(obj))
  } catch {}
}

export async function fetchPokemon(id: number): Promise<Pokemon> {
  if (memCache.has(id)) return memCache.get(id)!
  const res = await fetch(`${API}${id}`)
  if (!res.ok) throw new Error(`PokeAPI ${id} -> ${res.status}`)
  const data = await res.json()
  const get = (k: StatKey) => data.stats.find((s: any) => s.stat.name === k)?.base_stat ?? 0
  const poke: Pokemon = {
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
  }
  memCache.set(id, poke)
  persistToLS(poke)
  return poke
}

export function randomId(exclude?: number) {
  let id = 1
  do id = Math.floor(Math.random() * MAX_ID) + 1
  while (id === exclude)
  return id
}

hydrateCache()
