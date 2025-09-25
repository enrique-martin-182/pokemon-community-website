import React from 'react'
import { useAudio } from '../audio/AudioProvider'

function formatTime(sec: number) {
  if (!isFinite(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function StickyPlayer() {
  const a = useAudio()
  const t = a.track

  // iOS no permite controlar el volumen por software
  const isIOS =
    typeof navigator !== 'undefined' &&
    /iPhone|iPad|iPod/i.test(navigator.userAgent)

  if (!a.visible || !t) return null

  return (
    <div className="fixed z-50 bottom-0 left-0 right-0">
      <div className="mx-auto max-w-5xl px-3 sm:px-4 py-2">
        <div className="glass rounded-2xl shadow-lg p-2 sm:p-3">
          <div className="grid grid-cols-[52px,1fr,auto] sm:grid-cols-[64px,1fr,auto] gap-3 items-center">
            {/* Cover */}
            <img
              src={t.cover || '/logo.png'}
              alt=""
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover"
            />

            {/* Título + progreso */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="truncate font-medium">{t.title}</div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">
                  {a.isPlaying ? 'Reproduciendo' : 'Pausado'}
                </span>
              </div>
              {t.artist && (
                <div className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
                  {t.artist}
                </div>
              )}

              <div className="mt-1 flex items-center gap-2">
                <span className="text-[10px] w-8 text-right text-neutral-600 dark:text-neutral-400">
                  {formatTime(a.currentTime)}
                </span>
                <input
                  type="range"
                  min={0}
                  max={isFinite(a.duration) && a.duration > 0 ? a.duration : 0}
                  step={0.1}
                  value={a.currentTime}
                  onChange={(e) => a.seekAbs(Number(e.target.value))}
                  className="flex-1 accent-neutral-900 dark:accent-white"
                  aria-label="Progreso"
                />
                <span className="text-[10px] w-8 text-neutral-600 dark:text-neutral-400">
                  {formatTime(a.duration)}
                </span>
              </div>
            </div>

            {/* Controles (ahora el volumen también en móvil) */}
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <button
                onClick={a.prev}
                className="px-2 py-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
                aria-label="Anterior"
              >
                ⏮
              </button>
              <button
                onClick={a.togglePlay}
                className="px-3 py-2 rounded-xl bg-white text-neutral-900 hover:opacity-90 font-semibold"
                aria-label={a.isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {a.isPlaying ? '⏸' : '▶️'}
              </button>
              <button
                onClick={a.next}
                className="px-2 py-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
                aria-label="Siguiente"
              >
                ⏭
              </button>

              {/* Volumen SIEMPRE visible (se adapta de tamaño) */}
              <div className="flex items-center gap-2 ml-1">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  🔊
                </span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={a.volume}
                  onChange={(e) => a.setVolume(Number(e.target.value))}
                  className="w-20 sm:w-24 md:w-28 accent-neutral-900 dark:accent-white"
                  aria-label="Volumen"
                  disabled={isIOS}
                />
              </div>

              <button
                onClick={() => a.setVisible(false)}
                className="ml-1 px-2 py-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
                aria-label="Ocultar reproductor"
                title="Ocultar reproductor"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Nota para iOS */}
          {isIOS && (
            <div className="mt-1 text-[10px] text-neutral-600 dark:text-neutral-400">
              En iOS no se puede ajustar el volumen por software; usa los
              botones físicos del dispositivo.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
