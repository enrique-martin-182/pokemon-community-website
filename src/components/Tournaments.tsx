import { activeTournaments } from '../data/tournaments'
import TournamentCard from './TournamentCard'

export default function Tournaments() {
  console.log('Active Tournaments:', activeTournaments);
  console.log('Active Tournaments Length:', activeTournaments.length);

  return (
    <section className="space-y-6">
      <h2 className="text-3xl md:text-4xl font-bold">🏆 Torneos activos</h2>
      {activeTournaments.length === 0 ? (
        <p className="text-neutral-400">De momento no hay torneos activos. Vuelve pronto.</p>
      ) : (
        <ul className="grid sm:grid-cols-2 gap-5">
          {activeTournaments.map((t) => (
            <li key={t.id} className="glass rounded-2xl p-5">
              <TournamentCard tournament={t} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
