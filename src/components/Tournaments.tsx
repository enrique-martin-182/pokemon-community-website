import { activeTournaments } from '../data/tournaments'

function formatDate(dateISO: string) {
  const d = new Date(dateISO)
  return d.toLocaleString('es-ES', {
    dateStyle: 'long',
    timeStyle: 'short',
  })
}

export default function Tournaments() {
  return (
    <section className="space-y-6">
      <h2 className="text-3xl md:text-4xl font-bold">🏆 Torneos activos</h2>
      {activeTournaments.length === 0 ? (
        <p className="text-neutral-400">De momento no hay torneos activos. Vuelve pronto.</p>
      ) : (
        <ul className="grid sm:grid-cols-2 gap-5">
          {activeTournaments.map((t) => (
            <li key={t.id} className="glass rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">{t.name}</h3>
                  <p className="text-sm text-neutral-400">
                    {t.format} · {t.location}
                  </p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-white/10">
                  {formatDate(t.dateISO)}
                </span>
              </div>

              {t.notes && <p className="mt-3 text-neutral-300">{t.notes}</p>}

              <div className="mt-4">
                {t.registrationLink ? (
                  <a
                    href={t.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-xl px-4 py-2 bg-white text-neutral-900 font-semibold hover:opacity-90 transition"
                  >
                    Inscribirme
                  </a>
                ) : (
                  <span className="text-neutral-400 text-sm">Inscripción próximamente</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
