import type { HourEntry } from '@/lib/data'

interface Props {
  hours: HourEntry[]
  compact?: boolean
}

export default function OpeningHours({ hours, compact = false }: Props) {
  const activeDays = hours.filter((h) => h.active)

  if (compact) {
    return (
      <div className="font-source text-sm space-y-1">
        {activeDays.map((h) => {
          const timeStr = formatHourEntry(h)
          return (
            <div key={h.day} className="flex justify-between gap-4">
              <span className="font-semibold text-text-dark">{h.day.slice(0, 2)}.</span>
              <span className="text-text-mid">{timeStr}</span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="opening-hours-table">
      <table className="w-full font-source text-sm border-collapse">
        <tbody>
          {hours.map((h) => (
            <tr key={h.day} className={`border-b border-border last:border-0 ${!h.active ? 'opacity-40' : ''}`}>
              <td className="py-2.5 pr-4 font-semibold text-text-dark w-32">{h.day}</td>
              <td className="py-2.5 text-text-mid">
                {h.active ? formatHourEntry(h) : 'Geschlossen'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function formatHourEntry(h: HourEntry): string {
  const parts: string[] = []
  if (h.morning) parts.push(`${h.morning.open} – ${h.morning.close}`)
  if (h.afternoon) parts.push(`${h.afternoon.open} – ${h.afternoon.close}`)
  return parts.join('  |  ')
}
