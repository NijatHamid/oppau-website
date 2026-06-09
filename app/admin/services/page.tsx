'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import SessionProvider from '@/components/admin/SessionProvider'
import type { ServiceItem } from '@/lib/data'

function ServicesEditor() {
  const { status } = useSession()
  const router = useRouter()
  const [services, setServices] = useState<ServiceItem[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [editing, setEditing] = useState<ServiceItem | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  useEffect(() => {
    fetch('/api/services').then((r) => r.json()).then((data) =>
      setServices(data.sort((a: ServiceItem, b: ServiceItem) => a.order - b.order))
    )
  }, [])

  const save = async (list = services) => {
    setSaving(true)
    await fetch('/api/services', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(list) })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const toggleActive = (id: string) => {
    const updated = services.map((s) => s.id === id ? { ...s, active: !s.active } : s)
    setServices(updated)
    save(updated)
  }

  const deleteService = (id: string) => {
    if (!confirm('Leistung wirklich löschen?')) return
    const updated = services.filter((s) => s.id !== id)
    setServices(updated)
    save(updated)
  }

  const addNew = () => {
    const newService: ServiceItem = {
      id: Date.now().toString(),
      title: 'Neue Leistung',
      subtitle: '',
      image: '',
      imageAlt: '',
      description: '',
      active: true,
      order: services.length + 1,
    }
    setEditing(newService)
  }

  const saveEditing = async () => {
    if (!editing) return
    const exists = services.find((s) => s.id === editing.id)
    const updated = exists
      ? services.map((s) => s.id === editing.id ? editing : s)
      : [...services, editing]
    setServices(updated)
    setEditing(null)
    await save(updated)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editing) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    setUploading(false)
    if (data.url) setEditing({ ...editing, image: data.url })
  }

  if (editing) {
    return (
      <AdminLayout title={editing.title || 'Neue Leistung'}>
        <div className="max-w-2xl space-y-4">
          <div>
            <label className="label">Titel *</label>
            <input className="input-field" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
          </div>
          <div>
            <label className="label">Untertitel</label>
            <input className="input-field" value={editing.subtitle} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} />
          </div>
          <div>
            <label className="label">Bild</label>
            <div className="flex gap-3 items-center">
              {editing.image && <img src={editing.image} alt="" className="w-24 h-16 object-cover rounded-lg border border-border" />}
              <label className="btn-outline py-2 px-4 text-sm cursor-pointer">
                {uploading ? 'Lädt...' : '📁 Bild hochladen'}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
              {editing.image && <button onClick={() => setEditing({ ...editing, image: '' })} className="text-red-500 text-sm">Entfernen</button>}
            </div>
          </div>
          <div>
            <label className="label">Bild Alt-Text (SEO)</label>
            <input className="input-field" value={editing.imageAlt} onChange={(e) => setEditing({ ...editing, imageAlt: e.target.value })} />
          </div>
          <div>
            <label className="label">Beschreibung *</label>
            <textarea className="input-field resize-y" rows={6} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="active" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} className="w-4 h-4 accent-primary" />
            <label htmlFor="active" className="font-source text-sm cursor-pointer">Auf der Website anzeigen</label>
          </div>
          <div className="flex gap-4 pt-4">
            <button onClick={saveEditing} className="btn-primary py-3 px-8">Speichern</button>
            <button onClick={() => setEditing(null)} className="btn-outline py-3 px-6">Abbrechen</button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Leistungen">
      <div className="max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <p className="font-source text-text-light text-sm">{services.length} Leistungen</p>
          <div className="flex gap-3">
            <button onClick={addNew} className="btn-primary py-2 px-6 text-sm">+ Neue Leistung</button>
            {saved && <span className="font-source text-success text-sm self-center">✅ Gespeichert!</span>}
          </div>
        </div>

        <div className="space-y-3">
          {services.map((s) => (
            <div key={s.id} className={`admin-card flex items-center gap-4 ${!s.active ? 'opacity-60' : ''}`}>
              {s.image ? (
                <img src={s.image} alt={s.imageAlt} className="w-16 h-12 object-cover rounded-lg border border-border shrink-0" />
              ) : (
                <div className="w-16 h-12 bg-bg-soft rounded-lg border border-border flex items-center justify-center text-2xl shrink-0">👁️</div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-playfair font-bold text-primary truncate">{s.title}</h3>
                {s.subtitle && <p className="font-montserrat text-xs text-accent">{s.subtitle}</p>}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <input
                  type="checkbox"
                  checked={s.active}
                  onChange={() => toggleActive(s.id)}
                  className="w-4 h-4 accent-primary cursor-pointer"
                  title="Aktiv/Inaktiv"
                />
                <button onClick={() => setEditing(s)} className="btn-outline py-1.5 px-4 text-sm">Bearbeiten</button>
                <button onClick={() => deleteService(s.id)} className="text-red-500 border border-red-200 rounded-lg py-1.5 px-3 text-sm hover:bg-red-50 transition-colors">Löschen</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}

export default function ServicesPage() {
  return <SessionProvider><ServicesEditor /></SessionProvider>
}
