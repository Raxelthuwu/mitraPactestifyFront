import { AlertTriangle, CheckCircle2, Info } from 'lucide-react'

type SystemStatusProps = {
  tone?: 'info' | 'loading' | 'success' | 'error'
  title: string
  message?: string
}

export function SystemStatus({ tone = 'info', title, message }: SystemStatusProps) {
  return (
    <div className={`system-status system-status-${tone}`} role="status" aria-live="polite">
      <span className="system-status-icon" aria-hidden="true">
        {tone === 'loading' ? <span className="status-spinner" /> : null}
        {tone === 'success' ? <CheckCircle2 size={20} /> : null}
        {tone === 'error' ? <AlertTriangle size={20} /> : null}
        {tone === 'info' ? <Info size={20} /> : null}
      </span>
      <span>
        <strong>{title}</strong>
        {message ? <small>{message}</small> : null}
      </span>
    </div>
  )
}
