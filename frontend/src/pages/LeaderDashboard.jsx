import React, { useEffect, useState } from 'react'
import api from '../services/api.js'
import { useAuth } from '../contexts/AuthContext'

export default function LeaderDashboard() {
  const { user } = useAuth()
  const [myClubs, setMyClubs] = useState([])
  const [newClub, setNewClub] = useState({ name: '', shortDescription: '', contactEmail: '' })

  useEffect(() => {
    let mounted = true
    if (!user) return
    api.get('/clubs?leader=' + user.id).then(res => { if (mounted) setMyClubs(res.data.clubs) }).catch(console.error)
    return () => { mounted = false }
  }, [user])

  async function createClub(e) {
    e.preventDefault()
    try {
      await api.post('/clubs', newClub)
      setNewClub({ name: '', shortDescription: '', contactEmail: '' })
      const res = await api.get('/clubs?leader=' + user.id)
      setMyClubs(res.data.clubs)
    } catch (e) {
      console.error(e)
      alert(e.response?.data?.error || 'Failed to create')
    }
  }

  async function postAnnouncement(clubId, title, body) {
    try {
      await api.post(`/clubs/${clubId}/announcements`, { title, body })
      alert('Posted')
    } catch (e) {
      console.error(e)
      alert(e.response?.data?.error || 'Failed')
    }
  }

  return (
    <div className="container">
      <h2>Leader Dashboard</h2>
      <section>
        <h3>Create Club</h3>
        <form onSubmit={createClub}>
          <input placeholder="Club name" value={newClub.name} onChange={e => setNewClub(s => ({ ...s, name: e.target.value }))} />
          <input placeholder="Short description" value={newClub.shortDescription} onChange={e => setNewClub(s => ({ ...s, shortDescription: e.target.value }))} />
          <input placeholder="Contact email" value={newClub.contactEmail} onChange={e => setNewClub(s => ({ ...s, contactEmail: e.target.value }))} />
          <button type="submit">Create</button>
        </form>
      </section>
      <section>
        <h3>Your Clubs</h3>
        {myClubs.map(c => (
          <div key={c._id || c.id} className="club-card">
            <h4>{c.name}</h4>
            <p>{c.shortDescription}</p>
            <p>Members: {(c.members || []).length}</p>
            <button onClick={() => postAnnouncement(c._id || c.id, 'Hello Members', 'This is a test announcement')}>Post sample announcement</button>
          </div>
        ))}
      </section>
    </div>
  )
}