import { useMemo, useState } from 'react'
import { REVEAL_MS_CORRECT, REVEAL_MS_WRONG } from '../gameConfig'
import { fetchPokemon, randomId, PokemonInfo, StatKey } from '../services/pokeapi';

function useBestScore() {
  const getAll = () => {
    try {
      return JSON.parse(localStorage.getItem('qkk-best') || '{}') as Record<StatKey, number>
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
  const getFor = (stat?: StatKey | null) => (stat ? (getAll()[stat] ?? 0) : 0)
  return { getFor, setFor }
}

export function useGameLogic() {
  const [stat, setStat] = useState<StatKey | null>(null)
     const [left, setLeft] = useState<PokemonInfo | null>(null)
     const [right, setRight] = useState<PokemonInfo | null>(null)
   const [loading, setLoading] = useState(false)
  const [score, setScore] = useState(0)
  const [mode, setMode] = useState<'select' | 'playing' | 'gameover'>('select')
  const [msg, setMsg] = useState<string>('')

  // --- Fase de revelado
  const [revealing, setRevealing] = useState(false)
  const [revealValues, setRevealValues] = useState<{ left: number; right: number } | null>(null)
  const [selectedSide, setSelectedSide] = useState<'left' | 'right' | null>(null)

  const { getFor, setFor } = useBestScore()

     async function getRandomPokemon(excludeId?: number): Promise<PokemonInfo> {    let tries = 0
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

     function value(p: PokemonInfo | null, s: StatKey | null) {    if (!p || !s) return 0
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
        await nextRound(side)
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

  return {
    stat,
    left,
    right,
    loading,
    score,
    mode,
    msg,
    revealing,
    revealValues,
    selectedSide,
    best,
    startGame,
    choose,
    resetAll,
  }
}
