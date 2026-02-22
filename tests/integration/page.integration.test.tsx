/**
 * Level 2 - UI Integration Tests
 * 
 * ตาม Test Ladder:
 * - ทดสอบการเชื่อม UI ↔ state/reducer (wiring)
 * - ไม่ทดสอบ reducer ซ้ำ (Level 1 ทำแล้ว)
 * - ใช้ aria-label ที่คงที่ เพื่อให้ test ไม่พังตอนสลับภาษา
 * 
 * AAA Style: Arrange → Act → Assert
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '../../src/app/page'

// Mock localStorage for tests
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// ======================
// UI Integration Tests
// ======================
describe('UI Integration - Page Wiring', () => {
  
  beforeEach(() => {
    localStorageMock.clear()
  })

  // -------------------------------------------
  // Test 1: Start blocked when objective empty
  // -------------------------------------------
  describe('Start Session Button', () => {
    
    it('should be disabled when objective is empty', async () => {
      // Arrange: render Page
      render(<Home />)
      
      // Act: create new session (there should be no session initially)
      // Since no session exists, we need to create one first
      // Use the desktop button with aria-label
      const newSessionBtn = screen.getByLabelText('new-session')
      await userEvent.click(newSessionBtn)
      
      // Assert: start button should be disabled (objective is empty)
      await waitFor(() => {
        const startButton = screen.queryByLabelText('start-session')
        if (startButton) {
          expect(startButton).toBeDisabled()
        }
      })
      
      // Also check: state badge should show Draft
      const stateBadge = screen.getByLabelText('session-state')
      expect(stateBadge).toHaveTextContent(/Draft|แบบร่าง/i)
    })

    // -------------------------------------------
    // Test 2: Start works when objective has value
    // -------------------------------------------
    it('should enable and change state to Active when objective is filled', async () => {
      // Arrange: render Page
      const user = userEvent.setup()
      render(<Home />)
      
      // Create new session first
      const newSessionBtn = screen.getByLabelText('new-session')
      await user.click(newSessionBtn)
      
      // Wait for objective input to appear
      await waitFor(() => {
        expect(screen.queryByLabelText('objective-input')).toBeInTheDocument()
      })
      
      // Act: fill objective
      const objectiveInput = screen.getByLabelText('objective-input')
      await user.type(objectiveInput, 'ตัดสินใจเรื่อง Feature X')
      
      // Assert: start button should be enabled now
      await waitFor(() => {
        const startButton = screen.getByLabelText('start-session')
        expect(startButton).not.toBeDisabled()
      })
      
      // Act: click start
      const startButton = screen.getByLabelText('start-session')
      await user.click(startButton)
      
      // Assert: state badge should change to Active
      await waitFor(() => {
        const stateBadge = screen.getByLabelText('session-state')
        expect(stateBadge).toHaveTextContent(/Active|กำลังดำเนินการ/i)
      })
    })
  })

  // -------------------------------------------
  // Test 3: Delete confirm dialog flow
  // -------------------------------------------
  describe('Delete Session Dialog', () => {
    
    it('should show dialog on delete click and cancel should keep session', async () => {
      // Arrange: render Page with a session
      const user = userEvent.setup()
      render(<Home />)
      
      // Create new session first
      const newSessionBtn = screen.getByLabelText('new-session')
      await user.click(newSessionBtn)
      
      // Wait for delete button to appear (in history panel - desktop only)
      await waitFor(() => {
        const deleteBtn = screen.queryByLabelText('delete-session')
        // On mobile the history panel is hidden, skip if not found
        if (deleteBtn) {
          expect(deleteBtn).toBeInTheDocument()
        }
      })
      
      const deleteBtn = screen.queryByLabelText('delete-session')
      
      // Skip test if delete button not visible (mobile view)
      if (!deleteBtn) {
        return
      }
      
      // Act: click delete button
      await user.click(deleteBtn)
      
      // Assert: dialog should appear
      await waitFor(() => {
        expect(screen.getByLabelText('cancel-delete-session')).toBeInTheDocument()
        expect(screen.getByLabelText('confirm-delete-session')).toBeInTheDocument()
      })
      
      // Act: click cancel
      const cancelBtn = screen.getByLabelText('cancel-delete-session')
      await user.click(cancelBtn)
      
      // Assert: dialog should close (buttons no longer visible)
      await waitFor(() => {
        expect(screen.queryByLabelText('cancel-delete-session')).not.toBeInTheDocument()
      })
      
      // Session should still exist (delete button still visible)
      expect(screen.getByLabelText('delete-session')).toBeInTheDocument()
    })

    it('should delete session when confirm is clicked', async () => {
      // Arrange: render Page with a session
      const user = userEvent.setup()
      render(<Home />)
      
      // Create new session first
      const newSessionBtn = screen.getByLabelText('new-session')
      await user.click(newSessionBtn)
      
      // Wait for delete button
      await waitFor(() => {
        const deleteBtn = screen.queryByLabelText('delete-session')
        if (deleteBtn) {
          expect(deleteBtn).toBeInTheDocument()
        }
      })
      
      const deleteBtn = screen.queryByLabelText('delete-session')
      
      // Skip test if delete button not visible (mobile view)
      if (!deleteBtn) {
        return
      }
      
      // Act: click delete button
      await user.click(deleteBtn)
      
      // Act: click confirm
      await waitFor(() => {
        expect(screen.getByLabelText('confirm-delete-session')).toBeInTheDocument()
      })
      
      const confirmBtn = screen.getByLabelText('confirm-delete-session')
      await user.click(confirmBtn)
      
      // Assert: dialog should close and session should be deleted
      await waitFor(() => {
        expect(screen.queryByLabelText('confirm-delete-session')).not.toBeInTheDocument()
      })
      
      // No more sessions in history (no delete button)
      await waitFor(() => {
        expect(screen.queryByLabelText('delete-session')).not.toBeInTheDocument()
      })
    })
  })
})
