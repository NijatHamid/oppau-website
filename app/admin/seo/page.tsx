'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import SessionProvider from '@/components/admin/SessionProvider'
import type { SeoData } from '@/lib/data'

const PAGES = [
  { path: '/', label: 'Startseite' },
  { path: '/uber-uns', label: 'Über uns' },
  { path: '/leistungen', label: 'Leistungen' },
  { path: '/kontakt', label: 'Kontakt' },
  { path: '/impressum', label: 'Impressum' },
  { path: '/datenschutz', label: 'Datenschutz' },
]

function SeoEditor() {
  const { status } = useSession()
  const router = useRouter()
  const [data, setData] = useState<SeoData | null>(null)
  const [tab, setTab] = useState<string>('global')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  useEffect(() => {
    fetch('/api/content?type=seo').then((r) => r.json()).then(setData)
  }, [])

  const save = async () => {
    if (!data) return
    setSaving(true)
    await fetch('/api/content?type=seo', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!data) return <AdminLayout title="SEO"><p className="font-source text-text-light">Laden...</p></AdminLayout>

  const currentPage = tab !== 'global' ? data.pages[tab] ?? { title: '', description: '', ogImage: '' } : null

  const updatePage = (field: string, value: string) => {
    if (!data || tab === 'global') return
    setData({
      ...data,
      pages: {
        ...data.pages,
        [tab]: { ...(data.pages[tab] ?? {}), [field]: value },
      },
    })
  }

  return (
    <AdminLayout title="SEO Einstellungen">
      <div className="max-w-3xl">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setTab('global')}
            className={`py-2 px-4 rounded-lg font-montserrat text-sm font-semibold transition-all ${tab === 'global' ? 'bg-primary text-white' : 'bg-white border border-border text-text-mid hover:border-accent'}`}
          >
            🌐 Global
          </button>
          {PAGES.map((p) => (
            <button
              key={p.path}
              onClick={() => setTab(p.path)}
              className={`py-2 px-4 rounded-lg font-montserrat text-sm font-semibold transition-all ${tab === p.path ? 'bg-primary text-white' : 'bg-white border border-border text-text-mid hover:border-accent'}`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="admin-card space-y-4">
          {tab === 'global' ? (
            <>
              <h2 className="font-playfair text-lg font-bold text-primary mb-2">Globale SEO Einstellungen</h2>
              <div>
                <label className="label">Website Titel</label>
                <input className="input-field" value={data.global.siteTitle} onChange={(e) => setData({ ...data, global: { ...data.global, siteTitle: e.target.value } })} />
              </div>
              <div>
                <label className="label">Google Analytics ID</label>
                <input className="input-field" placeholder="G-XXXXXXXXXX" value={data.global.analyticsId} onChange={(e) => setData({ ...data, global: { ...data.global, analyticsId: e.target.value } })} />
              </div>
              <div>
                <label className="label">Google Search Console Verification</label>
                <input className="input-field" placeholder="Verification Code" value={data.global.gscVerification} onChange={(e) => setData({ ...data, global: { ...data.global, gscVerification: e.target.value } })} />
              </div>
            </>
          ) : (
            <>
              <h2 className="font-playfair text-lg font-bold text-primary mb-2">
                SEO für: {PAGES.find((p) => p.path === tab)?.label}
              </h2>
              <div>
                <label className="label">
                  Meta Titel
                  <span className={`ml-2 text-xs font-normal ${(currentPage?.title?.length ?? 0) > 60 ? 'text-red-500' : 'text-text-light'}`}>
                    {currentPage?.title?.length ?? 0}/60
                  </span>
                </label>
                <input
                  className="input-field"
                  maxLength={60}
                  value={currentPage?.title ?? ''}
                  onChange={(e) => updatePage('title', e.target.value)}
                />
              </div>
              <div>
                <label className="label">
                  Meta Beschreibung
                  <span className={`ml-2 text-xs font-normal ${(currentPage?.description?.length ?? 0) > 160 ? 'text-red-500' : 'text-text-light'}`}>
                    {currentPage?.description?.length ?? 0}/160
                  </span>
                </label>
                <textarea
                  className="input-field resize-none"
                  rows={3}
                  maxLength={160}
                  value={currentPage?.description ?? ''}
                  onChange={(e) => updatePage('description', e.target.value)}
                />
              </div>
              <div className="bg-bg-soft rounded-lg p-4 border border-border">
                <p className="font-montserrat text-xs text-text-light uppercase tracking-wide mb-2">Google-Vorschau</p>
                <p className="font-source text-accent text-sm font-semibold">{currentPage?.title || '(Kein Titel)'}</p>
                <p className="font-source text-green-700 text-xs">https://www.augenarzt-oppau.de{tab}</p>
                <p className="font-source text-text-mid text-xs mt-1">{currentPage?.description || '(Keine Beschreibung)'}</p>
              </div>
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

export default function SeoPage() {
  return <SessionProvider><SeoEditor /></SessionProvider>
}
