import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFacebook, faTwitter, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons"
import { Link } from "react-router-dom"
import themeStore from "../store/themeStore"

const Footer = () => {
  const { theme } = themeStore((state) => state)

  return (
    <footer
      className={`w-full py-8 px-10 border-t transition-colors duration-300 ${
        theme === "dark" ? "bg-[#121212] border-gray-600 text-white" : "bg-white border-gray-200 text-black"
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Logo and Description - Centered on mobile, left on desktop */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">+</span>
            </div>
            <h1 className="text-2xl font-bold">MediCare Hub</h1>
          </div>
          <p className={`mt-2 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Your trusted partner in healthcare management.
          </p>
        </div>

        {/* Navigation Links - Centered on mobile, right on desktop */}
        <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
          <Link
            to="/"
            className={`transition-colors duration-300 ${
              theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"
            }`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`transition-colors duration-300 ${
              theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"
            }`}
          >
            About
          </Link>
          <Link
            to="/register"
            className={`transition-colors duration-300 ${
              theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"
            }`}
          >
            Register
          </Link>
          <Link
            to="/login"
            className={`transition-colors duration-300 ${
              theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"
            }`}
          >
            Login
          </Link>
        </div>

        {/* Social Media Icons - Stacked on mobile, horizontal on desktop */}
        <div className="flex gap-5 justify-center md:justify-start">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors duration-300 ${
              theme === "dark" ? "text-gray-400 hover:text-[#6a4dfa]" : "text-gray-600 hover:text-[#6a4dfa]"
            }`}
          >
            <FontAwesomeIcon icon={faFacebook} size="lg" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors duration-300 ${
              theme === "dark" ? "text-gray-400 hover:text-[#6a4dfa]" : "text-gray-600 hover:text-[#6a4dfa]"
            }`}
          >
            <FontAwesomeIcon icon={faTwitter} size="lg" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors duration-300 ${
              theme === "dark" ? "text-gray-400 hover:text-[#6a4dfa]" : "text-gray-600 hover:text-[#6a4dfa]"
            }`}
          >
            <FontAwesomeIcon icon={faInstagram} size="lg" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors duration-300 ${
              theme === "dark" ? "text-gray-400 hover:text-[#6a4dfa]" : "text-gray-600 hover:text-[#6a4dfa]"
            }`}
          >
            <FontAwesomeIcon icon={faLinkedin} size="lg" />
          </a>
        </div>
      </div>

      {/* Bottom Section */}
      <div className={`mt-8 text-center text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
        © {new Date().getFullYear()} MediCare Hub. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
