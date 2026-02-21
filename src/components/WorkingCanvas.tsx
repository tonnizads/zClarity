'use client'

import { Dispatch, useState } from 'react'
import { Session, Topic, OutcomeType } from '@/lib/types'
import { AppAction, canStart, canMarkPending, canClose, isOutcomeComplete } from '@/lib/sessionReducer'

// WorkingCanvas Component - zClarity
// Main working area with Intent, Discussion, and Outcome sections

interface WorkingCanvasProps {
  activeSession: Session | null
  dispatch: Dispatch<AppAction>
}

export default function WorkingCanvas({ activeSession, dispatch }: WorkingCanvasProps) {
  // Show empty state if no active session
  if (!activeSession) {
    return (
      <main className="flex-1 p-6 overflow-auto flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No session selected</p>
          <p className="text-sm text-gray-400">Click &quot;New Session&quot; to start</p>
        </div>
      </main>
    )
  }

  const isClosed = activeSession.state === 'Closed'
  const isDraft = activeSession.state === 'Draft'

  return (
    <main className="flex-1 p-6 overflow-auto">
      {/* Section 1 - Intent */}
      <IntentSection
        activeSession={activeSession}
        dispatch={dispatch}
        isClosed={isClosed}
        isDraft={isDraft}
      />

      {/* Section 2 - Discussion */}
      <DiscussionSection
        activeSession={activeSession}
        dispatch={dispatch}
        isClosed={isClosed}
        isDraft={isDraft}
      />

      {/* Section 3 - Outcome & Close */}
      <OutcomeSection
        activeSession={activeSession}
        dispatch={dispatch}
        isClosed={isClosed}
        isDraft={isDraft}
      />
    </main>
  )
}

// ======================
// Intent Section
// ======================
interface SectionProps {
  activeSession: Session
  dispatch: Dispatch<AppAction>
  isClosed: boolean
  isDraft: boolean
}

function IntentSection({ activeSession, dispatch, isClosed, isDraft }: SectionProps) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Intent</h2>
      <div className="space-y-4">
        {/* Title (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Session Title (optional)
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Give this session a name"
            value={activeSession.title}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_INTENT',
                payload: { title: e.target.value },
              })
            }
            disabled={isClosed}
          />
        </div>

        {/* Objective */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Objective *
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="What do you want to achieve in this meeting?"
            value={activeSession.objective}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_INTENT',
                payload: { objective: e.target.value },
              })
            }
            disabled={isClosed}
          />
        </div>

        {/* Expected Output Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expected Output Type
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={activeSession.expectedOutputType}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_INTENT',
                payload: { expectedOutputType: e.target.value as Session['expectedOutputType'] },
              })
            }
            disabled={isClosed}
          >
            <option value="Decision">Decision</option>
            <option value="Clarification">Clarification</option>
            <option value="Feasibility">Feasibility</option>
            <option value="RiskMap">RiskMap</option>
          </select>
        </div>

        {/* Start Session Button */}
        {isDraft && (
          <button
            onClick={() => dispatch({ type: 'START_SESSION' })}
            disabled={!canStart(activeSession)}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
              canStart(activeSession)
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Start Session
          </button>
        )}
      </div>
    </section>
  )
}

// ======================
// Discussion Section
// ======================
function DiscussionSection({ activeSession, dispatch, isClosed, isDraft }: SectionProps) {
  const [newQuestions, setNewQuestions] = useState<Record<string, string>>({})

  const handleAddQuestion = (topicId: string) => {
    const question = newQuestions[topicId]?.trim()
    if (question) {
      dispatch({
        type: 'ADD_OPEN_QUESTION',
        payload: { topicId, question },
      })
      setNewQuestions((prev) => ({ ...prev, [topicId]: '' }))
    }
  }

  if (isDraft) {
    return (
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Discussion</h2>
        <div className="p-4 border border-dashed border-gray-300 rounded-lg">
          <p className="text-sm text-gray-500 italic">Start session to add topics</p>
        </div>
      </section>
    )
  }

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Discussion</h2>
        {!isClosed && (
          <button
            onClick={() => dispatch({ type: 'ADD_TOPIC' })}
            className="px-3 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            + Add Topic
          </button>
        )}
      </div>

      {activeSession.topics.length === 0 ? (
        <div className="p-4 border border-dashed border-gray-300 rounded-lg">
          <p className="text-sm text-gray-500 italic">No topics yet. Add a topic to start discussion.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeSession.topics.map((topic, index) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              index={index}
              dispatch={dispatch}
              isClosed={isClosed}
              newQuestion={newQuestions[topic.id] || ''}
              onNewQuestionChange={(value) =>
                setNewQuestions((prev) => ({ ...prev, [topic.id]: value }))
              }
              onAddQuestion={() => handleAddQuestion(topic.id)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

// ======================
// Topic Card
// ======================
interface TopicCardProps {
  topic: Topic
  index: number
  dispatch: Dispatch<AppAction>
  isClosed: boolean
  newQuestion: string
  onNewQuestionChange: (value: string) => void
  onAddQuestion: () => void
}

function TopicCard({
  topic,
  index,
  dispatch,
  isClosed,
  newQuestion,
  onNewQuestionChange,
  onAddQuestion,
}: TopicCardProps) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-500">Topic {index + 1}</span>
        {!isClosed && (
          <button
            onClick={() => dispatch({ type: 'REMOVE_TOPIC', payload: { topicId: topic.id } })}
            className="text-xs text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        )}
      </div>

      {/* Topic Title */}
      <input
        type="text"
        className="w-full px-3 py-2 mb-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Topic title"
        value={topic.title}
        onChange={(e) =>
          dispatch({
            type: 'UPDATE_TOPIC',
            payload: { topicId: topic.id, title: e.target.value },
          })
        }
        disabled={isClosed}
      />

      {/* Topic Notes */}
      <textarea
        className="w-full px-3 py-2 mb-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        rows={2}
        placeholder="Notes..."
        value={topic.notes}
        onChange={(e) =>
          dispatch({
            type: 'UPDATE_TOPIC',
            payload: { topicId: topic.id, notes: e.target.value },
          })
        }
        disabled={isClosed}
      />

      {/* Open Questions */}
      <div className="mt-3">
        <p className="text-xs font-medium text-gray-500 mb-2">Open Questions</p>
        {topic.openQuestions.length > 0 && (
          <ul className="space-y-1 mb-2">
            {topic.openQuestions.map((q, qIndex) => (
              <li key={qIndex} className="flex items-center justify-between text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded">
                <span>• {q}</span>
                {!isClosed && (
                  <button
                    onClick={() =>
                      dispatch({
                        type: 'REMOVE_OPEN_QUESTION',
                        payload: { topicId: topic.id, index: qIndex },
                      })
                    }
                    className="text-xs text-red-500 hover:text-red-700 ml-2"
                  >
                    ✕
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
        {!isClosed && (
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add a question..."
              value={newQuestion}
              onChange={(e) => onNewQuestionChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  onAddQuestion()
                }
              }}
            />
            <button
              onClick={onAddQuestion}
              className="px-2 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ======================
// Outcome Section
// ======================
function OutcomeSection({ activeSession, dispatch, isClosed, isDraft }: SectionProps) {
  if (isDraft) {
    return (
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Outcome & Close</h2>
        <div className="p-4 border border-dashed border-gray-300 rounded-lg">
          <p className="text-sm text-gray-500 italic">Start session first</p>
        </div>
      </section>
    )
  }

  const outcome = activeSession.outcome || {
    type: 'Decision' as OutcomeType,
    summary: '',
    owner: '',
    nextStep: '',
    dueDate: '',
    impactArea: '',
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Outcome & Close</h2>
      <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-white">
        {/* Outcome Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Outcome Type *
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={outcome.type}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_OUTCOME',
                payload: { type: e.target.value as OutcomeType },
              })
            }
            disabled={isClosed}
          >
            <option value="Decision">Decision</option>
            <option value="NextStep">NextStep</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {/* Summary */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Summary *
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={2}
            placeholder="What was decided or concluded?"
            value={outcome.summary}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_OUTCOME',
                payload: { summary: e.target.value },
              })
            }
            disabled={isClosed}
          />
        </div>

        {/* Owner */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Owner *
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Who is responsible?"
            value={outcome.owner}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_OUTCOME',
                payload: { owner: e.target.value },
              })
            }
            disabled={isClosed}
          />
        </div>

        {/* Next Step */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Next Step *
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="What happens next?"
            value={outcome.nextStep}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_OUTCOME',
                payload: { nextStep: e.target.value },
              })
            }
            disabled={isClosed}
          />
        </div>

        {/* Due Date (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date (optional)
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={outcome.dueDate || ''}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_OUTCOME',
                payload: { dueDate: e.target.value },
              })
            }
            disabled={isClosed}
          />
        </div>

        {/* Impact Area (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Impact Area (optional)
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Which area is affected?"
            value={outcome.impactArea || ''}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_OUTCOME',
                payload: { impactArea: e.target.value },
              })
            }
            disabled={isClosed}
          />
        </div>

        {/* Outcome Status Indicator */}
        <div className="pt-2 border-t border-gray-200">
          <p className={`text-sm ${isOutcomeComplete(activeSession.outcome) ? 'text-green-600' : 'text-gray-500'}`}>
            {isOutcomeComplete(activeSession.outcome)
              ? '✓ Outcome complete'
              : '○ Fill in all required fields (Type, Summary, Owner, Next Step)'}
          </p>
        </div>

        {/* Closing Summary */}
        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Closing Summary *
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="One sentence summary of this session"
            value={activeSession.closingSummary}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_CLOSING_SUMMARY',
                payload: { summary: e.target.value },
              })
            }
            disabled={isClosed}
          />
        </div>

        {/* Action Buttons */}
        {!isClosed && (
          <div className="flex gap-3 pt-4">
            {/* Mark Pending Button */}
            <button
              onClick={() => dispatch({ type: 'MARK_PENDING' })}
              disabled={!canMarkPending(activeSession)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                canMarkPending(activeSession)
                  ? 'text-orange-600 border border-orange-600 hover:bg-orange-50'
                  : 'text-gray-400 border border-gray-300 cursor-not-allowed'
              }`}
            >
              Mark Pending
            </button>

            {/* Close Session Button */}
            <button
              onClick={() => dispatch({ type: 'CLOSE_SESSION' })}
              disabled={!canClose(activeSession)}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                canClose(activeSession)
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Close Session
            </button>
          </div>
        )}

        {/* Closed State Indicator */}
        {isClosed && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-green-600 font-medium">✓ Session Closed</p>
          </div>
        )}
      </div>
    </section>
  )
}
