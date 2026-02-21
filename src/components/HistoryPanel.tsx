'use client'

import { Session } from '@/lib/types'
import { Locale, messages } from '@/lib/i18n'

// HistoryPanel Component - zClarity
// Left sidebar showing list of previous sessions

interface HistoryPanelProps {
  sessions: Session[]
  activeSessionId: string | null
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onNewSession: () => void
  locale: Locale
}

export default function HistoryPanel({ sessions, activeSessionId, onSelect, onDelete, onNewSession, locale }: HistoryPanelProps) {
  const t = messages[locale]
  // Sort sessions by createdAt (newest first)
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  // Translate state to current locale
  const getStateLabel = (state: string) => {
    switch (state) {
      case 'Draft':
        return t.stateDraft
      case 'Active':
        return t.stateActive
      case 'OutcomeDefined':
        return t.stateOutcomeDefined
      case 'Pending':
        return t.statePending
      case 'Closed':
        return t.stateClosed
      default:
        return t.stateDraft
    }
  }

  // Get state badge styling
  const getStateBadgeStyle = (state: string) => {
    switch (state) {
      case 'Draft':
        return 'bg-gray-100 text-gray-600'
      case 'Active':
        return 'bg-blue-100 text-blue-600'
      case 'OutcomeDefined':
        return 'bg-yellow-100 text-yellow-600'
      case 'Pending':
        return 'bg-orange-100 text-orange-600'
      case 'Closed':
        return 'bg-green-100 text-green-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <aside className="h-full bg-white md:border md:border-gray-200 md:rounded-xl md:shadow-sm p-4 overflow-y-auto">
      {/* New Session Button - Desktop Only */}
      <button
        onClick={onNewSession}
        className="hidden md:block w-full px-3 py-2 mb-4 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
      >
        {t.newSession}
      </button>
      
      <h2 className="hidden md:block text-sm font-semibold text-gray-700 mb-4">{t.sessionHistory}</h2>
      
      {sortedSessions.length === 0 ? (
        <p className="text-sm text-gray-500 italic">{t.noSessions}</p>
      ) : (
        <div className="space-y-2">
          {sortedSessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSelect(session.id)}
              className={`w-full text-left py-3 px-3 rounded-lg transition-colors ${
                session.id === activeSessionId
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-white border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500 min-w-0 truncate">
                  {new Date(session.createdAt).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${getStateBadgeStyle(session.state)}`}>
                    {getStateLabel(session.state)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(session.id)
                    }}
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded p-0.5 transition-colors shrink-0"
                    title={t.deleteSession}
                  >
                    <span className="text-sm leading-none">×</span>
                  </button>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900 truncate min-w-0">
                {session.title || session.objective?.slice(0, 40) || t.untitledSession}
              </p>
            </button>
          ))}
        </div>
      )}
    </aside>
  )
}
