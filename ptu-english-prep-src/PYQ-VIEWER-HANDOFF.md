# PYQ Viewer Handoff

Date: 2026-08-22
Branch: `pyq-view-issue-fix`
Pull request: [#14](https://github.com/dev913913/PTU-English-Prep/pull/14)

## Problem

PYQ PDF previews behaved differently by device:

- Desktop showed a blank PDF viewer when the hosted Mozilla PDF.js page was used.
- Mobile browsers were unreliable when a PDF was loaded directly inside an iframe.

## Current behavior

The implementation is in `src/pages/PyqPage.jsx`:

- Desktop uses the browser's native PDF renderer for inline previews and new-tab links.
- Mobile uses the hosted Mozilla PDF.js viewer for inline previews and new-tab links.
- The mobile PDF.js URL points to the canonical production domain, `https://ptuenglish.vercel.app`, rather than `https://ptu-english.vercel.app`.
- The hyphenated domain redirects with a `307` response that does not include CORS headers. That redirect can block PDF.js even though the final PDF response allows CORS.
- The Download PDF link remains a direct download fallback on all devices.
- The viewport media-query listener updates the renderer after screen-size or orientation changes and is removed on unmount.

## Review fixes already applied

- Removed the unsupported `type="application/pdf"` attribute from the iframe. The browser determines the resource type from the server's `Content-Type` response header.
- Added JSDoc comments for the touched functions to satisfy the repository review check.
- Documented the device-specific behavior in `README.md`.

## Validation

The following checks passed after the review fixes:

- `npm run lint`
- `npm run build`
- `https://ptuenglish.vercel.app/pyq/english-jan-2026.pdf` returns `200`, `Content-Type: application/pdf`, and `Access-Control-Allow-Origin: *`.
- All four referenced PDFs are present and valid.

## Git history

- `d5cb7f8` Fix responsive PYQ PDF viewing
- `27bfb70` Address PYQ viewer review feedback

The latest commit is pushed to `origin/pyq-view-issue-fix`. Any future change to the viewer should preserve the canonical mobile PDF URL unless the Vercel redirect is changed to include the required CORS headers.
