import { Eye, EyeOff, IdCard, Lock, Mail } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Button } from '../../shared/components/Button'
import { BrandHeader } from '../../shared/components/BrandHeader'
import { SystemStatus } from '../../shared/components/SystemStatus'
import { TextInput } from '../../shared/components/TextInput'
import { routeForRole } from '../../core/types/user.types'
import { useAuth } from '../../core/auth/useAuth'

export function LoginPage() {
  const { login, status, user } = useAuth()
  const [correo, setCorreo] = useState('')
  const [cedula, setCedula] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (status === 'authenticated' && user) return <Navigate to={routeForRole(user.role)} replace />

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    const cedulaNumber = Number(cedula)

    if (!correo.trim() || !password || !Number.isFinite(cedulaNumber)) {
      setError('Ingresa correo, cédula y contraseña para continuar.')
      return
    }

    setSubmitting(true)
    try {
      await login({ correo: correo.trim(), cedula: cedulaNumber, password })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo iniciar sesión. Revisa los datos e intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="app-shell auth-layout">
      <BrandHeader />
      <section className="screen panel auth-panel" aria-labelledby="login-title">
        <div>
          <h2 className="page-title" id="login-title">
            Bienvenido
          </h2>
          <p className="muted">Ingresa con la cuenta asignada para la jornada electoral.</p>
        </div>

        <form className="stack" onSubmit={onSubmit}>
          {status === 'checking' ? <SystemStatus tone="loading" title="Revisando sesión guardada" message="Esto toma solo unos segundos." /> : null}
          {submitting ? <SystemStatus tone="loading" title="Validando acceso" message="Estamos confirmando tus datos y el rol asignado." /> : null}
          {error ? <SystemStatus tone="error" title="No se pudo ingresar" message={error} /> : null}
          <TextInput
            label="Correo"
            name="correo"
            type="email"
            autoComplete="email"
            value={correo}
            onChange={(event) => setCorreo(event.target.value)}
            disabled={submitting}
            icon={<Mail size={20} />}
          />
          <TextInput
            label="Cédula"
            name="cedula"
            inputMode="numeric"
            value={cedula}
            onChange={(event) => setCedula(event.target.value)}
            disabled={submitting}
            icon={<IdCard size={20} />}
          />
          <TextInput
            label="Contraseña"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={submitting}
            icon={<Lock size={20} />}
            trailing={
              <button
                className="icon-button"
                type="button"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                disabled={submitting}
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            }
          />
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Validando ingreso' : 'Ingresar'}
          </Button>
        </form>
      </section>
    </main>
  )
}
