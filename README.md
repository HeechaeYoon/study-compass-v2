# Study Compass V2

Korean middle-school self-directed-learning class web app. It is a static React/Vite app: no backend, login, analytics, tracking, database, or external AI call.

## Run Locally

```bash
npm install
npm run dev
```

The app is designed for wide classroom screens. Phone landscape viewports from 560px wide use a compact landscape mode; phone portrait and extremely narrow screens show guidance to rotate the device or use a wider display.

## Verification

```bash
npm run typecheck
npm run lint
npm run test
npm run test:e2e
npm run test:visual
npm run build
```

`test:e2e` and `test:visual` use Chromium. `test:e2e:webkit` is available for environments with WebKit system dependencies installed.

## Fixture Screens

Fixture routes are available only in dev or fixture-enabled builds:

- `/?fixture=start`
- `/?fixture=question`
- `/?fixture=result`
- `/?fixture=prompt`

## Data Policy

Student answers, nickname, memo, result, and generated prompt stay in the browser. A result is written to `localStorage` only when the student explicitly saves it, and delete removes the saved result and memo from this app's storage key.

## Deployment

The Vite base is `./`, so the production build works on GitHub Pages repository subpaths such as:

```text
https://heechaeyoon.github.io/study-compass-v2/
```

Deployment is handled by `.github/workflows/deploy-pages.yml`.

1. In GitHub, open `Settings > Pages`.
2. Set `Build and deployment > Source` to `GitHub Actions`.
3. Push to `main`, or run the `Deploy Pages` workflow manually from the `Actions` tab.

The workflow uses Node 24, installs from `package-lock.json` with `npm ci`, runs typecheck, lint, unit tests, Chromium E2E tests, visual tests, and then uploads `dist/` to GitHub Pages.
