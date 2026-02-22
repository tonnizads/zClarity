# zClarity (v0.1.3)

**Tagline:** From discussion to decision.

zClarity is a session-driven meeting clarity tool designed to reduce cognitive load and ensure that every meeting produces a defined outcome.

This project is built as a personal QA-focused system-thinking tool and portfolio project.

---

## 🚀 Purpose

Many meetings drift into discussion without clear decisions or defined outputs.

zClarity enforces:
- A required Objective
- Structured Discussion capture
- A defined Outcome before closing

Core Principle:

> Every meeting must produce a defined outcome.

---
## Documentation

- Vision & Philosophy → docs/vision/zClarity.md
- Evaluation Model → docs/vision/eval-model.md
- Wireframe → docs/design/wireframe.md
- Test Strategy → docs/quality/test-strategy.md
- Test Ladder → docs/quality/test-ladder.md

---

## 🧠 How It Works (v0)

State Machine:

Draft → Active → OutcomeDefined → (Pending | Closed)

Pending → Active (reopen)

Key Rules:
- Cannot start without Objective
- Cannot close without complete Outcome
- Cannot close without Closing Summary

---

## 🏗 Tech Stack (v0)

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- LocalStorage (no backend)

---

## 💾 Data Storage (Important)

- All data is stored in the browser using LocalStorage.
- No backend.
- No authentication.
- No data leaves your machine.

⚠️ Do NOT store sensitive or confidential meeting information.

If you need secure storage, use a private version or extend this project with a backend.

---

## 📦 Features

- Session-based meeting workflow (Draft → Active → Pending/Closed)
- Structured Intent / Discussion / Outcome sections
- State enforcement via reducer logic
- Auto-save with LocalStorage
- Session history panel (with delete + confirmation)
- Responsive layout (mobile drawer + FAB)
- Thai / English language switch (Thai default)

See docs/release/CHANGELOG.md for detailed version history.

---

## ✅ Testing

Run all tests:
```bash
npm test
```

Includes:
- Level 1: reducer unit tests (Vitest)
- Level 2: UI integration tests (RTL)

---

## 🔒 Security Notes

This repository:
- Contains no API keys
- Contains no backend
- Contains no authentication
- Stores no remote data

Before publishing as public, ensure:
- No .env files are committed
- No sensitive screenshots are included
- No internal company data exists in commits

---

## 📜 License

See LICENSE file for details.

---

## 🧩 Roadmap (Future Ideas)

- Lock Closed sessions (read-only mode)
- Export/Import JSON
- Backend persistence
- Team collaboration

---

Built as part of a structured thinking system by Adisorn Homthong.

Local-first clarity engine.