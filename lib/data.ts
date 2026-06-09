import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')

function readJson<T>(filename: string): T {
  const filePath = path.join(dataDir, filename)
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as T
}

function writeJson(filename: string, data: unknown): void {
  const filePath = path.join(dataDir, filename)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

export function getServices() {
  return readJson<ServiceItem[]>('services.json')
}

export function saveServices(data: ServiceItem[]) {
  writeJson('services.json', data)
}

export function getHours() {
  return readJson<HourEntry[]>('hours.json')
}

export function saveHours(data: HourEntry[]) {
  writeJson('hours.json', data)
}

export function getContact() {
  return readJson<ContactData>('contact.json')
}

export function saveContact(data: ContactData) {
  writeJson('contact.json', data)
}

export function getHero() {
  return readJson<HeroSlide[]>('hero.json')
}

export function saveHero(data: HeroSlide[]) {
  writeJson('hero.json', data)
}

export function getAbout() {
  return readJson<AboutData>('about.json')
}

export function saveAbout(data: AboutData) {
  writeJson('about.json', data)
}

export function getSeo() {
  return readJson<SeoData>('seo.json')
}

export function saveSeo(data: SeoData) {
  writeJson('seo.json', data)
}

export function getLegal() {
  return readJson<LegalData>('legal.json')
}

export function saveLegal(data: LegalData) {
  writeJson('legal.json', data)
}

// Types
export interface ServiceItem {
  id: string
  title: string
  subtitle: string
  image: string
  imageAlt: string
  description: string
  active: boolean
  order: number
}

export interface HourEntry {
  day: string
  active: boolean
  morning: { open: string; close: string } | null
  afternoon: { open: string; close: string } | null
}

export interface ContactData {
  telefon: string
  fax: string
  email: string
  strasse: string
  plz: string
  stadt: string
  doctolibUrl: string
  googleMapsEmbedUrl: string
  parking: boolean
  etage: string
  hinweis: string
  whatsapp: string
  whatsappAktiv: boolean
}

export interface HeroSlide {
  id: string
  image: string
  imageAlt: string
  title: string
  subtitle: string
  order: number
}

export interface TeamMember {
  id: string
  name: string
  titel: string
  bio: string
  foto: string
  order: number
}

export interface SprachenEntry {
  flag: string
  name: string
  hinweis: string
}

export interface AboutData {
  haupttext: string
  praxistext: string
  geschichte: string
  team: TeamMember[]
  sprachen: SprachenEntry[]
}

export interface SeoPageData {
  title: string
  description: string
  ogImage: string
}

export interface SeoData {
  global: {
    siteTitle: string
    defaultOgImage: string
    analyticsId: string
    gscVerification: string
  }
  pages: Record<string, SeoPageData>
}

export interface LegalData {
  impressum: string
  datenschutz: string
  datenschutzAktualisiert: string
}
