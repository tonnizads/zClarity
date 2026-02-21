'use client'

import { useReducer, useEffect, useMemo } from 'react'
import TopBar from '@/components/TopBar'
import HistoryPanel from '@/components/HistoryPanel'
import WorkingCanvas from '@/components/WorkingCanvas'
import { appReducer, initialState } from '@/lib/sessionReducer'
import {
  loadSessions,
  loadActiveSessionId,
  saveSessions,
  saveActiveSessionId,
} from '@/lib/storage'

export default function Home() {
  // Initialize reducer with empty state
  const [state, dispatch] = useReducer(appReducer, initialState)
  const { sessions, activeSessionId } = state

  // Load from LocalStorage on first mount
  useEffect(() => {
    const storedSessions = loadSessions()
    const storedActiveId = loadActiveSessionId()
    dispatch({
      type: 'INIT_FROM_STORAGE',
      payload: {
        sessions: storedSessions,
        activeSessionId: storedActiveId,
      },
    })
  }, [])

  // Autosave sessions whenever they change
  useEffect(() => {
    // Skip initial empty state (before INIT_FROM_STORAGE)
    if (sessions.length === 0 && activeSessionId === null) return
    saveSessions(sessions)
  }, [sessions, activeSessionId])

  // Autosave activeSessionId whenever it changes
  useEffect(() => {
    saveActiveSessionId(activeSessionId)
  }, [activeSessionId])

  // Compute activeSession from state
  const activeSession = useMemo(() => {
    if (!activeSessionId) return null
    return sessions.find((s) => s.id === activeSessionId) || null
  }, [sessions, activeSessionId])

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Top Bar */}
      <TopBar
        activeSession={activeSession}
        onNewSession={() => dispatch({ type: 'NEW_SESSION' })}
      />

      {/* Main Content - 2 Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - History Panel */}
        <HistoryPanel
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelect={(id: string) => dispatch({ type: 'SELECT_SESSION', payload: { sessionId: id } })}
          onDelete={(id: string) => dispatch({ type: 'DELETE_SESSION', payload: { sessionId: id } })}
        />

        {/* Main Area - Working Canvas */}
        <WorkingCanvas
          activeSession={activeSession}
          dispatch={dispatch}
        />
      </div>
    </div>
  )
}
