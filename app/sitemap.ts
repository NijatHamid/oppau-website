import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.augenarzt-oppau.de'
  const now = new Date()

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/uber-uns`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/leistungen`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/kontakt`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/impressum`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/datenschutz`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
