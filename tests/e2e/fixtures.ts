/**
 * Deterministic Test Fixtures - zClarity E2E
 * 
 * NO faker, NO random values
 * Used for consistent, reproducible tests
 */

import type { TestFixtures } from './types'

/**
 * Get deterministic test fixtures
 * Call this function to get fresh test data object
 */
export function getTestFixtures(): TestFixtures {
  return {
    // Session objective text
    objectiveText: 'ตัดสินใจเรื่อง Feature Roadmap Q3',
    
    // Outcome fields (required for close)
    outcomeType: 'Decision', // matches <option value="Decision">
    outcomeSummary: 'อนุมัติแผน Feature A และ B เลื่อน Feature C ไป Q4',
    owner: 'Team Lead',
    nextStep: 'สร้าง Tickets ใน Jira ภายในสัปดาห์หน้า',
    
    // Closing summary (required for close)
    closingSummary: 'สรุป: อนุมัติ Feature A, B',
    
    // For persistence test
    persistenceObjective: 'Test Persistence Objective',
  }
}
