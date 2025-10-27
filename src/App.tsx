import React, { lazy, Suspense } from 'react'
import { AudioProvider } from './audio/AudioProvider'
import StickyPlayer from './components/StickyPlayer'
import Header from './components/Header'
import { DISCORD_URL } from './config'
import { Routes, Route, useNavigate } from 'react-router-dom'

const Tournaments = lazy(() => import('./components/Tournaments'))
const Game = lazy(() => import('./components/Game'))
const MusicPlayer = lazy(() => import('./components/MusicPlayer'))
const DamageCalculator = lazy(() => import('./components/DamageCalculator'))

function Home() {
  const navigate = useNavigate()

  return (
    <section className="grid md:grid-cols-2 gap-8 items-center">
      <div className="space-y-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-readable">
          <span className="brand-title">QueLoKhé</span> — Pokémon competitivo Córdoba
        </h1>

        <p className="text-readable text-base sm:text-lg text-neutral-700 dark:text-neutral-200">
          Comunidad local (y online) para jugar, aprender y competir en Pokémon. Quedadas, ligas,
          torneos y buen ambiente en Córdoba, España.
        </p>

        <div className="flex flex-wrap gap-3">
          <a
            href={DISCORD_URL || '#'}
            target={DISCORD_URL ? '_blank' : undefined}
            rel={DISCORD_URL ? 'noopener noreferrer' : undefined}
            aria-disabled={!DISCORD_URL}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold shadow-glow transition
              ${DISCORD_URL ? 'bg-white text-neutral-900 hover:opacity-90' : 'glass text-neutral-700 dark:text-neutral-300 cursor-not-allowed'}
            `}
            title={DISCORD_URL ? 'Abrir Discord' : 'Añade el enlace de Discord en src/config.ts'}
          >
            🗨️ Únete al Discord
          </a>
          <button
            onClick={() => navigate('/torneos')}
            className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold glass hover:bg-black/10 dark:hover:bg-white/10 transition"
          >
            🏆 Ver torneos activos
          </button>
          <button
            onClick={() => navigate('/juego')}
            className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold glass hover:bg-black/10 dark:hover:bg-white/10 transition"
          >
            🎮 Jugar ahora
          </button>
          <button
            onClick={() => navigate('/musica')}
            className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold glass hover:bg-black/10 dark:hover:bg-white/10 transition"
          >
            🎧 Música
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -inset-6 bg-[linear-gradient(135deg,#ec4899,#8b5cf6)] opacity-40 blur-2xl rounded-full" />
        <img
          src="/logo.png"
          alt="Logo QueLoKhé"
          className="relative w-full max-w-[260px] sm:max-w-sm mx-auto aspect-square object-contain shadow-glow"
        />
      </div>
    </section>
  )
}

export default function App() {
  return (
    <AudioProvider>
      <div className="min-h-screen text-neutral-900 dark:text-neutral-100">
        <Header />

        <main className="max-w-5xl mx-auto px-4 py-8 pb-28">
          <Suspense fallback={<div>Cargando...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/torneos" element={<Tournaments />} />
              <Route path="/juego" element={<Game />} />
              <Route path="/musica" element={<MusicPlayer />} />
              <Route path="/calculadora" element={<DamageCalculator />} />
              {/* Fallback for unknown routes */}
              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>
        </main>

        <footer className="border-t border-black/10 dark:border-white/10 mt-16">
          <div className="max-w-5xl mx-auto px-4 py-6 text-sm text-neutral-600 dark:text-neutral-400 text-center sm:text-left">
            © {new Date().getFullYear()} QueLoKhé · Córdoba, España
          </div>
        </footer>

        <StickyPlayer />
      </div>
    </AudioProvider>
  )
}
