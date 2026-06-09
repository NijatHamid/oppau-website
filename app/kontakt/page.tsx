import type { Metadata } from 'next'
import { getContact, getHours, getSeo } from '@/lib/data'
import ContactForm from '@/components/public/ContactForm'
import OpeningHours from '@/components/public/OpeningHours'
import GdprMap from '@/components/public/GdprMap'
import Breadcrumb from '@/components/public/Breadcrumb'

export async function generateMetadata(): Promise<Metadata> {
  const seo = getSeo()
  const p = seo.pages['/kontakt'] ?? {}
  return { title: p.title, description: p.description }
}

export default function Kontakt() {
  const contact = getContact()
  const hours = getHours()

  return (
    <>
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary to-primary-light text-white py-20 text-center">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Kontakt</h1>
        <p className="font-source text-lg text-blue-200">Wir sind für Sie da</p>
      </div>

      <Breadcrumb crumbs={[{ label: 'Startseite', href: '/' }, { label: 'Kontakt' }]} />

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Contact info */}
          <div>
            <h2 className="font-playfair text-3xl font-bold text-primary mb-8">Unsere Kontaktdaten</h2>

            <div className="space-y-4 mb-8">
              <a href={`tel:${contact.telefon}`} className="flex items-center gap-4 p-4 bg-bg-soft rounded-xl border border-border hover:border-accent transition-all group">
                <span className="text-3xl">📞</span>
                <div>
                  <p className="font-montserrat text-xs text-text-light uppercase tracking-wide">Telefon</p>
                  <p className="font-source font-semibold text-primary group-hover:text-accent">{contact.telefon}</p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 bg-bg-soft rounded-xl border border-border">
                <span className="text-3xl">📠</span>
                <div>
                  <p className="font-montserrat text-xs text-text-light uppercase tracking-wide">Fax</p>
                  <p className="font-source text-text-dark">{contact.fax}</p>
                </div>
              </div>

              <a href={`mailto:${contact.email}`} className="flex items-center gap-4 p-4 bg-bg-soft rounded-xl border border-border hover:border-accent transition-all group">
                <span className="text-3xl">✉️</span>
                <div>
                  <p className="font-montserrat text-xs text-text-light uppercase tracking-wide">E-Mail</p>
                  <p className="font-source font-semibold text-primary group-hover:text-accent">{contact.email}</p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 bg-bg-soft rounded-xl border border-border">
                <span className="text-3xl">📍</span>
                <div>
                  <p className="font-montserrat text-xs text-text-light uppercase tracking-wide">Adresse</p>
                  <p className="font-source text-text-dark">{contact.strasse}</p>
                  <p className="font-source text-text-dark">{contact.plz} {contact.stadt}</p>
                </div>
              </div>

              {contact.parking && (
                <div className="flex items-center gap-4 p-4 bg-bg-soft rounded-xl border border-border">
                  <span className="text-3xl">🅿️</span>
                  <div>
                    <p className="font-source text-text-dark">Parkmöglichkeit auf dem Gelände vorhanden</p>
                    <p className="font-source text-sm text-text-light">🏢 {contact.etage}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Hours */}
            <div className="bg-white rounded-xl shadow-card border border-border p-6 mb-6">
              <h3 className="font-playfair text-xl font-bold text-primary mb-4">Öffnungszeiten</h3>
              <OpeningHours hours={hours} />
              <p className="font-source text-sm text-text-light mt-4 pt-4 border-t border-border">
                Termine nach Vereinbarung
              </p>
            </div>

            {/* Doctolib */}
            <a
              href={contact.doctolibUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full text-center py-4 block"
            >
              Online Termin buchen (Doctolib)
            </a>

            {contact.hinweis && (
              <p className="font-source text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
                ⚠️ {contact.hinweis}
              </p>
            )}
          </div>

          {/* Right: Form */}
          <div>
            <h2 className="font-playfair text-3xl font-bold text-primary mb-8">Nachricht senden</h2>
            <div className="bg-white rounded-xl shadow-card border border-border p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-12 bg-bg-soft">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-playfair text-2xl font-bold text-primary mb-6 text-center">So finden Sie uns</h2>
          <GdprMap
            embedUrl={contact.googleMapsEmbedUrl}
            address={`${contact.strasse}, ${contact.plz} ${contact.stadt}`}
          />
        </div>
      </section>
    </>
  )
}
