export type Tournament = {
  id: string
  name: string
  dateISO: string // ISO date string
  format: 'VGC' | 'Singles' | 'Doubles' | 'Otros'
  location: 'Córdoba' | 'Online' | string
  registrationLink?: string
  notes?: string
}

export type Track = {
  id: string
  title: string
  artist?: string
  src: string
  cover?: string
}
