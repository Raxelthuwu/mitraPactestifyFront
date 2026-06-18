import type { ReactNode, SelectHTMLAttributes } from 'react'

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  error?: string
  icon?: ReactNode
}

export function SelectField({ label, error, icon, id, children, ...props }: SelectFieldProps) {
  const selectId = id ?? props.name
  return (
    <div className="field">
      <label htmlFor={selectId}>{label}</label>
      <div className="control-wrap">
        {icon ? <span aria-hidden="true">{icon}</span> : <span />}
        <select id={selectId} className="control" aria-invalid={Boolean(error)} aria-describedby={error ? `${selectId}-error` : undefined} {...props}>
          {children}
        </select>
        <span />
      </div>
      {error ? (
        <p className="error-text" id={`${selectId}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  )
}
