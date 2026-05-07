import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { pool } from './index.js'

const __dir = dirname(fileURLToPath(import.meta.url))

const migrations = ['001_initial.sql', '002_countries_iso.sql']

async function run() {
  const client = await pool.connect()
  try {
    for (const file of migrations) {
      const sql = readFileSync(join(__dir, 'migrations', file), 'utf8')
      console.log(`Running ${file}...`)
      await client.query(sql)
      console.log(`  ✓ done`)
    }
    console.log('All migrations applied.')
  } finally {
    client.release()
    await pool.end()
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
