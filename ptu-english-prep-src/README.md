# PTU English Prep

Free study site for **IKGPTU AECC English**: Theory (BTHU103/18) and Lab (BTHU104/18). Built by **Mr. Dev Kumar** for his students, so nobody is left behind if they miss a class or want to revise before an MST or the end-semester exam.

**Live site:** https://ptuenglish.vercel.app

---

## What students get

- **Notes** for every unit, written in plain language and cross-checked against the syllabus and previous papers.
- **Quizzes** with instant feedback, retry, and a **PDF download** of the results.
- **Listening exercises**: a video with a short quiz on the same page.
- **Reading practice with AI marking**: students write answers to passage questions and get marks and feedback. If the AI is unavailable they still get model answers.
- **Previous year question papers (PYQ)** and guess papers, viewable online or downloadable as PDF.
- **Mobile-friendly navigation**: swipe left or right to move between Home, Theory, Lab and PYQ.
- **Share button** (WhatsApp, Telegram, copy link, or the phone's own share sheet).

---

## Tech stack

| Part | Choice |
| --- | --- |
| Framework | React 19 with Vite 8 |
| Routing | react-router-dom 7 (BrowserRouter) |
| Styling | Tailwind CSS v4, with theme colors defined in `src/index.css` |
| Notes | Markdown rendered with react-markdown (remark-gfm, rehype-raw) |
| PDF export | jsPDF |
| Analytics | Vercel Analytics |
| Hosting | Vercel (auto-deploys from GitHub) |
| Serverless function | `api/evaluate-reading.js` (AI marking) |

No database, no login, no admin panel. Content is plain files in the repo.

---

## Pages (routes)

| Address | What it shows |
| --- | --- |
| `/` | Home page |
| `/theory`, `/lab` | The four units of each track |
| `/:track/:unitId` | A unit: notes page, or intro plus part cards |
| `/:track/:unitId/quiz` | The unit quiz |
| `/:track/:unitId/:partId` | One part of a parts-based unit |
| `/:track/:unitId/listening` | Listening exercises hub |
| `/:track/:unitId/listening/:exerciseId` | One listening exercise |
| `/pyq` | Previous year papers and guess papers |

All addresses are lowercase. A mixed-case address (for example `/Theory`) is redirected to the lowercase one.

---

## How content works

- All content lives under `src/content/`. Edit a file on GitHub, commit, and Vercel rebuilds the live site within about a minute.
- `src/content/syllabus.js` is the master list of units. A unit shows as **Available** only when its files exist **and** its `status` is `'available'`. Otherwise it shows "Coming soon".
- You never need to edit `.jsx` code just to add content. Content and code are kept separate on purpose.
- `src/lib/content.js` finds content files automatically using Vite's glob imports, so new files are picked up without any registration (the one exception is the private AI answer key, see below).

There are four kinds of unit content.

### 1. Simple unit (notes plus quiz)

1. Create `src/content/<track>/<unitId>/notes.md`.
2. Create `src/content/<track>/<unitId>/mcqs.json` (format below).
3. In `syllabus.js`, set the unit's `status` to `'available'`.

### 2. Parts-based unit (intro plus part cards)

Use this when a unit splits into distinct chunks (for example Theory Unit 3, or Lab Units 1 to 4).

1. `notes.md` holds only the short intro shown above the cards.
2. Create `parts.js`:
   ```js
   export const unitParts = [
     { id: 'part-slug', number: 1, title: 'Part Title', type: 'notes', blurb: 'One-line description' },
   ]
   ```
3. Create `parts/<part-id>.md` for each part. Optionally add `parts/<part-id>-mcqs.json` for a quiz at the bottom of that part.
4. Part `type` can be:
   - `'notes'`: a normal content page.
   - `'listening'`: links to the listening exercises hub.
   - `'reading'`: the AI-marked reading practice page (see "Reading practice with AI marking").

If you insert a part in the middle of the list, renumber the `number` values after it.

### 3. Listening exercises (video plus inline quiz)

1. In `parts.js`, add a part with `type: 'listening'`.
2. Create `listening.js`:
   ```js
   export const listeningExercises = [
     { id: 'exercise-slug', title: 'Listening Exercise 1: The Story Title' },
   ]
   ```
3. For each exercise add two files in `listening/`: `<exercise-id>.md` (the video) and `<exercise-id>-mcqs.json` (the quiz). An empty quiz file (`[]`) shows "Quiz is being added soon".

### 4. Reading practice with AI marking

See the dedicated section below.

### Quiz format: `mcqs.json`

```json
[
  {
    "question": "Your question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "One or two lines on why this is right."
  }
]
```

- `correctAnswer` is the position of the right option, counting from 0.
- A missing comma between questions, or a trailing comma after the last one, breaks the whole file. If a quiz disappears after an edit, check commas first.
- The quiz screen (one question at a time, instant feedback, retry, PDF results) needs no other setup.

### Adding a video

Works in any `.md` file:

```html
<div class="video-embed">
<iframe src="https://www.youtube.com/embed/VIDEO_ID" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>
```

Remove any fixed `width` and `height` from the YouTube embed code, and leave a blank line before and after the block. Raw HTML is allowed in notes, so only add embed code you trust.

### Adding an image or diagram

Put the file in `public/diagrams/` (SVG is best), then in a `.md` file:

```
![Description](/diagrams/my-diagram.svg)
```

The leading `/` means "from the site root".

---

## Previous year papers (PYQ)

- Papers are listed in `src/content/pyq.js`:
  ```js
  { id: 'jan-2025', subject: 'English (AECC) — BTHU103-18', session: 'January 2025', date: '2025-01-04', file: '/pyq/english-jan-2025.pdf' }
  ```
  Upload the PDF to `public/pyq/`. The page sorts papers newest first by `date`.
- On desktop the browser's own PDF viewer is used. On mobile, Mozilla PDF.js is used, because many mobile browsers cannot show a PDF inside an iframe. A Download link works everywhere.
- The mobile viewer needs the canonical domain (`https://ptuenglish.vercel.app`), because the old hyphenated domain redirects without CORS headers. `vercel.json` also sends a CORS header for `/pyq/*`. Do not remove it.

---

## Reading practice with AI marking

Students read a passage, write short answers, and get marks (0, 1 or 2 per question) with a one-line feedback and a model answer for each.

### How it works

1. The page (`src/components/ReadingPractice.jsx`) sends the answers to `/api/evaluate-reading`.
2. The function (`api/evaluate-reading.js`) builds one marking prompt and tries free AI models in order: several Gemini models, then Groq. The first valid reply wins.
3. The reply is never trusted blindly. Marks are rounded and clamped to the allowed range, and every question must be present, or that model's reply is rejected and the next model is tried.
4. If every model fails, the student sees **no marks**, only the model answers and key points. The app never guesses a mark.
5. The function stops trying after 24 seconds (Vercel's limit is 30), and each provider call is time-limited, including reading its reply.

### Where the files are

| File | Purpose |
| --- | --- |
| `src/content/<track>/<unitId>/reading/<part-id>.json` | Public passage and questions |
| `api/_keys/<part-id>.js` | Private marking key: passage, questions, model answers, key points |
| `api/_keys/index.js` | Registers each key by part id |
| `api/evaluate-reading.js` | The marking function |
| `src/components/ReadingPractice.jsx` | The page UI |

The folder `api/_keys` starts with an underscore, so Vercel never serves it as a web address. If the repository is public, anyone can still read the files on GitHub.

### Setup on Vercel (once)

In the Vercel project, open Settings, then Environment Variables, and add (for Production, Preview and Development):

- `GEMINI_API_KEY`: a free key from Google AI Studio
- `GROQ_API_KEY`: a free key from the Groq console

Then redeploy, because new variables only reach new deployments. Never put these keys in GitHub or in chat. The project's Root Directory in Vercel must be `ptu-english-prep-src`.

Optional overrides, as comma-separated lists of model names: `GEMINI_MODELS`, `GROQ_MODELS`. The built-in order is `gemini-3.1-flash-lite-preview`, `gemini-3-flash-preview`, `gemini-2.5-flash-lite`, `gemma-3-27b-it`, then Groq `llama-3.3-70b-versatile` and `llama3-8b-8192`. Free model names change over time. If one is retired, that attempt just fails and the next model runs.

### Adding another reading passage

1. Create `src/content/<track>/<unitId>/reading/<part-id>.json` with `title`, `maxMarksPerQuestion`, `passage` and `questions` (`id` and `text` for each).
2. Create `api/_keys/<part-id>.js` with the same passage and questions, plus a `modelAnswer` and `keyPoints` for each question.
3. Register it in `api/_keys/index.js`.
4. Add a part to the unit's `parts.js` with `type: 'reading'` and the same `id`.
5. Add the new address to `public/sitemap.xml`.

The passage and question text must be identical in the public JSON and the private key file.

### Limits and privacy

- A basic rate limit allows 6 marking requests per 10 minutes per visitor. It is best effort, because each server instance keeps its own count.
- Free AI tiers have daily limits. When they run out, students get model answers instead of marks.
- Student answers are sent to the AI service only to be marked. They are not stored on this site. The free Gemini tier may use submitted text to improve Google products, so students are told not to type personal details.
- To see why marking failed, open the reading page with `?debug=1` at the end of the address. A grey list of reasons appears under "No marks this time". API keys are hidden in that text.
- Failures are also written to Vercel's runtime logs (model name and error only, never answers). On the free Hobby plan these logs are kept for about an hour.

---

## Navigation features

- **Swipe navigation** (`src/hooks/useSwipeNavigation.js`): a deliberate horizontal swipe moves between Home, Theory, Lab and PYQ. It is ignored near the screen edges, during pinch or zoom, on inputs, videos and horizontally scrollable areas, after text selection, and on quiz, listening-exercise and reading-practice pages. Any element can opt out with the `data-no-swipe` attribute.
- **Sliding tab highlight** in the header (`src/components/Layout.jsx`).
- **Share button** (`src/components/ShareButton.jsx`): shares the current page address with a short message.
- **Breadcrumbs** on every page below the home page.

---

## Search and sharing (SEO)

- `index.html` has the site title, description, Open Graph and Twitter tags, the Google Search Console verification tag (do not remove it), a `WebSite` JSON-LD block (site name "PTU English Prep"), and a `<noscript>` block with real text and links for crawlers that do not run JavaScript.
- `src/hooks/usePageMeta.js` runs on every route change. It sets a unique **title, description, canonical link and breadcrumb data** for each page, and marks made-up addresses as `noindex`. It reads unit and part names from the same content files as the site, so new units and parts get titles automatically.
- `public/robots.txt` allows crawling and points to the sitemap.
- `public/sitemap.xml` is written by hand. **When you add a new unit, part or exercise, add its address here.** Quiz pages and PDFs are left out on purpose.
- After changing the sitemap, resubmit it in Google Search Console.
- Google decides on its own whether to show extra links (sitelinks) under the site name. Clear titles, a sitemap and links from other places (YouTube, blog, Substack, Instagram, the GitHub repo page) help.

---

## Project structure

```
ptu-english-prep-src/
├── api/
│   ├── evaluate-reading.js          ← AI marking function (serverless)
│   └── _keys/                       ← private answer keys (never served)
├── public/
│   ├── diagrams/                    ← images and SVGs used in notes
│   ├── pyq/                         ← PYQ and guess-paper PDFs
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── content/
│   │   ├── syllabus.js              ← master list of units and their status
│   │   ├── pyq.js                   ← list of papers
│   │   ├── theory/unit1..4/         ← notes.md, mcqs.json, parts.js, parts/, reading/
│   │   └── lab/unit1..4/            ← notes.md, parts.js, parts/, listening.js, listening/
│   ├── pages/                       ← Home, TrackPage, UnitPage, QuizPage, LabPartPage,
│   │                                  ListeningHub, ListeningExercisePage, PyqPage
│   ├── components/                  ← Layout, QuizWidget, ReadingPractice, ShareButton,
│   │                                  Breadcrumb, UnitCard
│   ├── hooks/                       ← useSwipeNavigation, usePageMeta
│   ├── lib/                         ← content.js (loads content), generatePdf.js
│   └── index.css                    ← colors, fonts, spacing (the theme)
├── index.html
├── vercel.json                      ← page-reload rewrite, PYQ CORS header, function time limit
└── package.json
```

`vercel.json` has a catch-all rewrite so that reloading any page works. Do not delete it.

---

## Running it locally

Needs Node.js 22 or newer.

```
npm install
npm run dev       # development server
npm run lint      # code checks
npm run build     # production build, must finish with "built" and no errors
npm run preview   # serve the production build
```

The AI marking function only runs on Vercel (or with the Vercel CLI), not under `npm run dev`. On the plain dev server the reading page will show a "could not reach the marking service" message.

---

## Before you merge a change

1. Run `npm run build` and confirm there are no errors.
2. If you added a page, unit, part or exercise, add its address to `public/sitemap.xml`.
3. Open the Vercel preview and check the changed page on a phone.
4. Copy and paste code, never retype it. Curly quotes (‘ ’ “ ”) instead of straight quotes (' ") break the build.

---

## If something breaks

- **A page shows "not found" after adding content:** check the file path and folder name. Names are case-sensitive and addresses are lowercase.
- **A quiz does not appear:** check the `mcqs.json` file for a missing comma or bracket.
- **Reloading a page gives a Vercel 404:** make sure `vercel.json` is at the project root.
- **Vercel build fails with "Invalid character":** a curly quote got into a code file. Replace it with a straight quote.
- **Reading practice says "No marks this time":** open the page with `?debug=1` and read the reasons. The usual causes are missing or mistyped keys in Vercel, a deployment made before the keys were added, or a retired model name.
- **A new feature shows a stray character at the top of every page:** text accidentally typed inside `<head>` in `index.html` is moved into the page by the browser. Look for a lone character there.

---

## Status

All eight units (four Theory, four Lab) are live. Content is expanded and refined unit by unit. Planned ideas: remembering the last page visited in each section for swipe navigation, and more reading passages.

---

Built by [Mr. Dev Kumar](https://dev-portfolio-3000.vercel.app/), faculty in English and Computer Applications, KMS College of IT & Management, Dasuya.
