"use client";
import React, { useState, useEffect, useMemo } from "react";
import Cookies from "js-cookie";
import { logoutUser } from "../lib/auth";
import { useCart } from "../lib/CartContext";
import { BiShoppingBag } from "react-icons/bi";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { GoTriangleDown } from "react-icons/go";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);
  const { cart = [] } = useCart();
  const pathname = usePathname();

  const navLinks = useMemo(
    () => [
      { path: "/", label: "ʜᴏᴍᴇ" },
      { path: "/about", label: "ᴀʙᴏᴜᴛ" },
      { path: "/booknow", label: "ʟᴏᴄᴀᴛɪᴏɴꜱ" },
      { path: "/membership", label: "ᴍᴇᴍʙᴇʀꜱʜɪᴘ" },
      { path: "/contact", label: "ᴄᴏɴᴛᴀᴄᴛ" },
    ],
    []
  );

  useEffect(() => {
    setIsMounted(true);
    const checkAuth = async () => {
      setAuthLoading(true);
      const token = Cookies.get("token");
      setIsAuthenticated(!!token);
      setAuthLoading(false);
    };
    checkAuth();
    const interval = setInterval(checkAuth, 1000);

    let timeoutId;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setScrolled(window.scrollY > 10);
      }, 50);
    };
    window.addEventListener("scroll", handleScroll);

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeMenu();
        setShowProfileMenu(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
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

  const isActiveLink = (linkPath) => {
    if (linkPath === "/") {
      return pathname === linkPath;
    }
    return pathname.startsWith(linkPath);
  };

  const focusClasses =
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* Main Header */}
      <header
        className={`bg-white transition-all duration-300 z-50 sticky top-0 w-full ${
          scrolled ? "shadow-md py-1 " : "shadow-sm py-2"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center px-4 sm:px-8 lg:px-4">
          {/* Logo */}
          <Link href="/" onClick={closeMenu} className="flex items-center z-50">
            <img
              src="https://live.templately.com/wp-content/uploads/2020/09/5b956696-spacehub_.png"
              alt="Space Hub Logo"
              className="w-28 sm:w-36 cursor-pointer transition-transform hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-3 lg:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-2 py-1 rounded-lg text-sm lg:text-base transition-all duration-200 ${focusClasses} ${
                  isActiveLink(link.path)
                    ? "text-blue-600 font-medium bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            {/* Cart with Preview */}
            <div className="relative group">
              <Link
                href="/cart"
                className={`relative p-1 text-gray-700 hover:text-blue-600 transition-all ${focusClasses}`}
                aria-label="Shopping cart"
              >
                <BiShoppingBag className="text-xl" />
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

              {cart.length > 0 && (
                <div className="absolute hidden group-hover:block right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
                  <h4 className="font-medium text-gray-800 mb-2">ʏᴏᴜʀ ᴄᴀʀᴛ</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {cart.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">₹{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/cart"
                    className="block mt-3 text-center text-sm font-medium text-blue-600 hover:underline"
                  >
                    ᴠɪᴇᴡ ᴀʟʟ {cart.length} ɪᴛᴇᴍꜱ
                  </Link>
                </div>
              )}
            </div>

            {/* Auth Section */}
            {authLoading ? (
              <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            ) : isAuthenticated ? (
              <div
                className="relative"
                onMouseEnter={() => setShowProfileMenu(true)}
                onMouseLeave={() => setShowProfileMenu(false)}
              >
                <button
                  className={`flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-all duration-200 rounded-full p-1 ${focusClasses}`}
                  aria-label="User menu"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <FaUserCircle className="text-xl" />
                  <GoTriangleDown className="text-xs" />
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white backdrop-blur-lg border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-800">
                          ᴡᴇʟᴄᴏᴍᴇ ʙᴀᴄᴋ!
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        className={`block px-4 py-3 text-sm hover:bg-gray-50 transition ${
                          isActiveLink("/profile")
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-700"
                        }`}
                        onClick={() => setShowProfileMenu(false)}
                      >
                        ᴍʏ ᴘʀᴏꜰɪʟᴇ
                      </Link>
                      <Link
                        href="/my-bookings"
                        className={`block px-4 py-3 text-sm hover:bg-gray-50 transition ${
                          isActiveLink("/my-bookings")
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-700"
                        }`}
                        onClick={() => setShowProfileMenu(false)}
                      >
                        ᴍʏ ʙᴏᴏᴋɪɴɢꜱ
                      </Link>
                      <div className="border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className={`block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-50 transition ${focusClasses}`}
                        >
                          ꜱɪɢɴ ᴏᴜᴛ
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  href="/login"
                  className={`px-3 py-1.5 rounded-lg transition-all duration-200 font-medium text-sm ${focusClasses} ${
                    isActiveLink("/login")
                      ? "text-blue-600 bg-blue-50"
                      : "text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  ʟᴏɢ ɪɴ
                </Link>
                <Link
                  href="/register"
                  className={`px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 font-medium text-sm ${focusClasses}`}
                >
                  ꜱɪɢɴ ᴜᴘ
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-3">
            <Link
              href="/cart"
              className={`relative p-1 text-gray-700 hover:text-blue-600 transition ${focusClasses}`}
              aria-label="Shopping cart"
            >
              <BiShoppingBag className="text-xl" />
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
              className={`text-gray-700 text-xl ${focusClasses} z-50`}
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
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 right-0 w-4/5 max-w-sm h-full bg-white shadow-2xl z-50 overflow-y-auto"
              >
                <div className="p-5">
                  <div className="flex justify-end mb-5">
                    <button
                      onClick={closeMenu}
                      className={`text-gray-700 text-xl ${focusClasses}`}
                      aria-label="Close menu"
                    >
                      <FaTimes />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        href={link.path}
                        onClick={closeMenu}
                        className={`block px-3 py-2 rounded-lg ${focusClasses} ${
                          isActiveLink(link.path)
                            ? "text-blue-600 font-medium bg-blue-50"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}

                    {isAuthenticated ? (
                      <>
                        <Link
                          href="/profile"
                          onClick={closeMenu}
                          className={`block px-3 py-2 rounded-lg mt-3 ${focusClasses} ${
                            isActiveLink("/profile")
                              ? "text-blue-600 bg-blue-50"
                              : "hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          ᴍʏ ᴘʀᴏꜰɪʟᴇ
                        </Link>
                        <Link
                          href="/my-bookings"
                          onClick={closeMenu}
                          className={`block px-3 py-2 rounded-lg ${focusClasses} ${
                            isActiveLink("/my-bookings")
                              ? "text-blue-600 bg-blue-50"
                              : "hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          ᴍʏ ʙᴏᴏᴋɪɴɢꜱ
                        </Link>
                        <Link
                          href="/notifications"
                          onClick={closeMenu}
                          className={`block px-3 py-2 rounded-lg relative ${focusClasses} ${
                            isActiveLink("/notifications")
                              ? "text-blue-600 bg-blue-50"
                              : "hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          Notifications
                          {hasNotifications && (
                            <span className="absolute right-3 top-2 w-2 h-2 bg-red-500 rounded-full"></span>
                          )}
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            closeMenu();
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-gray-100 mt-3 ${focusClasses}`}
                        >
                          ꜱɪɢɴ ᴏᴜᴛ
                        </button>
                      </>
                    ) : (
                      <div className="space-y-2 mt-3">
                        <Link
                          href="/login"
                          onClick={closeMenu}
                          className={`block px-3 py-2 rounded-lg text-center ${focusClasses} ${
                            isActiveLink("/login")
                              ? "text-blue-600 bg-blue-50"
                              : "text-blue-600 hover:bg-blue-50"
                          }`}
                        >
                          ʟᴏɢ ɪɴ
                        </Link>
                        <Link
                          href="/register"
                          onClick={closeMenu}
                          className={`block px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-center ${focusClasses}`}
                        >
                          ꜱɪɢɴ ᴜᴘ
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
    </>
  );
};

export default Header;
