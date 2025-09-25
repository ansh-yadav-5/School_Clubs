const jwt = require('jsonwebtoken')
const User = require('../models/User')

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

async function authMiddleware(req, res, next) {
  const header = req.headers.authorization
  if (!header) return res.status(401).json({ error: 'Missing Authorization header' })
  const token = header.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Malformed Authorization header' })
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(payload.userId).select('-passwordHash')
    if (!user) return res.status(401).json({ error: 'User not found' })
    req.user = user
    next()
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).end()
    if (req.user.role === 'admin' || req.user.role === role) return next()
    return res.status(403).json({ error: 'Forbidden' })
  }
}

module.exports = { authMiddleware, requireRole }