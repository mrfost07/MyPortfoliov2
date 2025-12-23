"use client";
import { usePathname } from 'next/navigation';
import Link from "next/link";
import { useState } from "react";
import { HiMenuAlt3, HiX } from "react-icons/hi";

function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Hide navbar on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { href: "/#about", label: "ABOUT" },
    { href: "/#experience", label: "EXPERIENCE" },
    { href: "/#skills", label: "SKILLS" },
    { href: "/#projects", label: "PROJECTS" },
    { href: "/#education", label: "EDUCATION" },
    { href: "/#achievements", label: "ACHIEVEMENTS" },
    { href: "/#certificates", label: "CERTIFICATES" },
  ];

  return (
    <nav className="bg-transparent relative z-50">
      <div className="flex items-center justify-between py-5">
        <div className="flex flex-shrink-0 items-center">
          <Link
            href="/"
            className="text-[#16f2b3] text-3xl font-bold">
            Renier F
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-white p-2 focus:outline-none hover:text-[#16f2b3] transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}
        </button>

        {/* Desktop Navigation - Responsive sizing */}
        <ul className="hidden md:flex md:flex-row md:items-center">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                className="block px-2 lg:px-3 xl:px-4 py-2 no-underline outline-none hover:no-underline"
                href={link.href}
              >
                <div className="text-xs lg:text-sm text-white transition-colors duration-300 hover:text-pink-600 whitespace-nowrap">
                  {link.label}
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Navigation Overlay */}
        <div
          className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          onClick={closeMenu}
        />

        {/* Mobile Navigation Menu - Fixed */}
        <div
          className={`fixed top-0 right-0 h-full w-64 max-w-[80vw] bg-[#0d1224] border-l border-[#1a1443] z-50 md:hidden transform transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          {/* Header with arrow */}
          <div className="flex items-center p-4 border-b border-[#1a1443]">
            <button
              onClick={closeMenu}
              className="p-2 text-white/80 hover:text-[#16f2b3] transition-colors duration-300"
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Nav Links */}
          <ul className="flex flex-col p-4 space-y-1">
            {navLinks.map((link, index) => (
              <li key={link.href}>
                <Link
                  className="block px-4 py-3 rounded-lg no-underline outline-none hover:no-underline hover:bg-[#16f2b3]/10 transition-all duration-300"
                  href={link.href}
                  onClick={closeMenu}
                >
                  <div className="text-base text-white transition-colors duration-300 hover:text-[#16f2b3] flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                    {link.label}
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#1a1443]">
            <p className="text-gray-500 text-xs text-center">© 2024 Renier F</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;