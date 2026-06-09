import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import SessionProvider from '@/components/admin/SessionProvider'
import Link from 'next/link'

const modules = [
  { href: '/admin/hero', icon: '🖼️', label: 'Hero Bilder', desc: 'Carousel-Bilder und Texte verwalten' },
  { href: '/admin/about', icon: '📝', label: 'Über uns', desc: 'Praxistext, Team und Geschichte' },
  { href: '/admin/services', icon: '⚕️', label: 'Leistungen', desc: 'Leistungen hinzufügen, bearbeiten, löschen' },
  { href: '/admin/hours', icon: '🕐', label: 'Öffnungszeiten', desc: 'Wochentage und Uhrzeiten anpassen' },
  { href: '/admin/contact-info', icon: '📞', label: 'Kontaktdaten', desc: 'Telefon, Adresse, Doctolib-Link' },
  { href: '/admin/legal', icon: '⚖️', label: 'Impressum & DSGVO', desc: 'Rechtliche Texte bearbeiten' },
  { href: '/admin/seo', icon: '🔍', label: 'SEO', desc: 'Meta-Titel, Beschreibungen und mehr' },
]

export default async function Dashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  return (
    <SessionProvider>
      <AdminLayout title="Dashboard">
        <div className="max-w-4xl">
          <p className="font-source text-text-mid mb-8">
            Willkommen, <strong>{session.user?.name ?? session.user?.email}</strong>. Was möchten Sie heute bearbeiten?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className="admin-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 group"
              >
                <div className="text-3xl mb-3">{m.icon}</div>
                <h3 className="font-playfair text-lg font-bold text-primary mb-1 group-hover:text-accent transition-colors">{m.label}</h3>
                <p className="font-source text-sm text-text-light">{m.desc}</p>
              </Link>
            ))}
          </div>

          {/* Quick links */}
          <div className="mt-10 p-6 bg-bg-soft rounded-xl border border-border">
            <h2 className="font-playfair text-lg font-bold text-primary mb-4">Schnellzugriff</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/" target="_blank" className="btn-outline py-2 px-4 text-sm">
                🌐 Website ansehen
              </Link>
              <Link href="/kontakt" target="_blank" className="btn-outline py-2 px-4 text-sm">
                📋 Kontaktseite
              </Link>
              <Link href="/leistungen" target="_blank" className="btn-outline py-2 px-4 text-sm">
                ⚕️ Leistungsseite
              </Link>
            </div>
          </div>
        </div>
      </AdminLayout>
    </SessionProvider>
  )
}
