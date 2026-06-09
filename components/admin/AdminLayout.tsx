'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/admin/dashboard', icon: '🏠', label: 'Dashboard' },
  { href: '/admin/hero', icon: '🖼️', label: 'Hero Bilder' },
  { href: '/admin/about', icon: '📝', label: 'Über uns' },
  { href: '/admin/services', icon: '⚕️', label: 'Leistungen' },
  { href: '/admin/hours', icon: '🕐', label: 'Öffnungszeiten' },
  { href: '/admin/contact-info', icon: '📞', label: 'Kontakt' },
  { href: '/admin/legal', icon: '⚖️', label: 'Impressum & DSGVO' },
  { href: '/admin/seo', icon: '🔍', label: 'SEO' },
]

interface Props {
  children: React.ReactNode
  title: string
}

export default function AdminLayout({ children, title }: Props) {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col shadow-xl shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-blue-800">
          <div className="font-playfair text-lg font-bold">Augenarztpraxis</div>
          <div className="font-montserrat text-xs font-semibold text-accent tracking-widest uppercase">Oppau Admin</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-source text-sm transition-all ${
                pathname === item.href
                  ? 'bg-accent text-white font-semibold'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User + logout */}
        <div className="p-4 border-t border-blue-800">
          <div className="text-xs text-blue-300 font-source mb-3">{session?.user?.email}</div>
          <div className="flex gap-2">
            <Link href="/" target="_blank" className="flex-1 text-center py-2 text-xs text-blue-300 border border-blue-700 rounded-lg hover:border-accent hover:text-white transition-all">
              🌐 Website
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="flex-1 py-2 text-xs text-blue-300 border border-blue-700 rounded-lg hover:border-red-400 hover:text-red-300 transition-all"
            >
              Abmelden
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-border px-8 py-4 flex items-center justify-between shadow-sm shrink-0">
          <h1 className="font-playfair text-xl font-bold text-primary">{title}</h1>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
