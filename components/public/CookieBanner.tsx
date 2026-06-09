'use client'

import { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  const reject = () => {
    localStorage.setItem('cookie-consent', 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-2xl p-4 md:p-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-1">
          <p className="font-source text-sm text-text-mid">
            <strong className="text-text-dark">Diese Website verwendet Cookies.</strong> Wir nutzen Cookies, um die
            Nutzererfahrung zu verbessern und anonyme Statistiken zu erheben. Mehr Informationen finden Sie in
            unserer{' '}
            <a href="/datenschutz" className="text-accent hover:underline">Datenschutzerklärung</a>.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button onClick={reject} className="btn-outline py-2 px-5 text-sm">
            Ablehnen
          </button>
          <button onClick={accept} className="btn-primary py-2 px-5 text-sm">
            Akzeptieren
          </button>
        </div>
      </div>
    </div>
  )
}
