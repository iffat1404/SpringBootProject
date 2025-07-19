"use client"

import React, { useState } from "react"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import themeStore from "../store/themeStore"

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [confirmation, setConfirmation] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")

  const { login } = useAuth()
  const { theme } = themeStore((state) => state)
  const navigate = useNavigate()

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setConfirmation("")

    try {
      let endpoint = ""
      if (role === "PATIENT") {
        endpoint = "http://localhost:8080/patient/login"
      } else if (role === "DOCTOR") {
        endpoint = "http://localhost:8080/doctor/login"
      } else if (role === "ADMIN") {
        endpoint = "http://localhost:8080/admin/login"
      } else {
        throw new Error("Please select a role.")
      }

      const resp = await axios.post(endpoint, { email, password })
      const token = resp.data

      // Decode the token
      const base64Url = token.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const payload = JSON.parse(atob(base64))
      const decodedRole = payload.role

      console.log("Decoded role:", decodedRole)

      login(token, decodedRole)

      setConfirmation("Login successful!")

      let dashboardPath = "/"
      if (decodedRole === "PATIENT") {
        dashboardPath = "/patient/dashboard"
      } else if (decodedRole === "DOCTOR") {
        dashboardPath = "/doctor/dashboard"
      } else if (decodedRole === "ADMIN") {
        dashboardPath = "/admin/dashboard"
      } else {
        dashboardPath = "/unauthorized"
      }

      setTimeout(() => {
        navigate(dashboardPath)
      }, 1000)

    } catch (err) {
      console.error(err)
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className={`flex flex-col justify-center items-center h-screen transition-colors ${
        theme === "dark" ? "bg-[#121212]" : "bg-[#f9f9f9]"
      }`}
    >
      <div
        className={`p-10 rounded-lg shadow-lg w-full max-w-md transition-colors ${
          theme === "dark"
            ? "bg-[#1f1f1f] text-white border border-gray-700"
            : "bg-white text-gray-800 border border-gray-300"
        }`}
      >
        <h2 className="text-2xl mb-6 text-center font-semibold">Welcome Back</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {confirmation && (
          <div className="text-green-500 text-center mb-4">
            <span>{confirmation}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className={`w-full p-4 mb-4 rounded-md focus:outline-none focus:ring-2 transition-colors ${
              theme === "dark"
                ? "bg-[#2a2a2a] text-white border-[#444] focus:ring-[#6a4dfa]"
                : "bg-gray-100 text-gray-900 border-gray-300 focus:ring-blue-500"
            }`}
          >
            <option value="">Select Role</option>
            <option value="PATIENT">Patient</option>
            <option value="DOCTOR">Doctor</option>
            <option value="ADMIN">Admin</option>
          </select>

          <input
            type="email"
            name="email"
            placeholder="Your email"
            required
            className={`w-full p-4 mb-4 rounded-md focus:outline-none focus:ring-2 transition-colors ${
              theme === "dark"
                ? "bg-[#2a2a2a] text-white border-[#444] focus:ring-[#6a4dfa]"
                : "bg-gray-100 text-gray-900 border-gray-300 focus:ring-blue-500"
            }`}
            value={email}
            onInput={(e) => setEmail(e.target.value)}
          />

          <div className="relative mb-6">
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              className={`w-full p-4 rounded-md focus:outline-none focus:ring-2 transition-colors ${
                theme === "dark"
                  ? "bg-[#2a2a2a] text-white border-[#444] focus:ring-[#6a4dfa]"
                  : "bg-gray-100 text-gray-900 border-gray-300 focus:ring-blue-500"
              }`}
              value={password}
              onInput={(e) => setPassword(e.target.value)}
            />
            <FontAwesomeIcon
              icon={passwordVisible ? faEyeSlash : faEye}
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer transition-colors ${
                theme === "dark" ? "text-white" : "text-gray-700"
              }`}
              onClick={handlePasswordVisibility}
              aria-label="Toggle password visibility"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-4 rounded-md font-medium transition duration-300 ${
              isSubmitting
                ? "cursor-not-allowed"
                : theme === "dark"
                ? "bg-[#6a4dfa] hover:bg-[#4a36c4] text-white"
                : "bg-blue-500 hover:bg-blue-700 text-white"
            }`}
          >
            {isSubmitting ? "Processing..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className={`${theme === "dark" ? "text-white" : "text-gray-800"}`}>
            Don't have an account?{" "}
            <a href="/register" className="text-[#6a4dfa] hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
