const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../middleware/auth.js')
const User = require('../models/User.js')

router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user })
})

module.exports = router