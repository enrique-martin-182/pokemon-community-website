import { useState } from 'react'
import type { Tournament } from '../types'

function formatDate(dateISO: string) {
  const d = new Date(dateISO)
  return d.toLocaleString('es-ES', {
    dateStyle: 'long',
    timeStyle: 'short',
  })
}

export default function TournamentCard({ tournament }: { tournament: Tournament }) {
  const [notesOpen, setNotesOpen] = useState(false)

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">{tournament.name}</h3>
          <p className="text-sm text-neutral-400">
            {tournament.format} · {tournament.location}
          </p>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-white/10">
          {formatDate(tournament.dateISO)}
        </span>
      </div>

      {notesOpen && tournament.notes && (
        <div className="mt-3 text-neutral-300 whitespace-pre-wrap bg-black/20 p-4 rounded-lg">
          {tournament.notes}
        </div>
      )}

      {notesOpen && tournament.rounds && tournament.rounds.length > 0 && (
        <div className="mt-3 text-neutral-300 whitespace-pre-wrap bg-black/20 p-4 rounded-lg">
          {tournament.rounds.map((round, index) => (
            <p key={index}>{round}</p>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-4">
        {tournament.registrationLink ? (
          <a
            href={tournament.registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-xl px-4 py-2 bg-white text-neutral-900 font-semibold hover:opacity-90 transition"
          >
            Inscribirme
          </a>
        ) : (
          <span className="text-neutral-400 text-sm">Inscripción próximamente</span>
        )}

        {tournament.notes && (
          <button
            onClick={() => setNotesOpen(!notesOpen)}
            className="inline-flex rounded-xl px-4 py-2 bg-white/10 text-white font-semibold hover:bg-white/20 transition"
          >
            {notesOpen ? 'Ocultar Detalles' : 'Ver Detalles'}
          </button>
        )}
        <a
          href="/reglas-torneo-lideres-qlk.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-xl px-4 py-2 bg-white/10 text-white font-semibold hover:bg-white/20 transition"
        >
          Normas (PDF)
        </a>
      </div>
    </>
  )
}
