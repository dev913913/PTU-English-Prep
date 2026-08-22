# Unit 3 Theory Handoff

## Branch

The Unit 3 work is being developed on:

```text
unit-3-theory
```

Do not merge this branch into `main` until the content has been reviewed.

## Guidance for future AI work

When continuing Unit 3, work on `unit-3-theory` or a new branch created from it. Keep `main` unchanged until the work is reviewed and intentionally merged.

Preserve the repository's existing ecosystem:

- Add learning material under `src/content/` using Markdown, JSON, and the existing `parts.js` pattern.
- Reuse the existing `QuizWidget`, loaders, routes, and page components before creating new abstractions.
- Do not add dependencies, replace the quiz system, or change the framework for normal content additions.
- Keep the Unit 3 syllabus topics and available parts synchronized.
- Read the current files before editing because the branch may contain newer review fixes than this document describes.
- Run `npm run build` from `ptu-english-prep-src` after content or loader changes.

The existing part-level MCQ support was added specifically so quizzes can appear below each part's passage. It should be reused for future Unit 3 sections rather than duplicated.

## Goal

Unit 3 prepares students for the reading and understanding tasks that repeatedly appear in PTU English previous-year questions:

- Close reading and comprehension
- Summary writing
- Paraphrasing
- Analysis and interpretation
- Translation between Hindi/Punjabi and English

## Unit structure

Unit 3 uses the existing parts-based layout. The unit introduction appears first, followed by five separate part cards:

1. **Close Reading and Comprehension**
2. **Summary Writing**
3. **Paraphrasing**
4. **Analysis and Interpretation**
5. **Translation Practice**

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
    translation.md
    translation-mcqs.json
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

The four original reading parts currently have five MCQs each. Translation Practice has ten MCQs. The existing `QuizWidget` provides:

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
- Hindi/Punjabi to English and English to Hindi/Punjabi translation examples and practice
- Guidance for literary and knowledge-based texts

## Review fixes included

- Added Translation content so the available Unit 3 topics match the syllabus.
- Kept the Afghanistan explanation limited to the claim that development cannot be sustainable without peace.
- Kept the leadership assessment focused on aspiring to become a leader through determination and effort.
- Preserved the source's economic-resilience and finite-resource claims in the sustainable-living paraphrase.
- Ensured the analysis Markdown file ends with the required trailing newline.

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
- Add more translation passages and literary-text examples.
- Add more MCQs for each passage.
- Review whether all model answers match the intended university marking scheme.
- Add a dedicated Unit 3 quiz only if a combined quiz is preferred in addition to the part-level quizzes.
