# Kerplunk Media – Anonymous Feedback Form

A responsive React (Vite) landing page where anyone can leave **anonymous** feedback:
overall star rating, positive / neutral / negative experience, category ratings,
what went well, what to improve, suggestions and "would you recommend".
Every submission is saved as a new row in **Google Sheets**.

## 1. Run locally

```bash
npm install
cp .env.example .env     # then paste your Apps Script URL (step 2)
npm run dev
```

## 2. Connect Google Sheets

1. Create a new Google Sheet (e.g. "Kerplunk Feedback").
2. **Extensions → Apps Script**. Delete the sample code and paste everything from
   [`google-apps-script/Code.gs`](google-apps-script/Code.gs). Save.
3. **Deploy → New deployment** → type **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy** and authorize. Copy the **Web app URL** (ends with `/exec`).
5. Put it in `.env`:
   ```
   VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/XXXX/exec
   ```
6. Restart `npm run dev`. Submit a test. A `Feedback` tab with headers appears automatically.

> If you edit `Code.gs` later, use **Deploy → Manage deployments → Edit → New version**,
> otherwise the old code keeps running.

## 3. Logo (transparent background)

Save your white-on-blue logo as a PNG, then run:

```bash
node scripts/make-logo-transparent.mjs path/to/kerplunk-logo.png
```

This writes `public/logo.png` with the blue removed (white logo, transparent background).
The header uses it automatically and falls back to a text logo if the file is missing.

## 4. Build & deploy

```bash
npm run build      # output in dist/
```

Deploy `dist/` to Netlify, Vercel, or any static host. Remember to set
`VITE_GOOGLE_SCRIPT_URL` as an environment variable on the host too.
