const express = require('express')
const router = express.Router()
const { authMiddleware, requireRole } = require('../middleware/auth.js')
const Club = require('../models/Club.js')
const User = require('../models/User.js')

router.get('/', async (req, res) => {
  const { q, tag, page = 1, limit = 20 } = req.query
  const filter = { }
  if (tag) filter.tags = tag
  if (q) filter.$or = [ { name: new RegExp(q, 'i') }, { shortDescription: new RegExp(q, 'i') }, { longDescription: new RegExp(q, 'i') } ]
  try {
    const clubs = await Club.find(filter).sort({ name: 1 }).skip((page-1)*limit).limit(Number(limit)).lean()
    res.json({ clubs })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const club = await Club.findById(req.params.id).populate('leader', 'name email').lean()
    if (!club) return res.status(404).json({ error: 'Not found' })
    res.json({ club })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/', authMiddleware, requireRole('leader'), async (req, res) => {
  const { name, shortDescription, longDescription, contactEmail, tags = [] } = req.body
  try {
    const club = await Club.create({ name, shortDescription, longDescription, contactEmail, tags, leader: req.user._id })
    res.status(201).json({ club })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
    if (!club) return res.status(404).json({ error: 'Not found' })
    if (String(club.leader) !== String(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' })
    const allowed = ['name','shortDescription','longDescription','contactEmail','tags','isPublic']
    allowed.forEach(k => { if (k in req.body) club[k] = req.body[k] })
    await club.save()
    res.json({ club })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/:id/join', authMiddleware, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
    if (!club) return res.status(404).json({ error: 'Not found' })
    const exists = club.members.find(m => String(m.user) === String(req.user._id))
    if (exists) return res.status(400).json({ error: 'Already requested or member' })
    club.members.push({ user: req.user._id, status: 'pending' })
    await club.save()
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/:id/members/:memberId/approve', authMiddleware, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
    if (!club) return res.status(404).json({ error: 'Not found' })
    if (String(club.leader) !== String(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' })
    const member = club.members.id(req.params.memberId)
    if (!member) return res.status(404).json({ error: 'Member not found' })
    member.status = 'approved'
    member.approvedAt = new Date()
    await club.save()
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/:id/announcements', authMiddleware, async (req, res) => {
  const { title, body } = req.body
  try {
    const club = await Club.findById(req.params.id)
    if (!club) return res.status(404).json({ error: 'Not found' })
    if (String(club.leader) !== String(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' })
    club.announcements.push({ title, body, author: req.user._id })
    await club.save()
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router