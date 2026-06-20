# Code Review Instructions

Use this file for the final Codex `/review` or reviewer subagent.

Review the current branch against the base branch and the product documents. Prioritize findings that can affect students, privacy, scoring, or visual fidelity.

---

## 1. Critical review areas

### A. Student-data privacy

Check for:

- fetch/XHR/WebSocket/beacon use
- external analytics or monitoring
- student data in URLs
- student data in logs
- runtime third-party font or image requests
- implicit auto-save
- inability to fully delete stored memo/result

Any student-data transmission is critical.

### B. Scoring correctness

Check:

- 16 question definitions
- 12 Likert + 4 scenario
- question IDs unique
- valid mappings
- automatic axis min/max
- normalization and clamping
- label thresholds
- special type rules
- distance matching
- secondary type threshold
- deterministic growth-axis logic

Incorrect scoring or an always-dominant type is high or critical depending on scope.

### C. Result language

Search for:

- permanent type claims
- deficit or superiority language
- personality-test wording
- ranking or comparison
- visual/auditory/kinesthetic classification

Any fixed or stigmatizing student wording is high severity.

### D. Visual fidelity

Compare live screens with `reference/design-board.png` and `docs/VISUAL_SPEC.md`.

Flag:

- generic template UI
- wrong layout proportions
- missing paper texture
- wrong color family
- oversized radii
- inconsistent fonts
- missing doodles
- chart-library default styling
- notebook/pencil mismatch
- mobile-first one-column layout replacing wide composition

### E. Accessibility

Check:

- answer cards use real radio semantics
- keyboard operation
- focus visibility
- input labels
- modal focus
- toast live region
- progress accessibility
- chart text alternative
- color-only indicators
- reduced motion

### F. Robustness

Check:

- localStorage exceptions
- clipboard exceptions
- image export exceptions
- invalid saved data
- stale schema
- empty optional input
- browser refresh
- unsupported width

---

## 2. Review severity

### Critical

- student data transmitted
- app cannot complete diagnosis
- scoring produces invalid/out-of-range output
- build/deploy broken
- destructive delete without confirmation
- stored student data cannot be deleted

### High

- wrong type logic for common cases
- major visual mismatch on core screen
- inaccessible questionnaire by keyboard
- clipboard has no usable fallback
- saved result crashes app
- fixed-personality wording

### Medium

- responsive issue at a supported width
- visual detail noticeably inconsistent
- weak error message
- missing lower-priority test
- minor contrast issue

### Low

- maintainability or polish issue with no current user impact

---

## 3. Review output format

Return only actionable findings, ordered by severity.

For each:

```text
[Severity] Short title
File: path:line
Evidence:
Impact:
Recommended fix:
```

Then include:

- tests reviewed
- tests run
- unresolved questions
- final recommendation: approve / request changes

Do not give a generic compliment section before findings.

---

## 4. Approval bar

Approve only if:

- no critical/high finding
- visual gates passed
- tests passed
- privacy verified
- docs and final report accurate
