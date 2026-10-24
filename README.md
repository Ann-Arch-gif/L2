# L2 Angkor

Website for L2 Angkor, a family-run building of furnished apartments for monthly rent in Siem Reap,
Cambodia. Available in English, Khmer and Chinese.

- **Admin:** https://l2angkor.sanity.studio (also `/admin` on the website)
- **How to manage content:** [EDITING.md](EDITING.md)

## Development

```bash
npm install
npm run dev        # website on http://localhost:3000
npm run build      # production build

cd studio
npm install
npm run dev        # admin (Sanity Studio) on http://localhost:3333
```

## Stack

- Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- Sanity (project `97y5asq7`, dataset `production`) for rooms, photos and settings, with
  live updates via `next-sanity` and an optional webhook at `/api/revalidate`
- Translated fields stored with `sanity-plugin-internationalized-array`; page text in `content/translations/`
- Language routing in `src/proxy.ts` (saved choice → browser language → English)
- Enquiry form → `src/app/api/inquiry/route.ts` → email (Resend) and Telegram; see `.env.example`

## Structure

```
content/translations/   page text in en / km / zh
studio/                 Sanity Studio (admin): schema, structure, config
src/app/[lang]/         home, rooms (with filters), rooms/[slug]
src/components/         page sections and UI
src/sanity/             client, live fetching, queries, image loader
src/lib/                i18n, formatting, room helpers, fonts
```
