# PTU English Prep

Supplementary study site for AECC English — Theory (BTHU103/18) and Lab (BTHU104/18) — built for my students so nobody's left behind if they miss a class or want to revise before an MST.

Live site: https://ptu-english.vercel.app

---

## How this site works (in plain terms)

- The site has two "tracks": **Theory** and **Lab**, each with 4 units.
- Content lives in plain files under `src/content/`. No admin panel, no database, no login — edit a file on GitHub, push it, and Vercel rebuilds the live site automatically within a minute.
- A unit only shows as "Available" once its files exist AND its status is flipped in `syllabus.js` — until then it shows "Coming soon," so students always see the full syllabus roadmap even for units not written yet.
- **You never need to touch `.jsx` code files just to add content.** Content and code are kept separate on purpose.

There are two different **unit layouts**, depending on the unit:

1. **Simple units** (e.g. Theory units) — one page of notes, plus a separate quiz page.
2. **Parts-based units** (e.g. Lab Unit 1 and Unit 2) — a short intro, then several "Part" cards (like Listening, Self-Introduction, Interviews), each with its own page. Use this layout whenever a unit naturally splits into distinct chunks of practice rather than one continuous read.

---

## Adding a Simple unit (notes + quiz)

1. Create `src/content/<track>/<unitId>/notes.md` — the reading material, in Markdown.
2. Create `src/content/<track>/<unitId>/mcqs.json` — the quiz (see format below).
3. In `src/content/syllabus.js`, find the unit's entry and change `status: 'soon'` to `status: 'available'`.

That's it — the unit page, quiz page, and breadcrumbs are all generic and just pick up these files automatically.

---

## Adding a Parts-based unit (like Lab Unit 1 / Unit 2)

Use this when a unit has several distinct chunks (e.g. "Listening," "Interviews," "Group Discussion") rather than one long read.

1. Create `src/content/<track>/<unitId>/notes.md` — just the short unit **intro**, shown above the part cards.
2. Create `src/content/<track>/<unitId>/parts.js`:
   ```js
   export const unitParts = [
     { id: 'part-slug', number: 1, title: 'Part Title', type: 'notes', blurb: 'One-line description' },
   ]
   ```
   - `id` must match a filename in the `parts/` folder (see below).
   - `type: 'notes'` renders a normal content page. `type: 'listening'` is a special case (see next section) that links to a listening-exercises hub instead.
3. Create `src/content/<track>/<unitId>/parts/<part-id>.md` for each part — the actual content for that part.
4. Flip `status: 'available'` in `syllabus.js` as usual.

---

## Adding a Listening Exercises part (video + inline quiz)

This is the richest content type — used for Lab Unit 1's "Listening Comprehension" part. Each exercise is a video with a quiz appearing directly below it on the same page (no separate quiz page).

1. In the unit's `parts.js`, add an entry with `type: 'listening'`:
   ```js
   { id: 'listening', number: 1, title: 'Listening Comprehension', type: 'listening', blurb: '...' }
   ```
2. Create `src/content/<track>/<unitId>/listening.js` — the list of exercises:
   ```js
   export const listeningExercises = [
     { id: 'exercise-slug', title: 'Listening Exercise 1: The Story Title' },
   ]
   ```
3. For each exercise, create two files in `src/content/<track>/<unitId>/listening/`:
   - `<exercise-id>.md` — the video embed (see "Adding a video" below)
   - `<exercise-id>-mcqs.json` — the quiz for that exercise (same format as a normal `mcqs.json`)

If `<exercise-id>-mcqs.json` is an empty array (`[]`), the page shows "Quiz for this exercise is being added soon" instead of a quiz — safe to scaffold the video first and add questions later.

---

## Adding a quiz — `mcqs.json` format

Used for unit-level quizzes and listening-exercise quizzes alike:

```json
[
  {
    "question": "Your question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "One or two lines on why this is the right answer."
  }
]
```

- `"correctAnswer"` is the **position** of the correct option, counting from 0 (0 = first option, 1 = second, etc.)
- Separate each question block with a comma. The whole file is a list: starts with `[`, ends with `]`.
- **Common mistake:** a missing comma between questions, or a trailing comma after the last one, breaks the whole file. If a quiz stops appearing after an edit, check commas first.
- The quiz UI (question-by-question, instant feedback, retry, and **PDF download of results**) is fully automatic once this file has content — no other setup needed.

---

## Adding a video (or any embed)

Works in any `.md` file — unit notes, part notes, or listening exercise content.

```html
<div class="video-embed">
<iframe src="https://www.youtube.com/embed/VIDEO_ID" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>
```

Notes:
- Get the embed code from YouTube's Share → Embed option (or similar), then **strip out** any fixed `width="560" height="315"` attributes — the `video-embed` wrapper makes it responsive automatically.
- Leave a blank line before and after the `<div>` block in the Markdown file.
- This works because raw HTML is explicitly allowed in notes (`rehype-raw`) — only add embed code you trust, since it renders as real HTML.

---

## Adding a diagram or static image

1. Add the image file to `public/diagrams/` (SVG preferred — sharp at any size, loads instantly).
2. Reference it in a `.md` file:
   ```
   ![Description of the image](/diagrams/my-diagram.svg)
   ```
   The leading `/` matters — it means "from the site root."

---

## Project structure, quickly

```
ptu-english-prep-src/
├── src/
│   ├── content/
│   │   ├── syllabus.js              ← master list of all units + their status
│   │   ├── theory/unit1/
│   │   │   ├── notes.md
│   │   │   └── mcqs.json
│   │   ├── lab/unit1/               ← a "parts-based" unit, for reference
│   │   │   ├── notes.md             ← short intro only
│   │   │   ├── parts.js             ← the 4 part cards
│   │   │   ├── parts/               ← self-introduction.md, group-discussion.md, etc.
│   │   │   ├── listening.js         ← list of listening exercises
│   │   │   └── listening/           ← <id>.md (video) + <id>-mcqs.json (quiz) pairs
│   ├── pages/                       ← page code — shouldn't need to touch for content
│   ├── components/
│   │   ├── QuizWidget.jsx           ← the reusable quiz engine (question UI + PDF export)
│   │   ├── Breadcrumb.jsx           ← path shown at the top of every page
│   │   └── Layout.jsx, UnitCard.jsx
│   ├── lib/
│   │   ├── content.js               ← loads all the content files automatically
│   │   └── generatePdf.js           ← builds the quiz-result PDF
│   └── index.css                    ← colors, fonts, spacing (the "theme")
├── public/diagrams/                 ← images/SVGs referenced in notes
├── vercel.json                      ← makes page-reload work correctly, don't delete
└── package.json
```

---

## Other things set up on this site

- **Vercel Analytics** — enabled, tracks page views automatically (`<Analytics />` in `App.jsx`). Check under the Analytics tab on vercel.com.
- **PDF export** — every quiz (unit-level and listening-exercise-level) has a "Download as PDF" button on the results screen, powered by `src/lib/generatePdf.js`. If this ever needs changing, edit that one file — both quiz types share it.
- **Breadcrumbs** — every page below the homepage shows a path like `Home / Lab / Unit 1 / Listening / Exercise 1`, both for orientation and quick navigation back up a level.

---

## If something breaks

- **A page 404s after adding content:** almost always a typo in the file path or folder name. Names are case-sensitive.
- **The quiz doesn't show up:** check the relevant `mcqs.json` for a missing comma or bracket.
- **Reloading a page shows a Vercel 404:** make sure `vercel.json` still exists at the project root.
- **A big paste/replace doesn't seem to have worked:** before assuming the code is wrong, open the file and paste its actual current content back to check — a partial paste that didn't fully save is the most common real cause of a "did everything you said, still broken" situation.
- **Before pushing anything structural:** always run `npm run build` locally first and confirm `✓ built` with no errors. Catches most problems before they reach Vercel.

---

## Roadmap

- [x] Theory Unit 1 — Introduction (notes + quiz)
- [x] Lab Unit 1 — Listening & Self-Introduction, Group Discussion, Conversations (notes + 3 listening exercises with quizzes)
- [x] Lab Unit 2 — Workplace Communication (Dialogues + Interviews, with video)
- [ ] Theory Unit 2 — Language of Communication
- [ ] Theory Unit 3 — Reading and Understanding
- [ ] Theory Unit 4 — Writing Skills
- [ ] Lab Unit 3 — Formal Speaking
- [ ] Lab Unit 4 — Effective Communication
READMEEOF
echo done