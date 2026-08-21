# Unit 4 Theory Handoff

## Branch

Unit 4 is being developed on:

```text
unit-4-theory
```

The branch contains the previously prepared Unit 3 work and the new Unit 4 content. Do not merge it into `main` until it has been reviewed.

## Goal

Unit 4 prepares students for the PTU English writing formats listed in the syllabus:

- Documenting
- Report Writing
- Making Notes
- Letter Writing

## Unit structure

Unit 4 uses the existing parts-based layout. It contains four study pages:

1. **Documenting** — qualities of useful documents, formats, notices, and a cleanliness-drive practice task.
2. **Report Writing** — report structure, objective style, and a market-research report task based on a supplied PYQ.
3. **Making Notes** — headings, subheadings, keywords, abbreviations, and a social-media practice passage with model notes.
4. **Letter Writing** — formal and informal formats plus environment and road-accident letter tasks from supplied PYQs.

Each part has notes or a model outline followed by five interactive MCQs.

## Files added

```text
src/content/theory/unit4/
  notes.md
  parts.js
  parts/
    documenting.md
    documenting-mcqs.json
    report-writing.md
    report-writing-mcqs.json
    making-notes.md
    making-notes-mcqs.json
    letter-writing.md
    letter-writing-mcqs.json
```

## Configuration

- `src/content/syllabus.js` now marks Theory Unit 4 as `available`.
- The existing parts loader automatically discovers the Unit 4 Markdown and JSON files.
- The existing generic `LabPartPage.jsx` renders both Theory and Lab parts and places each part's MCQ quiz below its content.

## Preview

Run the development server from `ptu-english-prep-src`:

```bash
npm run dev -- --host 0.0.0.0
```

Open:

```text
http://localhost:5173/theory/unit4
```

## Validation

The production build passes with:

```bash
npm run build
```

Vite reports the existing large JavaScript chunk warning, but the build completes successfully.

## Possible next additions

- Add more university PYQ writing prompts and model answers.
- Add minutes, memo, agenda, and application-writing examples under Documenting.
- Add report-writing exercises on social media and mental health.
- Add answer-length guidance for 10-mark and 15-mark questions.
- Review all model answers against the intended marking scheme.
