import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// Simple in-memory brute-force protection
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>()

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'E-Mail', type: 'email' },
        password: { label: 'Passwort', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null

        const ip = (req as { headers?: Record<string, string> }).headers?.['x-forwarded-for'] ?? 'unknown'
        const attempts = loginAttempts.get(ip)
        const now = Date.now()

        if (attempts && attempts.lockedUntil > now) {
          throw new Error('Zu viele Fehlversuche. Bitte warten Sie 15 Minuten.')
        }

        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        if (!adminEmail || !adminPassword) {
          console.error('Admin credentials not configured')
          return null
        }

        const emailMatch = credentials.email === adminEmail
        const passwordMatch = credentials.password === adminPassword

        if (!emailMatch || !passwordMatch) {
          // Track failed attempt
          const current = loginAttempts.get(ip) ?? { count: 0, lockedUntil: 0 }
          current.count++
          if (current.count >= 5) {
            current.lockedUntil = now + 15 * 60 * 1000 // 15 min lockout
            current.count = 0
          }
          loginAttempts.set(ip, current)
          return null
        }

        // Success — clear attempts
        loginAttempts.delete(ip)

        return { id: '1', email: adminEmail, name: 'Admin' }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 hours
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (session.user) (session.user as { id?: string }).id = token.id as string
      return session
    },
  },
}
