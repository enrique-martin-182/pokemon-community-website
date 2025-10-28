export interface Tournament {
  id: string
  name: string
  dateISO: string // ISO date string
  format: 'VGC' | 'Singles' | 'Doubles' | 'Otros'
  location: 'Córdoba' | 'Online' | string
  registrationLink?: string
  notes?: string
  rounds?: string[]
}

export interface Track {
  id: string
  title: string
  artist?: string
  src: string
  cover?: string
}

export interface GymLeader {
  type: string;
  name: string;
}
