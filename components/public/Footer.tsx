import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-primary text-white mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo + about */}
        <div>
          <div className="mb-4">
            <div className="font-playfair text-xl font-bold">Augenarztpraxis</div>
            <div className="font-montserrat text-xs font-semibold text-accent tracking-widest uppercase">Oppau</div>
          </div>
          <p className="font-source text-sm text-blue-200 leading-relaxed">
            Ihre erste Anlaufstelle für alle augenärztlichen Untersuchungen in Ludwigshafen-Oppau.
          </p>
        </div>

        {/* Quick nav */}
        <div>
          <h3 className="font-montserrat text-sm font-semibold uppercase tracking-wider text-accent mb-4">Navigation</h3>
          <ul className="space-y-2 font-source text-sm text-blue-200">
            {[
              { href: '/', label: 'Startseite' },
              { href: '/uber-uns', label: 'Über uns' },
              { href: '/leistungen', label: 'Leistungen' },
              { href: '/kontakt', label: 'Kontakt' },
              { href: '/impressum', label: 'Impressum' },
              { href: '/datenschutz', label: 'Datenschutz' },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact + hours */}
        <div>
          <h3 className="font-montserrat text-sm font-semibold uppercase tracking-wider text-accent mb-4">Kontakt & Zeiten</h3>
          <ul className="space-y-2 font-source text-sm text-blue-200">
            <li>📍 Horst-Schork-Str. 84, 67069 Ludwigshafen</li>
            <li>📞 <a href="tel:+4962162951120" className="hover:text-white transition-colors">0621 / 62 95 120</a></li>
            <li>✉️ <a href="mailto:info@augenarzt-oppau.de" className="hover:text-white transition-colors">info@augenarzt-oppau.de</a></li>
          </ul>
          <div className="mt-4 text-sm text-blue-200 font-source">
            <p>Mo–Di–Do: 08–17 Uhr</p>
            <p>Mi–Fr: 08–12 Uhr</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-blue-800 py-4">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-blue-300 font-source">
          <span>© {year} Augenarztpraxis Oppau – Ekaterina Chashchina & Kollegen</span>
          <div className="flex gap-4">
            <Link href="/impressum" className="hover:text-white transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-white transition-colors">Datenschutz</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
