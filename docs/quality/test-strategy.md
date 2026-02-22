

# 🧪 Test Strategy – zClarity

## 🎯 Purpose

เอกสารนี้กำหนดแนวทางการทดสอบของ zClarity
เพื่อให้สอดคล้องกับ Evaluation Model (docs/vision/eval-model.md)

เป้าหมายหลัก:

> ป้องกัน Regression ของ Business Logic และ State Machine
> โดยไม่สร้างภาระ Maintenance เกินจำเป็น

---

# 1️⃣ Quality Scope

สิ่งที่ zClarity ต้องปกป้องเป็นพิเศษ:

- State Machine Transition (Draft → Active → OutcomeDefined → Closed / Pending)
- Business Rules Validation
- Outcome Completeness Logic
- Delete / Reopen Flow
- Persistence (localStorage)

ไม่เน้น:

- Pixel-perfect UI
- Animation perfection
- Styling snapshot

---

# 2️⃣ Test Pyramid (zClarity Edition)

## 🟢 Layer 1 – Reducer Unit Tests (Core)

Scope:
- sessionReducer.ts
- Validation helpers (canStart, canClose, isOutcomeComplete)

เป้าหมาย:
- ป้องกัน illegal state
- ตรวจสอบ transition logic
- ตรวจสอบ revert logic

Coverage Target:
- เฉพาะ Business Rules สำคัญ
- ไม่ไล่ 100% coverage

---

## 🟡 Layer 2 – UI Integration Tests

Scope:
- Form interactions
- State change reflected in UI

ตัวอย่าง:
- Start button disabled เมื่อ objective ว่าง
- Close button disabled เมื่อ outcome ไม่ครบ
- Delete confirm dialog ทำงานถูกต้อง

ไม่ทดสอบ animation detail

---

## 🔵 Layer 3 – Minimal E2E Smoke

Happy Path:
1. Create Session
2. Set Objective
3. Start
4. Add Topic
5. Define Outcome
6. Close

Critical Flow:
- Delete Session with Confirm
- Reload แล้ว state ไม่หาย

จำนวน test ต้องน้อย แต่เชื่อถือได้

---

# 3️⃣ Acceptance Criteria Dimension

ทุก Feature ใหม่ ต้องประเมินผ่าน 4 มิติ:

1. Functional Correctness
2. State Consistency
3. Regression Risk
4. Cognitive Load Impact

Feature ที่ผ่าน 1 แต่ทำให้ 4 แย่ลง = ต้องทบทวน

---

# 4️⃣ Definition of Done (Testing)

Feature ถือว่า Done เมื่อ:

- Reducer logic มี unit test รองรับ (ถ้าเกี่ยวข้องกับ state)
- ไม่มี illegal transition ใหม่
- CI ผ่านทั้งหมด
- Manual smoke test ผ่าน 1 รอบ

---

# 5️⃣ Automation Tools (Planned)

- Unit: Vitest
- Integration: Testing Library
- E2E: Playwright (minimal set)
- CI: GitHub Actions

หลักคิด:

> Automation ต้องช่วยลดความเสี่ยง
> ไม่ใช่เพิ่มภาระ maintenance

---

# 6️⃣ Metrics & Evaluation Alignment

Test Strategy นี้สอดคล้องกับ Evaluation Model ดังนี้:

- Reducer tests = Benchmark Core
- CI Pass Rate = Metric
- Illegal transition = Red condition
- Pending without owner = Yellow condition

Testing ไม่ใช่แค่ verification
แต่เป็นส่วนหนึ่งของ Evaluation Framework

---

# 📌 สรุป

zClarity จะไม่ทดสอบทุกอย่าง
แต่จะปกป้องสิ่งที่สำคัญที่สุด:

- Decision Logic
- State Machine
- Regression Core

และทุก test ต้องตอบคำถามนี้:

> Test นี้ปกป้อง Clarity จริงหรือไม่?