import type { Tournament } from '../types'

export const activeTournaments: Tournament[] = [
  {
    id: 'qlk-comm-001',
    name: 'LIGA POKÉMON QLK: TORNEO DE EXHIBICIÓN DE LÍDERES DE GIMNASIO',
    dateISO: new Date().toISOString(),
    format: 'VGC',
    location: 'Online',
    registrationLink: '#',
    notes: `El objetivo del torneo será por una parte que los futuros líderes tengan la oportunidad de demostrar su habilidad y equipos por un lado y elegir al alto mando por el otro.\n\nLa competición consta de dos fases: \n\nFase de liguilla (rey de la pista): se jugará un “rey de la pista” entre 3 personas que formarán 6 grupos hasta alcanzar 18 participantes, uno por tipo. El mejor de cada trío, pasará automáticamente al bracket principal. Los 12 entrenadores restantes se enfrentarán en una repesca en un cuadro secundario, de los cuales 2 accederán al cuadro principal.\nFase de cuadro eliminatorio: con los 6 jugadores del bracket principal y los 2 del cuadro de la repesca, se hará un cuadro de eliminación directa de 8 personas.\n\nTodos los participantes ostentarán el título de líder de gimnasio de su tipo una vez finalizado el torneo y el top 4 del torneo será coronado como alto mando, también de su tipo, quedando vacantes los 4 puestos de líderes de gimnasio para futuros miembros de la liga.`,
    rounds: [
      '--- Primera Ronda (Semana del 27 de Octubre) ---',
      '- Clau (PSÍQUICO) vs Antonio (VENENO) (TBD)',
      '- Charion/ Rb (DRAGÓN) (L) vs James (TIERRA) (W)',
      '- Mario (VOLADOR) (L) vs Isma (FANTASMA) (W)',
      '- Manue (BICHO) (L) vs Sergio (HADA) (W)',
      '- Enri (SINIESTRO) (W) vs Fran (ROCA) (L)',
      '- José Torrico (ELÉCTRICO) vs Dolphin (HIELO) (TBD)',
    ],
  },
]
