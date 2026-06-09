import type { Metadata } from 'next'
import { getLegal, getSeo } from '@/lib/data'
import Breadcrumb from '@/components/public/Breadcrumb'

export async function generateMetadata(): Promise<Metadata> {
  const seo = getSeo()
  const p = seo.pages['/datenschutz'] ?? {}
  return { title: p.title, description: p.description, robots: { index: false, follow: false } }
}

export default function Datenschutz() {
  const legal = getLegal()

  return (
    <>
      <div className="bg-gradient-to-r from-primary to-primary-light text-white py-20 text-center">
        <h1 className="font-playfair text-4xl font-bold mb-4">Datenschutzerklärung</h1>
        <p className="font-source text-blue-200 text-sm">
          Letzte Aktualisierung: {new Date(legal.datenschutzAktualisiert).toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <Breadcrumb crumbs={[{ label: 'Startseite', href: '/' }, { label: 'Datenschutz' }]} />

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <div
            className="rich-text font-source text-text-mid leading-relaxed"
            dangerouslySetInnerHTML={{ __html: legal.datenschutz }}
          />
        </div>
      </section>
    </>
  )
}
