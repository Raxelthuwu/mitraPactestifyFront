import { Spinner } from '../shared/components/Spinner'

export function RouteFallback() {
  return (
    <main className="app-shell centered-shell">
      <Spinner label="Cargando vista" />
    </main>
  )
}
