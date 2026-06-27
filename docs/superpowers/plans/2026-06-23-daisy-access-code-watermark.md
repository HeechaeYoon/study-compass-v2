# Daisy Copyright and Access Code Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add subtle Daisy ownership/watermark protection and a static-app classroom access-code system with a hidden admin generator.

**Architecture:** Keep the app client-only. Use build-time `MASTER_CODE` only for a derived admin verifier and `ACCESS_CODE_REVISION` for a separate classroom-code seed digest, never raw values. Admin and student access-code logic lives outside React; UI components only call typed domain/storage APIs.

**Tech Stack:** React, Vite, TypeScript, plain CSS, Vitest, Playwright, browser `crypto.subtle`.

---

## Files

- Create `src/domain/accessCode.ts`: normalize, generate, validate, verify master-code digest.
- Create `src/infrastructure/accessStorage.ts`: local/session access pass persistence.
- Create `src/components/DaisyOwnershipMark.tsx`: visible copyright mark plus hidden 7-click admin trigger.
- Create `src/screens/AccessGateScreen.tsx`: required student access-code entry screen.
- Create `src/screens/AdminAccessModal.tsx`: master-code prompt and day-based code generator.
- Modify `vite.config.ts`, `src/vite-env.d.ts`, `.gitignore`, `.env.example`.
- Modify `src/app/App.tsx`, `src/app/fixtures.ts`, `src/styles/global.css`.
- Modify `src/screens/ResultScreen.tsx`, `src/domain/result.ts` for exported/copied attribution.
- Add tests in `tests/unit/accessCode.test.ts`, `tests/unit/accessStorage.test.ts`, `tests/e2e/app.spec.ts`, `tests/visual/visual.spec.ts`.
- Update docs: `PRD.md`, `docs/TECHNICAL_SPEC.md`, `docs/QA_ACCEPTANCE.md`, `docs/DECISION_LOG.md`, `PLAN.md`, `FINAL_REPORT.md`, `docs/VISUAL_REVIEW_LOG.md`.

## Tasks

- [ ] Add `.env` ignores and tracked `.env.example` with `MASTER_CODE=replace-with-private-master-code` and `ACCESS_CODE_REVISION=1`.
- [ ] Update `vite.config.ts` to read unprefixed `MASTER_CODE`, compute `SHA-256("study-compass-v2:" + MASTER_CODE)`, inject `__ACCESS_VERIFIER_DIGEST__`, read `ACCESS_CODE_REVISION` as a separate code seed digest, and fail production builds when the master code is missing.
- [ ] Add `src/vite-env.d.ts` declarations for injected constants.
- [ ] Write failing unit tests for access-code behavior: uppercase normalization, invalid prefix, signature mismatch, valid 1-day/7-day code, expiry at local midnight after valid days, and day range `1-90`.
- [ ] Implement `src/domain/accessCode.ts` with 6-character uppercase classroom codes derived from issue date, validity days, and code seed digest.
- [ ] Write failing unit tests for access storage: valid pass loads, expired pass is ignored, malformed JSON is rejected, unavailable localStorage returns `"unavailable"`.
- [ ] Implement `src/infrastructure/accessStorage.ts` with key `srl-coach-access-v1`; store only schema version, access-code fingerprint, and expiry timestamp.
- [ ] Create `AccessGateScreen` with heading `수업 접속 코드`, code input, submit button, invalid/expired message, and privacy note that no answers are sent to a server.
- [ ] Create `AdminAccessModal` with password master-code input, day-count input default `7`, range `1-90`, generated code output, valid-until date, and copy/manual fallback.
- [ ] Create `DaisyOwnershipMark` using exact text: `© Daisy Teacher. All rights reserved. 무단 복제 및 재배포 금지`; trigger admin modal after 7 clicks/keyboard activations within 4 seconds.
- [ ] Wire `App.tsx`: load access pass on mount, render access gate before start when no valid pass, bypass only for fixture routes, keep master code out of React state after verification.
- [ ] Add subtle global watermark CSS: fixed bottom ownership mark, low-opacity surface watermark, no overlap with controls, responsive behavior for portrait and compact landscape.
- [ ] Add the same copyright text to result PNG export and copied detailed report footer. Do not append it to the AI prompt body.
- [ ] Add fixture support for `/?fixture=access` and include it in visual tests.
- [ ] Update E2E helper to unlock via admin modal, then run existing standard flow. Add tests for invalid code rejection, generated code acceptance, expired code rejection, localStorage failure session fallback, and no external network requests.
- [ ] Update visual tests to capture access gate and assert ownership mark/watermark does not overlap core content at `1280x800`, `390x844`, and compact landscape.
- [ ] Update docs and reports to state this is a static classroom deterrent, not backend-grade authorization.
- [ ] Run verification: `npm run typecheck`, `npm run lint`, `npm run test`, `npm run logic:distribution`, `npm run build`, `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4174 npm run test:e2e`, `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4174 npm run test:visual`.
- [ ] Before committing implementation, search `dist` and source for the raw `MASTER_CODE` and `ACCESS_CODE_REVISION` values and confirm they are absent.

## Assumptions

- Final copyright text is exactly: `© Daisy Teacher. All rights reserved. 무단 복제 및 재배포 금지`.
- Admin entry is hidden behind repeated activation of the copyright mark, not a visible URL.
- Access code is required before the start screen.
- Because this remains a static GitHub Pages app, this prevents casual access and sharing but is not strong server-side security.
- Current uncommitted repo changes must be preserved; implementation must inspect diffs before editing.
