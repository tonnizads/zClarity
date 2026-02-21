'use client'

import { Session } from '@/lib/types'
import { Locale, messages } from '@/lib/i18n'

// TopBar Component - zClarity
// Displays session title, date/time, state badge, and actions

interface TopBarProps {
  activeSession: Session | null
  onOpenHistory: () => void
  locale: Locale
  setLocale: (locale: Locale) => void
}

export default function TopBar({ activeSession, onOpenHistory, locale, setLocale }: TopBarProps) {
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
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-sm px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      {/* Group A - Left: App name + session info + state badge */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-wrap">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-900 whitespace-nowrap">zClarity</h1>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">
            {activeSession
              ? new Date(activeSession.createdAt).toLocaleDateString()
              : new Date().toLocaleDateString()}
          </span>
          <span className="text-sm text-gray-500 truncate max-w-[140px] sm:max-w-[280px]">
            {activeSession?.title || activeSession?.objective?.slice(0, 30) || t.noSession}
          </span>
        </div>
        {/* State Badge */}
        <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full whitespace-nowrap ${getStateBadgeStyle(activeSession?.state || 'Draft')}`}>
          {getStateLabel(activeSession?.state || 'Draft')}
        </span>
      </div>

      {/* Group B - Right: History (mobile) + Language Toggle */}
      <div className="flex items-center gap-2 justify-between w-full sm:w-auto">
        {/* History Button - Mobile Only */}
        <button
          onClick={onOpenHistory}
          className="md:hidden px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
        >
          {t.history}
        </button>
        
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
      </div>
    </header>
  )
}
