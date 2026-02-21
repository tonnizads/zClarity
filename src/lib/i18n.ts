// i18n - Simple dictionary-based internationalization for zClarity
// Thai is default. English can be switched manually.

export type Locale = 'th' | 'en'

export const messages = {
  th: {
    // TopBar
    newSession: 'สร้างเซสชันใหม่',
    noSession: 'ไม่มีเซสชัน',
    
    // Session States
    stateDraft: 'แบบร่าง',
    stateActive: 'กำลังดำเนินการ',
    stateOutcomeDefined: 'กำหนดผลลัพธ์แล้ว',
    statePending: 'รอดำเนินการ',
    stateClosed: 'ปิดแล้ว',
    
    // HistoryPanel
    sessionHistory: 'ประวัติเซสชัน',
    noSessions: 'ยังไม่มีเซสชัน',
    untitledSession: 'เซสชันไม่มีชื่อ',
    deleteSession: 'ลบเซสชัน',
    
    // WorkingCanvas - Intent
    intent: 'เจตนา / Intent',
    sessionTitle: 'ชื่อเซสชัน (ไม่บังคับ) / Session Title (optional)',
    sessionTitlePlaceholder: 'ตั้งชื่อเซสชันนี้',
    objective: 'วัตถุประสงค์ / Objective',
    objectivePlaceholder: 'การประชุมนี้ต้องการบรรลุอะไร?',
    expectedOutput: 'ประเภทผลลัพธ์ที่คาดหวัง / Expected Output Type',
    startSession: 'เริ่มเซสชัน',
    
    // Objective Helper
    objectiveGuide1: 'วันนี้เป้าหมายคือจะตัดสินใจเรื่องไหนให้จบ?',
    objectiveGuide2: 'เซสชันนี้เราต้องได้ผลลัพธ์อะไร?',
    insertTemplate: 'แทรกเทมเพลต Objective',
    objectiveTemplate: 'ตัดสินใจเรื่อง: ____\nผลลัพธ์ที่ต้องได้: ____',
    
    // Expected Output Type Options
    outputDecision: 'การตัดสินใจ / Decision',
    outputClarification: 'การชี้แจง / Clarification',
    outputFeasibility: 'ความเป็นไปได้ / Feasibility',
    outputRiskMap: 'แผนที่ความเสี่ยง / Risk Map',

    // Outcome Type Options
    outcomeDecision: 'การตัดสินใจ',
    outcomeNextStep: 'ขั้นตอนถัดไป',
    outcomePending: 'รอดำเนินการ',
    
    // WorkingCanvas - Discussion
    discussion: 'การสนทนา / Discussion',
    addTopic: 'เพิ่มหัวข้อ',
    topicPlaceholder: 'ชื่อหัวข้อ',
    removeTopic: 'ลบหัวข้อ',
    
    // WorkingCanvas - Outcome
    outcome: 'ผลลัพธ์ / Outcome',
    outcomeType: 'ประเภทผลลัพธ์',
    outcomeSummary: 'สรุปผลลัพธ์',
    outcomeSummaryPlaceholder: 'ผลลัพธ์จากการประชุมคืออะไร?',
    owner: 'ผู้รับผิดชอบ',
    ownerPlaceholder: 'ใครรับผิดชอบ?',
    nextStep: 'ขั้นตอนถัดไป',
    nextStepPlaceholder: 'ต้องทำอะไรต่อ?',
    dueDate: 'กำหนดส่ง',
    markPending: 'รอดำเนินการ',
    closeSession: 'ปิดเซสชัน',
    closingSummary: 'สรุปก่อนปิด',
    closingSummaryPlaceholder: 'สรุปสิ่งที่ตัดสินใจและขั้นตอนถัดไป',
    sessionClosed: 'เซสชันปิดแล้ว',
    noSessionSelected: 'ไม่มีเซสชันที่เลือก',
    clickNewSession: 'คลิก "สร้างเซสชันใหม่" เพื่อเริ่มต้น',
    
    // Delete Confirmation Modal
    confirmDeleteTitle: 'ยืนยันการลบเซสชัน',
    confirmDeleteDescription: 'คุณกำลังจะลบเซสชันนี้ออกจากประวัติ การลบจะไม่สามารถกู้คืนได้',
    cancel: 'ยกเลิก',
    confirmDelete: 'ลบเซสชัน',
  },
  en: {
    // TopBar
    newSession: 'New Session',
    noSession: 'No session',
    
    // Session States
    stateDraft: 'Draft',
    stateActive: 'Active',
    stateOutcomeDefined: 'Outcome Defined',
    statePending: 'Pending',
    stateClosed: 'Closed',
    
    // HistoryPanel
    sessionHistory: 'Session History',
    noSessions: 'No sessions yet',
    untitledSession: 'Untitled Session',
    deleteSession: 'Delete session',
    
    // WorkingCanvas - Intent
    intent: 'Intent',
    sessionTitle: 'Session Title (optional)',
    sessionTitlePlaceholder: 'Give this session a name',
    objective: 'Objective',
    objectivePlaceholder: 'What should this meeting achieve?',
    expectedOutput: 'Expected Output Type',
    startSession: 'Start Session',
    
    // Objective Helper
    objectiveGuide1: 'What decision must we finalize today?',
    objectiveGuide2: 'What output must this session produce?',
    insertTemplate: 'Insert Objective Template',
    objectiveTemplate: 'Finalize decision on: ____\nRequired output: ____',
    
    // Expected Output Type Options
    outputDecision: 'Decision',
    outputClarification: 'Clarification',
    outputFeasibility: 'Feasibility',
    outputRiskMap: 'Risk Map',
    
    // Outcome Type Options
    outcomeDecision: 'Decision',
    outcomeNextStep: 'Next Step',
    outcomePending: 'Pending',
    
    // WorkingCanvas - Discussion
    discussion: 'Discussion',
    addTopic: 'Add Topic',
    topicPlaceholder: 'Topic title',
    removeTopic: 'Remove topic',
    
    // WorkingCanvas - Outcome
    outcome: 'Outcome',
    outcomeType: 'Outcome Type',
    outcomeSummary: 'Outcome Summary',
    outcomeSummaryPlaceholder: 'What was decided or concluded?',
    owner: 'Owner',
    ownerPlaceholder: 'Who is responsible?',
    nextStep: 'Next Step',
    nextStepPlaceholder: 'What needs to be done next?',
    dueDate: 'Due Date',
    markPending: 'Mark Pending',
    closeSession: 'Close Session',
    closingSummary: 'Closing Summary',
    closingSummaryPlaceholder: 'Summarize decisions and next steps',
    sessionClosed: 'Session Closed',
    noSessionSelected: 'No session selected',
    clickNewSession: 'Click "New Session" to start',
    
    // Delete Confirmation Modal
    confirmDeleteTitle: 'Confirm delete session',
    confirmDeleteDescription: 'You are about to delete this session from history. This action cannot be undone.',
    cancel: 'Cancel',
    confirmDelete: 'Delete session',
  },
}
