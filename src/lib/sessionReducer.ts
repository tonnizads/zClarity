// Session Reducer for zClarity v0
// Pure reducer - no side effects, no localStorage calls

import {
  Session,
  Topic,
  Outcome,
  ExpectedOutputType,
  OutcomeType,
  createNewSession,
  createNewTopic,
} from './types'

// ======================
// State Shape
// ======================

export interface AppState {
  sessions: Session[]
  activeSessionId: string | null
}

export const initialState: AppState = {
  sessions: [],
  activeSessionId: null,
}

// ======================
// Action Types
// ======================

export type AppAction =
  | { type: 'INIT_FROM_STORAGE'; payload: { sessions: Session[]; activeSessionId: string | null } }
  | { type: 'NEW_SESSION' }
  | { type: 'SELECT_SESSION'; payload: { sessionId: string } }
  | { type: 'DELETE_SESSION'; payload: { sessionId: string } }
  | { type: 'UPDATE_INTENT'; payload: { objective?: string; expectedOutputType?: ExpectedOutputType; title?: string } }
  | { type: 'ADD_TOPIC' }
  | { type: 'UPDATE_TOPIC'; payload: { topicId: string; title?: string; notes?: string } }
  | { type: 'REMOVE_TOPIC'; payload: { topicId: string } }
  | { type: 'ADD_OPEN_QUESTION'; payload: { topicId: string; question: string } }
  | { type: 'REMOVE_OPEN_QUESTION'; payload: { topicId: string; index: number } }
  | { type: 'UPDATE_OUTCOME'; payload: Partial<Outcome> & { type?: OutcomeType } }
  | { type: 'CLEAR_OUTCOME' }
  | { type: 'UPDATE_CLOSING_SUMMARY'; payload: { summary: string } }
  | { type: 'START_SESSION' }
  | { type: 'MARK_PENDING' }
  | { type: 'CLOSE_SESSION' }
  | { type: 'REOPEN_SESSION' }

// ======================
// Validation Helpers
// ======================

/**
 * Check if an Outcome has all required fields filled
 */
export function isOutcomeComplete(outcome: Outcome | null): boolean {
  if (!outcome) return false
  return (
    outcome.type !== undefined &&
    outcome.summary.trim() !== '' &&
    outcome.owner.trim() !== '' &&
    outcome.nextStep.trim() !== ''
  )
}

/**
 * Check if a session can be closed
 * Requires: outcome complete + closing summary filled
 */
export function canClose(session: Session): boolean {
  return (
    isOutcomeComplete(session.outcome) &&
    session.closingSummary.trim() !== ''
  )
}

/**
 * Check if a session can be started (Draft -> Active)
 * Requires: objective not empty
 */
export function canStart(session: Session): boolean {
  return session.objective.trim() !== ''
}

/**
 * Check if a session can be marked as pending
 * Requires: outcome complete
 */
export function canMarkPending(session: Session): boolean {
  return isOutcomeComplete(session.outcome)
}

// ======================
// Helper: Update Active Session
// ======================

function updateActiveSession(
  state: AppState,
  updater: (session: Session) => Session
): AppState {
  if (!state.activeSessionId) return state

  const now = new Date().toISOString()
  const sessions = state.sessions.map((s) => {
    if (s.id === state.activeSessionId) {
      const updated = updater(s)
      return { ...updated, updatedAt: now }
    }
    return s
  })

  return { ...state, sessions }
}

function getActiveSession(state: AppState): Session | undefined {
  return state.sessions.find((s) => s.id === state.activeSessionId)
}

// ======================
// Reducer
// ======================

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    // Initialize from localStorage
    case 'INIT_FROM_STORAGE': {
      return {
        sessions: action.payload.sessions,
        activeSessionId: action.payload.activeSessionId,
      }
    }

    // Create a new session and make it active
    case 'NEW_SESSION': {
      const newSession = createNewSession()
      return {
        sessions: [...state.sessions, newSession],
        activeSessionId: newSession.id,
      }
    }

    // Select an existing session
    case 'SELECT_SESSION': {
      const exists = state.sessions.some((s) => s.id === action.payload.sessionId)
      if (!exists) return state
      return {
        ...state,
        activeSessionId: action.payload.sessionId,
      }
    }

    // Delete a session
    case 'DELETE_SESSION': {
      const newSessions = state.sessions.filter((s) => s.id !== action.payload.sessionId)
      
      // Determine new active session ID
      let newActiveId: string | null
      if (state.activeSessionId !== action.payload.sessionId) {
        // Deleted session was NOT active - keep current active
        newActiveId = state.activeSessionId
      } else if (newSessions.length > 0) {
        // Deleted session WAS active and other sessions remain
        // Select the most recently created session
        const sorted = [...newSessions].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        newActiveId = sorted[0].id
      } else {
        // No sessions remain
        newActiveId = null
      }

      return {
        sessions: newSessions,
        activeSessionId: newActiveId,
      }
    }

    // Update intent fields (objective, expectedOutputType, title)
    case 'UPDATE_INTENT': {
      return updateActiveSession(state, (session) => ({
        ...session,
        ...(action.payload.objective !== undefined && { objective: action.payload.objective }),
        ...(action.payload.expectedOutputType !== undefined && { expectedOutputType: action.payload.expectedOutputType }),
        ...(action.payload.title !== undefined && { title: action.payload.title }),
      }))
    }

    // Add a new topic
    case 'ADD_TOPIC': {
      return updateActiveSession(state, (session) => ({
        ...session,
        topics: [...session.topics, createNewTopic()],
      }))
    }

    // Update a topic
    case 'UPDATE_TOPIC': {
      return updateActiveSession(state, (session) => ({
        ...session,
        topics: session.topics.map((t) =>
          t.id === action.payload.topicId
            ? {
                ...t,
                ...(action.payload.title !== undefined && { title: action.payload.title }),
                ...(action.payload.notes !== undefined && { notes: action.payload.notes }),
              }
            : t
        ),
      }))
    }

    // Remove a topic
    case 'REMOVE_TOPIC': {
      return updateActiveSession(state, (session) => ({
        ...session,
        topics: session.topics.filter((t) => t.id !== action.payload.topicId),
      }))
    }

    // Add an open question to a topic
    case 'ADD_OPEN_QUESTION': {
      if (!action.payload.question.trim()) return state
      return updateActiveSession(state, (session) => ({
        ...session,
        topics: session.topics.map((t) =>
          t.id === action.payload.topicId
            ? { ...t, openQuestions: [...t.openQuestions, action.payload.question] }
            : t
        ),
      }))
    }

    // Remove an open question from a topic
    case 'REMOVE_OPEN_QUESTION': {
      return updateActiveSession(state, (session) => ({
        ...session,
        topics: session.topics.map((t) =>
          t.id === action.payload.topicId
            ? {
                ...t,
                openQuestions: t.openQuestions.filter((_, i) => i !== action.payload.index),
              }
            : t
        ),
      }))
    }

    // Update outcome fields
    case 'UPDATE_OUTCOME': {
      return updateActiveSession(state, (session) => {
        const currentOutcome = session.outcome || {
          type: 'Decision' as OutcomeType,
          summary: '',
          owner: '',
          nextStep: '',
        }
        const newOutcome: Outcome = {
          ...currentOutcome,
          ...action.payload,
        }
        
        // Determine new state based on outcome completeness
        const outcomeComplete = isOutcomeComplete(newOutcome)
        let newState = session.state

        if (outcomeComplete) {
          // Outcome is complete - transition to OutcomeDefined if allowed
          // Only from Active or Pending (not from Draft or Closed)
          if (session.state === 'Active' || session.state === 'Pending') {
            newState = 'OutcomeDefined'
          }
        } else {
          // Outcome is incomplete - revert from OutcomeDefined to Active
          if (session.state === 'OutcomeDefined') {
            newState = 'Active'
          }
          // Other states (Draft, Active, Pending, Closed) remain unchanged
        }

        return {
          ...session,
          outcome: newOutcome,
          state: newState,
        }
      })
    }

    // Clear outcome
    case 'CLEAR_OUTCOME': {
      return updateActiveSession(state, (session) => ({
        ...session,
        outcome: null,
        state: session.state === 'OutcomeDefined' ? 'Active' : session.state,
      }))
    }

    // Update closing summary
    case 'UPDATE_CLOSING_SUMMARY': {
      return updateActiveSession(state, (session) => ({
        ...session,
        closingSummary: action.payload.summary,
      }))
    }

    // Start session: Draft -> Active (requires objective)
    case 'START_SESSION': {
      const activeSession = getActiveSession(state)
      if (!activeSession || activeSession.state !== 'Draft') return state
      if (!canStart(activeSession)) return state

      return updateActiveSession(state, (session) => ({
        ...session,
        state: 'Active',
      }))
    }

    // Mark as pending: OutcomeDefined -> Pending (requires outcome complete)
    case 'MARK_PENDING': {
      const activeSession = getActiveSession(state)
      if (!activeSession || activeSession.state !== 'OutcomeDefined') return state
      if (!canMarkPending(activeSession)) return state

      return updateActiveSession(state, (session) => ({
        ...session,
        state: 'Pending',
      }))
    }

    // Close session: OutcomeDefined -> Closed (requires outcome + closing summary)
    case 'CLOSE_SESSION': {
      const activeSession = getActiveSession(state)
      if (!activeSession || activeSession.state !== 'OutcomeDefined') return state
      if (!canClose(activeSession)) return state

      return updateActiveSession(state, (session) => ({
        ...session,
        state: 'Closed',
      }))
    }

    // Reopen session: Pending -> Active
    case 'REOPEN_SESSION': {
      const activeSession = getActiveSession(state)
      if (!activeSession || activeSession.state !== 'Pending') return state

      return updateActiveSession(state, (session) => ({
        ...session,
        state: 'Active',
      }))
    }

    default:
      return state
  }
}
