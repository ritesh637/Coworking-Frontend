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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get("token");
      setIsAuthenticated(!!token);
    };
    checkAuth();
    const interval = setInterval(checkAuth, 1000);

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
    };
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

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/booknow", label: "Locations" },
    { path: "/workspace", label: "Workspaces" },
    { path: "/membership", label: "Membership", highlight: true },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`bg-white dark:bg-gray-900 transition-all duration-300 z-50 sticky top-0 w-full ${
        scrolled ? "shadow-md py-2" : "shadow-sm py-3"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" onClick={closeMenu} className="flex items-center z-50">
          <img
            src="https://live.templately.com/wp-content/uploads/2020/09/5b956696-spacehub_.png"
            alt="Space Hub Logo"
            className="w-32 sm:w-40 cursor-pointer transition-transform hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`px-3 py-1.5 rounded-lg text-sm lg:text-base transition-all duration-200 ${
                link.highlight
                  ? "text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
          <Link
            href="/cart"
            className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
            aria-label="Shopping cart"
          >
            <BiShoppingBag className="text-xl lg:text-2xl" />
            {cart.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
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
              <button
                className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 rounded-full p-1 focus:outline-none"
                aria-label="User menu"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <FaUserCircle className="text-xl lg:text-2xl" />
                <RiArrowDownSLine
                  className={`text-sm lg:text-base transition-transform ${
                    showProfileMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800/95 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        Welcome back!
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/my-bookings"
                      className="block px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      My Bookings
                    </Link>
                    <div className="border-t border-gray-100 dark:border-gray-700">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      >
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex space-x-3">
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200 font-medium text-sm lg:text-base"
              >
                Log In
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-4">
          <Link
            href="/cart"
            className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            aria-label="Shopping cart"
          >
            <BiShoppingBag className="text-2xl" />
            {cart.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
              >
                {cart.length}
              </motion.span>
            )}
          </Link>
          <button
            onClick={toggleMenu}
            className="text-gray-700 dark:text-gray-300 text-2xl focus:outline-none z-50"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
              onClick={closeMenu}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween" }}
              className="fixed top-0 right-0 w-4/5 max-w-sm h-full bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-end mb-6">
                  <button
                    onClick={closeMenu}
                    className="text-gray-700 dark:text-gray-300 text-2xl focus:outline-none"
                    aria-label="Close menu"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      href={link.path}
                      onClick={closeMenu}
                      className={`block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 ${
                        link.highlight
                          ? "text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/profile"
                        onClick={closeMenu}
                        className="block px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/my-bookings"
                        onClick={closeMenu}
                        className="block px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        My Bookings
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          closeMenu();
                        }}
                        className="w-full text-left px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <Link
                        href="/login"
                        onClick={closeMenu}
                        className="block px-4 py-3 rounded-lg text-center text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      >
                        Log In
                      </Link>
                      <Link
                        href="/signup"
                        onClick={closeMenu}
                        className="block px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-500 text-center"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
