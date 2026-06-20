# Codex Setup and Operating Notes

## Required capabilities

The intended run uses:

- image input for the reference board
- `$imagegen`
- local browser or in-app browser
- Playwright
- subagents
- shell access
- write access within the repository

## Preflight commands

Run appropriate equivalents:

```bash
git status
node --version
npm --version
codex features list
```

Verify the design file:

```bash
file reference/design-board.png
```

After installing dependencies:

```bash
npm run dev
```

Open the local app and test fixture states.

## Instruction discovery

`AGENTS.md` belongs in the repository root. Detailed task-specific rules are intentionally split into `docs/` and linked from it.

Do not create a huge replacement `AGENTS.md` by copying all documents into it.

## Image generation

Invoke the skill explicitly in the working thread:

```text
$imagegen Generate the paper texture candidates specified in docs/ASSET_GENERATION.md.
```

Attach or reference `reference/design-board.png`.

Repeat for the pencil.

## Subagents

The main agent must explicitly spawn reviewers. They do not edit files during their first review pass.

Recommended roles:

- visual fidelity reviewer
- functional/privacy reviewer
- accessibility/performance reviewer

The main agent waits for all results and consolidates them.

## Browser iteration

The app should be run in a browser throughout development, not only after implementation.

Minimum checkpoints:

1. static start screen
2. all four fixture screens
3. functional questionnaire flow
4. final visual refinement
5. final build preview

## Approval and safety

Stay within the repository. Do not alter unrelated files or global machine configuration. Do not publish or push without explicit user authorization unless the environment's task explicitly asks for it.

## When to stop and ask

Ask only when:

- the reference image is missing or unreadable
- project write access is unavailable
- uncommitted work cannot be preserved safely
- `$imagegen` is required by the user but unavailable
- a platform limitation makes a must-have acceptance criterion impossible

Do not ask about routine choices already covered by `docs/DECISION_LOG.md`.
