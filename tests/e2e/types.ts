/**
 * Test Types - zClarity E2E
 * 
 * Type definitions for test fixtures and utilities
 */

export interface TestFixtures {
  // Session
  objectiveText: string
  // Outcome fields (required for close)
  outcomeType: string
  outcomeSummary: string
  owner: string
  nextStep: string
  // Closing
  closingSummary: string
  // Persistence test
  persistenceObjective: string
}
