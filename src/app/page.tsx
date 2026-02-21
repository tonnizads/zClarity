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
  const [contentPulse, setContentPulse] = useState(false)
  const t = messages[locale]

  // Change locale with subtle fade pulse
  const changeLocale = useCallback((nextLocale: Locale) => {
    setLocale(nextLocale)
    setContentPulse(true)
    setTimeout(() => {
      setContentPulse(false)
    }, 120)
  }, [])

  // Delete confirmation modal state (with animation)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isDeleteMounted, setIsDeleteMounted] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  // Mobile history drawer state (with animation)
  const [isHistoryMounted, setIsHistoryMounted] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  // Open drawer with animation
  const openHistoryDrawer = useCallback(() => {
    setIsHistoryMounted(true)
    // Use requestAnimationFrame to ensure DOM is ready before animating
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsHistoryOpen(true)
      })
    })
  }, [])

  // Close drawer with animation
  const closeHistoryDrawer = useCallback(() => {
    setIsHistoryOpen(false)
    // Wait for animation to finish before unmounting
    setTimeout(() => {
      setIsHistoryMounted(false)
    }, 200) // Match transition duration
  }, [])

  // Get delete target session info for display
  const deleteTargetSession = useMemo(() => {
    if (!deleteTargetId) return null
    return sessions.find((s) => s.id === deleteTargetId) || null
  }, [sessions, deleteTargetId])

  // Delete handlers (with animation)
  const requestDelete = useCallback((sessionId: string) => {
    setDeleteTargetId(sessionId)
    setIsDeleteMounted(true)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsDeleteOpen(true)
      })
    })
  }, [])

  const closeDeleteModal = useCallback(() => {
    setIsDeleteOpen(false)
    setTimeout(() => {
      setIsDeleteMounted(false)
      setDeleteTargetId(null)
    }, 150) // Match transition duration
  }, [])

  const confirmDelete = useCallback(() => {
    if (deleteTargetId) {
      dispatch({ type: 'DELETE_SESSION', payload: { sessionId: deleteTargetId } })
      closeDeleteModal()
    }
  }, [deleteTargetId, closeDeleteModal])

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
        onOpenHistory={openHistoryDrawer}
        locale={locale}
        setLocale={changeLocale}
      />

      {/* Main Content - Responsive Layout with Subtle Fade Transition */}
      <div
        className={`flex-1 flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6 pb-24 md:pb-6 overflow-hidden transition-opacity duration-150 ease-out ${
          contentPulse ? 'opacity-90' : 'opacity-100'
        }`}
      >
        {/* Left Sidebar - History Panel (hidden on mobile) */}
        <div className="hidden md:block md:w-72 lg:w-80 shrink-0">
          <HistoryPanel
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelect={(id: string) => dispatch({ type: 'SELECT_SESSION', payload: { sessionId: id } })}
            onDelete={requestDelete}
            onNewSession={() => dispatch({ type: 'NEW_SESSION' })}
            locale={locale}
          />
        </div>

        {/* Main Area - Working Canvas */}
        <div className="w-full flex-1 min-w-0">
          <WorkingCanvas
            activeSession={activeSession}
            dispatch={dispatch}
            locale={locale}
          />
        </div>
      </div>

      {/* Mobile FAB - New Session Button */}
      <button
        onClick={() => dispatch({ type: 'NEW_SESSION' })}
        className="md:hidden fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white shadow-lg px-4 py-3 rounded-full transition-colors"
        aria-label={t.newSession}
      >
        <span className="text-xl font-bold leading-none">+</span>
        <span className="text-sm font-medium">{locale === 'th' ? 'สร้าง' : 'New'}</span>
      </button>

      {/* Mobile History Drawer */}
      {isHistoryMounted && (
        <div className="md:hidden fixed inset-0 z-40">
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/30 transition-opacity duration-200 ease-out ${
              isHistoryOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={closeHistoryDrawer}
          />
          {/* Drawer Panel */}
          <div
            className={`absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-lg flex flex-col transition-transform duration-200 ease-out ${
              isHistoryOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">{t.sessionHistory}</h2>
              <button
                onClick={closeHistoryDrawer}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <span className="text-2xl leading-none">×</span>
              </button>
            </div>
            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto">
              <HistoryPanel
                sessions={sessions}
                activeSessionId={activeSessionId}
                onSelect={(id: string) => {
                  dispatch({ type: 'SELECT_SESSION', payload: { sessionId: id } })
                  closeHistoryDrawer()
                }}
                onDelete={requestDelete}
                onNewSession={() => {
                  dispatch({ type: 'NEW_SESSION' })
                  closeHistoryDrawer()
                }}
                locale={locale}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteMounted && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-150 ease-out ${
              isDeleteOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={closeDeleteModal}
          />
          {/* Dialog Container */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onKeyDown={(e) => {
              if (e.key === 'Escape') closeDeleteModal()
            }}
          >
            {/* Dialog Panel */}
            <div
              className={`w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-lg p-6 transform transition-all duration-150 ease-out ${
                isDeleteOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
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
                  onClick={closeDeleteModal}
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
        </>
      )}
    </div>
  )
}
