'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import SessionProvider from '@/components/admin/SessionProvider'
import type { HourEntry } from '@/lib/data'

function HoursEditor() {
  const { status } = useSession()
  const router = useRouter()
  const [hours, setHours] = useState<HourEntry[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  useEffect(() => {
    fetch('/api/hours').then((r) => r.json()).then(setHours)
  }, [])

  const update = (dayIndex: number, field: string, value: string | boolean | null) => {
    setHours((prev) => {
      const next = [...prev]
      const entry = { ...next[dayIndex] }

      if (field === 'active') {
        entry.active = value as boolean
      } else if (field.startsWith('morning.')) {
        const key = field.split('.')[1] as 'open' | 'close'
        entry.morning = entry.morning ? { ...entry.morning, [key]: value } : { open: '08:00', close: '12:00', [key]: value }
      } else if (field.startsWith('afternoon.')) {
        const key = field.split('.')[1] as 'open' | 'close'
        entry.afternoon = entry.afternoon ? { ...entry.afternoon, [key]: value } : { open: '13:00', close: '17:00', [key]: value }
      } else if (field === 'afternoon.toggle') {
        entry.afternoon = entry.afternoon ? null : { open: '13:00', close: '17:00' }
      }

      next[dayIndex] = entry
      return next
    })
  }

  const save = async () => {
    setSaving(true)
    await fetch('/api/hours', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(hours) })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <AdminLayout title="Öffnungszeiten">
      <div className="max-w-4xl">
        <div className="admin-card">
          <table className="w-full text-sm font-source">
            <thead>
              <tr className="text-left border-b border-border">
                <th className="pb-3 pr-4 font-montserrat text-xs text-text-light uppercase tracking-wide">Tag</th>
                <th className="pb-3 pr-4 font-montserrat text-xs text-text-light uppercase tracking-wide">Aktiv</th>
                <th className="pb-3 pr-4 font-montserrat text-xs text-text-light uppercase tracking-wide">Vormittag öffnet</th>
                <th className="pb-3 pr-4 font-montserrat text-xs text-text-light uppercase tracking-wide">Schließt</th>
                <th className="pb-3 pr-4 font-montserrat text-xs text-text-light uppercase tracking-wide">Nachmittag</th>
                <th className="pb-3 pr-4 font-montserrat text-xs text-text-light uppercase tracking-wide">öffnet</th>
                <th className="pb-3 font-montserrat text-xs text-text-light uppercase tracking-wide">Schließt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {hours.map((h, i) => (
                <tr key={h.day} className={`py-3 ${!h.active ? 'opacity-50' : ''}`}>
                  <td className="py-3 pr-4 font-semibold text-text-dark">{h.day}</td>
                  <td className="py-3 pr-4">
                    <input
                      type="checkbox"
                      checked={h.active}
                      onChange={(e) => update(i, 'active', e.target.checked)}
                      className="w-4 h-4 accent-primary cursor-pointer"
                    />
                  </td>
                  <td className="py-3 pr-4">
                    <input
                      type="time"
                      disabled={!h.active}
                      value={h.morning?.open ?? '08:00'}
                      onChange={(e) => update(i, 'morning.open', e.target.value)}
                      className="input-field py-1.5 text-sm w-28"
                    />
                  </td>
                  <td className="py-3 pr-4">
                    <input
                      type="time"
                      disabled={!h.active}
                      value={h.morning?.close ?? '12:00'}
                      onChange={(e) => update(i, 'morning.close', e.target.value)}
                      className="input-field py-1.5 text-sm w-28"
                    />
                  </td>
                  <td className="py-3 pr-4">
                    <input
                      type="checkbox"
                      disabled={!h.active}
                      checked={!!h.afternoon}
                      onChange={() => update(i, 'afternoon.toggle', null)}
                      className="w-4 h-4 accent-primary cursor-pointer"
                    />
                  </td>
                  <td className="py-3 pr-4">
                    {h.afternoon && (
                      <input
                        type="time"
                        value={h.afternoon.open}
                        onChange={(e) => update(i, 'afternoon.open', e.target.value)}
                        className="input-field py-1.5 text-sm w-28"
                      />
                    )}
                  </td>
                  <td className="py-3">
                    {h.afternoon && (
                      <input
                        type="time"
                        value={h.afternoon.close}
                        onChange={(e) => update(i, 'afternoon.close', e.target.value)}
                        className="input-field py-1.5 text-sm w-28"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button onClick={save} disabled={saving} className="btn-primary py-3 px-8 disabled:opacity-50">
            {saving ? 'Speichern...' : 'Speichern'}
          </button>
          {saved && <span className="font-source text-success text-sm">✅ Gespeichert!</span>}
        </div>
      </div>
    </AdminLayout>
  )
}

export default function HoursPage() {
  return <SessionProvider><HoursEditor /></SessionProvider>
}
