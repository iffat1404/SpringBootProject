"use client"

import React, { useState } from "react"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import themeStore from "../store/themeStore"

const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [confirmation, setConfirmation] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()
  const { login } = useAuth()
  const { theme } = themeStore((state) => state)

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

 const handleSubmit = async (e) => {
  e.preventDefault()
  setIsSubmitting(true)
  setError("")
  setConfirmation("")

  const payload = {
    name,
    email,
    password,
    phone,
    address,
    dateOfBirth,
  }

  console.log("Payload:", payload)

  try {
    const resp = await axios.post(
      "http://localhost:8080/patient/register",
      payload,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    )

    const token = resp.data.token
    login(token, "PATIENT")
    setConfirmation("Registration Successful!")
    setTimeout(() => navigate("/patient/dashboard"), 1000)

  } catch (err) {
  console.error("❌ Error:", err);

  // ✅ Use `error` field from backend if present:
  const message =
    err.response?.data?.error ||  // your backend sends {error: "..."}
    err.response?.data?.message || // fallback
    "Registration failed. Please try again.";

  setError(message);
} finally {
  setIsSubmitting(false);
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
        <h2 className="text-2xl mb-6 text-center font-semibold">
          Patient Signup
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {confirmation && (
          <div className="text-green-500 text-center mb-4">
            {confirmation}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            required
            className={`w-full p-4 mb-4 rounded-md border focus:outline-none ${
              theme === "dark"
                ? "bg-[#2a2a2a] text-white border-[#444]"
                : "bg-white text-gray-900 border-gray-300"
            }`}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            required
            className={`w-full p-4 mb-4 rounded-md border focus:outline-none ${
              theme === "dark"
                ? "bg-[#2a2a2a] text-white border-[#444]"
                : "bg-white text-gray-900 border-gray-300"
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="tel"
            placeholder="Phone"
            required
            className={`w-full p-4 mb-4 rounded-md border focus:outline-none ${
              theme === "dark"
                ? "bg-[#2a2a2a] text-white border-[#444]"
                : "bg-white text-gray-900 border-gray-300"
            }`}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            type="text"
            placeholder="Address"
            required
            className={`w-full p-4 mb-4 rounded-md border focus:outline-none ${
              theme === "dark"
                ? "bg-[#2a2a2a] text-white border-[#444]"
                : "bg-white text-gray-900 border-gray-300"
            }`}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <input
            type="date"
            placeholder="Date of Birth"
            required
            className={`w-full p-4 mb-4 rounded-md border focus:outline-none ${
              theme === "dark"
                ? "bg-[#2a2a2a] text-white border-[#444]"
                : "bg-white text-gray-900 border-gray-300"
            }`}
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />

          <div className="relative mb-6">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              required
              className={`w-full p-4 mb-4 rounded-md border focus:outline-none ${
                theme === "dark"
                  ? "bg-[#2a2a2a] text-white border-[#444]"
                  : "bg-white text-gray-900 border-gray-300"
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FontAwesomeIcon
              icon={passwordVisible ? faEyeSlash : faEye}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={handlePasswordVisibility}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full p-4 bg-blue-500 hover:bg-blue-700 text-white rounded-md"
          >
            {isSubmitting ? "Processing..." : "Register"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p>
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
