# Unit 3 Theory Handoff

## Branch

The Unit 3 work is being developed on:

```text
unit-3-theory
```

Do not merge this branch into `main` until the content has been reviewed.

## Goal

Unit 3 prepares students for the reading and understanding tasks that repeatedly appear in PTU English previous-year questions:

- Close reading and comprehension
- Summary writing
- Paraphrasing
- Analysis and interpretation

## Unit structure

Unit 3 uses the existing parts-based layout. The unit introduction appears first, followed by four separate part cards:

1. **Close Reading and Comprehension**
2. **Summary Writing**
3. **Paraphrasing**
4. **Analysis and Interpretation**

Every part contains explanatory notes, a practice passage or task, written questions where useful, and an interactive MCQ quiz below the content.

## Files added

```text
src/content/theory/unit3/
  notes.md
  parts.js
  parts/
    close-reading-comprehension.md
    close-reading-comprehension-mcqs.json
    summary-writing.md
    summary-writing-mcqs.json
    paraphrasing.md
    paraphrasing-mcqs.json
    analysis-and-interpretation.md
    analysis-and-interpretation-mcqs.json
```

## Files changed

- `src/content/syllabus.js`
  - Changed Theory Unit 3 from `soon` to `available`.
- `src/lib/content.js`
  - Added automatic loading for `parts/*-mcqs.json`.
  - Added `getPartMcqs(track, unitId, partId)`.
- `src/pages/LabPartPage.jsx`
  - Loads the MCQs for each part.
  - Renders the existing `QuizWidget` below the Markdown content.

Although the page is named `LabPartPage.jsx`, it is the generic page used by both Lab and Theory parts. No new page component was needed.

## Quiz behavior

Each Unit 3 part currently has five MCQs. The existing `QuizWidget` provides:

- Immediate correct/incorrect feedback
- Explanations after selecting an answer
- Score at completion
- Retry button
- PDF result download
- Progress saved in the current browser tab

Quiz progress keys follow this pattern:

```text
quiz-progress:theory:unit3:part:<part-id>
```

## Practice content included

- Leadership comprehension passage based on a supplied PYQ
- Big-city passage with a four-sentence summary task
- Sustainable-living passage with a paraphrase model
- Heart of Asia passage with analysis and interpretation questions
- Guidance for literary and knowledge-based texts

## Preview

Run the development server from `ptu-english-prep-src`:

```bash
npm run dev -- --host 0.0.0.0
```

Open:

```text
http://localhost:5173/theory/unit3
```

## Validation

The production build was run successfully with:

```bash
npm run build
```

Vite still reports the existing large JavaScript chunk warning, but the build completes successfully.

## Possible next additions

- Add more supplied PYQ passages and their answer keys.
- Add separate translation and literary-text parts if Unit 3 content requires them.
- Add more MCQs for each passage.
- Review whether all model answers match the intended university marking scheme.
- Add a dedicated Unit 3 quiz only if a combined quiz is preferred in addition to the part-level quizzes.
