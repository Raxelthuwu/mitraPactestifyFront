type Listener = () => void

const listeners = new Set<Listener>()

export const authEvents = {
  onLogout(listener: Listener) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  emitLogout() {
    listeners.forEach((listener) => listener())
  },
}
