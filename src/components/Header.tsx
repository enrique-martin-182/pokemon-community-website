import React, { useEffect, useState } from 'react'
import ThemeToggle from './ThemeToggle'
import { useAudio } from '../audio/AudioProvider'

type Tab = 'inicio' | 'torneos' | 'juego' | 'musica'

type Props = {
  onNavigate: (tab: Tab) => void
  active: Tab
}

export default function Header({ onNavigate, active }: Props) {
  const [open, setOpen] = useState(false)
  const audio = useAudio()

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const btn = (key: Tab) =>
    `block w-full md:w-auto text-left md:text-center px-4 py-2 rounded-xl transition
     hover:bg-black/5 dark:hover:bg-white/10 ${active === key ? 'glass' : ''}`

  return (
    <header className="sticky top-0 z-40 bg-white/70 dark:bg-neutral-950/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-neutral-950/60 border-b border-black/10 dark:border-white/10">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <button onClick={() => onNavigate('inicio')} className="flex items-center gap-3 cursor-pointer" aria-label="Ir al inicio">
          <img src="/logo.png" alt="QueLoKhé" className="w-8 h-8 rounded-full object-cover" />
          <span className="font-bold tracking-tight text-neutral-900 dark:text-neutral-100">QueLoKhé</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => audio.toggleVisible()}
            className={`hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 ${audio.visible ? 'glass' : ''}`}
            title={audio.visible ? 'Ocultar reproductor' : 'Mostrar reproductor'}
          >
            🎧 <span className="hidden md:inline">{audio.visible ? 'Ocultar' : 'Reproductor'}</span>
          </button>

          <ThemeToggle className="hidden sm:inline-flex" />

          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl hover:bg-black/5 dark:hover:bg-white/10"
            aria-expanded={open}
            aria-controls="primary-nav"
            onClick={() => setOpen(!open)}
            aria-label="Abrir menú"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"/>
            </svg>
          </button>
        </div>

        <nav
          id="primary-nav"
          className={`absolute md:static top-16 left-0 right-0 md:top-auto
            bg-white/95 dark:bg-neutral-950/95 border-b border-black/10 dark:border-white/10 md:border-0
            ${open ? 'block' : 'hidden'} md:block`}
        >
          <ul className="max-w-5xl md:max-w-none mx-auto md:mx-0 px-4 py-2 md:p-0 grid md:flex gap-2 items-center">
            <li><button onClick={() => { onNavigate('inicio'); setOpen(false) }} className={btn('inicio')}>Inicio</button></li>
            <li><button onClick={() => { onNavigate('torneos'); setOpen(false) }} className={btn('torneos')}>Torneos</button></li>
            <li><button onClick={() => { onNavigate('juego'); setOpen(false) }} className={btn('juego')}>Minijuego</button></li>
            <li><button onClick={() => { onNavigate('musica'); setOpen(false) }} className={btn('musica')}>Música</button></li>

            <li className="md:hidden">
              <button
                onClick={() => { audio.toggleVisible(); setOpen(false) }}
                className={`w-full my-1 px-4 py-2 rounded-xl transition hover:bg-black/5 dark:hover:bg-white/10 ${audio.visible ? 'glass' : ''}`}
              >
                {audio.visible ? 'Ocultar reproductor' : 'Mostrar reproductor'}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
