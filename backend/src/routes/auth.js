import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query } from '../db/index.js'

const router = Router()

router.post('/register', async (req, res) => {
  const { email, password } = req.body ?? {}
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password required' })
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'password must be at least 8 characters' })
  }

  const hash = await bcrypt.hash(password, 12)
  try {
    const { rows } = await query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
      [email.toLowerCase().trim(), hash],
    )
    const token = jwt.sign({ sub: rows[0].id, email: rows[0].email }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    })
    res.status(201).json({ token, user: rows[0] })
  } catch (err) {
    if (err.constraint === 'users_email_key') {
      return res.status(409).json({ error: 'Email already in use' })
    }
    throw err
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {}
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password required' })
  }

  const { rows } = await query('SELECT * FROM users WHERE email = $1', [
    email.toLowerCase().trim(),
  ])
  const user = rows[0]
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
  res.json({ token, user: { id: user.id, email: user.email, created_at: user.created_at } })
})

router.get('/me', async (req, res) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' })
  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET)
    const { rows } = await query('SELECT id, email, created_at FROM users WHERE id = $1', [
      payload.sub,
    ])
    if (!rows[0]) return res.status(404).json({ error: 'User not found' })
    res.json(rows[0])
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
})

export default router
