import type { Metadata } from 'next'
import Image from 'next/image'
import { getAbout, getContact, getSeo } from '@/lib/data'
import Breadcrumb from '@/components/public/Breadcrumb'

export async function generateMetadata(): Promise<Metadata> {
  const seo = getSeo()
  const p = seo.pages['/uber-uns'] ?? {}
  return { title: p.title, description: p.description }
}

export default function UeberUns() {
  const about = getAbout()
  const contact = getContact()

  return (
    <>
      {/* Hero banner */}
      <div className="bg-gradient-to-r from-primary to-primary-light text-white py-20 text-center">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Über uns</h1>
        <p className="font-source text-lg text-blue-200">Lernen Sie uns kennen</p>
      </div>

      <Breadcrumb crumbs={[{ label: 'Startseite', href: '/' }, { label: 'Über uns' }]} />

      {/* Main content */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <p className="font-montserrat text-accent text-sm font-semibold uppercase tracking-widest mb-4">Unsere Praxis</p>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-8">
              Willkommen in der Augenarztpraxis Oppau
            </h2>
            <div
              className="rich-text font-source text-text-mid leading-relaxed text-lg space-y-4"
              dangerouslySetInnerHTML={{ __html: about.praxistext }}
            />
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-bg-soft">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="font-montserrat text-accent text-sm font-semibold uppercase tracking-widest mb-4">Wer wir sind</p>
            <h2 className="section-title">Unser Team</h2>
          </div>

          {about.team.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {about.team.sort((a, b) => a.order - b.order).map((member) => (
                <div key={member.id} className="card text-center">
                  <div className="w-32 h-32 rounded-full bg-bg-soft border-4 border-accent mx-auto mb-4 overflow-hidden flex items-center justify-center">
                    {member.foto ? (
                      <Image src={member.foto} alt={member.name} width={128} height={128} className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-5xl">👩‍⚕️</span>
                    )}
                  </div>
                  <h3 className="font-playfair text-xl font-bold text-primary mb-1">{member.name}</h3>
                  <p className="font-montserrat text-sm text-accent mb-3">{member.titel}</p>
                  {member.bio && <p className="font-source text-text-mid text-sm">{member.bio}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center font-source text-text-light italic">Teamfotos werden in Kürze hinzugefügt.</p>
          )}
        </div>
      </section>

      {/* Geschichte */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <p className="font-montserrat text-accent text-sm font-semibold uppercase tracking-widest mb-4">Unsere Wurzeln</p>
            <h2 className="font-playfair text-3xl font-bold text-primary mb-8">Unsere Geschichte</h2>
            <div
              className="rich-text font-source text-text-mid leading-relaxed text-lg"
              dangerouslySetInnerHTML={{ __html: about.geschichte }}
            />
          </div>
        </div>
      </section>

      {/* Sprachen */}
      <section className="py-16 bg-bg-soft">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="section-title mb-8">Wir sprechen Ihre Sprache</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {about.sprachen.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <span className="text-4xl">{s.flag}</span>
                <span className="font-montserrat font-semibold text-text-dark">{s.name}</span>
                {s.hinweis && <span className="font-source text-xs text-text-light max-w-[130px] text-center">{s.hinweis}</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-playfair text-3xl font-bold mb-4">Vereinbaren Sie Ihren Termin</h2>
          <p className="font-source text-blue-200 mb-8">Wir freuen uns auf Ihren Besuch in unserer Praxis.</p>
          <a href={contact.doctolibUrl} target="_blank" rel="noopener noreferrer" className="btn-accent py-4 px-10 text-base">
            Termin online vereinbaren
          </a>
        </div>
      </section>
    </>
  )
}
