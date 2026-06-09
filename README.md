# Augenarztpraxis Oppau — Website

Next.js 14 website + admin panel for Augenarztpraxis Oppau, Ludwigshafen.

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
```

Generate the admin password hash:
```bash
node scripts/generate-password-hash.js YourPassword123!
```

Paste the output into `.env.local`:
```
NEXTAUTH_SECRET=<random 32+ char string>
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=admin@augenarzt-oppau.de
ADMIN_PASSWORD_HASH=<from script above>
CONTACT_EMAIL=info@augenarzt-oppau.de
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
```

### 3. Run in development
```bash
npm run dev
```

Visit: http://localhost:3000
Admin: http://localhost:3000/admin/login

### 4. Build for production
```bash
npm run build
npm run start
```

### 5. Deploy with PM2 (DigitalOcean)
```bash
npm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Structure

```
app/               — Next.js App Router pages
  (public pages)   — /, /uber-uns, /leistungen, /kontakt, /impressum, /datenschutz
  admin/           — Admin panel (protected by NextAuth middleware)
  api/             — API routes
components/
  public/          — Shared public components
  admin/           — Admin layout + session provider
data/              — JSON content files (editable via admin panel)
lib/               — Data access functions + auth config
public/uploads/    — Uploaded images (gitignored)
scripts/           — Utility scripts
```

## Admin Panel

Login at `/admin/login` with your configured credentials.

Modules:
- **Hero Bilder** — carousel images and headings
- **Über uns** — practice description, team, history
- **Leistungen** — services (add/edit/delete/toggle)
- **Öffnungszeiten** — opening hours per weekday
- **Kontaktdaten** — phone, address, Doctolib link
- **Impressum & DSGVO** — legal texts
- **SEO** — meta titles and descriptions per page

## Content

All content is stored in `/data/*.json` files. The admin panel reads and writes these files directly — no database required.

Images are uploaded to `/public/uploads/` (gitignored — back these up separately on your server).
