'use client'

import { Session } from '@/lib/types'

// HistoryPanel Component - zClarity
// Left sidebar showing list of previous sessions

interface HistoryPanelProps {
  sessions: Session[]
  activeSessionId: string | null
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}

export default function HistoryPanel({ sessions, activeSessionId, onSelect, onDelete }: HistoryPanelProps) {
  // Sort sessions by createdAt (newest first)
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

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
    <aside className="w-64 h-full border-r border-gray-200 bg-gray-50 p-4 overflow-y-auto">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">Session History</h2>
      
      {sortedSessions.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No sessions yet</p>
      ) : (
        <div className="space-y-2">
          {sortedSessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSelect(session.id)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                session.id === activeSessionId
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-white border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">
                  {new Date(session.createdAt).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getStateBadgeStyle(session.state)}`}>
                    {session.state}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(session.id)
                    }}
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded p-0.5 transition-colors"
                    title="Delete session"
                  >
                    <span className="text-sm leading-none">×</span>
                  </button>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900 truncate">
                {session.title || session.objective?.slice(0, 40) || 'Untitled Session'}
              </p>
            </button>
          ))}
        </div>
      )}
    </aside>
  )
}
