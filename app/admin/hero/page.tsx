'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import SessionProvider from '@/components/admin/SessionProvider'
import type { HeroSlide } from '@/lib/data'

function HeroEditor() {
  const { status } = useSession()
  const router = useRouter()
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  useEffect(() => {
    fetch('/api/content?type=hero').then((r) => r.json()).then((data) =>
      setSlides(data.sort((a: HeroSlide, b: HeroSlide) => a.order - b.order))
    )
  }, [])

  const updateSlide = (id: string, field: keyof HeroSlide, value: string) => {
    setSlides((prev) => prev.map((s) => s.id === id ? { ...s, [field]: value } : s))
  }

  const handleUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(id)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    setUploading(null)
    if (data.url) updateSlide(id, 'image', data.url)
  }

  const save = async () => {
    setSaving(true)
    await fetch('/api/content?type=hero', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(slides) })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <AdminLayout title="Hero Bilder">
      <div className="max-w-3xl space-y-6">
        {slides.map((slide, i) => (
          <div key={slide.id} className="admin-card">
            <h3 className="font-montserrat text-sm font-semibold text-text-light uppercase tracking-wide mb-4">
              Slide {i + 1}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Image upload */}
              <div>
                <label className="label">Bild</label>
                <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-accent transition-colors">
                  {slide.image ? (
                    <div className="space-y-2">
                      <img src={slide.image} alt={slide.imageAlt} className="w-full h-32 object-cover rounded-lg" />
                      <label className="btn-outline py-1.5 px-4 text-xs cursor-pointer">
                        {uploading === slide.id ? '⏳ Lädt...' : '📁 Ersetzen'}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(slide.id, e)} />
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="text-4xl mb-2">🖼️</div>
                      <p className="font-source text-sm text-text-light mb-2">Bild hochladen</p>
                      <span className="btn-primary py-1.5 px-4 text-xs">
                        {uploading === slide.id ? '⏳ Lädt...' : 'Datei auswählen'}
                      </span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(slide.id, e)} />
                    </label>
                  )}
                </div>
              </div>

              {/* Text fields */}
              <div className="space-y-3">
                <div>
                  <label className="label">Titel</label>
                  <input className="input-field text-sm" value={slide.title} onChange={(e) => updateSlide(slide.id, 'title', e.target.value)} />
                </div>
                <div>
                  <label className="label">Untertitel</label>
                  <input className="input-field text-sm" value={slide.subtitle} onChange={(e) => updateSlide(slide.id, 'subtitle', e.target.value)} />
                </div>
                <div>
                  <label className="label">Alt Text (SEO)</label>
                  <input className="input-field text-sm" value={slide.imageAlt} onChange={(e) => updateSlide(slide.id, 'imageAlt', e.target.value)} placeholder="Bildbeschreibung für Suchmaschinen" />
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-center gap-4">
          <button onClick={save} disabled={saving} className="btn-primary py-3 px-8 disabled:opacity-50">
            {saving ? 'Speichern...' : 'Alle Slides speichern'}
          </button>
          {saved && <span className="font-source text-success text-sm">✅ Gespeichert!</span>}
        </div>
      </div>
    </AdminLayout>
  )
}

export default function HeroPage() {
  return <SessionProvider><HeroEditor /></SessionProvider>
}
