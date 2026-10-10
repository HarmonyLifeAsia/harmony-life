import { useRef, useSyncExternalStore } from 'react'

const subscribe = () => () => {}

// Reads a browser-only value (URL, localStorage, sessionStorage) once, after
// hydration. The server and the hydration pass get `fallback`, so the markup
// matches; React then re-renders with the real value — the same result as the
// old "useEffect + setState on mount" pattern, without setState inside effects.
export function useBrowserValue<T>(read: () => T, fallback: T): T {
  const cache = useRef<{ value: T } | null>(null)
  return useSyncExternalStore(
    subscribe,
    () => (cache.current ??= { value: read() }).value,
    () => fallback,
  )
}
