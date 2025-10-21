// logic/block.ts - Updated with correct endpoints
import { loadSession } from './session'

const API_BASE = window.location.origin

// Block a user
export async function blockUser(userId: number): Promise<void> {
  const session = loadSession()
  if (!session?.token) throw new Error('Not authenticated')

  console.log(`🚫 Blocking user ID: ${userId}`)

  const response = await fetch(`${API_BASE}/block/block`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.token}`
    },
    body: JSON.stringify({ blockedUserId: userId })
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('❌ Block failed:', error)
    throw new Error('Failed to block user')
  }

  const result = await response.json()
  console.log('✅ Block successful:', result)
}

// Unblock a user
export async function unblockUser(userId: number): Promise<void> {
  const session = loadSession()
  if (!session?.token) throw new Error('Not authenticated')

  console.log(`✅ Unblocking user ID: ${userId}`)

  const response = await fetch(`${API_BASE}/block/unblock`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.token}`
    },
    body: JSON.stringify({ blockedUserId: userId })
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('❌ Unblock failed:', error)
    throw new Error('Failed to unblock user')
  }

  const result = await response.json()
  console.log('✅ Unblock successful:', result)
}

// Check if a user is blocked
export async function isUserBlocked(userId: number): Promise<boolean> {
  const session = loadSession()
  if (!session?.token) return false

  try {
    const response = await fetch(`${API_BASE}/block/is-blocked/${userId}`, {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.token}` 
      }
    })
    
    if (!response.ok) {
      console.warn(`Block check failed with status: ${response.status}`)
      return false
    }
    
    // Verify content type is JSON
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('Block check returned non-JSON response')
      return false
    }
    
    const data = await response.json()
    console.log(`🔍 User ${userId} blocked status:`, data.isBlocked)
    return data.isBlocked
  } catch (err) {
    console.error('❌ Error checking block status:', err)
    return false
  }
}
