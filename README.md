# Study Compass V2

Korean middle-school self-directed-learning class web app. It is a static React/Vite app: no backend, login, analytics, tracking, database, or external AI call.

## Run Locally

```bash
npm install
npm run dev
```

The app is designed for wide classroom screens. Under 900px width it shows guidance to switch to a landscape or wider display.

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

The Vite base is `./`, so the production build works on GitHub Pages repository subpaths. The included Pages workflow builds and uploads `dist/`.
