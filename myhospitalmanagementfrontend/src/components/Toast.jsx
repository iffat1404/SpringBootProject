"use client"

import { useEffect } from "react"
import { CheckCircle, XCircle, Info, X } from "lucide-react"

const Toast = ({ message, type = "info", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Auto closing toast")
      onClose()
    }, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const getToastConfig = (type) => {
    switch (type) {
      case "success":
        return {
          bgColor: "bg-green-50 border-green-200",
          textColor: "text-green-800",
          iconColor: "text-green-600",
          icon: CheckCircle,
        }
      case "error":
        return {
          bgColor: "bg-red-50 border-red-200",
          textColor: "text-red-800",
          iconColor: "text-red-600",
          icon: XCircle,
        }
      default:
        return {
          bgColor: "bg-blue-50 border-blue-200",
          textColor: "text-blue-800",
          iconColor: "text-blue-600",
          icon: Info,
        }
    }
  }

  const config = getToastConfig(type)
  const IconComponent = config.icon

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-in slide-in-from-right duration-300">
      <div className={`${config.bgColor} border rounded-lg shadow-lg p-4 max-w-sm w-full`}>
        <div className="flex items-start gap-3">
          <IconComponent className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
          <div className="flex-1">
            <p className={`text-sm font-medium ${config.textColor}`}>{message}</p>
          </div>
          <button onClick={onClose} className={`${config.textColor} hover:opacity-70 transition-opacity flex-shrink-0`}>
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Toast
