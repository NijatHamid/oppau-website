import Image from 'next/image'
import Link from 'next/link'
import type { ServiceItem } from '@/lib/data'

const serviceIcons: Record<string, string> = {
  '1': '👁️',
  '2': '🔬',
  '3': '📊',
  '4': '⚡',
  '5': '🔵',
  '6': '🗺️',
  '7': '📏',
  '8': '📷',
  '9': '🌙',
}

interface Props {
  service: ServiceItem
  compact?: boolean
}

export default function ServiceCard({ service, compact = false }: Props) {
  if (compact) {
    return (
      <div className="card flex flex-col gap-3 group cursor-pointer">
        <div className="text-4xl">{serviceIcons[service.id] ?? '👁️'}</div>
        <h3 className="font-playfair text-lg font-bold text-primary">{service.title}</h3>
        {service.subtitle && (
          <p className="font-montserrat text-xs font-semibold text-accent uppercase tracking-wide">
            {service.subtitle}
          </p>
        )}
        <p className="font-source text-sm text-text-mid leading-relaxed line-clamp-2">
          {service.description}
        </p>
        <Link
          href="/leistungen"
          className="font-montserrat text-sm font-semibold text-accent hover:text-primary flex items-center gap-1 mt-auto transition-colors"
        >
          Mehr erfahren →
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-card border border-border overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="relative h-52 bg-bg-soft flex items-center justify-center overflow-hidden">
        {service.image ? (
          <Image
            src={service.image}
            alt={service.imageAlt}
            fill
            className="object-cover"
          />
        ) : (
          <span className="text-6xl">{serviceIcons[service.id] ?? '👁️'}</span>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {service.subtitle && (
          <p className="font-montserrat text-xs font-semibold text-accent uppercase tracking-wide mb-2">
            {service.subtitle}
          </p>
        )}
        <h3 className="font-playfair text-xl font-bold text-primary mb-3">{service.title}</h3>
        <p className="font-source text-text-mid leading-relaxed text-sm">{service.description}</p>
      </div>
    </div>
  )
}
