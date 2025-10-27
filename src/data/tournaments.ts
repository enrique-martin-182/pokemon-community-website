import type { Tournament } from '../types'

export const activeTournaments: Tournament[] = [
  {
    id: 'qkk-001',
    name: 'Liga QueLoKhé — Jornada 3',
    dateISO: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // +7 días
    format: 'VGC',
    location: 'Córdoba',
    registrationLink: '#',
    notes: 'Inscripción abierta. Trae tu consola y cargador.',
  },
  {
    id: 'qkk-002',
    name: 'Showdown Night — Bo3',
    dateISO: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(), // +14 días
    format: 'Singles',
    location: 'Online',
    registrationLink: '#',
    notes: 'Se juega en Pokémon Showdown. Formato OU.',
  },
]
