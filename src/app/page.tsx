'use client'

import { useReducer, useEffect, useMemo, useState, useCallback } from 'react'
import TopBar from '@/components/TopBar'
import HistoryPanel from '@/components/HistoryPanel'
import WorkingCanvas from '@/components/WorkingCanvas'
import { appReducer, initialState } from '@/lib/sessionReducer'
import { Locale, messages } from '@/lib/i18n'
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

  // Locale state - Thai is default
  const [locale, setLocale] = useState<Locale>('th')
  const t = messages[locale]

  // Delete confirmation modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  // Get delete target session info for display
  const deleteTargetSession = useMemo(() => {
    if (!deleteTargetId) return null
    return sessions.find((s) => s.id === deleteTargetId) || null
  }, [sessions, deleteTargetId])

  // Delete handlers
  const requestDelete = useCallback((sessionId: string) => {
    setDeleteTargetId(sessionId)
  }, [])

  const cancelDelete = useCallback(() => {
    setDeleteTargetId(null)
  }, [])

  const confirmDelete = useCallback(() => {
    if (deleteTargetId) {
      dispatch({ type: 'DELETE_SESSION', payload: { sessionId: deleteTargetId } })
      setDeleteTargetId(null)
    }
  }, [deleteTargetId])

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
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <TopBar
        activeSession={activeSession}
        onNewSession={() => dispatch({ type: 'NEW_SESSION' })}
        locale={locale}
        setLocale={setLocale}
      />

      {/* Main Content - 2 Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - History Panel */}
        <HistoryPanel
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelect={(id: string) => dispatch({ type: 'SELECT_SESSION', payload: { sessionId: id } })}
          onDelete={requestDelete}
          locale={locale}
        />

        {/* Main Area - Working Canvas */}
        <WorkingCanvas
          activeSession={activeSession}
          dispatch={dispatch}
          locale={locale}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={cancelDelete}
          onKeyDown={(e) => {
            if (e.key === 'Escape') cancelDelete()
          }}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Title */}
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {t.confirmDeleteTitle}
            </h2>

            {/* Session Name */}
            {deleteTargetSession && (
              <p className="text-sm text-gray-700 mb-2 font-medium">
                &quot;{deleteTargetSession.title || deleteTargetSession.objective?.slice(0, 50) || t.untitledSession}&quot;
              </p>
            )}

            {/* Description */}
            <p className="text-sm text-gray-600 mb-6">
              {t.confirmDeleteDescription}
            </p>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                {t.confirmDelete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
