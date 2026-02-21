1) Principle
	•	Core Principle: Every meeting must produce a defined outcome.
	•	Tagline: From discussion to decision.
	•	Primary Goal: ลด cognitive load ระหว่างประชุม + ทำให้รู้ว่าควรถามอะไร + รู้ว่าเรื่องที่คุย “จบหรือยัง”
	•	Non-Goal (v0): ยังไม่ทำ ClickUp API, multi-user collaboration, metrics dashboard

2) Interaction Model
	•	Session-driven: ผู้ใช้สร้าง “Session” หนึ่งอัน แล้วทำงานจน “Close”
	•	Outcome required before Close: ปิด session ไม่ได้ถ้ายังไม่มี Outcome ที่ defined

3) Session States

สถานะและความหมาย
	•	Draft: เตรียมก่อนประชุม (ใส่ objective/expected output)
	•	Active: กำลังประชุม (จด topics / open questions)
	•	Outcome Defined: ระบุ outcome แล้ว (decision / next step / pending)
	•	Closed: ปิด session (summary final ถูก lock)
	•	Pending: ยังไม่จบ แต่สถานะชัด (มี owner + next step แล้ว)

หมายเหตุ: v0 สามารถ implement เป็น “Active + OutcomeDefined + Closed” ก่อนก็ได้ แล้วค่อยเพิ่ม Draft/Pending

4) Data Structure (v0)

Session
	•	id
	•	title (optional)
	•	objective (required)
	•	expectedOutputType (enum: Decision | Clarification | Feasibility | RiskMap)
	•	state (enum: Draft | Active | OutcomeDefined | Pending | Closed)
	•	topics: Topic[]
	•	outcome: Outcome | null
	•	closingSummary (string | null)
	•	createdAt, updatedAt

Topic
	•	id
	•	title
	•	notes
	•	openQuestions: string[]

Outcome (Structured Object)
	•	type (enum: Decision | NextStep | Pending)
	•	summary (required)
	•	owner (required)
	•	nextStep (required)
	•	dueDate (optional)
	•	impactArea (optional)

5) UX Goals (Acceptance for v0)
	•	ผู้ใช้ ต้องกรอก Objective ก่อนเริ่ม Active (หรือก่อน Close อย่างน้อย)
	•	ปุ่ม Close Session ถูก disable จนกว่า Outcome จะครบ (type/summary/owner/nextStep)
	•	มีช่อง Closing Summary 1 ประโยค ก่อน Close
	•	UI ช่วย “ถามคำถามที่ควรถาม” ด้วย prompt text (ไม่ต้องเป็น AI)