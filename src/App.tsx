import { useState } from 'react'
import Header from './components/Header'
import Tournaments from './components/Tournaments'
import Game from './components/Game'
import { DISCORD_URL } from './config'

type Tab = 'inicio' | 'torneos' | 'juego'

export default function App() {
  const [tab, setTab] = useState<Tab>('inicio')

  return (
    <div className="min-h-screen">
      <Header onNavigate={setTab} active={tab} />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {tab === 'inicio' && (
          <section className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-readable">
                <span className="bg-retro-gradient bg-clip-text text-transparent">
                  QueLoKhé
                </span>{' '}
                — Pokémon competitivo Córdoba
              </h1>

              <p className="text-neutral-200 text-readable text-base sm:text-lg">
                Comunidad local (y online) para jugar, aprender y competir en Pokémon.
                Quedadas, ligas, torneos y buen ambiente en Córdoba, España.
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href={DISCORD_URL || '#'}
                  target={DISCORD_URL ? '_blank' : undefined}
                  rel={DISCORD_URL ? 'noopener noreferrer' : undefined}
                  aria-disabled={!DISCORD_URL}
                  className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold shadow-glow transition
                    ${DISCORD_URL ? 'bg-white text-neutral-900 hover:opacity-90' : 'glass text-neutral-300 cursor-not-allowed'}
                  `}
                  title={DISCORD_URL ? 'Abrir Discord' : 'Añade el enlace de Discord en src/config.ts'}
                >
                  🗨️ Únete al Discord
                </a>

                <button
                  onClick={() => setTab('torneos')}
                  className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold glass hover:bg-white/10 transition"
                >
                  🏆 Ver torneos activos
                </button>

                <button
                  onClick={() => setTab('juego')}
                  className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold glass hover:bg-white/10 transition"
                >
                  🎮 Jugar ahora
                </button>
              </div>
            </div>

            {/* Logo hero: ahora desde /public/logo.png para evitar problemas */}
            <div className="relative">
              <div className="absolute -inset-6 bg-retro-gradient opacity-40 blur-2xl rounded-full" />
              <img
                src="/logo.png"
                alt="Logo QueLoKhé"
                className="relative w-full max-w-[260px] sm:max-w-sm mx-auto aspect-square object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
              />
            </div>
          </section>
        )}

        {tab === 'torneos' && <Tournaments />}

        {tab === 'juego' && <Game />}
      </main>

      <footer className="border-t border-white/10 mt-16">
        <div className="max-w-5xl mx-auto px-4 py-6 text-sm text-neutral-400 text-center sm:text-left">
          © {new Date().getFullYear()} QueLoKhé · Córdoba, España
        </div>
      </footer>
    </div>
  )
}
