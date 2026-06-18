import condor from '../../../assets/condor.jpg'
import logo from '../../../assets/logo.svg'

type BrandHeaderProps = {
  compact?: boolean
}

export function BrandHeader({ compact = false }: BrandHeaderProps) {
  const variant = compact ? 'app' : 'login'

  return (
    <header className={`brand-panel brand-panel-${variant}`}>
      {!compact ? <img className="brand-condor" src={condor} alt="" aria-hidden="true" /> : null}
      <img className="brand-logo" src={logo} alt="Pacto Histórico Colombia Puede" />
      <div className="brand-copy">
        <h1 className="brand-title">{compact ? 'Gestión Territorial' : 'Sistema de Gestión Territorial'}</h1>
        <p className="brand-subtitle">Pacto Histórico · Colombia Puede</p>
        {!compact ? <p className="brand-brief">Reportes claros para actuar rápido en territorio.</p> : null}
        {!compact ? (
          <div className="brand-assurance" aria-label="Estado del sistema">
            <span>Sesión protegida</span>
            <span>Rol asignado</span>
            <span>Estado visible</span>
          </div>
        ) : null}
      </div>
    </header>
  )
}
