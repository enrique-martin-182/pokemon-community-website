/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useEffect, useMemo, useRef, useState } from 'react'
import { TRACKS } from '../music/tracks'
import { Track } from '../types'

interface AudioCtxType {
  tracks: Track[]
  index: number
  track: Track | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  loop: boolean
  shuffle: boolean
  visible: boolean
  error: string | null
  togglePlay(): void
  play(): void
  pause(): void
  next(): void
  prev(): void
  playTrack(i: number): void
  seekAbs(sec: number): void
  seekRel(delta: number): void
  setVolume(v: number): void
  setLoop(v: boolean): void
  setShuffle(v: boolean): void
  setVisible(v: boolean): void
  toggleVisible(): void
}

const VOL_KEY = 'qkk-audio-volume'
const LAST_KEY = 'qkk-audio-last'
const VIS_KEY = 'qkk-audio-visible'

export function useAudioPlayer(): AudioCtxType {
  const [index, setIndex] = useState<number>(() => {
    try {
      const id = localStorage.getItem(LAST_KEY)
      const i = TRACKS.findIndex((t: Track) => t.id === id)
      return i >= 0 ? i : 0
    } catch {
      // Ignore errors, use default
      return 0
    }
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState<number>(() => {
    try {
      const v = Number(localStorage.getItem(VOL_KEY))
      return isFinite(v) && v >= 0 && v <= 1 ? v : 0.9
    } catch {
      // Ignore errors, use default
      return 0.9
    }
  })
  const [loop, setLoop] = useState(false)
  const [shuffle, setShuffle] = useState(false)

  const [visible, setVisible] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem(VIS_KEY)
      return v === null ? true : v === '1'
    } catch {
      // Ignore errors, use default
      return true
    }
  })

  const [error, setError] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const track = useMemo<Track | null>(() => TRACKS[index] ?? null, [index])

  useEffect(() => {
    const el = document.createElement('audio')
    el.preload = 'metadata'
    audioRef.current = el

    const onLoaded = () => setDuration(el.duration || 0)
    const onTime = () => setCurrentTime(el.currentTime || 0)
    const onEnded = () => {
      if (!el.loop) next()
    }
    const onError = () => {
      setError('No se pudo cargar el audio (revisa /public/audio/...)')
      setIsPlaying(false)
    }

    el.addEventListener('loadedmetadata', onLoaded)
    el.addEventListener('timeupdate', onTime)
    el.addEventListener('ended', onEnded)
    el.addEventListener('error', onError)

    el.style.display = 'none'
    document.body.appendChild(el)

    return () => {
      el.pause()
      el.removeEventListener('loadedmetadata', onLoaded)
      el.removeEventListener('timeupdate', onTime)
      el.removeEventListener('ended', onEnded)
      el.removeEventListener('error', onError)
      document.body.removeChild(el)
    }
  }, [])

  useEffect(() => {
    const el = audioRef.current
    if (!el || !track) return
    el.src = track.src
    el.loop = loop
    el.volume = volume
    setError(null)
    setCurrentTime(0)
    setDuration(0)
    el.load()
    if (isPlaying) el.play().catch(() => setIsPlaying(false))
  }, [index, track?.src])

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    el.loop = loop
  }, [loop])

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    el.volume = volume
    try {
      localStorage.setItem(VOL_KEY, String(volume))
    } catch {
      // Ignore errors
    }
  }, [volume])

  useEffect(() => {
    if (track)
      try {
        localStorage.setItem(LAST_KEY, track.id)
      } catch {
        // Ignore errors
      }
  }, [track?.id])

  useEffect(() => {
    try {
      localStorage.setItem(VIS_KEY, visible ? '1' : '0')
    } catch {
      // Ignore errors
    }
  }, [visible])

  function togglePlay() {
    isPlaying ? pause() : play()
  }
  function play() {
    const el = audioRef.current
    if (!el) return
    el.play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false))
  }
  function pause() {
    const el = audioRef.current
    if (!el) return
    el.pause()
    setIsPlaying(false)
  }
  function seekAbs(sec: number) {
    const el = audioRef.current
    if (!el || !isFinite(duration)) return
    const t = Math.max(0, Math.min(duration, sec))
    el.currentTime = t
    setCurrentTime(t)
  }
  function seekRel(delta: number) {
    seekAbs(currentTime + delta)
  }
  function randIndex(exclude: number) {
    if (TRACKS.length <= 1) return exclude
    let r = exclude
    while (r === exclude) r = Math.floor(Math.random() * TRACKS.length)
    return r
  }
  function next() {
    if (shuffle) {
      setIndex((i) => randIndex(i))
      return
    }
    setIndex((i) => (i + 1) % TRACKS.length)
  }
  function prev() {
    if (shuffle) {
      setIndex((i) => randIndex(i))
      return
    }
    setIndex((i) => (i - 1 + TRACKS.length) % TRACKS.length)
  }
  function playTrack(i: number) {
    setIndex(i)
    setVisible(true)
    setTimeout(() => play(), 0)
  }
  function toggleVisible() {
    setVisible((v) => !v)
  }

  return {
    tracks: TRACKS,
    index,
    track,
    isPlaying,
    currentTime,
    duration,
    volume,
    loop,
    shuffle,
    visible,
    error,
    togglePlay,
    play,
    pause,
    next,
    prev,
    playTrack,
    seekAbs,
    seekRel,
    setVolume,
    setLoop,
    setShuffle,
    setVisible,
    toggleVisible,
  }
}
/* eslint-enable @typescript-eslint/no-unused-expressions */
