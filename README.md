# Study Compass V2

Study Compass V2 is a privacy-first Korean middle-school self-directed-learning classroom web app. It is a static React/Vite/TypeScript app: no backend, login, analytics, tracking, database, or runtime external AI call.

The app helps students answer 16 short questions, understand their current learning-strategy pattern across five axes, and copy a locally generated prompt for a later AI-chatbot activity without silently sending student data anywhere.

## 한국어 안내

Study Compass V2는 한국 중학생의 자기주도학습 수업에서 사용할 수 있도록 만든 정적 웹앱입니다. 학생 응답, 닉네임, 메모, 결과, 생성된 프롬프트는 기본적으로 브라우저 안에만 남고 서버로 전송되지 않습니다.

수업에서 사용할 때는 학생에게 결과가 현재 응답 기반의 학습 코칭 정보이며, 심리검사·성적·고정된 유형이 아니라고 안내해 주세요.

## Project overview

- **Live app:** <https://heechaeyoon.github.io/study-compass-v2/>
- **Audience:** Korean middle-school self-directed-learning classes
- **Stack:** React, Vite, TypeScript, plain CSS, Vitest, Playwright
- **Data model:** local-only browser state; no backend, analytics, tracking, or runtime AI API call
- **Deployment:** GitHub Pages with repository-subpath support
- **Quality gates:** typecheck, lint, unit tests, E2E tests, visual fixtures, production build, and npm audit
- **Maintenance:** issues, PR template, security policy, contribution guide, releases, and branch protection

## Classroom goals

Many classroom AI tools require accounts, server-side data collection, analytics, or direct AI API calls. Study Compass V2 demonstrates a different pattern: a static, local-only classroom app that helps students prepare safer AI prompts without transmitting their answers by default.

The goal is to keep the classroom workflow understandable, inspectable, and easy to adapt without adding a student-data pipeline.

- **Keep student data local:** answers, nickname, memo, result, and generated prompt remain in the browser.
- **Make the learning logic inspectable:** questions, scoring, profile matching, limitations, and research basis are documented.
- **Run from a simple static link:** the app works on GitHub Pages and supports repository subpaths.
- **Keep changes easy to check:** unit tests, E2E tests, visual fixtures, viewport checks, and deployment workflow are included.
- **Leave room for teacher adaptation:** educators can study or adapt the approach for local-only AI-literacy classroom activities.

This is not a psychological test, grade, rank, or fixed personality label. Results are described as current-response coaching information.

## Features

- Access gate for classroom sessions with local-only verification.
- 16-question self-directed-learning strategy questionnaire.
- Five-axis result summary with custom SVG radar chart.
- Detailed student-facing report with strengths, balance, and growth point language.
- Four AI prompt modes for study planning, concept learning, and image-prompt use.
- Explicit local save/delete flow; no automatic result persistence.
- Clipboard fallback and image export fallback.
- Responsive support for wide classroom screens and 360px+ phone portrait screens.
- Local fonts and generated assets; no runtime Google Fonts request.

## Run locally

```bash
npm install
npm run dev
```

The app is designed primarily for wide classroom screens. Phone landscape viewports from 560px wide use a compact landscape mode; phone portrait viewports from 360px wide use an adaptive one-column mode; smaller viewports show guidance.

## Verification

```bash
npm run typecheck
npm run lint
npm run test
npm run logic:distribution
npm run test:e2e
npm run test:visual
MASTER_CODE=replace-with-private-master-code npm run build
```

`test:e2e` and `test:visual` use Chromium. `test:e2e:webkit` is available for environments with WebKit system dependencies installed.

## Fixture screens

Fixture routes are available only in dev or fixture-enabled builds:

- `/?fixture=access`
- `/?fixture=start`
- `/?fixture=question`
- `/?fixture=result`
- `/?fixture=prompt`

## Data policy

Student answers, nickname, memo, result, and generated prompt stay in the browser. A result is written to `localStorage` only when the student explicitly saves it, and delete removes the saved result and memo from this app's storage key.

The app does not call an AI API. When students copy a generated prompt into another AI tool, they make that transfer themselves and are warned not to include sensitive personal information.

## Research basis

The questionnaire and coaching-profile logic are summarized in [`docs/RESEARCH_BASIS.md`](docs/RESEARCH_BASIS.md).

## Deployment

The Vite base is `./`, so the production build works on GitHub Pages repository subpaths such as:

```text
https://heechaeyoon.github.io/study-compass-v2/
```

Deployment is handled by `.github/workflows/deploy-pages.yml`.

1. In GitHub, open `Settings > Pages`.
2. Set `Build and deployment > Source` to `GitHub Actions`.
3. Add repository secret `MASTER_CODE` for the hidden classroom-admin modal.
4. Optionally add repository variable `ACCESS_CODE_REVISION`; change it before redeploying to invalidate previous classroom codes.
5. Push to `main`, or run the `Deploy Pages` workflow manually from the `Actions` tab.

The workflow uses Node 24, installs from `package-lock.json` with `npm ci`, runs typecheck, lint, unit tests, Chromium E2E tests, visual tests, and then uploads `dist/` to GitHub Pages.

## Contributing and maintenance

- See [`CONTRIBUTING.md`](CONTRIBUTING.md) for contribution rules and local verification.
- See [`SECURITY.md`](SECURITY.md) for responsible disclosure and student-data handling.
- See [`docs/PILOT_FEEDBACK_TEMPLATE.md`](docs/PILOT_FEEDBACK_TEMPLATE.md) for non-identifying educator pilot feedback.

## How the project is maintained

The repository is maintained with:

- typed domain logic for scoring, result generation, prompt generation, storage, clipboard, and export behavior
- Vitest unit tests for scoring, matching, prompt generation, storage, access-code logic, and deployment config
- Playwright Chromium E2E tests for the core classroom flow, access gate, copy fallback, save/delete, responsive layouts, and image export
- Playwright visual fixture captures at the canonical classroom viewport and supported compact viewports
- GitHub Actions for typecheck, lint, unit tests, E2E tests, visual tests, production build, and Pages deployment
- issue and PR templates, a security policy, a contribution guide, and release notes

Useful maintainer work includes issue triage, PR review, privacy/security regression checks, visual-diff investigation, accessibility review, synthetic test generation, and release-note drafting. Real student data must never be sent to external tools.

## License

The source code is licensed under the [MIT License](LICENSE). The deployed classroom copy currently includes Daisy ownership text to discourage casual redistribution of a specific classroom link. Forks should replace classroom-specific branding and ownership text in [`src/data/ownership.ts`](src/data/ownership.ts); that single source feeds the visible ownership mark, screen watermark, result image footer, and copied detailed-report footer.
