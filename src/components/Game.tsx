import { useEffect, useMemo, useRef, useState } from 'react'
import { REVEAL_MS_CORRECT, REVEAL_MS_WRONG } from '../gameConfig'

type StatKey = 'hp' | 'attack' | 'defense' | 'special-attack' | 'special-defense' | 'speed'
const STAT_LABELS: Record<StatKey, string> = {
  hp: 'HP',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'Ataque Especial',
  'special-defense': 'Defensa Especial',
  speed: 'Velocidad',
}

type Pokemon = {
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

async function fetchPokemon(id: number): Promise<Pokemon> {
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

function randomId(exclude?: number) {
  let id = 1
  do id = Math.floor(Math.random() * MAX_ID) + 1
  while (id === exclude)
  return id
}

function useBestScore() {
  const getAll = () => {
    try {
      return (JSON.parse(localStorage.getItem('qkk-best') || '{}') as Record<StatKey, number>)
    } catch {
      return {} as Record<StatKey, number>
    }
  }
  const setFor = (stat: StatKey, value: number) => {
    const all = getAll()
    all[stat] = Math.max(all[stat] ?? 0, value)
    localStorage.setItem('qkk-best', JSON.stringify(all))
    return all[stat]
  }
  const getFor = (stat?: StatKey | null) => (stat ? getAll()[stat] ?? 0 : 0)
  return { getFor, setFor }
}

export default function Game() {
  const [stat, setStat] = useState<StatKey | null>(null)
  const [left, setLeft] = useState<Pokemon | null>(null)
  const [right, setRight] = useState<Pokemon | null>(null)
  const [loading, setLoading] = useState(false)
  const [score, setScore] = useState(0)
  const [mode, setMode] = useState<'select' | 'playing' | 'gameover'>('select')
  const [msg, setMsg] = useState<string>('')

  // --- Fase de revelado
  const [revealing, setRevealing] = useState(false)
  const [revealValues, setRevealValues] = useState<{ left: number; right: number } | null>(null)
  const [selectedSide, setSelectedSide] = useState<'left' | 'right' | null>(null)

  const { getFor, setFor } = useBestScore()
  const started = useRef(false)

  useEffect(() => {
    if (!started.current) {
      hydrateCache()
      started.current = true
    }
  }, [])

  async function getRandomPokemon(excludeId?: number): Promise<Pokemon> {
    let tries = 0
    while (tries < 6) {
      try {
        const id = randomId(excludeId)
        return await fetchPokemon(id)
      } catch {
        tries++
      }
    }
    return fetchPokemon(1)
  }

  async function startGame(s: StatKey) {
    setStat(s)
    setScore(0)
    setMsg('')
    setMode('playing')
    setLoading(true)
    setRevealing(false)
    setRevealValues(null)
    setSelectedSide(null)
    const a = await getRandomPokemon()
    const b = await getRandomPokemon(a.id)
    setLeft(a)
    setRight(b)
    setLoading(false)
  }

  async function nextRound(keep: 'left' | 'right') {
    setLoading(true)
    if (keep === 'left' && left) {
      const b = await getRandomPokemon(left.id)
      setRight(b)
    } else if (keep === 'right' && right) {
      const a = await getRandomPokemon(right.id)
      setLeft(a)
    }
    setRevealing(false)
    setRevealValues(null)
    setSelectedSide(null)
    setLoading(false)
  }

  function value(p: Pokemon | null, s: StatKey | null) {
    if (!p || !s) return 0
    return p.stats[s]
  }

  async function choose(side: 'left' | 'right') {
    if (!stat || !left || !right || loading || revealing) return

    const a = value(left, stat)
    const b = value(right, stat)
    setSelectedSide(side)
    setRevealValues({ left: a, right: b })
    setRevealing(true)

    const isTie = a === b
    const isCorrect = isTie || (side === 'left' ? a > b : b > a)

    if (isCorrect) {
      setScore((x) => x + 1)
      setMsg(isTie ? '¡Empate! Cuenta como acierto. +1' : '¡Correcto! +1')
      window.setTimeout(async () => {
        await nextRound(side) // mantiene el Pokémon elegido
      }, REVEAL_MS_CORRECT)
    } else {
      setMsg(`¡Fallaste! ${left.name} (${a}) vs ${right.name} (${b})`)
      setFor(stat, score)
      window.setTimeout(() => {
        setMode('gameover')
        setRevealing(false)
      }, REVEAL_MS_WRONG)
    }
  }

  function resetAll() {
    setMode('select')
    setStat(null)
    setLeft(null)
    setRight(null)
    setScore(0)
    setMsg('')
    setRevealing(false)
    setRevealValues(null)
    setSelectedSide(null)
  }

  const best = useMemo(() => getFor(stat), [stat])

  return (
    <section className="space-y-6">
      <h2 className="text-3xl md:text-4xl font-bold">🎮 Minijuego — ¿Quién tiene más…?</h2>

      {mode === 'select' && (
        <div className="glass rounded-2xl p-6">
          <p className="text-neutral-300 mb-4">Elige una estadística para jugar:</p>
          <div className="flex flex-wrap gap-3">
            {(Object.keys(STAT_LABELS) as StatKey[]).map((k) => (
              <button
                key={k}
                onClick={() => startGame(k)}
                className="rounded-xl px-4 py-2 font-semibold bg-white text-neutral-900 hover:opacity-90 transition"
              >
                {STAT_LABELS[k]}
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === 'playing' && stat && (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm px-3 py-1 rounded-full glass">
              Estadística: <strong>{STAT_LABELS[stat]}</strong>
            </span>
            <span className="text-sm px-3 py-1 rounded-full glass">Puntuación: <strong>{score}</strong></span>
            <span className="text-sm px-3 py-1 rounded-full glass">Mejor {STAT_LABELS[stat]}: <strong>{best}</strong></span>
          </div>

          {msg && <div className="text-sm text-neutral-300">{msg}</div>}

          <div className={`grid md:grid-cols-2 gap-6 ${revealing ? 'pointer-events-none' : ''}`}>
            <PokemonCard
              side="left"
              pokemon={left}
              statKey={stat}
              disabled={loading || revealing}
              selected={selectedSide === 'left'}
              revealValues={revealValues}
              onChoose={() => choose('left')}
              label="Campeón actual"
            />
            <PokemonCard
              side="right"
              pokemon={right}
              statKey={stat}
              disabled={loading || revealing}
              selected={selectedSide === 'right'}
              revealValues={revealValues}
              onChoose={() => choose('right')}
            />
          </div>

          <p className="text-xs text-neutral-400">
            Consejo: piensa rápido; los valores se revelan tras tu elección y luego llega el siguiente rival.
          </p>
        </>
      )}

      {mode === 'gameover' && stat && (
        <div className="glass rounded-2xl p-6 space-y-4">
          <h3 className="text-2xl font-bold">Fin de la partida</h3>
          <p className="text-neutral-300">
            Estadística: <strong>{STAT_LABELS[stat]}</strong> · Puntuación total: <strong>{score}</strong> · Mejor: <strong>{getFor(stat)}</strong>
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => startGame(stat)}
              className="rounded-xl px-4 py-2 font-semibold bg-white text-neutral-900 hover:opacity-90 transition"
            >
              Jugar de nuevo
            </button>
            <button onClick={resetAll} className="rounded-xl px-4 py-2 font-semibold glass hover:bg-white/10 transition">
              Cambiar estadística
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

function PokemonCard({
  side,
  pokemon,
  statKey,
  onChoose,
  disabled,
  selected,
  label,
  revealValues,
}: {
  side: 'left' | 'right'
  pokemon: Pokemon | null
  statKey: StatKey
  onChoose: () => void
  disabled?: boolean
  selected?: boolean
  label?: string
  revealValues?: { left: number; right: number } | null
}) {
  const myVal = revealValues ? (side === 'left' ? revealValues.left : revealValues.right) : null
  const otherVal = revealValues ? (side === 'left' ? revealValues.right : revealValues.left) : null
  const revealed = typeof myVal === 'number' && typeof otherVal === 'number'
  const isTie = revealed && myVal === otherVal
  const isWinner = revealed && !isTie && myVal! > otherVal!

  const ring =
    revealed
      ? isTie
        ? 'ring-1 ring-yellow-400/60'
        : isWinner
          ? 'ring-1 ring-emerald-400/70'
          : 'ring-1 ring-rose-400/70'
      : selected
        ? 'ring-1 ring-white/40'
        : ''

  return (
    <div className={`glass rounded-2xl p-5 flex flex-col items-center text-center ${ring}`}>
      {label && <span className="text-xs text-neutral-400 mb-2">{label}</span>}
      <img
        src={pokemon?.sprite}
        alt={pokemon?.name || 'Pokémon'}
        className="w-40 h-40 object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,.35)] select-none"
        draggable={false}
      />
      <h4 className="mt-3 text-lg font-semibold capitalize">{pokemon?.name ?? '...'}</h4>
      <div className="mt-1 text-sm text-neutral-400">
        ¿Quién tiene más <strong className="text-neutral-200">{STAT_LABELS[statKey]}</strong>?
      </div>

      <div className={`mt-3 text-sm px-3 py-1 rounded-full border ${revealed ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10'}`}>
        {STAT_LABELS[statKey]}:{' '}
        <span className="tracking-widest">
          {revealed ? myVal : '???'}
        </span>
      </div>

      <button
        onClick={onChoose}
        disabled={disabled}
        className={`mt-4 inline-flex rounded-xl px-4 py-2 font-semibold transition ${
          disabled ? 'glass cursor-not-allowed' : 'bg-white text-neutral-900 hover:opacity-90'
        }`}
      >
        Elegir
      </button>
    </div>
  )
}
