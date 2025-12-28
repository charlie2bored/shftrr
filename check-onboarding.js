const Database = require('better-sqlite3');
const db = new Database('./prisma/dev.db');

console.log('👤 USERS:');
const users = db.prepare('SELECT id, email, name FROM users').all();
console.log(users);

console.log('\n📋 ONBOARDING RECORDS:');
const onboardings = db.prepare('SELECT "userId", completed, "yearsExperience", industry, "currentRole" FROM user_onboardings').all();
console.log(onboardings);

console.log('\n🔍 ONBOARDING STATUS:');
if (onboardings.length === 0) {
  console.log('❌ No onboarding records found - user will be redirected!');
} else {
  const completed = onboardings[0].completed;
  console.log(`📊 Completed: ${completed}`);
  if (!completed) {
    console.log('⚠️ Onboarding not completed - this will cause redirect!');
  } else {
    console.log('✅ Onboarding completed - should not redirect');
  }
}

db.close();
