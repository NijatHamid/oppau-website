/**
 * Run this script once to generate your admin password hash:
 *   node scripts/generate-password-hash.js YourPassword123!
 *
 * Then paste the output into your .env.local as ADMIN_PASSWORD_HASH=...
 */

const bcrypt = require('bcryptjs')

const password = process.argv[2]
if (!password) {
  console.error('Usage: node scripts/generate-password-hash.js <password>')
  process.exit(1)
}

bcrypt.hash(password, 12).then((hash) => {
  console.log('\nADMIN_PASSWORD_HASH=' + hash)
  console.log('\nAdd this to your .env.local file.\n')
})
