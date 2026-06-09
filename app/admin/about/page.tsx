'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import SessionProvider from '@/components/admin/SessionProvider'
import type { AboutData, TeamMember } from '@/lib/data'

function AboutEditor() {
  const { status } = useSession()
  const router = useRouter()
  const [data, setData] = useState<AboutData | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  useEffect(() => {
    fetch('/api/content?type=about').then((r) => r.json()).then(setData)
  }, [])

  const save = async () => {
    if (!data) return
    setSaving(true)
    await fetch('/api/content?type=about', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const addTeamMember = () => {
    if (!data) return
    const newMember: TeamMember = { id: Date.now().toString(), name: '', titel: '', bio: '', foto: '', order: data.team.length + 1 }
    setData({ ...data, team: [...data.team, newMember] })
  }

  const updateMember = (id: string, field: keyof TeamMember, value: string) => {
    if (!data) return
    setData({ ...data, team: data.team.map((m) => m.id === id ? { ...m, [field]: value } : m) })
  }

  const removeMember = (id: string) => {
    if (!data) return
    setData({ ...data, team: data.team.filter((m) => m.id !== id) })
  }

  if (!data) return <AdminLayout title="Über uns"><p className="font-source text-text-light">Laden...</p></AdminLayout>

  return (
    <AdminLayout title="Über uns">
      <div className="max-w-3xl space-y-8">
        {/* Haupttext */}
        <div className="admin-card">
          <h2 className="font-playfair text-lg font-bold text-primary mb-4">Willkommen-Text (Startseite)</h2>
          <label className="label">HTML-Inhalt</label>
          <textarea
            className="input-field font-mono text-sm resize-y"
            rows={6}
            value={data.haupttext}
            onChange={(e) => setData({ ...data, haupttext: e.target.value })}
          />
          <p className="font-source text-xs text-text-light mt-1">Unterstützt HTML-Tags: &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt;</p>
        </div>

        {/* Praxistext */}
        <div className="admin-card">
          <h2 className="font-playfair text-lg font-bold text-primary mb-4">Über uns Seite — Haupttext</h2>
          <textarea
            className="input-field font-mono text-sm resize-y"
            rows={6}
            value={data.praxistext}
            onChange={(e) => setData({ ...data, praxistext: e.target.value })}
          />
        </div>

        {/* Geschichte */}
        <div className="admin-card">
          <h2 className="font-playfair text-lg font-bold text-primary mb-4">Unsere Geschichte</h2>
          <textarea
            className="input-field font-mono text-sm resize-y"
            rows={4}
            value={data.geschichte}
            onChange={(e) => setData({ ...data, geschichte: e.target.value })}
          />
        </div>

        {/* Team */}
        <div className="admin-card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-playfair text-lg font-bold text-primary">Team</h2>
            <button onClick={addTeamMember} className="btn-outline py-1.5 px-4 text-sm">+ Teammitglied</button>
          </div>
          <div className="space-y-4">
            {data.team.map((member) => (
              <div key={member.id} className="border border-border rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label text-xs">Name</label>
                    <input className="input-field text-sm" value={member.name} onChange={(e) => updateMember(member.id, 'name', e.target.value)} />
                  </div>
                  <div>
                    <label className="label text-xs">Titel / Funktion</label>
                    <input className="input-field text-sm" value={member.titel} onChange={(e) => updateMember(member.id, 'titel', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="label text-xs">Bio</label>
                  <textarea className="input-field text-sm resize-none" rows={2} value={member.bio} onChange={(e) => updateMember(member.id, 'bio', e.target.value)} />
                </div>
                <button onClick={() => removeMember(member.id)} className="text-red-500 text-sm hover:underline">Entfernen</button>
              </div>
            ))}
            {data.team.length === 0 && <p className="font-source text-text-light text-sm italic">Noch keine Teammitglieder hinzugefügt.</p>}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={save} disabled={saving} className="btn-primary py-3 px-8 disabled:opacity-50">
            {saving ? 'Speichern...' : 'Speichern'}
          </button>
          {saved && <span className="font-source text-success text-sm">✅ Gespeichert!</span>}
        </div>
      </div>
    </AdminLayout>
  )
}

export default function AboutPage() {
  return <SessionProvider><AboutEditor /></SessionProvider>
}
