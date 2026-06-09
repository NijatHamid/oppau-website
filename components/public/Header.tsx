'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Startseite' },
  { href: '/uber-uns', label: 'Über uns' },
  { href: '/leistungen', label: 'Leistungen' },
  { href: '/kontakt', label: 'Kontakt' },
]

const DOCTOLIB_URL = 'https://www.doctolib.de/augenarzt/ludwigshafen-am-rhein/ekaterina-chashchina'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${
        scrolled ? 'shadow-md py-0' : 'py-0'
      }`}
    >
      {/* Top info bar */}
      <div className="bg-primary text-white text-sm py-1.5 px-4 hidden md:block">
        <div className="max-w-6xl mx-auto flex justify-between items-center font-source">
          <span>Horst-Schork-Str. 84, 67069 Ludwigshafen</span>
          <span>Tel: <a href="tel:+4962162951120" className="hover:text-accent transition-colors">0621 / 62 95 120</a></span>
        </div>
      </div>

      {/* Main nav */}
      <nav className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-tight">
          <span className="font-playfair text-lg font-bold text-primary">Augenarztpraxis</span>
          <span className="font-montserrat text-xs font-semibold text-accent tracking-widest uppercase">Oppau</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg font-montserrat text-sm font-medium transition-all duration-200 ${
                pathname === link.href
                  ? 'text-primary bg-bg-soft font-semibold'
                  : 'text-text-mid hover:text-primary hover:bg-bg-soft'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-3">
          <a
            href={DOCTOLIB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex btn-primary text-sm py-2 px-4"
          >
            Termin buchen
          </a>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menü öffnen"
          >
            <span className={`block w-6 h-0.5 bg-primary transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-primary transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-primary transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-[calc(3.5rem+2rem)] bg-white z-40 flex flex-col p-6 gap-4 shadow-xl">
          <div className="bg-primary text-white text-sm py-2 px-4 rounded-lg">
            <div>📍 Horst-Schork-Str. 84, Ludwigshafen</div>
            <div>📞 <a href="tel:+4962162951120">0621 / 62 95 120</a></div>
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`py-3 px-4 rounded-lg font-montserrat font-medium text-lg border-b border-border ${
                pathname === link.href ? 'text-primary font-semibold bg-bg-soft' : 'text-text-dark'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={DOCTOLIB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-center mt-4"
          >
            Termin online buchen
          </a>
        </div>
      )}
    </header>
  )
}
