"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      // Decode it for real role
      const base64Url = token.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const payload = JSON.parse(atob(base64))
      const realRole = payload.role
      console.log("Token in Dashboard:", token)
      console.log("Decoded role:", realRole)
      setUser({ token })
      setRole(realRole)
    }
    setLoading(false)
  }, [])

  const login = (token) => {
    // Always decode it for true role
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const payload = JSON.parse(atob(base64))
    const realRole = payload.role

    localStorage.setItem("token", token)
    setUser({ token })
    setRole(realRole)
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    setRole(null)
  }

  const value = {
    user,
    role,
    login,
    logout,
    isAuthenticated: !!user,
  }

  if (loading) {
    return <div>Loading MediCare Hub...</div>
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
