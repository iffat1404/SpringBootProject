"use client"

import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { Avatar } from "@radix-ui/themes"
import themeStore from "../store/themeStore"

const TopSearchBar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const theme = themeStore((state) => state.theme)

  // Toggle user menu visibility
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
  }

  return (
    <div className={`${theme === "dark" ? "dark" : "light"}`}>
      {/* Main container, gets dynamic theme class */}
      <div className="flex justify-between items-center w-full max-w-6xl mx-auto mt-6 p-4">
        {/* Search Bar */}
        <div className="relative flex items-center w-full max-w-xl">
          <input
            type="text"
            placeholder="Search patients, doctors, appointments..."
            className="w-full px-6 py-3 pl-12 
              text-black dark:text-white 
              rounded-lg 
              bg-white dark:bg-gray-800 
              border border-gray-300 dark:border-gray-700 
              focus:outline-none focus:ring-2 focus:ring-blue-500 
              shadow-md"
          />
          <FontAwesomeIcon icon={faSearch} className="absolute left-4 text-gray-500 dark:text-gray-400 text-xl" />
        </div>

        {/* User Avatar & Menu */}
        <div className="relative">
          <button
            onClick={toggleUserMenu}
            className="flex items-center justify-center rounded-full focus:outline-none transition-all"
          >
            {/* Avatar with proper circular border */}
            <Avatar
              src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
              fallback="A"
              className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600 object-cover"
            />
          </button>

          {/* Dropdown Menu */}
          {isUserMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-48 
                bg-white dark:bg-gray-800 
                shadow-lg rounded-lg z-10 
                border border-gray-200 dark:border-gray-700"
            >
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Profile</li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Settings</li>
                <li className="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800 cursor-pointer">
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TopSearchBar
