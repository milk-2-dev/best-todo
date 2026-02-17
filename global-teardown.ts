import { chromium, type FullConfig } from '@playwright/test'
import { Client, Users, Databases } from 'node-appwrite'

/**
 * Global teardown - cleanup test data after all tests
 */
async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting test data cleanup...')

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || '')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '')

  const users = new Users(client)

  try {
    // Get all users
    const usersList = await users.list()
    
    let deletedCount = 0

    // Delete test users (created during tests)
    for (const user of usersList.users) {
      // Identify test users by email pattern
      if (
        user.email.includes('test.user.') ||
        user.email.includes('complete.test.') ||
        (user.email.startsWith('test@') && !user.name.includes('Defaut Test User')) ||
        user.email.includes('.playwright@')
      ) {
        try {
          await users.delete(user.$id)
          console.log(`  ✅ Deleted test user: ${user.email}`)
          deletedCount++
        } catch (error) {
          console.error(`  ❌ Failed to delete user ${user.email}:`, error)
        }
      }
    }

    console.log(`✨ Cleanup completed! Deleted ${deletedCount} test users.`)
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    // Don't fail the tests if cleanup fails
  }
}

export default globalTeardown