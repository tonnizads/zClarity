// LocalStorage utilities for zClarity v0
// Handles persistence of sessions and active session ID

import { Session } from './types'

// Storage Keys
const SESSIONS_KEY = 'zclarity:sessions'
const ACTIVE_ID_KEY = 'zclarity:activeSessionId'

// ======================
// Helper Functions
// ======================

/**
 * Check if localStorage is available (handles SSR and private browsing)
 */
function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined') return false
    const testKey = '__storage_test__'
    window.localStorage.setItem(testKey, testKey)
    window.localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

/**
 * Minimal shape guard for Session objects
 * Only checks that item is an object with a string id
 */
function isValidSessionShape(item: unknown): item is Session {
  return (
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    typeof (item as { id: unknown }).id === 'string'
  )
}

// ======================
// Session Functions
// ======================

/**
 * Load all sessions from localStorage
 * Returns empty array if missing, invalid, or localStorage unavailable
 * Performs minimal shape validation to filter out broken/legacy data
 */
export function loadSessions(): Session[] {
  if (!isLocalStorageAvailable()) return []

  try {
    const data = window.localStorage.getItem(SESSIONS_KEY)
    if (!data) return []

    const parsed = JSON.parse(data)
    
    // Validate that parsed data is an array
    if (!Array.isArray(parsed)) return []

    // Filter items with minimal shape validation
    // Only keep items that are objects with a string id
    return parsed.filter(isValidSessionShape)
  } catch {
    // JSON parse error or other issues - return empty array
    return []
  }
}

/**
 * Save all sessions to localStorage
 * Fails silently on errors (no console spam for autosave)
 */
export function saveSessions(sessions: Session[]): void {
  if (!isLocalStorageAvailable()) return

  try {
    const data = JSON.stringify(sessions)
    window.localStorage.setItem(SESSIONS_KEY, data)
  } catch {
    // Storage quota exceeded or other errors - fail silently
    // Dev-only logging if needed:
    // if (process.env.NODE_ENV === 'development') console.warn('Failed to save sessions')
  }
}

// ======================
// Active Session ID Functions
// ======================

/**
 * Load the active session ID from localStorage
 * Returns null if missing or localStorage unavailable
 */
export function loadActiveSessionId(): string | null {
  if (!isLocalStorageAvailable()) return null

  try {
    return window.localStorage.getItem(ACTIVE_ID_KEY)
  } catch {
    return null
  }
}

/**
 * Save the active session ID to localStorage
 * Pass null to clear the active session
 * Fails silently on errors (no console spam for autosave)
 */
export function saveActiveSessionId(id: string | null): void {
  if (!isLocalStorageAvailable()) return

  try {
    if (id === null) {
      window.localStorage.removeItem(ACTIVE_ID_KEY)
    } else {
      window.localStorage.setItem(ACTIVE_ID_KEY, id)
    }
  } catch {
    // Fail silently
    // Dev-only logging if needed:
    // if (process.env.NODE_ENV === 'development') console.warn('Failed to save active session ID')
  }
}

// ======================
// Session Manipulation Functions
// ======================

/**
 * Upsert a session into the sessions array
 * If session with same ID exists, replace it; otherwise append
 * Returns a new array (immutable)
 */
export function upsertSession(sessions: Session[], session: Session): Session[] {
  const index = sessions.findIndex((s) => s.id === session.id)

  if (index >= 0) {
    // Replace existing session
    const newSessions = [...sessions]
    newSessions[index] = session
    return newSessions
  } else {
    // Append new session
    return [...sessions, session]
  }
}

/**
 * Delete a session from the sessions array by ID
 * Returns a new array (immutable)
 */
export function deleteSession(sessions: Session[], sessionId: string): Session[] {
  return sessions.filter((s) => s.id !== sessionId)
}
