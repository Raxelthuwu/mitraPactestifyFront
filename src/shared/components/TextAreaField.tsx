import type { TextareaHTMLAttributes } from 'react'

type TextAreaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  error?: string
}

export function TextAreaField({ label, error, id, ...props }: TextAreaFieldProps) {
  const textareaId = id ?? props.name
  return (
    <div className="field">
      <label htmlFor={textareaId}>{label}</label>
      <div className="control-wrap">
        <span />
        <textarea id={textareaId} className="control" aria-invalid={Boolean(error)} aria-describedby={error ? `${textareaId}-error` : undefined} {...props} />
        <span />
      </div>
      {error ? (
        <p className="error-text" id={`${textareaId}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  )
}
