import type { Metadata } from 'next'
import { getServices, getContact, getSeo } from '@/lib/data'
import ServiceCard from '@/components/public/ServiceCard'
import Breadcrumb from '@/components/public/Breadcrumb'

export async function generateMetadata(): Promise<Metadata> {
  const seo = getSeo()
  const p = seo.pages['/leistungen'] ?? {}
  return { title: p.title, description: p.description }
}

export default function Leistungen() {
  const services = getServices().filter((s) => s.active).sort((a, b) => a.order - b.order)
  const contact = getContact()

  return (
    <>
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary to-primary-light text-white py-20 text-center">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Ausstattung & Leistungen</h1>
        <p className="font-source text-lg text-blue-200 max-w-2xl mx-auto px-4">
          Wir erweitern unser diagnostisches und therapeutisches Spektrum fortlaufend.
        </p>
      </div>

      <Breadcrumb crumbs={[{ label: 'Startseite', href: '/' }, { label: 'Leistungen' }]} />

      {/* Intro */}
      <section className="py-12 bg-bg-soft">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="font-source text-text-mid text-lg leading-relaxed">
            Sollten Sie Fragen haben oder etwas nicht finden, nehmen Sie{' '}
            <a href="/kontakt" className="text-accent hover:underline">Kontakt mit uns auf</a>{' '}
            – wir helfen Ihnen gerne weiter.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} compact={false} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-playfair text-3xl font-bold mb-4">Haben Sie Fragen zu unseren Leistungen?</h2>
          <p className="font-source text-blue-200 mb-8">Unser Team berät Sie gerne – persönlich oder telefonisch.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={contact.doctolibUrl} target="_blank" rel="noopener noreferrer" className="btn-accent py-4 px-8">
              Termin buchen
            </a>
            <a href="/kontakt" className="btn-outline border-white text-white hover:bg-white hover:text-primary py-4 px-8">
              Kontakt aufnehmen
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
