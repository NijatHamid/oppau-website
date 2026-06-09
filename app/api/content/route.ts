import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import {
  getHero, saveHero,
  getAbout, saveAbout,
  getContact, saveContact,
  getSeo, saveSeo,
  getLegal, saveLegal,
} from '@/lib/data'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')

  switch (type) {
    case 'hero': return NextResponse.json(getHero())
    case 'about': return NextResponse.json(getAbout())
    case 'contact': return NextResponse.json(getContact())
    case 'seo': return NextResponse.json(getSeo())
    case 'legal': return NextResponse.json(getLegal())
    default: return NextResponse.json({ error: 'Unbekannter Typ' }, { status: 400 })
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')
  const data = await req.json()

  switch (type) {
    case 'hero': saveHero(data); break
    case 'about': saveAbout(data); break
    case 'contact': saveContact(data); break
    case 'seo': saveSeo(data); break
    case 'legal': saveLegal(data); break
    default: return NextResponse.json({ error: 'Unbekannter Typ' }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
