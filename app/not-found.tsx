import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
      <div className="text-8xl mb-6">👁️</div>
      <h1 className="font-playfair text-4xl font-bold text-primary mb-4">Seite nicht gefunden</h1>
      <p className="font-source text-text-mid text-lg mb-8 max-w-md">
        Die gesuchte Seite existiert leider nicht. Möglicherweise wurde sie verschoben oder der Link ist veraltet.
      </p>
      <div className="flex gap-4">
        <Link href="/" className="btn-primary">
          Zur Startseite
        </Link>
        <Link href="/kontakt" className="btn-outline">
          Kontakt
        </Link>
      </div>
    </div>
  )
}
