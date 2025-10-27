import React from 'react'
import { useAudio } from '../audio/AudioProvider'

export default function MusicPlayer() {
  const a = useAudio()

  if (!a.tracks.length) {
    return (
      <section className="space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold">🎧 Música</h2>
        <div className="glass p-6 rounded-2xl">
          Añade pistas en <code>public/audio/</code> y edita <code>src/music/tracks.ts</code>.
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl md:text-4xl font-bold">🎧 Música</h2>
        <button
          onClick={() => a.setVisible(true)}
          className="rounded-xl px-4 py-2 font-semibold glass hover:bg-black/10 dark:hover:bg-white/10 transition"
        >
          Mostrar reproductor
        </button>
      </div>

      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {a.tracks.map((t, i) => {
          const active = i === a.index
          return (
            <li key={t.id}>
              <button
                onClick={() => a.playTrack(i)}
                className={`w-full glass p-3 rounded-2xl text-left hover:bg-black/5 dark:hover:bg-white/10 transition ${active ? 'ring-1 ring-white/20' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={t.cover || '/logo.png'}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <div className="font-medium truncate">{t.title}</div>
                    {t.artist && (
                      <div className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
                        {t.artist}
                      </div>
                    )}
                  </div>
                  <div className="ml-auto text-sm opacity-80">
                    {active && (a.isPlaying ? 'Reproduciendo' : 'Pausado')}
                  </div>
                </div>
              </button>
            </li>
          )
        })}
      </ul>

      <p className="text-xs text-neutral-600 dark:text-neutral-400">
        Consejo: pulsa “Mostrar reproductor” para fijarlo abajo y seguir escuchando mientras
        navegas.
      </p>
    </section>
  )
}
