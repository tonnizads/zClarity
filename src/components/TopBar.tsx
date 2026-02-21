'use client'

import { Session } from '@/lib/types'

// TopBar Component - zClarity
// Displays session title, date/time, state badge, and new session button

interface TopBarProps {
  activeSession: Session | null
  onNewSession: () => void
}

export default function TopBar({ activeSession, onNewSession }: TopBarProps) {
  // Determine state badge styling
  const getStateBadgeStyle = (state: string) => {
    switch (state) {
      case 'Draft':
        return 'bg-gray-100 text-gray-700'
      case 'Active':
        return 'bg-blue-100 text-blue-700'
      case 'OutcomeDefined':
        return 'bg-yellow-100 text-yellow-700'
      case 'Pending':
        return 'bg-orange-100 text-orange-700'
      case 'Closed':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <header className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between">
      {/* Left side - Title and Date */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-900">zClarity</h1>
        <span className="text-sm text-gray-500">
          {activeSession?.title || activeSession?.objective?.slice(0, 30) || 'No session'}
        </span>
        <span className="text-sm text-gray-400">
          {activeSession
            ? new Date(activeSession.createdAt).toLocaleDateString()
            : new Date().toLocaleDateString()}
        </span>
      </div>

      {/* Center - State Badge */}
      <div className="flex items-center">
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStateBadgeStyle(activeSession?.state || 'Draft')}`}>
          {activeSession?.state || 'Draft'}
        </span>
      </div>

      {/* Right side - New Session Button */}
      <button
        onClick={onNewSession}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
      >
        New Session
      </button>
    </header>
  )
}
