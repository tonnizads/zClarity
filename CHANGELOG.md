# Changelog

All notable changes to this project will be documented in this file.

This project follows a simplified semantic versioning approach.

---

## [0.1.1] - 2026-02-11

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

## [0.1.0] - 2026-02-11

### Added

- Core session state machine (Draft → Active → OutcomeDefined → Pending/Closed)
- Intent / Discussion / Outcome structured workflow
- LocalStorage persistence with auto-save
- Session history panel with session list
- Thai / English language switch (Thai default)
- Objective Template helper for quick setup
- State enforcement via reducer logic

---

## [0.0.0] - 2026-02-11

### Added

- Initial project setup (Next.js 14 + TypeScript + Tailwind CSS)
- Basic layout structure (TopBar, HistoryPanel, WorkingCanvas)
- Foundation for reducer-based state management
- Type definitions for Session and SessionState
