import { Root as PortalRoot } from '@radix-ui/react-portal'
import { ToastProvider as ToastProviderPrimitive } from '@radix-ui/react-toast'
import { ReactNode, createContext, useCallback, useContext, useState } from 'react'

import { Toast, ToastProps } from '../components/Toast'
import { Viewport as ToastViewport } from '../styles/toast.style'

interface ToastManager {
  toasts: ToastProps[]
  addToast: (toast: ToastProps) => void
}

export const ToastContext = createContext<ToastManager>({
  toasts: [],
  addToast: (_: ToastProps) => {},
})

/* To call a toast:
    const { addToast } = useToast()
    addToast({ variant: 'info', title: 'File successfully deleted' }) */
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([])
  const addToast = useCallback((toast: ToastProps) => setToasts((toasts) => [...toasts, toast]), [])

  return (
    <ToastContext.Provider value={{ toasts, addToast }}>
      <ToastProviderPrimitive>
        {children}
        {toasts.map((toast: ToastProps, key: number) => (
          <Toast {...toast} key={key} />
        ))}
        <PortalRoot style={{ zIndex: 11 }}>
          <ToastViewport />
        </PortalRoot>
      </ToastProviderPrimitive>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
