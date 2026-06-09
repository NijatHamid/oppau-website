'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    telefon: '',
    nachricht: '',
    dsgvo: false,
    honeypot: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.honeypot) return // Bot detected
    if (!form.dsgvo) return

    setStatus('sending')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          telefon: form.telefon,
          nachricht: form.nachricht,
        }),
      })

      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', telefon: '', nachricht: '', dsgvo: false, honeypot: '' })
      } else {
        const data = await res.json()
        setStatus('error')
        setErrorMsg(data.error || 'Ein Fehler ist aufgetreten.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Verbindungsfehler. Bitte versuchen Sie es später erneut.')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-success rounded-xl p-8 text-center">
        <div className="text-4xl mb-4">✅</div>
        <h3 className="font-playfair text-xl font-bold text-success mb-2">Nachricht gesendet!</h3>
        <p className="font-source text-text-mid">Wir melden uns so schnell wie möglich bei Ihnen.</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 btn-outline text-sm py-2 px-6"
        >
          Neue Nachricht
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot */}
      <input
        type="text"
        name="honeypot"
        value={form.honeypot}
        onChange={handleChange}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="label">Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="input-field"
            placeholder="Ihr vollständiger Name"
            value={form.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email" className="label">E-Mail *</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="input-field"
            placeholder="ihre@email.de"
            value={form.email}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label htmlFor="telefon" className="label">Telefon *</label>
        <input
          id="telefon"
          name="telefon"
          type="tel"
          required
          className="input-field"
          placeholder="0621 / ..."
          value={form.telefon}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="nachricht" className="label">Nachricht *</label>
        <textarea
          id="nachricht"
          name="nachricht"
          required
          rows={5}
          className="input-field resize-none"
          placeholder="Ihre Nachricht an uns..."
          value={form.nachricht}
          onChange={handleChange}
        />
      </div>

      {/* DSGVO */}
      <div className="flex items-start gap-3">
        <input
          id="dsgvo"
          name="dsgvo"
          type="checkbox"
          required
          checked={form.dsgvo}
          onChange={handleChange}
          className="mt-1 w-4 h-4 accent-primary cursor-pointer"
        />
        <label htmlFor="dsgvo" className="font-source text-sm text-text-mid cursor-pointer">
          Ich bin damit einverstanden, dass diese Daten zum Zwecke der Kontaktaufnahme gespeichert und
          verarbeitet werden. Weitere Informationen finden Sie in unserer{' '}
          <a href="/datenschutz" className="text-accent hover:underline">Datenschutzerklärung</a>. *
        </label>
      </div>

      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 font-source">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending' || !form.dsgvo}
        className="btn-primary w-full py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Wird gesendet...
          </span>
        ) : (
          'Nachricht senden'
        )}
      </button>
    </form>
  )
}
