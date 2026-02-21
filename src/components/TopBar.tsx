'use client'

import { Dispatch, SetStateAction } from 'react'
import { Session } from '@/lib/types'
import { Locale, messages } from '@/lib/i18n'

// TopBar Component - zClarity
// Displays session title, date/time, state badge, and new session button

interface TopBarProps {
  activeSession: Session | null
  onNewSession: () => void
  locale: Locale
  setLocale: Dispatch<SetStateAction<Locale>>
}

export default function TopBar({ activeSession, onNewSession, locale, setLocale }: TopBarProps) {
  const t = messages[locale]
  
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
          {activeSession?.title || activeSession?.objective?.slice(0, 30) || t.noSession}
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
          {getStateLabel(activeSession?.state || 'Draft')}
        </span>
      </div>

      {/* Right side - Language Toggle + New Session Button */}
      <div className="flex items-center gap-3">
        {/* Language Toggle */}
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden text-sm">
          <button
            onClick={() => setLocale('th')}
            className={`px-2 py-1 transition-colors ${
              locale === 'th' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            TH
          </button>
          <button
            onClick={() => setLocale('en')}
            className={`px-2 py-1 transition-colors ${
              locale === 'en' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            EN
          </button>
        </div>

        {/* New Session Button */}
        <button
          onClick={onNewSession}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t.newSession}
        </button>
      </div>
    </header>
  )
}
