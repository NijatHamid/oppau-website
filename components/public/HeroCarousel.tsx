'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import type { HeroSlide } from '@/lib/data'

interface Props {
  slides: HeroSlide[]
  doctolibUrl: string
}

export default function HeroCarousel({ slides, doctolibUrl }: Props) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const activeSlides = slides.filter((s) => s.image).sort((a, b) => a.order - b.order)

  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden">
      {/* Slides */}
      {activeSlides.length > 0 ? (
        activeSlides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === current ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.imageAlt}
              fill
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-light" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4">
        <p className="font-montserrat text-accent text-sm font-semibold uppercase tracking-widest mb-4">
          Willkommen in der
        </p>
        <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          Augenarztpraxis Oppau
        </h1>
        <p className="font-source text-xl md:text-2xl text-blue-100 mb-3">
          Ekaterina Chashchina &amp; Kollegen
        </p>
        <p className="font-source text-lg md:text-xl text-blue-200 mb-10">
          Ihre Augengesundheit in besten Händen
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={doctolibUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-base py-4 px-8 shadow-xl"
          >
            Termin online buchen
          </a>
          <a href="/uber-uns" className="btn-outline text-base py-4 px-8 border-white text-white hover:bg-white hover:text-primary">
            Mehr erfahren
          </a>
        </div>
      </div>

      {/* Dot indicators */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {activeSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === current ? 'bg-white w-6' : 'bg-white/50'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 z-10 hidden md:flex flex-col items-center gap-1 text-white/60 text-xs font-source">
        <span>Scroll</span>
        <div className="w-px h-8 bg-white/40" />
      </div>
    </section>
  )
}
