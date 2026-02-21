// Session State Types
export type SessionState = 'Draft' | 'Active' | 'OutcomeDefined' | 'Pending' | 'Closed'

// Expected Output Types
export type ExpectedOutputType = 'Decision' | 'Clarification' | 'Feasibility' | 'RiskMap'

// Outcome Types
export type OutcomeType = 'Decision' | 'NextStep' | 'Pending'

// Topic Interface
export interface Topic {
  id: string
  title: string
  notes: string
  openQuestions: string[]
}

// Outcome Interface
export interface Outcome {
  type: OutcomeType
  summary: string
  owner: string
  nextStep: string
  dueDate?: string
  impactArea?: string
}

// Session Interface
export interface Session {
  id: string
  title: string
  objective: string
  expectedOutputType: ExpectedOutputType
  state: SessionState
  topics: Topic[]
  outcome: Outcome | null
  closingSummary: string
  createdAt: string
  updatedAt: string
}

// ======================
// Factory Functions
// ======================

/**
 * Generate a unique ID using crypto.randomUUID() with fallback
 */
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback for environments without crypto.randomUUID
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

/**
 * Create a new empty Topic with default values
 */
export function createNewTopic(): Topic {
  return {
    id: generateId(),
    title: '',
    notes: '',
    openQuestions: [],
  }
}

/**
 * Create a new Session with default values matching wireframe spec
 */
export function createNewSession(): Session {
  const now = new Date().toISOString()
  return {
    id: generateId(),
    title: '',
    objective: '',
    expectedOutputType: 'Decision',
    state: 'Draft',
    topics: [],
    outcome: null,
    closingSummary: '',
    createdAt: now,
    updatedAt: now,
  }
}
