require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('./models/User.js')
const Club = require('./models/Club.js')

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/school_clubs'
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10', 10)

async function run() {
  await mongoose.connect(MONGO_URL)
  await User.deleteMany({})
  await Club.deleteMany({})
  const hash = await bcrypt.hash('password', SALT_ROUNDS)
  const alice = await User.create({ name: 'Alice', email: 'alice@example.com', passwordHash: hash, role: 'leader' })
  const bob = await User.create({ name: 'Bob', email: 'bob@example.com', passwordHash: hash, role: 'student' })
  await Club.create({ name: 'Robotics', shortDescription: 'Robotics club', leader: alice._id, tags: ['STEM'] })
  console.log('Seeded')
  process.exit(0)
}
run().catch(e => { console.error(e); process.exit(1) })