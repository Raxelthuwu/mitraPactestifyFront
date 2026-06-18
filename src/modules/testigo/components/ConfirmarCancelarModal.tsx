import { Button } from '../../../shared/components/Button'
import { Modal } from '../../../shared/components/Modal'

type ConfirmarCancelarModalProps = {
  open: boolean
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmarCancelarModal({ open, onConfirm, onClose }: ConfirmarCancelarModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Cancelar reporte">
      <p>¿Seguro quieres cancelar esta acción? Te regresará al panel inicial.</p>
      <div className="actions">
        <Button type="button" variant="danger" onClick={onConfirm}>
          Sí, cancelar
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          No, volver
        </Button>
      </div>
    </Modal>
  )
}
