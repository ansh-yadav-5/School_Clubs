import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function Register() {
  const { signup } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signup(name, email, password, role)
      navigate('/')
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.error || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} type="email" />
        <input placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} type="password" />
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="leader">Club Leader</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create account'}
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  )
}
