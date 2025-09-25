type Tab = 'inicio' | 'torneos' | 'juego'

type Props = {
  onNavigate: (tab: Tab) => void
  active: Tab
}

export default function Header({ onNavigate, active }: Props) {
  const btn = (key: Tab, label: string) =>
    `px-4 py-2 rounded-xl transition hover:bg-white/10 ${active === key ? 'glass' : ''}`

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/70 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60 border-b border-white/10">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-retro-gradient" />
          <span className="font-bold tracking-tight">QueLoKhé</span>
        </div>

        <nav className="flex items-center gap-2">
          <button onClick={() => onNavigate('inicio')} className={btn('inicio', 'Inicio')}>Inicio</button>
          <button onClick={() => onNavigate('torneos')} className={btn('torneos', 'Torneos')}>Torneos</button>
          <button onClick={() => onNavigate('juego')} className={btn('juego', 'Minijuego')}>Minijuego</button>
        </nav>
      </div>
    </header>
  )
}
