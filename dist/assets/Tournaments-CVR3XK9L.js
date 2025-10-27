import { j as e } from './index-BeGCS1Mt.js'
const n = [
  {
    id: 'qkk-001',
    name: 'Liga QueLoKhé — Jornada 3',
    dateISO: new Date(Date.now() + 1e3 * 60 * 60 * 24 * 7).toISOString(),
    format: 'VGC',
    location: 'Córdoba',
    registrationLink: '#',
    notes: 'Inscripción abierta. Trae tu consola y cargador.',
  },
  {
    id: 'qkk-002',
    name: 'Showdown Night — Bo3',
    dateISO: new Date(Date.now() + 1e3 * 60 * 60 * 24 * 14).toISOString(),
    format: 'Singles',
    location: 'Online',
    registrationLink: '#',
    notes: 'Se juega en Pokémon Showdown. Formato OU.',
  },
]
function a(t) {
  return new Date(t).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })
}
function r() {
  return e.jsxs('section', {
    className: 'space-y-6',
    children: [
      e.jsx('h2', { className: 'text-3xl md:text-4xl font-bold', children: '🏆 Torneos activos' }),
      n.length === 0
        ? e.jsx('p', {
            className: 'text-neutral-400',
            children: 'De momento no hay torneos activos. Vuelve pronto.',
          })
        : e.jsx('ul', {
            className: 'grid sm:grid-cols-2 gap-5',
            children: n.map((t) =>
              e.jsxs(
                'li',
                {
                  className: 'glass rounded-2xl p-5',
                  children: [
                    e.jsxs('div', {
                      className: 'flex items-start justify-between gap-4',
                      children: [
                        e.jsxs('div', {
                          children: [
                            e.jsx('h3', { className: 'text-xl font-semibold', children: t.name }),
                            e.jsxs('p', {
                              className: 'text-sm text-neutral-400',
                              children: [t.format, ' · ', t.location],
                            }),
                          ],
                        }),
                        e.jsx('span', {
                          className: 'text-xs px-2 py-1 rounded-full bg-white/10',
                          children: a(t.dateISO),
                        }),
                      ],
                    }),
                    t.notes &&
                      e.jsx('p', { className: 'mt-3 text-neutral-300', children: t.notes }),
                    e.jsx('div', {
                      className: 'mt-4',
                      children: t.registrationLink
                        ? e.jsx('a', {
                            href: t.registrationLink,
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            className:
                              'inline-flex rounded-xl px-4 py-2 bg-white text-neutral-900 font-semibold hover:opacity-90 transition',
                            children: 'Inscribirme',
                          })
                        : e.jsx('span', {
                            className: 'text-neutral-400 text-sm',
                            children: 'Inscripción próximamente',
                          }),
                    }),
                  ],
                },
                t.id
              )
            ),
          }),
    ],
  })
}
export { r as default }
