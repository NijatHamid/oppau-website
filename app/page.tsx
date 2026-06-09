import type { Metadata } from 'next'
import { getHero, getServices, getHours, getContact, getAbout, getSeo } from '@/lib/data'
import HeroCarousel from '@/components/public/HeroCarousel'
import ServiceCard from '@/components/public/ServiceCard'
import OpeningHours from '@/components/public/OpeningHours'
import ContactForm from '@/components/public/ContactForm'
import GdprMap from '@/components/public/GdprMap'

export async function generateMetadata(): Promise<Metadata> {
  const seo = getSeo()
  const p = seo.pages['/'] ?? {}
  return { title: p.title, description: p.description }
}

export default function Startseite() {
  const hero = getHero().sort((a, b) => a.order - b.order)
  const services = getServices().filter((s) => s.active).sort((a, b) => a.order - b.order)
  const hours = getHours()
  const contact = getContact()
  const about = getAbout()

  // Show only first 6 services on homepage
  const featuredServices = services.slice(0, 6)

  return (
    <>
      {/* Hero */}
      <HeroCarousel slides={hero} doctolibUrl={contact.doctolibUrl} />

      {/* Info Bar */}
      <section className="bg-primary text-white py-6">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl mb-2">📞</div>
            <h3 className="font-montserrat text-sm font-semibold uppercase tracking-wide text-accent mb-1">Terminvereinbarung</h3>
            <p className="font-source text-sm text-blue-200">Tel: <a href="tel:+4962162951120" className="hover:text-white">{contact.telefon}</a></p>
            <a href={contact.doctolibUrl} target="_blank" rel="noopener noreferrer" className="font-source text-sm text-blue-200 hover:text-white underline">Online: Doctolib</a>
          </div>
          <div>
            <div className="text-2xl mb-2">🕐</div>
            <h3 className="font-montserrat text-sm font-semibold uppercase tracking-wide text-accent mb-1">Öffnungszeiten</h3>
            <p className="font-source text-sm text-blue-200">Mo–Di–Do: 08–17 Uhr</p>
            <p className="font-source text-sm text-blue-200">Mi–Fr: 08–12 Uhr</p>
          </div>
          <div>
            <div className="text-2xl mb-2">📍</div>
            <h3 className="font-montserrat text-sm font-semibold uppercase tracking-wide text-accent mb-1">Standort</h3>
            <p className="font-source text-sm text-blue-200">{contact.strasse}</p>
            <p className="font-source text-sm text-blue-200">{contact.plz} {contact.stadt}</p>
          </div>
        </div>
      </section>

      {/* Willkommen */}
      <section className="py-20 bg-bg-soft">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-montserrat text-accent text-sm font-semibold uppercase tracking-widest mb-4">Herzlich Willkommen</p>
            <h2 className="section-title">Willkommen in unserer Praxis</h2>
            <div
              className="rich-text font-source text-text-mid leading-relaxed text-lg"
              dangerouslySetInnerHTML={{ __html: about.haupttext }}
            />
            <a href="/uber-uns" className="inline-flex btn-outline mt-8">Mehr über uns erfahren</a>
          </div>
        </div>
      </section>

      {/* Leistungen Preview */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="font-montserrat text-accent text-sm font-semibold uppercase tracking-widest mb-4">Unser Angebot</p>
            <h2 className="section-title">Unsere Leistungen</h2>
            <p className="section-subtitle mx-auto">Modernste Diagnostik und Behandlung für Ihre Augengesundheit</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} compact />
            ))}
          </div>
          {services.length > 6 && (
            <div className="text-center mt-10">
              <a href="/leistungen" className="btn-primary">Alle Leistungen ansehen</a>
            </div>
          )}
        </div>
      </section>

      {/* Öffnungszeiten + Termin */}
      <section className="py-20 bg-bg-soft">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Hours */}
          <div>
            <p className="font-montserrat text-accent text-sm font-semibold uppercase tracking-widest mb-4">Wann sind wir für Sie da</p>
            <h2 className="font-playfair text-3xl font-bold text-primary mb-6">Öffnungszeiten</h2>
            <div className="bg-white rounded-xl shadow-card border border-border p-6">
              <OpeningHours hours={hours} />
              <p className="font-source text-sm text-text-light mt-4 pt-4 border-t border-border">
                Termine nach Vereinbarung
              </p>
              {about.sprachen.find(s => s.hinweis) && (
                <p className="font-source text-sm text-text-light mt-2">
                  🇹🇷 Türkisch: Mo/Di/Do – nur vormittags
                </p>
              )}
            </div>
          </div>

          {/* Appointment */}
          <div>
            <p className="font-montserrat text-accent text-sm font-semibold uppercase tracking-widest mb-4">Termin vereinbaren</p>
            <h2 className="font-playfair text-3xl font-bold text-primary mb-6">Jetzt Termin buchen</h2>
            <div className="bg-white rounded-xl shadow-card border border-border p-6 space-y-4">
              <p className="font-source text-text-mid">Vereinbaren Sie noch heute einen Termin mit uns.</p>
              <a
                href={`tel:${contact.telefon.replace(/\s/g, '')}`}
                className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-accent hover:bg-bg-soft transition-all group"
              >
                <span className="text-2xl">📞</span>
                <div>
                  <p className="font-montserrat text-xs text-text-light uppercase tracking-wide">Anrufen</p>
                  <p className="font-source font-semibold text-primary group-hover:text-accent">{contact.telefon}</p>
                </div>
              </a>
              <a
                href={contact.doctolibUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full text-center py-4"
              >
                Online Termin buchen (Doctolib)
              </a>
              {contact.hinweis && (
                <p className="font-source text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  ⚠️ {contact.hinweis}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sprachen */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="font-playfair text-2xl font-bold mb-8">Wir sprechen Ihre Sprache</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {about.sprachen.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <span className="text-3xl">{s.flag}</span>
                <span className="font-montserrat text-sm font-semibold">{s.name}</span>
                {s.hinweis && <span className="font-source text-xs text-blue-300 max-w-[120px] text-center">{s.hinweis}</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kontakt Form */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <p className="font-montserrat text-accent text-sm font-semibold uppercase tracking-widest mb-4">Schreiben Sie uns</p>
              <h2 className="section-title">Kontakt aufnehmen</h2>
            </div>
            <div className="bg-white rounded-xl shadow-card border border-border p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-20 bg-bg-soft">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="section-title">So finden Sie uns</h2>
            <p className="section-subtitle mx-auto">{contact.strasse}, {contact.plz} {contact.stadt}</p>
            {contact.parking && (
              <p className="font-source text-sm text-text-light mt-2">🅿️ Parkmöglichkeit auf dem Gelände vorhanden | 🏢 {contact.etage}</p>
            )}
          </div>
          <GdprMap
            embedUrl={contact.googleMapsEmbedUrl}
            address={`${contact.strasse}, ${contact.plz} ${contact.stadt}`}
          />
        </div>
      </section>
    </>
  )
}
