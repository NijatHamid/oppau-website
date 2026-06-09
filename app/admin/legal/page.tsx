'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import SessionProvider from '@/components/admin/SessionProvider'
import type { LegalData } from '@/lib/data'

function LegalEditor() {
  const { status } = useSession()
  const router = useRouter()
  const [data, setData] = useState<LegalData | null>(null)
  const [tab, setTab] = useState<'impressum' | 'datenschutz'>('impressum')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  useEffect(() => {
    fetch('/api/content?type=legal').then((r) => r.json()).then(setData)
  }, [])

  const save = async () => {
    if (!data) return
    setSaving(true)
    const updated = { ...data, datenschutzAktualisiert: new Date().toISOString().split('T')[0] }
    await fetch('/api/content?type=legal', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) })
    setData(updated)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!data) return <AdminLayout title="Impressum & DSGVO"><p className="font-source text-text-light">Laden...</p></AdminLayout>

  return (
    <AdminLayout title="Impressum & Datenschutz">
      <div className="max-w-4xl">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['impressum', 'datenschutz'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-2 px-6 rounded-lg font-montserrat text-sm font-semibold transition-all ${
                tab === t ? 'bg-primary text-white' : 'bg-white border border-border text-text-mid hover:border-accent'
              }`}
            >
              {t === 'impressum' ? '⚖️ Impressum' : '🔒 Datenschutzerklärung'}
            </button>
          ))}
        </div>

        <div className="admin-card">
          {tab === 'impressum' ? (
            <>
              <h2 className="font-playfair text-lg font-bold text-primary mb-4">Impressum</h2>
              <p className="font-source text-xs text-text-light mb-3">Inhalt als HTML bearbeiten. Gespeicherter Text erscheint direkt auf der Impressum-Seite.</p>
              <textarea
                className="input-field font-mono text-sm resize-y w-full"
                rows={20}
                value={data.impressum}
                onChange={(e) => setData({ ...data, impressum: e.target.value })}
              />
            </>
          ) : (
            <>
              <div className="flex justify-between items-start mb-4">
                <h2 className="font-playfair text-lg font-bold text-primary">Datenschutzerklärung</h2>
                <span className="font-source text-xs text-text-light bg-bg-soft px-3 py-1 rounded-full">
                  Letzte Aktualisierung: {data.datenschutzAktualisiert}
                </span>
              </div>
              <p className="font-source text-xs text-text-light mb-3">Das Datum wird beim Speichern automatisch auf heute gesetzt.</p>
              <textarea
                className="input-field font-mono text-sm resize-y w-full"
                rows={20}
                value={data.datenschutz}
                onChange={(e) => setData({ ...data, datenschutz: e.target.value })}
              />
            </>
          )}
        </div>

        <div className="flex items-center gap-4 mt-6">
          <button onClick={save} disabled={saving} className="btn-primary py-3 px-8 disabled:opacity-50">
            {saving ? 'Speichern...' : 'Speichern'}
          </button>
          {saved && <span className="font-source text-success text-sm">✅ Gespeichert!</span>}
        </div>
      </div>
    </AdminLayout>
  )
}

export default function LegalPage() {
  return <SessionProvider><LegalEditor /></SessionProvider>
}
