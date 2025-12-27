import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import path from 'path'

async function main() {
  console.log('🌱 Seeding database...')

  // Connect to SQLite database
  const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
  const db = new Database(dbPath)

  try {
    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 12)

    // Insert test user
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO users (id, email, name, password, provider, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    const userId = 'test-user-id'
    const now = new Date().toISOString()

    stmt.run(
      userId,
      'test@example.com',
      'Test User',
      hashedPassword,
      'credentials',
      now,
      now
    )

    console.log('✅ Created test user: test@example.com')
    console.log('📧 Test login: test@example.com / password123')

  } finally {
    db.close()
  }
}

main().catch((e) => {
  console.error('❌ Seeding failed:', e)
  process.exit(1)
})
