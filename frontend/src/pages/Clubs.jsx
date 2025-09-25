import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { Link } from 'react-router-dom'

export default function Clubs() {
  const [clubs, setClubs] = useState([])
  const [q, setQ] = useState('')

  useEffect(() => {
    let mounted = true
    api.get('/clubs').then(res => { if (mounted) setClubs(res.data.clubs) }).catch(console.error)
    return () => { mounted = false }
  }, [])

  const filtered = clubs.filter(c => {
    const name = (c.name || '').toLowerCase()
    const short = (c.shortDescription || '').toLowerCase()
    const term = q.toLowerCase()
    return name.includes(term) || short.includes(term)
  })

  return (
    <div className="container">
      <h2>Clubs</h2>
      <input placeholder="Search clubs" value={q} onChange={e => setQ(e.target.value)} />
      <div className="list">
        {filtered.map(c => (
          <div key={c._id || c.id} className="club-card">
            <h3>{c.name}</h3>
            <p>{c.shortDescription}</p>
            <Link to={`/clubs/${c._id || c.id}`}>View</Link>
          </div>
        ))}
      </div>
    </div>
  )
}