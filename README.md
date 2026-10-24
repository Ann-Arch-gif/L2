# L2 Angkor

Website for L2 Angkor, a family-run building of furnished apartments for monthly rent in Siem Reap,
Cambodia. Available in English, Khmer and Chinese.

**To change content, see [EDITING.md](EDITING.md).**

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (also validates content and translations)
```

## Stack

- Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Motion
- Content in JSON files under `content/`, no CMS
- Language routing in `src/proxy.ts` (saved choice → browser language → English)
- Inquiry form → `src/app/api/inquiry/route.ts` → email (Resend) + Telegram; see `.env.example`

## Structure

```
content/            site.json, rooms.json, translations/{en,km,zh}.json
public/images/      photos (rooms/, gallery/)
src/app/[lang]/     home page and rooms/[slug] detail pages
src/components/     page sections and UI
src/lib/            content loading, i18n helpers, fonts
```
