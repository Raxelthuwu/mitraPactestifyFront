type SpinnerProps = {
  label?: string
}

export function Spinner({ label = 'Cargando' }: SpinnerProps) {
  return (
    <div className="spinner" role="status" aria-live="polite">
      <span className="spinner-mark" />
      <span>{label}</span>
    </div>
  )
}
