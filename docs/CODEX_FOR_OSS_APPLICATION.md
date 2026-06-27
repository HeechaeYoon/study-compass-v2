# Codex for OSS Application Pack

This document captures the selection strategy and ready-to-paste form copy for the OpenAI Codex for OSS program.

## Current repo signals checked on 2026-06-27

- Repository: `https://github.com/HeechaeYoon/study-compass-v2`
- Visibility: public
- GitHub username inferred from remote: `HeechaeYoon`
- Git history author: `Heechae Yoon <HeechaeYoon@users.noreply.github.com>`
- Stars/forks/issues: 0 / 0 / 0 at the time of checking
- GitHub Pages URL responds: `https://heechaeyoon.github.io/study-compass-v2/`
- Latest Pages workflow status: passing after repository secret `MASTER_CODE` and variable `ACCESS_CODE_REVISION` were configured
- Repository metadata: description, website, and topics are configured; `playwright` topic was added after verification
- License/contributor/security docs: added locally in this application-readiness pass; commit and push before applying so GitHub can detect the license and display the OSS maintenance files

## Selection strategy

### Positioning

Do not pitch this as a high-star infrastructure dependency. The honest and stronger angle is:

1. A public-interest Korean education OSS project.
2. A privacy-first static app pattern for classrooms: no backend, login, analytics, tracking, database, or runtime AI call.
3. A concrete AI-literacy bridge: students copy a locally generated prompt into their chosen AI tool instead of silently sending student data to an API.
4. A well-maintained reference implementation: typed scoring, local storage safeguards, copy/export fallbacks, Playwright visual tests, E2E tests, GitHub Pages workflow, research-basis docs, and review logs.
5. A maintainer workflow where Codex directly reduces the work the program targets: issue triage, PR review, security/privacy review, release notes, test generation, and visual regression debugging.

### Weaknesses to disclose without over-apologizing

- Public adoption metrics are currently early: no stars, forks, releases, or package downloads.
- The project is an app, not a package ecosystem dependency.
- The previous GitHub Pages deployment blocker was resolved by configuring `MASTER_CODE`; future production builds still require this secret.

Frame these as early-stage OSS readiness, not popularity. Avoid claiming broad adoption until there is evidence.

### Before submitting

1. Commit and push the OSS-readiness files from this pass:
   - `LICENSE`
   - `CONTRIBUTING.md`
   - `SECURITY.md`
   - `CODE_OF_CONDUCT.md`
   - `.github/ISSUE_TEMPLATE/*`
   - `.github/PULL_REQUEST_TEMPLATE.md`
   - README/package metadata updates
2. Confirm GitHub repository settings remain set:
   - Description: `Privacy-first Korean self-directed-learning classroom web app built with React, Vite, and local-only data handling.`
   - Website: `https://heechaeyoon.github.io/study-compass-v2/`
   - Topics: `education`, `korean`, `self-directed-learning`, `privacy-first`, `react`, `vite`, `github-pages`, `playwright`
3. Confirm repository secret `MASTER_CODE` and optional variable `ACCESS_CODE_REVISION` are present, then rerun the Pages workflow if needed.
4. Create a `v0.1.0` GitHub release after the Pages workflow is green.
5. Open a few honest starter issues, for example:
   - `Run WebKit/Safari smoke test on a host with required system libraries`
   - `Collect educator pilot feedback with synthetic/non-identifying notes only`
   - `Make classroom ownership text configurable for forks`

## Form fields

### 성

`Yoon`  
확인 필요: 한국어 양식이라면 `윤`을 써도 됩니다.

### 이름

`Heechae`  
확인 필요: 한국어 양식이라면 `희채`를 써도 됩니다.

### 이메일

`[ChatGPT 계정 이메일 입력]`

### GitHub 사용자 이름

`HeechaeYoon`

### GitHub 리포지터리 URL

`https://github.com/HeechaeYoon/study-compass-v2`

### 담당 역할

권장 선택: `주 책임자`

설명 메모:

```text
기획, 제품 요구사항, React/Vite 구현, 점수·프롬프트 도메인 로직, 개인정보 보호 설계, Playwright/Vitest 검증, GitHub Pages 배포 워크플로와 문서화를 총괄하는 주 책임자입니다.
```

### 이 리포지터리가 프로그램에 적합하다고 생각하시는 이유는 무엇인가요? (500자 이하)

```text
Study Compass V2는 한국 중학생의 자기주도학습 수업을 위한 공개 정적 웹앱입니다. 서버·로그인·분석 없이 브라우저 안에서 16문항, 5축 점수, 리포트, AI 프롬프트를 처리해 학생 데이터가 외부로 나가지 않는 교육용 OSS 사례를 제공합니다. 현재 공개 초기라 stars/downloads는 작지만, 연구 근거 문서, 시각/기능/개인정보 테스트, GitHub Pages 배포 워크플로를 갖춘 재사용 가능한 교실 도구입니다.
```

### 어떤 항목에 관심이 있으신가요?

권장 선택:

- `Codex Security`
- `프로젝트에 사용할 API 크레딧`

### OpenAI 조직 ID

`[platform.openai.com/settings/organization/general 에서 org-... 값 입력]`

### 프로젝트에서 API 크레딧을 어떻게 사용할 계획인가요? (500자 이하)

```text
API 크레딧은 학생 응답 처리나 앱 런타임 AI 호출에는 쓰지 않고, 메인테이너 업무에만 사용하겠습니다. Codex로 PR 리뷰, 이슈 triage, 접근성·개인정보 회귀 테스트 생성, Playwright/visual diff 실패 분석, 릴리스 노트·문서 갱신을 자동화합니다. 테스트 데이터는 합성 fixture만 사용하며 실제 학생 정보는 전송하지 않습니다.
```

### 더 알려주고 싶으신 내용이 있나요? (500자 이하)

```text
이 프로젝트는 AI 챗봇을 학생에게 직접 호출하지 않고, 학생이 자신의 상황을 설명하는 프롬프트를 로컬에서 만들도록 돕는 안전한 AI 리터러시 도구입니다. 선정되면 Codex 사용 내역과 개선 사례를 문서화해 한국어 교육용 privacy-first 정적 앱의 유지관리 사례로 공개하겠습니다.
```

## Character-count check

The three limited Korean answers above are each under 500 characters. Recheck after editing names, metrics, or adoption evidence.
