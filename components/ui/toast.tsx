"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface ToastProps {
  variant?: "default" | "success" | "error"
  title?: string
  description?: string
  onClose?: () => void
  className?: string
}

export function Toast({ 
  variant = "default", 
  title, 
  description, 
  onClose,
  className 
}: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  const variants = {
    default: "bg-background border",
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800"
  }

  return (
    <div className={cn(
      "fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border max-w-md animate-in slide-in-from-top-2",
      variants[variant],
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {title && (
            <div className="font-semibold mb-1">{title}</div>
          )}
          {description && (
            <div className="text-sm opacity-90">{description}</div>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-2 p-1 rounded-md hover:bg-black/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export function useToast() {
  const [toasts, setToasts] = React.useState<Array<ToastProps & { id: string }>>([])

  const toast = React.useCallback((props: ToastProps) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { ...props, id }])
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const ToastContainer = React.useCallback(() => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(({ id, ...props }) => (
        <Toast
          key={id}
          {...props}
          onClose={() => removeToast(id)}
        />
      ))}
    </div>
  ), [toasts, removeToast])

  return { toast, ToastContainer }
} 