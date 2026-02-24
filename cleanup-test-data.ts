import { Client, Users } from 'node-appwrite'
import * as dotenv from 'dotenv'

// Load environment variables
if (!process.env.CI) {
  dotenv.config()
}

/**
 * Manual cleanup script for test data
 * Run with: npm run test:cleanup
 */
async function cleanupTestData() {
  console.log('🧹 Starting manual test data cleanup...')
  console.log('📍 Endpoint:', process.env.APPWRITE_ENDPOINT)
  console.log('📍 Project:', process.env.APPWRITE_PROJECT_ID)

  if (!process.env.APPWRITE_API_KEY) {
    console.error('❌ APPWRITE_API_KEY not found in environment variables!')
    console.error('Please add it to your .env.test file')
    process.exit(1)
  }

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || '')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY)

  const users = new Users(client)

  try {
    console.log('📋 Fetching users list...')
    const usersList = await users.list()
    console.log(`Found ${usersList.total} total users`)

    const testUserPatterns = [
      'test.user.',
      'complete.test.',
      'test@',
      '.playwright@',
      'e2e.test@',
      'automation@'
    ]

    let deletedCount = 0
    let skippedCount = 0

    console.log('\n🔍 Scanning for test users...\n')

    for (const user of usersList.users) {
      const isTestUser = testUserPatterns.some(pattern => 
        (user.email.includes(pattern) && !user.name.includes('Defaut Test User'))
      )

      if (isTestUser) {
        try {
          await users.delete(user.$id)
          console.log(`  ✅ Deleted: ${user.email} (${user.name})`)
          deletedCount++
        } catch (error: any) {
          console.error(`  ❌ Failed to delete ${user.email}:`, error.message)
        }
      } else {
        skippedCount++
      }
    }

    console.log('\n' + '='.repeat(50))
    console.log(`✨ Cleanup completed!`)
    console.log(`   🗑️  Deleted: ${deletedCount} test users`)
    console.log(`   ⏭️  Skipped: ${skippedCount} real users`)
    console.log('='.repeat(50))
  } catch (error: any) {
    console.error('\n❌ Error during cleanup:', error.message)
    process.exit(1)
  }
}

// Run cleanup
cleanupTestData()