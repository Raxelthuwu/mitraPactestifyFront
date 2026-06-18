import type { InputHTMLAttributes, ReactNode } from 'react'

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  icon?: ReactNode
  trailing?: ReactNode
}

export function TextInput({ label, error, icon, trailing, id, ...props }: TextInputProps) {
  const inputId = id ?? props.name
  return (
    <div className="field">
      <label htmlFor={inputId}>{label}</label>
      <div className="control-wrap">
        {icon ? <span aria-hidden="true">{icon}</span> : <span />}
        <input id={inputId} className="control" aria-invalid={Boolean(error)} aria-describedby={error ? `${inputId}-error` : undefined} {...props} />
        {trailing ?? <span />}
      </div>
      {error ? (
        <p className="error-text" id={`${inputId}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  )
}
