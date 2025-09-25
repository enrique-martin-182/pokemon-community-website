export type Track = {
  id: string
  title: string
  artist?: string
  src: string
  cover?: string
}

export const TRACKS: Track[] = [
  { id: 't1', title: 'Lofi beats to eat salmorejo/echar la siesta to', artist: 'Enrique Shikari', src: '/audio/eat-salmorejo.mp3', cover: '/audio/covers/1.jpg' },
  { id: 't2', title: 'Kokoro', artist: 'Enrique Shikari', src: '/audio/kokoro.mp3', cover: '/audio/covers/1.jpg' },
  { id: 't3', title: 'Trouble Dog', artist: 'Enrique Shikari', src: '/audio/trouble-dog.mp3', cover: '/audio/covers/1.jpg' },
  { id: 't4', title: 'storms.', artist: 'Enrique Shikari', src: '/audio/storms.mp3', cover: '/audio/covers/1.jpg' }
]