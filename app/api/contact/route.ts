import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function rateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 }) // 1 minute window
    return true
  }

  if (entry.count >= 3) return false // max 3 per minute

  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'

  if (!rateLimit(ip)) {
    return NextResponse.json({ error: 'Zu viele Anfragen. Bitte versuchen Sie es später.' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const { name, email, telefon, nachricht } = body

    if (!name?.trim() || !email?.trim() || !nachricht?.trim()) {
      return NextResponse.json({ error: 'Pflichtfelder fehlen.' }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Ungültige E-Mail-Adresse.' }, { status: 400 })
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: `"Augenarztpraxis Oppau Website" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL,
      replyTo: email,
      subject: `Neue Kontaktanfrage von ${name}`,
      html: `
        <h2>Neue Kontaktanfrage über die Website</h2>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr><td style="padding: 8px; font-weight: bold; width: 120px;">Name:</td><td style="padding: 8px;">${escapeHtml(name)}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">E-Mail:</td><td style="padding: 8px;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Telefon:</td><td style="padding: 8px;">${escapeHtml(telefon ?? '-')}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; vertical-align: top;">Nachricht:</td><td style="padding: 8px;">${escapeHtml(nachricht).replace(/\n/g, '<br>')}</td></tr>
        </table>
        <p style="color: #718096; font-size: 12px; margin-top: 20px;">Diese Nachricht wurde über das Kontaktformular der Augenarztpraxis Oppau Website gesendet.</p>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Server-Fehler beim Senden der Nachricht.' }, { status: 500 })
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
