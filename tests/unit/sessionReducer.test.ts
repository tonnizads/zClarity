/**
 * Level 1 - Reducer Unit Tests (Core Protection)
 * 
 * ตาม Test Ladder:
 * - ปกป้อง State Machine
 * - ปกป้อง Transition Rules
 * - ปกป้อง Validation Logic
 * 
 * AAA Style: Arrange → Act → Assert
 */

import { describe, it, expect } from 'vitest'
import {
  appReducer,
  initialState,
  AppState,
  canStart,
  canClose,
  isOutcomeComplete,
} from '../../src/lib/sessionReducer'
import { createNewSession } from '../../src/lib/types'

// ======================
// Helper: Create test state with a session
// ======================
function createStateWithSession(sessionOverrides: Partial<ReturnType<typeof createNewSession>> = {}): AppState {
  const session = {
    ...createNewSession(),
    ...sessionOverrides,
  }
  return {
    sessions: [session],
    activeSessionId: session.id,
  }
}

// ======================
// State Machine Tests
// ======================
describe('Session Reducer - State Machine Rules', () => {
  
  // -------------------------------------------
  // Rule 1: Draft → Active requires objective
  // -------------------------------------------
  describe('Draft → Active transition', () => {
    
    it('should NOT start session without objective (stays Draft)', () => {
      // Arrange: Draft session with empty objective
      const state = createStateWithSession({
        state: 'Draft',
        objective: '',
      })

      // Act: dispatch START_SESSION
      const newState = appReducer(state, { type: 'START_SESSION' })

      // Assert: state remains Draft
      const activeSession = newState.sessions.find(s => s.id === newState.activeSessionId)
      expect(activeSession).toBeTruthy()
      expect(activeSession!.state).toBe('Draft')
    })

    it('should start session with objective (becomes Active)', () => {
      // Arrange: Draft session with objective
      const state = createStateWithSession({
        state: 'Draft',
        objective: 'ตัดสินใจเรื่อง Feature X',
      })

      // Act: dispatch START_SESSION
      const newState = appReducer(state, { type: 'START_SESSION' })

      // Assert: state becomes Active
      const activeSession = newState.sessions.find(s => s.id === newState.activeSessionId)
      expect(activeSession).toBeTruthy()
      expect(activeSession!.state).toBe('Active')
    })

    it('should NOT start session if already Active', () => {
      // Arrange: Active session
      const state = createStateWithSession({
        state: 'Active',
        objective: 'Some objective',
      })

      // Act: dispatch START_SESSION
      const newState = appReducer(state, { type: 'START_SESSION' })

      // Assert: state remains Active (no change)
      const activeSession = newState.sessions.find(s => s.id === newState.activeSessionId)
      expect(activeSession).toBeTruthy()
      expect(activeSession!.state).toBe('Active')
    })
  })

  // -------------------------------------------
  // Rule 2: Close requires complete outcome + closing summary
  // -------------------------------------------
  describe('Close Session transition', () => {

    it('should NOT close session with incomplete outcome', () => {
      // Arrange: OutcomeDefined session but outcome missing fields
      const state = createStateWithSession({
        state: 'OutcomeDefined',
        objective: 'Test objective',
        outcome: {
          type: 'Decision',
          summary: '',  // Missing!
          owner: '',    // Missing!
          nextStep: '', // Missing!
        },
        closingSummary: 'Summary provided',
      })

      // Act: dispatch CLOSE_SESSION
      const newState = appReducer(state, { type: 'CLOSE_SESSION' })

      // Assert: state stays OutcomeDefined (not Closed)
      const activeSession = newState.sessions.find(s => s.id === newState.activeSessionId)
      expect(activeSession).toBeTruthy()
      expect(activeSession!.state).toBe('OutcomeDefined')
    })

    it('should NOT close session without closing summary', () => {
      // Arrange: OutcomeDefined with complete outcome but no closing summary
      const state = createStateWithSession({
        state: 'OutcomeDefined',
        objective: 'Test objective',
        outcome: {
          type: 'Decision',
          summary: 'We decided X',
          owner: 'John',
          nextStep: 'Implement X',
        },
        closingSummary: '', // Missing!
      })

      // Act: dispatch CLOSE_SESSION
      const newState = appReducer(state, { type: 'CLOSE_SESSION' })

      // Assert: state stays OutcomeDefined (not Closed)
      const activeSession = newState.sessions.find(s => s.id === newState.activeSessionId)
      expect(activeSession).toBeTruthy()
      expect(activeSession!.state).toBe('OutcomeDefined')
    })

    it('should close session with complete outcome AND closing summary', () => {
      // Arrange: OutcomeDefined with everything complete
      const state = createStateWithSession({
        state: 'OutcomeDefined',
        objective: 'Test objective',
        outcome: {
          type: 'Decision',
          summary: 'We decided X',
          owner: 'John',
          nextStep: 'Implement X',
        },
        closingSummary: 'Session concluded successfully',
      })

      // Act: dispatch CLOSE_SESSION
      const newState = appReducer(state, { type: 'CLOSE_SESSION' })

      // Assert: state becomes Closed
      const activeSession = newState.sessions.find(s => s.id === newState.activeSessionId)
      expect(activeSession).toBeTruthy()
      expect(activeSession!.state).toBe('Closed')
    })
  })

  // -------------------------------------------
  // Rule 3: Delete session
  // -------------------------------------------
  describe('Delete Session', () => {

    it('should remove session from state', () => {
      // Arrange: state with one session
      const state = createStateWithSession({
        state: 'Draft',
        objective: '',
      })
      const sessionId = state.sessions[0].id

      // Act: dispatch DELETE_SESSION
      const newState = appReducer(state, { 
        type: 'DELETE_SESSION', 
        payload: { sessionId } 
      })

      // Assert: session is removed
      expect(newState.sessions.length).toBe(0)
      expect(newState.activeSessionId).toBeNull()
    })

    it('should not change state when deleting non-existent session', () => {
      // Arrange
      const state = createStateWithSession({ state: 'Draft' })

      // Act: delete with wrong ID
      const newState = appReducer(state, {
        type: 'DELETE_SESSION',
        payload: { sessionId: 'non-existent-id' },
      })

      // Assert: state unchanged
      expect(newState.sessions.length).toBe(1)
    })
  })

  // -------------------------------------------
  // Rule 4: New Session creates Draft
  // -------------------------------------------
  describe('New Session', () => {

    it('should create a new Draft session', () => {
      // Arrange: empty state
      const state = initialState

      // Act: dispatch NEW_SESSION
      const newState = appReducer(state, { type: 'NEW_SESSION' })

      // Assert: new session created in Draft state
      expect(newState.sessions.length).toBe(1)
      expect(newState.sessions[0].state).toBe('Draft')
      expect(newState.activeSessionId).toBe(newState.sessions[0].id)
    })
  })
})

// ======================
// Validation Helper Tests
// ======================
describe('Validation Helpers', () => {

  describe('canStart', () => {
    it('should return false when objective is empty', () => {
      const session = { ...createNewSession(), objective: '' }
      expect(canStart(session)).toBe(false)
    })

    it('should return false when objective is whitespace only', () => {
      const session = { ...createNewSession(), objective: '   ' }
      expect(canStart(session)).toBe(false)
    })

    it('should return true when objective has content', () => {
      const session = { ...createNewSession(), objective: 'Valid objective' }
      expect(canStart(session)).toBe(true)
    })
  })

  describe('isOutcomeComplete', () => {
    it('should return false when outcome is null', () => {
      expect(isOutcomeComplete(null)).toBe(false)
    })

    it('should return false when summary is empty', () => {
      const outcome = { type: 'Decision' as const, summary: '', owner: 'John', nextStep: 'Do X' }
      expect(isOutcomeComplete(outcome)).toBe(false)
    })

    it('should return false when owner is empty', () => {
      const outcome = { type: 'Decision' as const, summary: 'Summary', owner: '', nextStep: 'Do X' }
      expect(isOutcomeComplete(outcome)).toBe(false)
    })

    it('should return false when nextStep is empty', () => {
      const outcome = { type: 'Decision' as const, summary: 'Summary', owner: 'John', nextStep: '' }
      expect(isOutcomeComplete(outcome)).toBe(false)
    })

    it('should return true when all required fields are filled', () => {
      const outcome = { type: 'Decision' as const, summary: 'Summary', owner: 'John', nextStep: 'Do X' }
      expect(isOutcomeComplete(outcome)).toBe(true)
    })
  })

  describe('canClose', () => {
    it('should return false when not in OutcomeDefined state', () => {
      const session = {
        ...createNewSession(),
        state: 'Active' as const,
        outcome: { type: 'Decision' as const, summary: 'S', owner: 'O', nextStep: 'N' },
        closingSummary: 'Done',
      }
      expect(canClose(session)).toBe(false)
    })

    it('should return true when OutcomeDefined + complete outcome + closing summary', () => {
      const session = {
        ...createNewSession(),
        state: 'OutcomeDefined' as const,
        outcome: { type: 'Decision' as const, summary: 'S', owner: 'O', nextStep: 'N' },
        closingSummary: 'Done',
      }
      expect(canClose(session)).toBe(true)
    })
  })
})
