import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

export default function ClubDetail() {
  const { id } = useParams()
  const [club, setClub] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    let mounted = true
    api.get(`/clubs/${id}`).then(res => { if (mounted) setClub(res.data.club) }).catch(console.error).finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [id])

  async function joinClub() {
    if (!user) return alert('Login to join')
    try {
      await api.post(`/clubs/${id}/join`)
      alert('Request sent')
    } catch (e) {
      console.error(e)
      alert(e.response?.data?.error || 'Failed')
    }
  }

  if (loading) return <div>Loading...</div>
  if (!club) return <div>Club not found</div>

  return (
    <div className="container">
      <h2>{club.name}</h2>
      <p>{club.shortDescription}</p>
      <p>Contact: {club.contactEmail}</p>
      <button onClick={joinClub}>Request to Join</button>
      <section>
        <h3>Announcements</h3>
        {(club.announcements || []).map(a => (
          <article key={a._id || a.announcementId}>
            <h4>{a.title}</h4>
            <p>{a.body}</p>
          </article>
        ))}
      </section>
    </div>
  )
}