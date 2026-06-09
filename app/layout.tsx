import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import ScrollToTop from '@/components/public/ScrollToTop'
import CookieBanner from '@/components/public/CookieBanner'
import { getSeo } from '@/lib/data'

export async function generateMetadata(): Promise<Metadata> {
  const seo = getSeo()
  const page = seo.pages['/'] ?? {}
  return {
    metadataBase: new URL('https://www.augenarzt-oppau.de'),
    title: {
      default: page.title ?? 'Augenarztpraxis Oppau | Chashchina & Kollegen | Ludwigshafen',
      template: '%s | Augenarztpraxis Oppau',
    },
    description: page.description,
    keywords: ['Augenarzt Ludwigshafen', 'Augenarztpraxis Oppau', 'Chashchina', 'OCT', 'Glaukom', 'Katarakt'],
    openGraph: {
      siteName: 'Augenarztpraxis Oppau',
      locale: 'de_DE',
      type: 'website',
    },
    robots: { index: true, follow: true },
    alternates: { canonical: 'https://www.augenarzt-oppau.de' },
    verification: {
      google: seo.global.gscVerification || undefined,
    },
  }
}

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MedicalClinic',
  name: 'Augenarztpraxis Oppau',
  description: 'Augenärztliche Praxis in Ludwigshafen-Oppau – Ekaterina Chashchina & Kollegen',
  url: 'https://www.augenarzt-oppau.de',
  telephone: '+49-621-6295120',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Horst-Schork-Str. 84',
    addressLocality: 'Ludwigshafen am Rhein',
    postalCode: '67069',
    addressCountry: 'DE',
  },
  openingHours: ['Mo 08:00-17:00', 'Tu 08:00-17:00', 'We 08:00-12:00', 'Th 08:00-17:00', 'Fr 08:00-12:00'],
  medicalSpecialty: 'Ophthalmology',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <Header />
        <main className="pt-[calc(3.5rem+2rem)]">{children}</main>
        <Footer />
        <ScrollToTop />
        <CookieBanner />
      </body>
    </html>
  )
}
