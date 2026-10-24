# How to edit the L2 Angkor website

Everything you'll normally change lives in the **`content/`** folder (text, prices, rooms, contact
details) and **`public/images/`** (photos). You don't need to touch the code in `src/`.

| I want to change… | Edit this file |
|---|---|
| Rooms: names, prices, photos, availability, amenities | `content/rooms.json` |
| Phone, Telegram, WhatsApp, Facebook, WeChat, email, address, map | `content/site.json` |
| Lease rules (minimum months, deposit, pets, electricity/water rates) | `content/site.json` → `policies` |
| Gallery photos, hero photo, "About" photo, logo | `content/site.json` + `public/images/` |
| Payment / deposit section | `content/site.json` → `payment` |
| Any page text: headings, About story, FAQ, house rules, How-to-rent steps | `content/translations/en.json`, `km.json`, `zh.json` |

---

## Run the site on your computer

```bash
npm install      # first time only
npm run dev      # then open http://localhost:3000
```

The page refreshes by itself every time you save a file.

Before publishing, run **`npm run build`**. If you made a typo in a JSON file or forgot a
translation, this command tells you exactly where.

---

## Rooms (`content/rooms.json`)

Each room is one `{ … }` block. Copy an existing block to add a new room.

```json
{
  "slug": "garden-studio",
  "hidden": false,
  "name": { "en": "Garden Studio", "km": "…", "zh": "…" },
  "summary": { "en": "One short sentence for the room card.", "km": "…", "zh": "…" },
  "description": { "en": "Longer text.\n\nA blank line (\\n\\n) starts a new paragraph.", "km": "…", "zh": "…" },
  "priceFrom": 250,
  "size": 28,
  "bed": { "en": "1 queen bed", "km": "…", "zh": "…" },
  "capacity": 1,
  "status": "available",
  "availableFrom": "",
  "photos": ["/images/rooms/garden-studio-1.jpg", "/images/rooms/garden-studio-2.jpg"],
  "amenities": ["ac", "wifi", "hotWater", "fridge", "Rooftop hammock"]
}
```

- **`slug`**: the room's web address (`/en/rooms/garden-studio`). Lowercase letters, numbers and dashes only. Must be unique.
- **`hidden: true`**: takes the room off the site without deleting it.
- **`priceFrom`**: a number, no `$` sign. It shows as "From $250 / month".
- **`status`**: one of:
  - `"available"`: green "Available now" badge
  - `"soon"`: yellow badge. Put the date in `availableFrom` as `"2026-12-01"`, or leave it `""` for "Available soon"
  - `"rented"`: grey "Currently rented" badge
- **`photos`**: put the image files in `public/images/rooms/` and list them here starting with `/images/rooms/…`. The **first photo** is used on the room card. Leave the list empty `[]` to show the "Photo coming soon" placeholder.
- **`size`**, **`bed`**, **`capacity`**, **`summary`**, **`description`**: all optional. Delete the line (or leave it empty) and that part simply disappears from the page.
- Text can be a single string (same for all languages, e.g. `"bed": "1 queen bed"`) or translated (`{ "en": …, "km": …, "zh": … }`). If a Khmer or Chinese translation is missing, the English text is shown.

### Amenities

Use these ready-made keys. They come with an icon and are translated automatically:

`ac` · `wifi` · `hotWater` · `fridge` · `kitchen` · `kitchenette` · `washingMachine` · `tv` · `desk` ·
`wardrobe` · `bed` · `sofa` · `diningTable` · `balcony` · `privateBathroom` · `parking` · `security` ·
`cleaning` · `laundry` · `pool` · `garden` · `elevator` · `gym` · `fan` · `microwave` · `safe`

You can also write **anything else** as plain text (`"Rooftop hammock"`) or translated
(`{ "en": "Rooftop hammock", "km": "…", "zh": "…" }`). It gets a check-mark icon.

The same keys work for `sharedAmenities` in `site.json` (facilities shared by all tenants). Use an
empty list `[]` to hide that box.

---

## Site details (`content/site.json`)

- **`contact`**: fill in the real values. Leave any of them as `""` and that button disappears.
  - `telegram`: your username without `@`
  - `whatsapp`: the full number with country code, digits only, e.g. `"85512345678"`
  - `wechatQr`: optional path to a QR image, e.g. `"/images/wechat-qr.png"`
- **`logo`**: path to your logo, e.g. `"/images/logo.png"`. Empty = the built-in text logo.
- **`heroImage`**: a photo for the top of the home page. Empty = the illustrated Angkor scene.
- **`aboutImage`**: a photo for the "Our family" section.
- **`gallery`**: the "Life at L2 Angkor" photos. Put the files in `public/images/gallery/`. Delete
  all items (`"gallery": []`) to hide the section.
- **`policies`**:
  - `minLeaseMonths`, `depositMonths`: numbers
  - `petsAllowed`: `true` or `false`
  - `electricityRate`, `waterRate`: optional text, e.g. `"$0.25 / kWh"`. Shown under "Electricity & water".

### Map pin

1. Open Google Maps and find your building (or your Google Business listing).
2. Click **Share → Embed a map → Copy HTML**.
3. From the copied code, take only the address inside `src="…"` and paste it as `map.embedUrl`.
4. Click **Share → Copy link** and paste that as `map.googleMapsLink` (used by the "Open in Google Maps" button).

### Payment / deposit

The section stays hidden while `"enabled": false`. When you're ready:

```json
"payment": {
  "enabled": true,
  "qrImage": "/images/khqr.png",
  "bankName": "ABA Bank",
  "accountName": "…",
  "accountNumber": "…"
}
```

---

## Page text (`content/translations/`)

`en.json`, `km.json` and `zh.json` hold the same keys in three languages. Change the text between the
quotes and keep everything else (keys, commas, brackets) the same.

- **FAQ**: `faq.items`. Add or remove `{ "q": "…", "a": "…" }` blocks.
- **House rules**: `policies.extra`
- **About story**: `about.paragraphs`
- **How to rent steps**: `steps.items`

If you add a FAQ question in English, add it to `km.json` and `zh.json` too.

> **Translations:** the Khmer and Chinese text was written by Claude. Please ask a native speaker to
> read `km.json`, `zh.json` and the `km`/`zh` parts of `rooms.json` before launch.

---

## Inquiry form: get messages by email and Telegram

Until this is set up, the form works in **test mode**: visitors see "Thank you!", but the message
only appears in the server log. Set it up before you launch.

**Email (Resend, free tier)**
1. Sign up at <https://resend.com> and create an API key.
2. Set `RESEND_API_KEY` to the key and `INQUIRY_TO_EMAIL` to the family's inbox.
3. Keep `INQUIRY_FROM_EMAIL` as `onboarding@resend.dev` at first. Once you own a domain, verify it in
   Resend and use e.g. `L2 Angkor <hello@yourdomain.com>`.

**Telegram notification**
1. In Telegram, message **@BotFather**, send `/newbot` and copy the token → `TELEGRAM_BOT_TOKEN`.
2. Send any message to your new bot, then message **@userinfobot** to get your chat ID → `TELEGRAM_CHAT_ID`.
   (For a family group, add the bot to the group and use the group's ID.)

**Where to put these values**
- On your computer: copy `.env.example` to `.env.local` and fill it in.
- On Vercel: **Project → Settings → Environment Variables**, then redeploy.

Replying to an inquiry email replies straight to the visitor.

---

## Publish on Vercel (free)

1. Create a GitHub repository and push this folder to it.
2. Go to <https://vercel.com>, choose **Add New → Project**, and import the repository. The default settings work.
3. Add the environment variables from the section above.
4. Your site will be at `https://<project-name>.vercel.app`. Every push to GitHub updates it automatically.
5. If you buy a domain later: **Project → Settings → Domains → Add**, and follow the DNS instructions.

---

## Change colours or fonts

Colours are at the top of `src/app/globals.css` (`--color-terracotta`, `--color-sage`, …).
Fonts are set in `src/lib/fonts.ts`.
