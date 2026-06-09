'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import SessionProvider from '@/components/admin/SessionProvider'
import type { ContactData } from '@/lib/data'

function ContactEditor() {
  const { status } = useSession()
  const router = useRouter()
  const [data, setData] = useState<ContactData | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  useEffect(() => {
    fetch('/api/content?type=contact').then((r) => r.json()).then(setData)
  }, [])

  const save = async () => {
    if (!data) return
    setSaving(true)
    await fetch('/api/content?type=contact', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!data) return <AdminLayout title="Kontaktdaten"><div className="font-source text-text-light">Laden...</div></AdminLayout>

  const fields: { key: keyof ContactData; label: string; type?: string; placeholder?: string }[] = [
    { key: 'telefon', label: 'Telefon', placeholder: '0621 / 62 95 120' },
    { key: 'fax', label: 'Fax', placeholder: '0621 / 62 95 121' },
    { key: 'email', label: 'E-Mail', type: 'email', placeholder: 'info@augenarzt-oppau.de' },
    { key: 'strasse', label: 'Straße', placeholder: 'Horst-Schork-Str. 84' },
    { key: 'plz', label: 'PLZ', placeholder: '67069' },
    { key: 'stadt', label: 'Stadt', placeholder: 'Ludwigshafen am Rhein' },
    { key: 'doctolibUrl', label: 'Doctolib URL', type: 'url', placeholder: 'https://www.doctolib.de/...' },
    { key: 'googleMapsEmbedUrl', label: 'Google Maps Embed URL', placeholder: 'https://www.google.com/maps/embed?...' },
    { key: 'etage', label: 'Etage / Lage', placeholder: 'Erdgeschoss' },
    { key: 'hinweis', label: 'Hinweis', placeholder: 'z.B. Nur 1 Begleitperson...' },
    { key: 'whatsapp', label: 'WhatsApp Nummer', placeholder: '+49621...' },
  ]

  return (
    <AdminLayout title="Kontaktdaten">
      <div className="max-w-2xl space-y-4">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="label">{f.label}</label>
            <input
              type={f.type ?? 'text'}
              className="input-field"
              placeholder={f.placeholder}
              value={(data[f.key] as string) ?? ''}
              onChange={(e) => setData({ ...data, [f.key]: e.target.value })}
            />
          </div>
        ))}

        <div className="flex items-center gap-3 py-2">
          <input
            id="parking"
            type="checkbox"
            checked={data.parking}
            onChange={(e) => setData({ ...data, parking: e.target.checked })}
            className="w-4 h-4 accent-primary"
          />
          <label htmlFor="parking" className="font-source text-sm text-text-dark cursor-pointer">
            Parkmöglichkeit vorhanden
          </label>
        </div>

        <div className="flex items-center gap-3 py-2">
          <input
            id="whatsappAktiv"
            type="checkbox"
            checked={data.whatsappAktiv}
            onChange={(e) => setData({ ...data, whatsappAktiv: e.target.checked })}
            className="w-4 h-4 accent-primary"
          />
          <label htmlFor="whatsappAktiv" className="font-source text-sm text-text-dark cursor-pointer">
            WhatsApp Button auf der Website anzeigen
          </label>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button onClick={save} disabled={saving} className="btn-primary py-3 px-8 disabled:opacity-50">
            {saving ? 'Speichern...' : 'Speichern'}
          </button>
          {saved && <span className="font-source text-success text-sm">✅ Gespeichert!</span>}
        </div>
      </div>
    </AdminLayout>
  )
}

export default function ContactInfoPage() {
  return <SessionProvider><ContactEditor /></SessionProvider>
}
