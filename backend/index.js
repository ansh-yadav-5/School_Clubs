require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const authRoutes = require('./routes/auth.js')
const clubRoutes = require('./routes/clubs.js')
const userRoutes = require('./routes/user.js')

const app = express()
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())

const PORT = process.env.PORT || 4000
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/school_clubs'

mongoose.connect(MONGO_URL).then(() => console.log('MongoDB connected')).catch(err => console.error(err))

app.use('/api/auth', authRoutes)
app.use('/api/clubs', clubRoutes)
app.use('/api/users', userRoutes)

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))

