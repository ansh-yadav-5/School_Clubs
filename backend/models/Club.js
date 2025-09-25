const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AnnouncementSchema = new Schema({
  title: String,
  body: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
}, { _id: true })

const MeetingSchema = new Schema({
  title: String,
  description: String,
  startsAt: Date,
  endsAt: Date,
  location: String
}, { _id: true })

const MemberSub = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' },
  roleInClub: { type: String, enum: ['member', 'officer'], default: 'member' },
  requestedAt: { type: Date, default: Date.now },
  approvedAt: Date
}, { _id: true })

const ClubSchema = new Schema({
  name: { type: String, required: true },
  shortDescription: String,
  longDescription: String,
  contactEmail: String,
  website: String,
  tags: [String],
  leader: { type: Schema.Types.ObjectId, ref: 'User' },
  members: [MemberSub],
  announcements: [AnnouncementSchema],
  meetings: [MeetingSchema],
  createdAt: { type: Date, default: Date.now },
  isPublic: { type: Boolean, default: true }
})

module.exports = mongoose.model('Club', ClubSchema)