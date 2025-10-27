import { useMemo } from 'react'
import { STAT_LABELS, StatKey, Pokemon } from '../services/pokeapi'
import { useGameLogic } from '../hooks/useGameLogic'

export default function Game() {
  const {
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
  } = useGameLogic()

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
            <span className="text-sm px-3 py-1 rounded-full glass">
              Puntuación: <strong>{score}</strong>
            </span>
            <span className="text-sm px-3 py-1 rounded-full glass">
              Mejor {STAT_LABELS[stat]}: <strong>{best}</strong>
            </span>
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
            Consejo: piensa rápido; los valores se revelan tras tu elección y luego llega el
            siguiente rival.
          </p>
        </>
      )}

      {mode === 'gameover' && stat && (
        <div className="glass rounded-2xl p-6 space-y-4">
          <h3 className="text-2xl font-bold">Fin de la partida</h3>
          <p className="text-neutral-300">
            Estadística: <strong>{STAT_LABELS[stat]}</strong> · Puntuación total:{' '}
            <strong>{score}</strong> · Mejor: <strong>{best}</strong>
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => startGame(stat)}
              className="rounded-xl px-4 py-2 font-semibold bg-white text-neutral-900 hover:opacity-90 transition"
            >
              Jugar de nuevo
            </button>
            <button
              onClick={resetAll}
              className="rounded-xl px-4 py-2 font-semibold glass hover:bg-white/10 transition"
            >
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

  const ring = revealed
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

      <div
        className={`mt-3 text-sm px-3 py-1 rounded-full border ${revealed ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10'}`}
      >
        {STAT_LABELS[statKey]}: <span className="tracking-widest">{revealed ? myVal : '???'}</span>
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
