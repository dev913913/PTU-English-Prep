# PTU English Prep

Supplementary study site for AECC English — Theory (BTHU103/18) and Lab (BTHU104/18) — built for my students so nobody's left behind if they miss a class or want to revise before an MST.

Live site: https://ptu-english.vercel.app

---

## How this site works (in plain terms)

- The site has two "tracks": **Theory** and **Lab**, each with 4 units.
- Each unit has two parts: **Notes** (what students read) and an **MCQ Quiz** (what tests them).
- All content lives in plain files under `src/content/`. There's no admin panel, no database, no login — you edit a file on GitHub, push it, and the live site updates itself automatically within a minute (Vercel rebuilds on every push to `main`).
- A unit only shows up as "Available" on the site once you've added its files AND flipped its status in one config file (`syllabus.js`) — until then it shows as "Coming soon," so students always see the full syllabus roadmap even for units not written yet.

**You never need to touch any code (`.jsx` files) just to add content.** Content and code are separate on purpose.

---

## Adding or editing a unit's notes

1. Go to: `src/content/<track>/<unitId>/notes.md`
   - `<track>` is either `theory` or `lab`
   - `<unitId>` is `unit1`, `unit2`, `unit3`, or `unit4`
   - Example: `src/content/theory/unit2/notes.md`
2. If the file doesn't exist yet, create it (GitHub lets you "Add file" → "Create new file" and type the path directly, it'll make the folders for you).
3. Write the notes in **Markdown**:
   - `## Heading` for a big heading
   - `### Subheading` for a smaller one
   - `**bold text**` for bold
   - `- item` for a bullet list
   - `1. item` for a numbered list
   - `---` on its own line for a divider
   - Leave a blank line between paragraphs
4. To add a diagram/image, see the "Adding a diagram" section below.
5. Commit the change (write a short message like "Add Unit 2 theory notes") and push.

---

## Adding or editing a unit's quiz

1. Go to: `src/content/<track>/<unitId>/mcqs.json`
2. Each question follows this exact shape — copy one block and edit it:

```json
{
  "question": "Your question text here?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0,
  "explanation": "One or two lines on why this is the right answer."
}
```

- `"correctAnswer"` is the **position** of the correct option, counting from 0. So `0` = first option, `1` = second, `2` = third, `3` = fourth.
- Separate each question block with a comma. The whole file is a list, so it starts with `[` and ends with `]`.
- **Common mistake:** a missing comma between questions, or a trailing comma after the last one, will break the whole file. If the quiz stops showing up after an edit, this is almost always why — check your commas carefully, or ask me to double-check the file.

---

## Making a unit go live

Once a unit's `notes.md` (and ideally `mcqs.json`) are ready:

1. Open `src/content/syllabus.js`
2. Find that unit's entry (under `theoryUnits` or `labUnits`)
3. Change `status: 'soon'` to `status: 'available'`
4. Push — the unit now shows as "Available" on the site and becomes clickable.

Leave it as `'soon'` while you're still writing it — that way half-finished notes never go live by accident.

---

## Adding a diagram or image

Images work best as SVGs (they stay sharp on any screen and load instantly), but any image works.

1. Add your image file to `public/diagrams/` (e.g. `public/diagrams/my-diagram.svg` or `.png`)
2. In the relevant `notes.md`, reference it like this:

```
![Description of the image](/diagrams/my-diagram.svg)
```

The leading `/` matters — it means "starting from the site root," not "starting from this notes file."

---

## Project structure, quickly

```
ptu-english-prep-src/
├── src/
│   ├── content/
│   │   ├── syllabus.js          ← the master list of all units + their status
│   │   ├── theory/
│   │   │   ├── unit1/
│   │   │   │   ├── notes.md     ← what students read
│   │   │   │   └── mcqs.json    ← the quiz
│   │   │   ├── unit2/  ...
│   │   ├── lab/
│   │   │   ├── unit1/  ...
│   ├── pages/                   ← the actual page code (don't need to touch this for content)
│   ├── components/              ← reusable UI pieces (don't need to touch this for content)
│   └── index.css                ← colors, fonts, spacing (the "theme")
├── public/
│   └── diagrams/                ← images/SVGs referenced in notes
├── vercel.json                  ← makes page-reload work correctly, don't delete
└── package.json
```

---

## If something breaks

- **A page 404s after adding content:** almost always a typo in the file path or folder name. Folder and file names are case-sensitive — `Unit1` and `unit1` are different.
- **The quiz doesn't show up:** check `mcqs.json` for a missing comma or bracket (see note above).
- **Reloading a page shows a Vercel 404:** make sure `vercel.json` still exists at the project root — this file tells Vercel to let React Router handle all page routes.
- **Still stuck:** paste me the exact error or screenshot and I'll pinpoint the fix — no need to re-explain the whole project each time, just say what you're trying to do and what went wrong.

---

## Roadmap (update as units get added)

- [x] Theory Unit 1 — Introduction (notes + quiz)
- [x] Lab Unit 1 — Listening & Self-Introduction (notes + quiz)
- [ ] Theory Unit 2 — Language of Communication
- [ ] Theory Unit 3 — Reading and Understanding
- [ ] Theory Unit 4 — Writing Skills
- [ ] Lab Unit 2 — Workplace Communication
- [ ] Lab Unit 3 — Formal Speaking
- [ ] Lab Unit 4 — Effective Communication