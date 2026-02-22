/**
 * Level 3 - E2E Smoke Tests
 * 
 * Test Ladder: Minimal E2E for Happy Path + Critical Flows
 * - Production-like server (next build + start)
 * - Deterministic fixtures (no random)
 * - aria-label selectors (stable across TH/EN)
 * - Playwright auto-wait (no sleep hacks)
 */

import { test, expect } from '@playwright/test'
import { getTestFixtures } from './fixtures'

// Get deterministic test data
const fixtures = getTestFixtures()

// ======================
// Test Isolation
// ======================
test.beforeEach(async ({ page }) => {
  // Clear localStorage for isolation
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

// ======================
// E2E-1: Happy Path Close Session
// ======================
test.describe('E2E-1: Happy Path Close Session', () => {
  test('should complete full session flow from Draft to Closed', async ({ page }) => {
    // Arrange: Create new session
    await page.getByLabel('new-session').click()

    // Wait for WorkingCanvas to render with objective input
    await expect(page.getByLabel('objective-input')).toBeVisible()

    // Assert: State should be Draft
    await expect(page.getByLabel('session-state')).toContainText(/Draft|แบบร่าง/)

    // Act: Fill objective
    await page.getByLabel('objective-input').fill(fixtures.objectiveText)

    // Act: Start session
    await page.getByLabel('start-session').click()

    // Assert: State should be Active
    await expect(page.getByLabel('session-state')).toContainText(/Active|กำลังดำเนินการ/)

    // Act: Fill outcome fields (required for close)
    await page.getByLabel('outcome-type').selectOption('Decision')
    await page.getByLabel('outcome-summary').fill(fixtures.outcomeSummary)
    await page.getByLabel('outcome-owner').fill(fixtures.owner)
    await page.getByLabel('outcome-next-step').fill(fixtures.nextStep)

    // Assert: State should change to OutcomeDefined
    await expect(page.getByLabel('session-state')).toContainText(/OutcomeDefined|กำหนดผลลัพธ์แล้ว/)

    // Act: Fill closing summary
    await page.getByLabel('closing-summary').fill(fixtures.closingSummary)

    // Act: Close session
    await page.getByLabel('close-session').click()

    // Assert: State should be Closed
    await expect(page.getByLabel('session-state')).toContainText(/Closed|ปิดแล้ว/)
  })
})

// ======================
// E2E-2: Delete Confirm Flow
// ======================
test.describe('E2E-2: Delete Confirm Flow', () => {
  test('cancel should keep session, confirm should delete', async ({ page }) => {
    // Arrange: Create a session first
    await page.getByLabel('new-session').click()

    // Wait for WorkingCanvas to render
    await expect(page.getByLabel('objective-input')).toBeVisible()

    await page.getByLabel('objective-input').fill(fixtures.objectiveText)

    // Assert: Delete button should exist
    await expect(page.getByLabel('delete-session')).toBeVisible()

    // Act: Click delete
    await page.getByLabel('delete-session').click()

    // Assert: Dialog should appear
    await expect(page.getByLabel('cancel-delete-session')).toBeVisible()
    await expect(page.getByLabel('confirm-delete-session')).toBeVisible()

    // Act: Click cancel
    await page.getByLabel('cancel-delete-session').click()

    // Assert: Dialog closed, session still exists
    await expect(page.getByLabel('cancel-delete-session')).not.toBeVisible()
    await expect(page.getByLabel('delete-session')).toBeVisible()

    // Act: Open delete again and confirm
    await page.getByLabel('delete-session').click()
    await page.getByLabel('confirm-delete-session').click()

    // Assert: Dialog should close first
    await expect(page.getByLabel('confirm-delete-session')).not.toBeVisible()

    // Assert: Session should be deleted (no delete button in history)
    await expect(page.getByLabel('delete-session')).not.toBeVisible()
  })
})

// ======================
// E2E-3: Persistence Reload
// ======================
test.describe('E2E-3: Persistence Reload', () => {
  test('session should persist after page reload', async ({ page }) => {
    // Arrange: Create session with objective
    await page.getByLabel('new-session').click()

    // Wait for WorkingCanvas to render
    await expect(page.getByLabel('objective-input')).toBeVisible()

    await page.getByLabel('objective-input').fill(fixtures.persistenceObjective)

    // Act: Start session to save state
    await page.getByLabel('start-session').click()

    // Assert: State is Active
    await expect(page.getByLabel('session-state')).toContainText(/Active|กำลังดำเนินการ/)

    // Act: Reload page
    await page.reload()

    // Assert: Session still exists with same objective
    await expect(page.getByLabel('objective-input')).toHaveValue(fixtures.persistenceObjective)

    // Assert: State is still Active
    await expect(page.getByLabel('session-state')).toContainText(/Active|กำลังดำเนินการ/)
  })
})
