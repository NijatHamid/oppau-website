'use client'

import { useState } from 'react'

interface Props {
  embedUrl: string
  address: string
}

export default function GdprMap({ embedUrl, address }: Props) {
  const [accepted, setAccepted] = useState(false)

  if (!accepted) {
    return (
      <div className="h-80 bg-bg-soft border border-border rounded-xl flex flex-col items-center justify-center text-center p-8 gap-4">
        <div className="text-4xl">🗺️</div>
        <div>
          <h3 className="font-playfair text-lg font-bold text-primary mb-2">Google Maps</h3>
          <p className="font-source text-sm text-text-mid max-w-sm">
            Zum Laden der Karte werden Daten an Google übertragen. Mit einem Klick auf &quot;Akzeptieren&quot; stimmen Sie der Übertragung zu.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setAccepted(true)}
            className="btn-primary py-2 px-6 text-sm"
          >
            Karte anzeigen
          </button>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline py-2 px-6 text-sm"
          >
            In Google Maps öffnen
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="h-80 rounded-xl overflow-hidden border border-border">
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Standort Augenarztpraxis Oppau"
      />
    </div>
  )
}
