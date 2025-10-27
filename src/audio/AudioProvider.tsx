import React, { createContext, useContext } from 'react'
import { useAudioPlayer } from '../hooks/useAudioPlayer'
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

const AudioCtx = createContext<AudioCtxType | null>(null)

export function useAudio() {
  const ctx = useContext(AudioCtx)
  if (!ctx) throw new Error('useAudio debe usarse dentro de <AudioProvider>')
  return ctx
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioPlayer = useAudioPlayer()

  return <AudioCtx.Provider value={audioPlayer}>{children}</AudioCtx.Provider>
}
