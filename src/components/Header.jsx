"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { logoutUser } from "../lib/auth";
import { useCart } from "../lib/CartContext";
import { BiShoppingBag } from "react-icons/bi";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { RiArrowDownSLine } from "react-icons/ri";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { cart = [] } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get("token");
      setIsAuthenticated(!!token);
    };
    checkAuth();
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    Cookies.remove("token");
    localStorage.clear();
    sessionStorage.clear();
    setIsAuthenticated(false);
    setShowProfileMenu(false);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className="bg-white dark:bg-gray-900 shadow-md z-50 sticky top-0 w-full">
        <div className="container mx-auto flex justify-between items-center py-4 px-4 sm:px-6">
          <Link href="/" onClick={closeMenu}>
            <img
              src="https://live.templately.com/wp-content/uploads/2020/09/5b956696-spacehub_.png"
              alt="Space Hub Logo"
              className="w-32 sm:w-40 cursor-pointer"
            />
          </Link>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 dark:text-gray-100 text-2xl"
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          <nav
            className={`${
              isMenuOpen ? "block" : "hidden"
            } absolute md:static top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-lg md:shadow-none p-4 md:p-0 md:flex justify-center items-center md:space-x-6 z-50`}
          >
            <div className="space-y-4 md:space-y-0 md:flex md:space-x-6 text-gray-700 dark:text-gray-100">
              {[
                "/",
                "/about",
                "/location",
                "/workspace",
                "/membership",
                "/contact",
              ].map((path, i) => (
                <Link
                  key={i}
                  href={path}
                  onClick={closeMenu}
                  className={`block py-2 md:py-0 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 transition ${
                    path === "/membership" ? "text-blue-600 font-semibold" : ""
                  }`}
                >
                  {path.replace("/", "").toUpperCase() || "HOME"}
                </Link>
              ))}
            </div>
          </nav>

          <div className="hidden md:flex space-x-4 items-center relative">
            <Link
              href="/cart"
              className="relative text-gray-700 dark:text-gray-100 hover:text-blue-600 transition duration-300"
            >
              <BiShoppingBag className="text-2xl" />
              {cart.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
                >
                  {cart.length}
                </motion.span>
              )}
            </Link>

            {isAuthenticated ? (
              <div
                className="relative"
                onMouseEnter={() => setShowProfileMenu(true)}
                onMouseLeave={() => setShowProfileMenu(false)}
              >
                <button className="flex items-center gap-1 text-gray-700 dark:text-gray-100 hover:text-blue-600 transition-all duration-200 rounded-full p-1">
                  <FaUserCircle className="text-2xl" />
                  <RiArrowDownSLine className="text-lg" />
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800/90 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                          Welcome!
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/my-bookings"
                        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        My Bookings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
