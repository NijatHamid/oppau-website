import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getHours, saveHours } from '@/lib/data'

export async function GET() {
  return NextResponse.json(getHours())
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })

  const data = await req.json()
  saveHours(data)
  return NextResponse.json({ ok: true })
}
