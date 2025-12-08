// Inspired by react-hot-toast library
import * as React from "react"

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactElement
}

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterContextValue = {
  toasts: ToasterToast[]
  toast: (toast: Omit<ToasterToast, "id">) => void
  dismiss: (toastId?: string) => void
}

const ToasterContext = React.createContext<ToasterContextValue | undefined>(
  undefined
)

export function useToast() {
  const context = React.useContext(ToasterContext)

  if (!context) {
    throw new Error("useToast must be used within a Toaster")
  }

  return context
}

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

export function Toaster({
  ...props
}: React.ComponentPropsWithoutRef<typeof ToastProvider>) {
  const [toasts, setToasts] = React.useState<ToasterToast[]>([])

  const toast = React.useCallback(
    (toast: Omit<ToasterToast, "id">) => {
      setToasts((toasts) => {
        const newToast = {
          ...toast,
          id: Math.random().toString(36).substr(2, 9),
        }

        return [newToast, ...toasts].slice(0, TOAST_LIMIT)
      })
    },
    [setToasts]
  )

  const dismiss = React.useCallback(
    (toastId?: string) => {
      setToasts((toasts) => {
        if (toastId) {
          return toasts.filter((t) => t.id !== toastId)
        }

        return []
      })
    },
    [setToasts]
  )

  React.useEffect(() => {
    const timers = toasts.map((toast) => {
      return setTimeout(() => {
        dismiss(toast.id)
      }, TOAST_REMOVE_DELAY)
    })

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [toasts, dismiss])

  return (
    <ToasterContext.Provider value={{ toasts, toast, dismiss }}>
      <ToastProvider {...props}>
        {toasts.map(function ({ id, title, description, action, ...props }) {
          return (
            <Toast key={id} {...props}>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
              {action}
              <ToastClose />
            </Toast>
          )
        })}
        <ToastViewport />
      </ToastProvider>
    </ToasterContext.Provider>
  )
}
