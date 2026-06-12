# What's for Dinner? 🍽️

Family dinner planning app with a community recipe hub.

---

## Deploy to Vercel (free — takes ~5 minutes)

### Step 1 — Get the code on GitHub

1. Go to [github.com](https://github.com) and create a free account if you don't have one
2. Click **"New repository"** → name it `whats-for-dinner` → click **Create**
3. Upload all these project files by dragging them into the repository page
   - Make sure to preserve the folder structure (`public/`, `src/`)

### Step 2 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up free (use "Continue with GitHub")
2. Click **"Add New Project"**
3. Select your `whats-for-dinner` repository
4. Vercel auto-detects it's a React app — just click **Deploy**
5. In ~60 seconds you'll get a live URL like:
   `https://whats-for-dinner-abc123.vercel.app`

### Step 3 — Share with beta testers

Send them the Vercel URL. That's it!

**On iPhone:** open the link in Safari → tap the Share icon → "Add to Home Screen"
**On Android:** open in Chrome → tap the 3-dot menu → "Add to Home screen"

The app icon will appear on their home screen just like a downloaded app.

---

## Demo accounts (for beta testers)

Tap the name in the top-right corner to switch between users:

| Name | Role | Family |
|------|------|--------|
| 👩 Sarah M. | **Admin** | The Mitchells |
| 👨 Tom M. | Member | The Mitchells |
| 👧 Emma M. | Member | The Mitchells |
| 👦 Jake M. | Member | The Mitchells |
| 👩‍🦰 Linda K. | Admin | The Kowalskis |
| 👨‍🍳 Chef Raj | Admin | The Patel Kitchen |
| 👩‍🦱 Mia C. | Admin | Casa Chen |

**Note:** This is a prototype — data resets on page refresh. It's for UI/flow feedback only.

---

## Key things to test with your beta users

- [ ] Is the weekly menu flow clear?
- [ ] Can family members easily submit their dinner picks?
- [ ] Is the recipe library easy to use?
- [ ] Does the shopping list make sense?
- [ ] Is the Community section intuitive?
- [ ] What features are missing?

---

## Project structure

```
whats-for-dinner/
├── public/
│   ├── index.html       # App shell with PWA meta tags
│   └── manifest.json    # Makes app installable on home screen
├── src/
│   ├── App.jsx          # Main app (all components)
│   └── index.js         # React entry point
├── package.json         # Dependencies
├── vercel.json          # Vercel routing config
└── README.md            # This file
```

---

## Next steps after beta

1. **Collect feedback** — Google Form works great for structured beta feedback
2. **Add Firebase** — real accounts + persistent data
3. **Convert to React Native / Expo** — true iOS & Android app
4. **App Store submission** — Apple ($99/yr) + Google Play ($25 one-time)
