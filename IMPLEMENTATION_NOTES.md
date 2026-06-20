# IMPLEMENTATION_NOTES

## Goal

Upgrade the AI prompt screen into a four-mode prompt generator:

- Study plan prompt
- Concept learning prompt
- Study plan infographic image prompt
- Concept infographic image prompt

All generated prompts must include the student's current-result context, optional study inputs, any written memo, and the full 16 question/answer context. The app must not call external AI, image generation APIs, analytics, tracking, or a backend.

## Skills Used

- `react-best-practices`: keep prompt generation as pure domain code outside React, hoist mode config, and derive preview text with `useMemo`.
- `frontend-testing-debugging`: Browser plugin is not available in this session, so rendered validation will use the existing Playwright workflow.

## Current State

- Git preflight: `git status --short --branch` returned `## main...origin/main`.
- Current prompt domain: `src/domain/prompt.ts` has a single study-plan prompt and a memo inclusion checkbox flag.
- Current storage schema: `schemaVersion: 1` stores `includeMemoInPrompt` and `promptInputs.includeMemo`.
- Current UI: `PromptScreen` shows a memo checkbox and one live prompt preview.

## Subtasks

- [x] Subtask 0: Preflight and notes started.
- [x] Subtask 1: Prompt domain and templates.
- [x] Subtask 2: State and storage cleanup.
- [x] Subtask 3: Prompt screen UI.
- [x] Subtask 4: Test suite update.
- [x] Subtask 5: Docs and reports.
- [x] Subtask 6: Rendered validation.

## Decisions

- Keep `buildAiPrompt(result, inputs)` as a compatibility wrapper for study-plan mode.
- Add `buildPrompt(result, inputs, mode)` as the canonical prompt builder.
- Treat any non-empty memo as intentionally included in generated prompts.
- Image-related features generate text prompts for Gemini/ChatGPT image generation; they do not generate images inside this app.
- Image prompt modes may include Q/A context for the AI model, but must instruct the model not to place raw answers or private information in the image.

## Validation Log

- Subtask 1: `npm run test -- tests/unit/prompt.test.ts` passed after updating the safety sentence to retain the old `고정된 성격이 아니라` wording while adding fixed-ability nuance.
- Subtask 2: `npm run test -- tests/unit/storage.test.ts` passed with v2 save/load and v1 migration coverage.
- Subtask 3: `npm run typecheck` and `npm run lint` passed after adding the prompt mode selector and removing the memo checkbox from app source.
- Subtask 4: `npm run test`, `npm run typecheck`, and `npm run lint` passed after unit, E2E, and visual test updates.
- Subtask 5: Product, content, technical, visual, QA, plan, and final-report docs were updated. `rg` scan shows old checkbox behavior only in historical implementation notes or v1 migration wording.
- Subtask 6: First `npm run build` failed because `tsc -b` treated `result.answers[question.id]` as possibly undefined. Fixed by allowing `formatAnswer` to handle undefined with the existing `응답 확인 필요` fallback.
- Subtask 6: First `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4174 npm run test:e2e` failed before app interaction because Chromium could not launch inside the sandbox (`sandbox_host_linux.cc`, operation not permitted). Retrying unsandboxed.
- Subtask 6: Unsandboxed `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4174 npm run test:e2e` first found a real layout regression: prompt utility buttons overflowed the 1280x800 surface after adding the mode selector. Fixed by compacting the prompt form CSS.
- Subtask 6: Final unsandboxed `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4174 npm run test:e2e` passed, 14 tests.
- Subtask 6: Unsandboxed `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4174 npm run test:visual` passed, 7 tests. Prompt visual metric: SSIM 0.3257, mismatch 0.1067.
- Subtask 6: Final no-fixture production `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run build` passed.

## Resume Point

Complete. Final follow-up is only review/commit/push if requested.
