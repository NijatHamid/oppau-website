import type { Metadata } from 'next'
import { getLegal, getSeo } from '@/lib/data'
import Breadcrumb from '@/components/public/Breadcrumb'

export async function generateMetadata(): Promise<Metadata> {
  const seo = getSeo()
  const p = seo.pages['/impressum'] ?? {}
  return { title: p.title, description: p.description, robots: { index: false, follow: false } }
}

export default function Impressum() {
  const legal = getLegal()

  return (
    <>
      <div className="bg-gradient-to-r from-primary to-primary-light text-white py-20 text-center">
        <h1 className="font-playfair text-4xl font-bold mb-4">Impressum</h1>
      </div>

      <Breadcrumb crumbs={[{ label: 'Startseite', href: '/' }, { label: 'Impressum' }]} />

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <div
            className="rich-text font-source text-text-mid leading-relaxed"
            dangerouslySetInnerHTML={{ __html: legal.impressum }}
          />
        </div>
      </section>
    </>
  )
}
