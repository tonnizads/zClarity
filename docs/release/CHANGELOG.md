# Changelog

All notable changes to this project will be documented in this file.

This project follows a simplified semantic versioning approach.

---

## [0.1.9] - 2026-02-22

### Changed

- CI: Always upload Playwright HTML report in Phase 2 (pass/fail)
- CI: Added manual trigger (workflow_dispatch) for Phase 2 E2E

---

## [0.1.8] - 2026-02-22

### Added

- CI Phase 2 (Playwright E2E smoke) on push to main
- Daily scheduled E2E run at 09:00 (UTC+7)

---

## [0.1.7] - 2026-02-22

### Added

- GitHub Actions CI Phase 1 (PR gate): build + test:ci (Level 1–2)

---

## [0.1.6] - 2026-02-22

### Changed

- Restructured automated tests into Test Ladder folders (unit/integration/e2e)
- Added dedicated scripts for each test level (test:unit, test:integration, test:ci)

---

## [0.1.5] - 2026-02-22

### Changed

- Migrated package manager from npm to pnpm
- Added pnpm-lock.yaml for reproducible installs
- Updated docs to use pnpm commands

---

## [0.1.4] - 2026-02-22

### Added

- Playwright E2E smoke benchmark (production-like: build + start)
- Smoke coverage: Happy path close, Safe delete confirm, Persistence reload

---

## [0.1.3] - 2026-02-22

### Added

- Level 1 reducer unit tests (Vitest) for state machine + validation helpers
- Level 2 UI integration tests (React Testing Library) for Start + Delete confirmation flows

### Changed

- Added a11y-first aria-label hooks for stable test selectors (cross-language safe)
- Minimal Vitest setup for UI tests (jsdom + jest-dom matchers)

---

## [0.1.2] - 2026-02-21

### Added

- Sticky TopBar (visible session state while scrolling)

### Changed

- Improved delete dialog animation (fade + scale)
- Reordered Discussion layout (Open Questions before Notes)
- Minor UI animation polish

---

## [0.1.1] - 2026-02-21

### Added

- Responsive mobile layout (sidebar hidden on mobile, content full-width)
- Floating Action Button (FAB) for mobile session creation
- Smooth animated History drawer with CSS transitions
- Delete confirmation dialog with modal overlay

### Changed

- Refined TopBar layout for mobile (2-row stacking)
- Improved visual hierarchy with white cards and soft elevation
- Primary action styling consistency (green for create/success actions)
- Moved "New Session" button from TopBar to HistoryPanel

---

## [0.1.0] - 2026-02-21

### Added

- Core session state machine (Draft → Active → OutcomeDefined → Pending/Closed)
- Intent / Discussion / Outcome structured workflow
- LocalStorage persistence with auto-save
- Session history panel with session list
- Thai / English language switch (Thai default)
- Objective Template helper for quick setup
- State enforcement via reducer logic

---

## [0.0.0] - 2026-02-21

### Added

- Initial project setup (Next.js 14 + TypeScript + Tailwind CSS)
- Basic layout structure (TopBar, HistoryPanel, WorkingCanvas)
- Foundation for reducer-based state management
- Type definitions for Session and SessionState
