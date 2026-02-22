/**
 * FAILURE DEMO TEST - DO NOT MERGE
 * 
 * This test intentionally fails to demonstrate:
 * - CI failure detection
 * - Artifact upload on failure (test-results)
 * - Always upload behavior (playwright-report)
 */

import { test, expect } from '@playwright/test'

test.describe('Failure Demo (DO NOT MERGE)', () => {
  test('intentional failure for CI demo', async () => {
    // This test will always fail
    expect(1).toBe(2)
  })
})
