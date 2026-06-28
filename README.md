# Study Compass V2

Study Compass V2 is a privacy-first Korean middle-school self-directed-learning classroom web app. It is a static React/Vite/TypeScript app: no backend, login, analytics, tracking, database, or runtime external AI call.

The app helps students answer 16 short questions, understand their current learning-strategy pattern across five axes, and copy a locally generated prompt for a later AI-chatbot activity without silently sending student data anywhere.

## 한국어 설명

Study Compass V2는 한국 중학생의 자기주도학습 수업에서 사용할 수 있도록 만든 정적 웹앱입니다. 학생은 16개의 짧은 문항에 답하고, 현재 응답을 바탕으로 5가지 학습전략 축의 패턴과 강점·균형·성장 포인트를 확인할 수 있습니다.

이 앱은 학생 데이터를 서버로 보내지 않는 수업 도구를 목표로 합니다. 학생 응답, 닉네임, 메모, 결과, 생성된 프롬프트는 기본적으로 브라우저 안에만 남으며, 로그인·분석 도구·추적 코드·외부 AI API 호출을 사용하지 않습니다.

AI 활동은 앱 안에서 자동으로 실행되지 않습니다. 대신 학생이 자신의 학습 상황을 설명하는 프롬프트를 로컬에서 만들고, 필요한 경우 스스로 다른 AI 도구에 복사해 사용하는 방식입니다. 수업에서 사용할 때는 결과가 심리검사·성적·고정된 유형이 아니라 현재 응답 기반의 학습 코칭 정보라고 안내해 주세요.

## Project overview

- **Live app:** <https://heechaeyoon.github.io/study-compass-v2/>
- **Audience:** Korean middle-school self-directed-learning classes
- **Stack:** React, Vite, TypeScript, plain CSS, Vitest, Playwright
- **Data model:** local-only browser state; no backend, analytics, tracking, or runtime AI API call
- **Deployment:** GitHub Pages with repository-subpath support
- **Quality gates:** typecheck, lint, unit tests, E2E tests, visual fixtures, privacy/secret scan, production build, and npm audit
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
MASTER_CODE=replace-with-private-master-code ACCESS_CODE_REVISION=replace-to-revoke npm run build
MASTER_CODE=replace-with-private-master-code ACCESS_CODE_REVISION=replace-to-revoke npm run privacy:scan
```

`test:e2e` and `test:visual` use Chromium. Field classroom devices are currently expected to be Galaxy Tab / Android Chromium-class tablets, so WebKit/Safari is not a required acceptance gate for this maintenance scope. `test:e2e:webkit` remains available as an optional future compatibility check for environments with WebKit system dependencies installed.

If the default preview port is already in use, run the browser checks against an external preview:

```bash
MASTER_CODE=development-master-code ACCESS_CODE_REVISION=development-access-code-revision VITE_ENABLE_FIXTURES=true npm run build
npm run preview -- --host 127.0.0.1 --port 4174 --strictPort
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4174 npm run test:e2e
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4174 npm run test:visual
```

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
4. Add repository variable `ACCESS_CODE_REVISION`; change it before redeploying to invalidate previous classroom codes. Production builds fail when either value is missing.
5. Push to `main`, or run the `Deploy Pages` workflow manually from the `Actions` tab.

The workflow uses Node 24, installs from `package-lock.json` with `npm ci`, runs typecheck, lint, unit tests, Chromium E2E tests, visual tests, production build, and privacy/secret scan before uploading `dist/` to GitHub Pages.

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
- GitHub Actions for typecheck, lint, unit tests, E2E tests, visual tests, production build, privacy/secret scan, and Pages deployment
- issue and PR templates, a security policy, a contribution guide, and release notes

Useful maintainer work includes issue triage, PR review, privacy/security regression checks, visual-diff investigation, accessibility review, synthetic test generation, and release-note drafting. Real student data must never be sent to external tools.

## License

The source code is licensed under the [MIT License](LICENSE). The deployed classroom copy currently includes Daisy ownership text to discourage casual redistribution of a specific classroom link. Forks should replace classroom-specific branding and ownership text in [`src/data/ownership.ts`](src/data/ownership.ts); that single source feeds the visible ownership mark, screen watermark, and result image footer. Clipboard text payloads intentionally omit the ownership/copyright footer.
