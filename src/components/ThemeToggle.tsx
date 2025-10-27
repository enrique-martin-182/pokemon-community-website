import { useTheme } from '../hooks/useTheme'

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Cambiar a modo diurno' : 'Cambiar a modo nocturno'}
      onClick={toggle}
      className={[
        'relative inline-flex items-center select-none',
        'w-20 h-10 rounded-full border transition-colors duration-300',
        isDark ? 'bg-neutral-900 border-white/15' : 'bg-neutral-200 border-black/10',
        className,
      ].join(' ')}
    >
      <span
        aria-hidden
        className="absolute left-3 text-neutral-600 dark:text-neutral-400 opacity-70"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <circle cx="12" cy="12" r="3.5" />
          <path
            strokeLinecap="round"
            d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M4.6 19.4l2.1-2.1M17.3 6.9l2.1-2.1"
          />
        </svg>
      </span>
      <span
        aria-hidden
        className="absolute right-3 text-neutral-400 dark:text-neutral-600 opacity-60"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12.8A9 9 0 1111.2 3a7 7 0 109.8 9.8z"
          />
        </svg>
      </span>
      <span
        aria-hidden
        className={[
          'absolute top-1 left-1 w-8 h-8 rounded-full shadow-md',
          'flex items-center justify-center text-white',
          'bg-indigo-600 transition-transform duration-300',
          isDark ? 'translate-x-10' : 'translate-x-0',
        ].join(' ')}
      >
        {isDark ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 12.79A9 9 0 1111.21 3c-.13.53-.21 1.09-.21 1.66A7.34 7.34 0 0018.34 12c.57 0 1.13-.08 1.66-.21z" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zM1 13h3v-2H1v2zm10 10h2v-3h-2v3zM20 13h3v-2h-3v2zM17.66 4.46l1.79-1.8-1.41-1.41-1.8 1.79 1.42 1.42zM4.22 18.36l-1.8 1.79 1.41 1.41 1.79-1.8-1.4-1.4zM18.36 19.78l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM12 6a6 6 0 100 12A6 6 0 0012 6z" />
          </svg>
        )}
      </span>
    </button>
  )
}
