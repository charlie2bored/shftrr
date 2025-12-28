const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new Database(dbPath);

console.log('📊 DATABASE CONTENTS:');
console.log('===================');

const tables = ['users', 'conversations', 'job_applications', 'action_items', 'career_goals', 'user_onboardings'];

tables.forEach(table => {
  try {
    const count = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get().count;
    console.log(`${table}: ${count} records`);
  } catch (e) {
    console.log(`${table}: table doesn't exist or error`);
  }
});

console.log('\n👤 USERS:');
const users = db.prepare('SELECT id, email, name FROM users').all();
console.log(users);

console.log('\n💼 JOB APPLICATIONS:');
const jobs = db.prepare('SELECT id, company, role, status FROM job_applications LIMIT 5').all();
console.log(jobs);

db.close();
